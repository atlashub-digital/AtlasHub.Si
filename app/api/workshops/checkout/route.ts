import { aroConfig, createCheckoutSession, AroError, type CheckoutSession } from "../../../../lib/aro/client";
import { bumpCapacity, checkoutCookie, rateLimited, recordIntent, sameOrigin, sealSession, seenIntent } from "../../../../lib/aro/session";
import { commerceBySlug, lotInWindow, type WorkshopLot } from "../../../../lib/workshop-commerce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * BFF do checkout dos workshops (issue #9 §3): valida origem, rate limit, idempotência,
 * allowlist de slug+lote e janela/capacidade server-side, persiste a intenção de inscrição
 * SEM declarar pagamento e só então cria a sessão via `createCheckoutSession()` do cliente
 * ARO. O amount nunca vem do browser: a oferta é resolvida por allowlist e o valor cobrado
 * é o do catálogo ARO.
 */
export async function POST(request: Request): Promise<Response> {
  const fallbackOrigin = process.env.PUBLIC_ORIGIN || "https://atlashub.si";
  if (!sameOrigin(request.headers.get("origin"), request.headers.get("host"), fallbackOrigin))
    return json(403, { error: "invalid_origin" });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) return json(429, { error: "rate_limited" });

  const idempotencyKey = request.headers.get("idempotency-key") ?? "";
  if (!UUID.test(idempotencyKey)) return json(400, { error: "invalid_idempotency_key" });

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return json(400, { error: "invalid_request" });
  }
  if (raw.length > 4000) return json(413, { error: "invalid_request" });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_request" });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const lot = typeof body.lot === "string" ? body.lot : "";
  const commerce = commerceBySlug(slug);
  if (!commerce || (lot !== "antecipado" && lot !== "regular")) return json(400, { error: "invalid_offer" });
  if (body.consentEvent !== true) return json(400, { error: "consent_required" });
  for (const flag of ["consentMarketing", "consentWhatsapp"]) {
    if (body[flag] !== undefined && typeof body[flag] !== "boolean") return json(400, { error: "invalid_consent" });
  }

  const field = (name: string, max: number) => {
    const v = body[name];
    const text = typeof v === "string" ? v.trim() : "";
    return text.length > max ? "" : text;
  };
  const name = field("name", 120);
  const email = field("email", 254).toLowerCase();
  const company = field("company", 160);
  // CPF (11) ou CNPJ (14): o ARO exige documento do pagador para PIX; apenas dígitos.
  const document = typeof body.document === "string" ? body.document.replace(/\D/g, "") : "";
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{11}(\d{3})?$/.test(document)) return json(400, { error: "invalid_payer" });

  const offer = commerce.offers[lot as WorkshopLot];
  if (!lotInWindow(commerce, lot as WorkshopLot)) return json(409, { error: "lot_not_open" });
  if (!bumpCapacity(commerce.slug, commerce.capacity)) return json(409, { error: "capacity_reached" });

  const cfg = aroConfig();
  if (!cfg) return json(503, { error: "checkout_unavailable" });

  const repeat = seenIntent(idempotencyKey);
  if (!repeat) {
    recordIntent({ idempotencyKey, slug, lot, email });
  }

  let session: CheckoutSession;
  try {
    session = await createCheckoutSession(cfg, {
      offer: offer.aroOffer,
      payer: { name, email, document },
      paymentMethod: "PIX",
      idempotencyKey: repeat ? idempotencyKey : undefined,
      attribution: { utm_source: "site", utm_medium: "workshops", utm_campaign: commerce.attributionCode },
      metadata: { workshop: commerce.code, lot, ...(company ? { company } : {}) },
    });
  } catch (e) {
    if (e instanceof AroError && e.code === "payments_disabled") return json(409, { error: "sales_not_open" });
    return json(503, { error: "checkout_unavailable" });
  }

  if (session.project !== cfg.project || session.offer !== offer.aroOffer || typeof session.checkout_secret !== "string" || session.checkout_secret.length < 16) {
    return json(502, { error: "checkout_unavailable" });
  }

  const response = json(201, {
    checkoutId: session.id,
    orderId: session.order_id,
    redirect: `/workshops/checkout/${session.id}`,
    expiresAt: session.payment?.kind === "PIX" ? session.payment.expires_at : session.expires_at,
  });
  response.headers.append(
    "Set-Cookie",
    [
      `${checkoutCookie}=${sealSession(
        { id: session.id, orderId: session.order_id, offer: offer.aroOffer, slug, email, secret: session.checkout_secret, exp: Date.now() + 3 * 86400000 },
        cfg.serverKey,
      )}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      process.env.NODE_ENV === "production" ? "Secure" : "",
      "Max-Age=259200",
    ]
      .filter(Boolean)
      .join("; "),
  );
  console.info(JSON.stringify({ ws_checkout_created: commerce.code, lot, checkout_id: session.id }));
  return response;
}
