import { aroConfig, getCheckoutSession, hasActiveEntitlement, AroError, type CheckoutSession } from "../../../../../lib/aro/client";
import { checkoutCookie, openSession, sameOrigin } from "../../../../../lib/aro/session";
import { commerceBySlug, normalizeCheckoutState, type PublicCheckoutState } from "../../../../../lib/workshop-commerce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Polling do checkout (issue #9 §4): o browser pergunta ao NOSSO servidor, que consulta o
 * ARO com o `checkout_secret` do cookie selado. Estados normalizados; o bilhete só é
 * devolvido quando ARO APPROVED **e** entitlement ACTIVE (decisão de acesso sempre por
 * `resolveEntitlements`, nunca por webhook nem comprovativo).
 */
export async function GET(request: Request): Promise<Response> {
  const fallbackOrigin = process.env.PUBLIC_ORIGIN || "https://atlashub.si";
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host"), fallbackOrigin))
    return json(403, { error: "invalid_origin" });

  const cfg = aroConfig();
  const secret = process.env.ARO_SERVER_KEY;
  const cookie = request.headers.get("cookie") ?? "";
  const raw = cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${checkoutCookie}=`))
    ?.slice(checkoutCookie.length + 1);
  const capability = cfg && secret ? openSession(raw, secret) : null;
  if (!capability) return json(401, { error: "checkout_missing" });

  let session: CheckoutSession;
  try {
    session = await getCheckoutSession(cfg, capability.id, capability.secret);
  } catch (e) {
    if (e instanceof AroError && e.code === "http_error" && e.status === 404) return json(404, { error: "checkout_missing" });
    return json(503, { error: "status_unavailable" });
  }
  if (session.id !== capability.id || session.order_id !== capability.orderId) return json(404, { error: "checkout_missing" });

  const commerce = commerceBySlug(capability.slug);
  const state: PublicCheckoutState = normalizeCheckoutState(session.state);

  const base = {
    checkoutId: session.id,
    orderId: session.order_id,
    slug: capability.slug,
    state,
    amount: session.amount,
    expiresAt: session.payment?.kind === "PIX" ? session.payment.expires_at : session.expires_at,
  };

  if (state !== "APPROVED" || !commerce) return json(200, base);

  const entitled = await hasActiveEntitlement(cfg, { email: capability.email }, commerce.aroEntitlement);
  if (!entitled)
    return json(200, {
      ...base,
      state: "PENDING" as PublicCheckoutState,
      note: "Pagamento confirmado. O bilhete está a ser emitido; não pague novamente.",
    });

  return json(200, {
    ...base,
    state: "APPROVED" as PublicCheckoutState,
    ticket: {
      orderId: session.order_id,
      code: `${commerce.code}-${session.order_id.slice(0, 8).toUpperCase()}`,
      email: capability.email,
    },
  });
}
