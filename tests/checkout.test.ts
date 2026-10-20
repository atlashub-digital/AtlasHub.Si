import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { aroConfig } from "../lib/aro/client";
import { availability, getStatus, handleEvent, startCheckout, type Deps } from "../lib/commerce/checkout";
import { termsVersion } from "../lib/commerce/policy";
import type { Registration, Store } from "../lib/commerce/store";
import { validateSignup } from "../lib/commerce/validate";

// Percurso de compra com ARO e base simulados (a base real tem os seus próprios testes SQL).
function memStore(capacity = { W01: 25, EL01: 12 }) {
  const rows: Registration[] = [];
  const events = new Set<string>();
  const live = (r: Registration) => r.status === "confirmed" || r.status === "pending";
  const store: Store = {
    markTicketEmailed: async () => {},
    async availability() { return { W01: { open: true, capacity: capacity.W01, taken: rows.filter((r) => r.workshop === "W01" && live(r)).length }, EL01: { open: true, capacity: capacity.EL01, taken: rows.filter((r) => r.workshop === "EL01" && live(r)).length } }; },
    async reserve(i) {
      const ex = rows.find((r) => r.workshop === i.workshop && r.email === i.email && live(r));
      if (ex) return { id: ex.id, status: ex.status, ticket: ex.ticket, outcome: ex.status === "confirmed" ? "already_confirmed" : "resume" };
      if (rows.filter((r) => r.workshop === i.workshop && live(r)).length >= capacity[i.workshop]) throw Error("sold_out");
      const r: Registration = { id: randomUUID(), workshop: i.workshop, status: "pending", email: i.email, name: i.name, phone: i.phone, company: i.company,
        campaign: i.campaign, consent_marketing: i.marketing, consent_whatsapp_group: i.waGroup, offer: null, amount_minor: null,
        aro_session_id: null, aro_order_id: null, ticket: null, over_capacity: false, crm_notified_at: null };
      rows.push(r);
      return { id: r.id, status: "pending", ticket: null, outcome: "new" };
    },
    async get(id) { return rows.find((r) => r.id === id) ?? null; },
    async findByOrder(o) { return rows.find((r) => r.aro_order_id === o) ?? null; },
    async attachCheckout(id, s, o, offer, amount) {
      const r = rows.find((x) => x.id === id)!;
      if (r.status !== "pending" || (r.aro_session_id && r.aro_session_id !== s)) throw Error("not_pending");
      Object.assign(r, { aro_session_id: s, aro_order_id: o, offer, amount_minor: amount });
    },
    async confirm(id, o) {
      const r = rows.find((x) => x.id === id)!;
      if (r.aro_order_id !== o) throw Error("order_mismatch");
      if (r.status === "confirmed") return { ticket: r.ticket!, newlyConfirmed: false, overCapacity: false };
      Object.assign(r, { status: "confirmed", ticket: `${r.workshop}-ABCD1234` });
      return { ticket: r.ticket!, newlyConfirmed: true, overCapacity: false };
    },
    async release(id) { const r = rows.find((x) => x.id === id); if (r?.status === "pending") r.status = "released"; },
    async revoke(o) { const r = rows.find((x) => x.aro_order_id === o && live(x)); if (r) r.status = "revoked"; return r ? 1 : 0; },
    async recordEvent(e) { if (events.has(e)) return false; events.add(e); return true; },
    async markCrmNotified(id) { rows.find((x) => x.id === id)!.crm_notified_at = new Date(); },
  };
  return { store, rows };
}

/** ARO falso: sessões, estado controlável, direitos e CRM; regista as chamadas. */
function fakeAro(opts: { amountOverride?: number; rejectOffers?: string[] } = {}) {
  const sessions = new Map<string, { offer: string; state: string; order: string; email: string; idem: string }>();
  const byIdem = new Map<string, string>();
  const entitled = new Set<string>();
  const calls: { url: string; body?: unknown; headers: Record<string, string> }[] = [];
  const prices: Record<string, number> = {
    "workshop-01-empresa-aumentada-antecipado-br": 29700, "workshop-01-empresa-aumentada-regular-br": 34700,
    "enterprise-lab-01-ecommerce-antecipado-br": 99000, "enterprise-lab-01-ecommerce-regular-br": 129000,
  };
  const session = (id: string, withSecret: boolean) => {
    const s = sessions.get(id)!;
    return { id, order_id: s.order, project: "atlashub-si", offer: s.offer, state: s.state,
      amount: { amount_minor: opts.amountOverride ?? prices[s.offer], currency: "BRL" },
      ...(withSecret ? { checkout_secret: `cs-${id}` } : {}),
      payment: { kind: "PIX", copy_paste: "00020126PIXCOPIAECOLA", qr_payload: "00020126PIXCOPIAECOLA", expires_at: "2026-11-01T12:30:00Z" } };
  };
  const f = (async (url: string, init: RequestInit) => {
    const headers = (init.headers ?? {}) as Record<string, string>;
    const body = init.body ? JSON.parse(init.body as string) : undefined;
    calls.push({ url, body, headers });
    const ok = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
    if (url.endsWith("/v1/checkout-sessions") && init.method === "POST") {
      if (opts.rejectOffers?.includes(body.offer)) return ok({ error: "offer_inactive" }, 422);
      const idem = headers["Idempotency-Key"];
      if (byIdem.has(idem)) return ok(session(byIdem.get(idem)!, true), 201);
      const id = randomUUID();
      sessions.set(id, { offer: body.offer, state: "PENDING", order: randomUUID(), email: body.payer.email, idem });
      byIdem.set(idem, id);
      return ok(session(id, true), 201);
    }
    const m = url.match(/\/v1\/checkout-sessions\/([^/]+)$/);
    if (m) return headers["X-ARO-Checkout-Secret"] === `cs-${m[1]}` ? ok(session(m[1], false)) : ok({}, 401);
    if (url.endsWith("/v1/entitlements/resolve")) {
      const email = body.identity.email;
      return ok({ project: "atlashub-si", entitlements: [...entitled].filter((k) => k.startsWith(email + "|")).map((k) => ({ key: k.split("|")[1], status: "ACTIVE", starts_at: "2026-10-16T00:00:00Z" })) });
    }
    if (url === "https://crm.example/hook") return ok({ ok: true });
    return ok({}, 404);
  }) as unknown as typeof fetch;
  return { fetch: f, sessions, entitled, calls };
}

const env = { ARO_API_URL: "https://aro.example", ARO_PROJECT_SLUG: "atlashub-si", ARO_PUBLIC_KEY: "pk", ARO_SERVER_KEY: "sk",
  ARO_PAYMENTS_ENABLED: "yes", WORKSHOPS_SALES_OPEN: "W01,EL01", WORKSHOP_CRM_WEBHOOK_URL: "https://crm.example/hook", WORKSHOP_CRM_WEBHOOK_TOKEN: "t" };
const deps = (store: Store | null, aro: ReturnType<typeof fakeAro>, e: Record<string, string> = env, now = "2026-10-20T12:00:00-03:00"): Deps =>
  ({ aro: aroConfig(e), store, env: e, fetch: aro.fetch, now: () => new Date(now) });
const ana = () => validateSignup({ slug: "empresa-aumentada-2027-2030", name: "Ana Souza", email: "Ana@Example.com", phone: "(62) 99999-0000",
  acceptTerms: true, termsVersion, campaign: "w01-ig" }, { requireDocument: false });

test("validação: termos obrigatórios, EL01 exige empresa, campanha saneada, CPF verificado", () => {
  const base = { slug: "empresa-aumentada-2027-2030", name: "Ana", email: "a@x.com", phone: "62999990000", termsVersion };
  assert.throws(() => validateSignup({ ...base, acceptTerms: false }, { requireDocument: false }), /acceptTerms/);
  assert.throws(() => validateSignup({ ...base, acceptTerms: true, termsVersion: "antiga" }, { requireDocument: false }), /acceptTerms/);
  assert.throws(() => validateSignup({ ...base, slug: "enterprise-lab-ecommerce", acceptTerms: true }, { requireDocument: false }), /company/);
  assert.throws(() => validateSignup({ ...base, acceptTerms: true, document: "111.111.111-11" }, { requireDocument: false }), /document/);
  assert.throws(() => validateSignup({ ...base, acceptTerms: true, website: "bot" }, { requireDocument: false }), /website/);
  const ok = validateSignup({ ...base, acceptTerms: true, campaign: "<script>", document: "529.982.247-25", amount_minor: 1 }, { requireDocument: false });
  assert.equal(ok.campaign, "W01-SITE");
  assert.equal(ok.phone, "+5562999990000");
  assert.equal(ok.document, "52998224725");
  assert.ok(!("amount_minor" in ok));
});

test("vendas fechadas sem ARO pagamentos, sem base ou sem flag comercial", async () => {
  const aro = fakeAro();
  const { store } = memStore();
  for (const e of [{ ...env, ARO_PAYMENTS_ENABLED: "" }, { ...env, WORKSHOPS_SALES_OPEN: "EL01" }])
    assert.deepEqual(await startCheckout(ana(), null, deps(store, aro, e)), { ok: false, status: 503, error: "sales_closed" });
  assert.deepEqual(await startCheckout(ana(), null, deps(null, aro)), { ok: false, status: 503, error: "sales_closed" });
  assert.equal(aro.calls.length, 0);
  const a = await availability(deps(null, aro));
  assert.equal(a.W01.open, false);
});

test("compra completa: lote antecipado, PIX, aprovação → só com direito ACTIVE emite bilhete; CRM uma vez", async () => {
  const aro = fakeAro();
  const { store, rows } = memStore();
  const d = deps(store, aro);
  const r = await startCheckout(ana(), "ip", d);
  assert.ok(r.ok);
  const create = aro.calls.find((c) => c.url.endsWith("/v1/checkout-sessions"))!;
  assert.equal((create.body as { offer: string }).offer, "workshop-01-empresa-aumentada-antecipado-br");
  assert.equal(create.headers["Idempotency-Key"], `si:${r.id}:workshop-01-empresa-aumentada-antecipado-br`);
  assert.equal((create.body as { attribution: { utm_campaign: string } }).attribution.utm_campaign, "W01-IG");
  assert.ok(!("amount_minor" in (create.body as object)));

  const pending = await getStatus(r.id, r.checkoutSecret!, d);
  assert.equal(pending?.state, "PENDING");
  assert.ok(pending?.state === "PENDING" && pending.payment?.qrSvg.startsWith("<svg") && pending.amountMinor === 29700);

  const sid = rows[0].aro_session_id!;
  aro.sessions.get(sid)!.state = "APPROVED";
  assert.equal((await getStatus(r.id, r.checkoutSecret!, d))?.state, "PROCESSING"); // sem direito ainda
  aro.entitled.add("ana@example.com|atlashub-si:workshop:workshop-01-empresa-aumentada");
  const done = await getStatus(r.id, r.checkoutSecret!, d);
  assert.deepEqual(done, { state: "CONFIRMED", workshop: "W01", ticket: "W01-ABCD1234" });
  await getStatus(r.id, r.checkoutSecret!, d);
  assert.equal(aro.calls.filter((c) => c.url === "https://crm.example/hook").length, 1);
  // sem o cookie (outro dispositivo), o bilhete não é exposto
  assert.deepEqual(await getStatus(r.id, null, d), { state: "CONFIRMED", workshop: "W01", ticket: null });
  // segunda inscrição com o mesmo e-mail é recusada sem novo pagamento
  assert.deepEqual(await startCheckout(ana(), "ip", d), { ok: false, status: 409, error: "already_registered" });
});

test("dupla tentativa retoma a mesma sessão (Idempotency-Key) e não cria segundo pagamento", async () => {
  const aro = fakeAro();
  const { store, rows } = memStore();
  const d = deps(store, aro);
  const a = await startCheckout(ana(), null, d), b = await startCheckout(ana(), null, d);
  assert.ok(a.ok && b.ok && a.id === b.id);
  assert.equal(aro.sessions.size, 1);
  assert.equal(rows.length, 1);
});

test("preço adulterado/divergente no ARO: recusa, liberta o lugar e não mostra PIX", async () => {
  const aro = fakeAro({ amountOverride: 100 });
  const { store, rows } = memStore();
  assert.deepEqual(await startCheckout(ana(), null, deps(store, aro)), { ok: false, status: 502, error: "price_mismatch" });
  assert.equal(rows[0].status, "released");
});

test("lote antecipado inativo no ARO → regular; depois da data, só regular", async () => {
  const aro = fakeAro({ rejectOffers: ["workshop-01-empresa-aumentada-antecipado-br"] });
  const { store, rows } = memStore();
  const r = await startCheckout(ana(), null, deps(store, aro));
  assert.ok(r.ok);
  assert.equal(rows[0].offer, "workshop-01-empresa-aumentada-regular-br");
  assert.equal(rows[0].amount_minor, 34700);
  const aro2 = fakeAro();
  const m2 = memStore();
  await startCheckout(ana(), null, deps(m2.store, aro2, env, "2026-11-10T10:00:00-03:00"));
  assert.equal(m2.rows[0].offer, "workshop-01-empresa-aumentada-regular-br");
});

test("capacidade: sem sobrevenda", async () => {
  const aro = fakeAro();
  const { store } = memStore({ W01: 1, EL01: 12 });
  const d = deps(store, aro);
  assert.ok((await startCheckout(ana(), null, d)).ok);
  const bia = validateSignup({ slug: "empresa-aumentada-2027-2030", name: "Bia", email: "bia@x.com", phone: "62999990001", acceptTerms: true, termsVersion }, { requireDocument: false });
  assert.deepEqual(await startCheckout(bia, null, d), { ok: false, status: 409, error: "sold_out" });
});

test("PIX expirado/falhado liberta a reserva; webhook duplicado, aprovação tardia e reembolso", async () => {
  const aro = fakeAro();
  const { store, rows } = memStore();
  const d = deps(store, aro);
  const r = await startCheckout(ana(), null, d);
  assert.ok(r.ok);
  const reg = rows[0];
  // aprovação chega só por webhook (utilizador fechou a página): confirma com direito ACTIVE
  aro.sessions.get(reg.aro_session_id!)!.state = "APPROVED";
  aro.entitled.add("ana@example.com|atlashub-si:workshop:workshop-01-empresa-aumentada");
  const ev = { id: "e1", type: "payment.approved" as const, created_at: "x", project: "atlashub-si", data: { order_id: reg.aro_order_id } };
  assert.equal(await handleEvent(ev, d), "processed");
  assert.equal(reg.status, "confirmed");
  assert.equal(await handleEvent(ev, d), "duplicate");
  assert.equal(aro.calls.filter((c) => c.url === "https://crm.example/hook").length, 1);
  // reembolso revoga e avisa o CRM
  await handleEvent({ ...ev, id: "e2", type: "payment.refunded" }, d);
  assert.equal(reg.status, "revoked");
  // evento de outra encomenda é ignorado
  assert.equal(await handleEvent({ ...ev, id: "e3", data: { order_id: "outra" } }, d), "ignored");

  // nova tentativa expira
  const r2 = await startCheckout(ana(), null, d);
  assert.ok(r2.ok);
  const reg2 = rows[1];
  aro.sessions.get(reg2.aro_session_id!)!.state = "EXPIRED";
  assert.equal((await getStatus(r2.id, r2.checkoutSecret!, d))?.state, "EXPIRED");
  assert.equal(reg2.status, "released");
});

test("ARO indisponível na criação: liberta a reserva e responde 503", async () => {
  const { store, rows } = memStore();
  const broken = { fetch: (async () => { throw new Error("down"); }) as unknown as typeof fetch } as ReturnType<typeof fakeAro>;
  assert.deepEqual(await startCheckout(ana(), null, deps(store, broken)), { ok: false, status: 503, error: "aro_unavailable" });
  assert.equal(rows[0].status, "released");
});
