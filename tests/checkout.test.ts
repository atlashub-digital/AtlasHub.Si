// Testes do BFF do checkout dos workshops (issue #9, sem rede real): `npm test`.
// Cobrem: origem, rate limit, idempotência, allowlist, janela, capacidade, amount server-side,
// cookie selado (checkout_secret nunca no browser), estados normalizados e bilhete só com
// ARO APPROVED + entitlement ACTIVE.
import test from "node:test";
import assert from "node:assert/strict";
import { POST as checkoutPOST } from "../app/api/workshops/checkout/route";
import { GET as statusGET } from "../app/api/workshops/checkout/status/route";
import { checkoutCookie, openSession, sealSession, bumpCapacity } from "../lib/aro/session";
import { normalizeCheckoutState } from "../lib/workshop-commerce";

const env = {
  ARO_API_URL: "https://aro.example",
  ARO_PROJECT_SLUG: "atlashub-si",
  ARO_PUBLIC_KEY: "pk-test",
  ARO_SERVER_KEY: "sk-test",
  ARO_PAYMENTS_ENABLED: "yes",
};

const origin = "https://atlashub.si";
const body = (extra: Record<string, unknown> = {}) =>
  JSON.stringify({ slug: "empresa-aumentada-2027-2030", lot: "antecipado", name: "Maria Silva", email: "maria@example.com", consentEvent: true, document: "12345678901", ...extra });

function req(over: { body?: string; origin?: string | null; idem?: string; ip?: string; cookie?: string } = {}): Request {
  const headers: Record<string, string> = { "content-type": "application/json", origin: over.origin === undefined ? origin : (over.origin as string), host: "atlashub.si" };
  if (over.idem !== null) headers["idempotency-key"] = over.idem ?? "11111111-1111-4111-8111-111111111111";
  if (over.ip) headers["x-forwarded-for"] = over.ip;
  if (over.cookie) headers["cookie"] = over.cookie;
  if (over.origin === null) delete headers.origin;
  return new Request(`${origin}/api/workshops/checkout`, { method: "POST", headers, body: over.body ?? body() });
}

const aroSession = (over: Record<string, unknown> = {}) => ({
  id: "22222222-2222-4222-8222-222222222222",
  order_id: "33333333-3333-4333-8333-333333333333",
  project: "atlashub-si",
  offer: "workshop-01-empresa-aumentada-antecipado-br",
  state: "PENDING",
  amount: { amount_minor: 29700, currency: "BRL" },
  checkout_secret: "cs-test-0123456789abcdef",
  payment: { kind: "PIX", copy_paste: "pix-copia-cola", qr_payload: "pix-qr", expires_at: "2026-10-16T20:00:00Z" },
  ...over,
});

let lastAroBody: string | undefined;
function fakeFetch(response: unknown, status = 201): typeof fetch {
  return (async (url: unknown, _init?: RequestInit) => {
    lastAroBody = typeof _init?.body === "string" ? _init.body : undefined;
    return new Response(JSON.stringify(response), { status, headers: { "content-type": "application/json" } });
  }) as unknown as typeof fetch;
}

test("normalizeCheckoutState: CREATED/PENDING→PENDING, APPROVED, EXPIRED, resto→FAILED (fail-closed)", () => {
  assert.equal(normalizeCheckoutState("CREATED"), "PENDING");
  assert.equal(normalizeCheckoutState("PENDING"), "PENDING");
  assert.equal(normalizeCheckoutState("APPROVED"), "APPROVED");
  assert.equal(normalizeCheckoutState("EXPIRED"), "EXPIRED");
  for (const s of ["FAILED", "CANCELED", "REFUNDED", "CHARGEBACK", "??"]) assert.equal(normalizeCheckoutState(s), "FAILED");
});

test("checkout: origem estranha, sem idempotência, oferta fora da allowlist, sem termos e pagador inválido são recusados", async () => {
  const saved = process.env;
  Object.assign(process.env, env);
  try {
    const never = (() => assert.fail("não devia chamar o ARO")) as unknown as typeof fetch;
    const withFetch = async (r: Request) => {
      const real = globalThis.fetch;
      globalThis.fetch = never;
      try {
        return await checkoutPOST(r);
      } finally {
        globalThis.fetch = real;
      }
    };
    assert.equal((await withFetch(req({ origin: "https://evil.example" }))).status, 403);
    assert.equal((await withFetch(req({ origin: null }))).status, 403);
    assert.equal((await withFetch(req({ idem: "nao-e-uuid" }))).status, 400);
    assert.equal((await withFetch(req({ body: body({ lot: "vip" }) }))).status, 400);
    assert.equal((await withFetch(req({ body: body({ slug: "espelhomeu" }) }))).status, 400);
    assert.equal((await withFetch(req({ body: body({ consentEvent: false }) }))).status, 400);
    assert.equal((await withFetch(req({ body: body({ email: "invalido" }) }))).status, 400);
    assert.equal((await withFetch(req({ body: body({ document: "123" }) }))).status, 400);
    // Lote regular fora da janela (abre 02/11/2026) → 409, sem tocar no ARO.
    assert.equal((await withFetch(req({ body: body({ lot: "regular" }) }))).status, 409);
  } finally {
    process.env = saved;
  }
});

test("checkout: happy path cria sessão no ARO com a oferta da allowlist, cookie selado e sem amount do browser", async () => {
  const saved = process.env;
  Object.assign(process.env, env);
  try {
    globalThis.fetch = fakeFetch(aroSession());
    const res = await checkoutPOST(req({ ip: "203.0.113.10" }));
    assert.equal(res.status, 201);
    const payload = await res.json();
    assert.equal(payload.redirect, "/workshops/checkout/22222222-2222-4222-8222-222222222222");
    const sent = JSON.parse(lastAroBody!);
    assert.equal(sent.offer, "workshop-01-empresa-aumentada-antecipado-br");
    assert.equal(sent.amount, undefined); // amount nunca vem do browser
    assert.equal(sent.payment_method, "PIX");
    assert.equal(sent.payer.document, "12345678901");
    assert.equal(sent.attribution.utm_campaign, "W01-SITE");
    const setCookie = res.headers.get("set-cookie")!;
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Lax/);
    const value = /atlashub_aro_checkout=([^;]+)/.exec(setCookie)![1];
    const capability = openSession(value, env.ARO_SERVER_KEY)!;
    assert.equal(capability.id, aroSession().id);
    assert.equal(capability.secret, aroSession().checkout_secret);
    assert.match(value, /^[\w-]+$/); // blob selado; nenhum segredo legível no browser
    assert.ok(!value.includes("cs-test"));
  } finally {
    (globalThis as { fetch?: typeof fetch }).fetch = undefined as unknown as typeof fetch;
    process.env = saved;
  }
});

test("checkout: capacidade server-side recusa acima do limite-alvo", async () => {
  // Contador isolado: enche o limite do EL01 (12) e espera 409.
  const slug = "enterprise-lab-ecommerce";
  let ok = true;
  for (let i = 0; i < 12; i++) ok = bumpCapacity(slug + ":test", 12, 1_700_000_000_000 + i);
  assert.equal(ok, true);
  assert.equal(bumpCapacity(slug + ":test", 12, 1_700_000_000_000 + 99), false);
});

test("status: bilhete só com ARO APPROVED + entitlement ACTIVE", async () => {
  const saved = process.env;
  Object.assign(process.env, env);
  const capability = { id: "22222222-2222-4222-8222-222222222222", orderId: "33333333-3333-4333-8333-333333333333", offer: "workshop-01-empresa-aumentada-antecipado-br", slug: "empresa-aumentada-2027-2030", email: "maria@example.com", secret: "cs-test-0123456789abcdef", exp: Date.now() + 86_400_000 };
  const cookie = `${checkoutCookie}=${sealSession(capability, env.ARO_SERVER_KEY)}`;
  try {
    const call = (aro: unknown, status = 200) => {
      globalThis.fetch = fakeFetch(aro, status) as typeof fetch;
      return statusGET(new Request(`${origin}/api/workshops/checkout/status`, { headers: { origin, host: "atlashub.si", cookie } }));
    };

    // PENDING: só estado normalizado.
    let res = await call(aroSession());
    assert.equal((await res.json()).state, "PENDING");

    // APPROVED mas entitlement não ativo → PENDING com nota, sem bilhete.
    res = await call(aroSession({ state: "APPROVED" }));
    let p = await res.json();
    assert.equal(p.state, "PENDING");
    assert.match(p.note, /não pague novamente/i);
    assert.equal(p.ticket, undefined);

    // APPROVED + entitlement ACTIVE → bilhete com código.
    globalThis.fetch = (async (url: unknown) => {
      if (String(url).includes("/entitlements/resolve")) {
        return new Response(JSON.stringify({ project: "atlashub-si", entitlements: [{ key: "atlashub-si:w01", status: "ACTIVE", starts_at: "2026-10-01T00:00:00Z" }] }), { status: 200 });
      }
      return new Response(JSON.stringify(aroSession({ state: "APPROVED" })), { status: 200 });
    }) as unknown as typeof fetch;
    res = await statusGET(new Request(`${origin}/api/workshops/checkout/status`, { headers: { origin, host: "atlashub.si", cookie } }));
    p = await res.json();
    assert.equal(p.state, "APPROVED");
    assert.equal(p.ticket.code, "W01-33333333");

    // Sem cookie → 401 (não há como consultar sem a capacidade selada).
    globalThis.fetch = fakeFetch(aroSession()) as typeof fetch;
    res = await statusGET(new Request(`${origin}/api/workshops/checkout/status`, { headers: { origin, host: "atlashub.si" } }));
    assert.equal(res.status, 401);
  } finally {
    (globalThis as { fetch?: typeof fetch }).fetch = undefined as unknown as typeof fetch;
    process.env = saved;
  }
});

test("cookies: blob adulterado ou expirado é recusado", () => {
  const capability = { id: "22222222-2222-4222-8222-222222222222", orderId: "33333333-3333-4333-8333-333333333333", offer: "x", slug: "empresa-aumentada-2027-2030", email: "a@b.co", secret: "cs-test-0123456789abcdef", exp: Date.now() + 1000 };
  const blob = sealSession(capability, env.ARO_SERVER_KEY);
  assert.ok(openSession(blob, env.ARO_SERVER_KEY));
  assert.equal(openSession(blob.slice(0, -4) + "AAAA", env.ARO_SERVER_KEY), null);
  assert.equal(openSession(blob, "sk-errado"), null);
  assert.equal(openSession(sealSession({ ...capability, exp: Date.now() - 1 }, env.ARO_SERVER_KEY), env.ARO_SERVER_KEY), null);
});
