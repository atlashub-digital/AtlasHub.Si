import { startCheckout } from "../../../../lib/commerce/checkout";
import { allowedOrigin, ipHash, runtimeDeps, secretCookie } from "../../../../lib/commerce/runtime";
import { InvalidSignup, validateSignup } from "../../../../lib/commerce/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Inicia a inscrição paga: valida, reserva lugar e cria a sessão PIX no ARO. Nunca recebe preço do browser. */
export async function POST(req: Request) {
  if (!allowedOrigin(req)) return json(403, { error: "origin" });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return json(415, { error: "content_type" });
  const raw = await req.text();
  if (raw.length > 8000) return json(413, { error: "too_large" });
  let input;
  try {
    input = validateSignup(JSON.parse(raw), { requireDocument: process.env.WORKSHOP_PAYER_DOCUMENT === "required" });
  } catch (e) {
    return json(400, { error: "invalid", field: e instanceof InvalidSignup ? e.message : "body" });
  }
  const result = await startCheckout(input, ipHash(req), runtimeDeps());
  if (!result.ok) return json(result.status, { error: result.error });
  const headers: Record<string, string> = {};
  if (result.checkoutSecret) {
    // Segredo da sessão só em cookie httpOnly, nunca no URL, no corpo nem em logs.
    headers["Set-Cookie"] = `${secretCookie(result.id)}=${encodeURIComponent(result.checkoutSecret)}; Path=/api/workshops/checkout; HttpOnly; Secure; SameSite=Lax; Max-Age=7200`;
  }
  return json(201, { id: result.id, next: `/workshops/checkout/${result.id}` }, headers);
}
