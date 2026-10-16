// Testes unitários do consumidor ARO (sem rede): `npm test`.
import test from "node:test";
import assert from "node:assert/strict";
import { signAroPayload, verifyAroWebhook } from "../lib/aro/webhook";
import { aroConfig, createCheckoutSession, getCheckoutSession, hasActiveEntitlement, AroError } from "../lib/aro/client";

const secret = "test-secret";
const now = 1_792_040_470;
const event = { id: "6b1f0c4e-0000-4000-8000-000000000001", type: "entitlement.granted", created_at: "2026-10-15T05:01:22Z", project: "atlashub-si", data: { entitlements: ["atlashub-si:workshop:workshop-01-empresa-aumentada"] } };
const body = JSON.stringify(event);
const ts = String(now);
const reason = (r: ReturnType<typeof verifyAroWebhook>) => (r.ok ? "ok" : r.reason);
const base = { rawBody: body, eventId: event.id, timestamp: ts, signature: signAroPayload(secret, ts, body), secret, project: "atlashub-si", nowSeconds: now };

test("webhook: assinatura válida é aceite", () => {
  const r = verifyAroWebhook(base);
  assert.equal(r.ok, true);
});
test("webhook: corpo alterado, segredo errado, cabeçalho em falta ou fora da janela são recusados", () => {
  assert.equal(verifyAroWebhook({ ...base, rawBody: body.replace("workshop-01", "workshop-02") }).ok, false);
  assert.equal(verifyAroWebhook({ ...base, secret: "outro" }).ok, false);
  assert.equal(verifyAroWebhook({ ...base, signature: null }).ok, false);
  const stale = verifyAroWebhook({ ...base, nowSeconds: now + 301 });
  assert.deepEqual(stale, { ok: false, status: 401, reason: "stale_timestamp" });
});
test("webhook: id, projeto e tipo têm de bater certo", () => {
  const sign = (b: string) => ({ ...base, rawBody: b, signature: signAroPayload(secret, ts, b) });
  assert.equal(reason(verifyAroWebhook({ ...base, eventId: "outro" })), "event_id_mismatch");
  assert.equal(reason(verifyAroWebhook(sign(JSON.stringify({ ...event, project: "espelhomeu" })))), "wrong_project");
  assert.equal(reason(verifyAroWebhook(sign(JSON.stringify({ ...event, type: "payment.magic" })))), "unknown_type");
});

const env = { ARO_API_URL: "https://aro.example", ARO_PROJECT_SLUG: "atlashub-si", ARO_PUBLIC_KEY: "pk", ARO_SERVER_KEY: "sk" };

test("config: incompleta ou sem https → null; pagamentos desligados por defeito", () => {
  assert.equal(aroConfig({}), null);
  assert.equal(aroConfig({ ...env, ARO_SERVER_KEY: "" }), null);
  assert.equal(aroConfig({ ...env, ARO_API_URL: "http://aro.example" }), null);
  assert.equal(aroConfig(env)?.paymentsEnabled, false);
  assert.equal(aroConfig({ ...env, ARO_PAYMENTS_ENABLED: "yes" })?.paymentsEnabled, true);
});

test("checkout: recusa sem configuração e com pagamentos desligados, sem chamar a rede", async () => {
  const never = (() => assert.fail("não devia chamar a rede")) as unknown as typeof fetch;
  await assert.rejects(createCheckoutSession(null, { offer: "workshop-01-empresa-aumentada-antecipado-br", payer: { name: "Teste", email: "t@example.com" } }, never), (e: unknown) => e instanceof AroError && e.code === "not_configured");
  await assert.rejects(createCheckoutSession(aroConfig(env), { offer: "workshop-01-empresa-aumentada-antecipado-br", payer: { name: "Teste", email: "t@example.com" } }, never), (e: AroError) => e.code === "payments_disabled");
});

test("checkout: pedido canónico (chave pública, Idempotency-Key, projeto/oferta/mercado) e polling com o segredo", async () => {
  const calls: { url: string; init: RequestInit & { headers: Record<string, string>; body: string } }[] = [];
  const fake = (async (url: string, init: never) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: "s1", order_id: "o1", project: "atlashub-si", offer: "workshop-01-empresa-aumentada-antecipado-br", state: "PENDING", amount: { amount_minor: 29700, currency: "BRL" }, checkout_secret: "cs" }), { status: 201 });
  }) as unknown as typeof fetch;
  const cfg = aroConfig({ ...env, ARO_PAYMENTS_ENABLED: "yes" });
  const s = await createCheckoutSession(cfg, { offer: "workshop-01-empresa-aumentada-antecipado-br", payer: { name: "Teste", email: "t@example.com" }, idempotencyKey: "intent-1" }, fake);
  assert.equal(calls[0].url, "https://aro.example/v1/checkout-sessions");
  assert.equal(calls[0].init.headers["X-ARO-Public-Key"], "pk");
  assert.equal(calls[0].init.headers["Idempotency-Key"], "intent-1");
  assert.deepEqual(JSON.parse(calls[0].init.body), { project: "atlashub-si", offer: "workshop-01-empresa-aumentada-antecipado-br", market: "BR", currency: "BRL", payment_method: "PIX", payer: { name: "Teste", email: "t@example.com" } });
  await getCheckoutSession(cfg, s.id, s.checkout_secret ?? "", fake);
  assert.equal(calls[1].url, "https://aro.example/v1/checkout-sessions/s1");
  assert.equal(calls[1].init.headers["X-ARO-Checkout-Secret"], "cs");
});

test("direito: só ACTIVE não expirado desbloqueia; erro do ARO nega", async () => {
  const reply = (entitlements: object[], status = 200) => (async () => new Response(JSON.stringify({ project: "atlashub-si", entitlements }), { status })) as unknown as typeof fetch;
  const cfg = aroConfig(env);
  const key = "atlashub-si:workshop:workshop-01-empresa-aumentada";
  const who = { customerId: "c1" };
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "ACTIVE", starts_at: "2026-10-15T00:00:00Z" }])), true);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "REVOKED", starts_at: "2026-10-15T00:00:00Z" }])), false);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "ACTIVE", starts_at: "2026-01-01T00:00:00Z", expires_at: "2026-02-01T00:00:00Z" }])), false);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([], 503)), false);
  assert.equal(await hasActiveEntitlement(null, who, key, reply([{ key, status: "ACTIVE", starts_at: "x" }])), false);
});

test("rota /api/aro/webhook: 503 sem ARO configurado; com segredo, só aceita assinatura válida", async () => {
  const { POST } = await import("../app/api/aro/webhook/route");
  const saved = { s: process.env.ARO_WEBHOOK_SECRET, p: process.env.ARO_PROJECT_SLUG };
  delete process.env.ARO_WEBHOOK_SECRET;
  delete process.env.ARO_PROJECT_SLUG;
  assert.equal((await POST(new Request("http://x/api/aro/webhook", { method: "POST", body: body }))).status, 503);
  process.env.ARO_WEBHOOK_SECRET = secret;
  process.env.ARO_PROJECT_SLUG = "atlashub-si";
  const nowTs = String(Math.floor(Date.now() / 1000));
  const headers = (sig: string) => ({ "x-aro-event-id": event.id, "x-aro-timestamp": nowTs, "x-aro-signature": sig });
  assert.equal((await POST(new Request("http://x", { method: "POST", body, headers: headers("v1=00") }))).status, 401);
  assert.equal((await POST(new Request("http://x", { method: "POST", body, headers: headers(signAroPayload(secret, nowTs, body)) }))).status, 200);
  if (saved.s === undefined) delete process.env.ARO_WEBHOOK_SECRET; else process.env.ARO_WEBHOOK_SECRET = saved.s;
  if (saved.p === undefined) delete process.env.ARO_PROJECT_SLUG; else process.env.ARO_PROJECT_SLUG = saved.p;
});
