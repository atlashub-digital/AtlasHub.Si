import test from "node:test";
import assert from "node:assert/strict";
import { aroConfig, type Order, type Entitlement } from "../lib/aro/client";
import { verifyLl01Purchase } from "../lib/commerce/ll01-confirmation";
import { handleEvent, getStatus, type Deps } from "../lib/commerce/checkout";
import type { Registration, Store } from "../lib/commerce/store";

const now = new Date("2026-10-27T03:00:00Z");
function fixture() {
  const reg: Registration = { id: "00000000-0000-4000-8000-000000000001", workshop: "LL01", status: "pending",
    email: "buyer@example.test", name: "Test Buyer", phone: null, company: null, campaign: "LL01-SITE",
    consent_marketing: false, consent_whatsapp_group: false, offer: "ll01-promocional-br", amount_minor: 24900,
    aro_session_id: "session-1", aro_order_id: "order-1", ticket: null, over_capacity: false, crm_notified_at: null };
  const order: Order = { id: "order-1", project: "atlashub-si", status: "APPROVED", customer_id: "customer-1",
    amount: { amount_minor: 24900, currency: "BRL" },
    items: [{ offer: "ll01-promocional-br", quantity: 1, unit_amount: { amount_minor: 24900, currency: "BRL" } }] };
  const entitlement: Entitlement = { key: "atlashub-si:ll01", status: "ACTIVE", source_order_id: "order-1", starts_at: "2026-10-19T00:00:00Z" };
  const env = { ARO_API_URL: "https://aro.example", ARO_PROJECT_SLUG: "atlashub-si", ARO_PUBLIC_KEY: "pk", ARO_SERVER_KEY: "sk",
    WORKSHOP_CRM_WEBHOOK_URL: "https://crm.example/hook", WORKSHOP_CRM_WEBHOOK_TOKEN: "token" };
  const calls: { url: string; body: unknown; headers: Record<string, string> }[] = [];
  let crmOk = true, aroOk = true, confirms = 0;
  const events = new Set<string>();
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input), headers = init?.headers as Record<string, string>;
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null, headers });
    const reply = (data: unknown, status = 200) => Response.json(data, { status });
    if (url === env.WORKSHOP_CRM_WEBHOOK_URL) return reply({}, crmOk ? 200 : 503);
    if (!aroOk) return reply({}, 503);
    if (url.endsWith("/v1/orders/order-1")) return reply(order);
    if (url.endsWith("/v1/entitlements/resolve")) return reply({ project: "atlashub-si", entitlements: [entitlement] });
    if (url.endsWith("/v1/checkout-sessions/session-1")) {
      if (headers["X-ARO-Checkout-Secret"] !== "valid-secret") return reply({}, 401);
      return reply({ id: "session-1", order_id: "order-1", project: "atlashub-si", state: order.status });
    }
    throw Error("unexpected request");
  }) as typeof fetch;
  const unused = async (): Promise<never> => { throw Error("unexpected store operation"); };
  const store: Store = {
    availability: unused, reserve: unused, attachCheckout: unused, release: unused,
    get: async () => reg, findByOrder: async id => id === reg.aro_order_id ? reg : null,
    confirm: async () => {
      const newlyConfirmed = reg.status !== "confirmed";
      if (newlyConfirmed) confirms++;
      reg.status = "confirmed"; reg.ticket = "LL01-TICKET";
      return { ticket: reg.ticket, newlyConfirmed, overCapacity: false };
    },
    revoke: async () => { const changed = reg.status !== "revoked"; reg.status = "revoked"; return changed ? 1 : 0; },
    recordEvent: async id => { if (events.has(id)) return false; events.add(id); return true; },
    markCrmNotified: async () => { reg.crm_notified_at = now; },
  };
  const d: Deps = { aro: aroConfig(env), store, env, fetch: fetchImpl, now: () => now };
  const event = { id: "event-1", type: "entitlement.granted" as const, project: "atlashub-si", created_at: now.toISOString(), data: { order_id: "order-1" } };
  return { reg, order, entitlement, calls, events, d, event, confirms: () => confirms,
    setCrm: (ok: boolean) => { crmOk = ok; }, setAro: (ok: boolean) => { aroOk = ok; } };
}

test("LL01: approved order + same-order active entitlement confirms once, even after campaign deadline", async () => {
  const f = fixture();
  assert.equal(await handleEvent(f.event, f.d), "processed");
  assert.equal(await handleEvent(f.event, f.d), "duplicate");
  assert.equal(f.confirms(), 1);
  assert.equal(f.reg.ticket, "LL01-TICKET");
  assert.equal(f.calls.filter(c => c.url.includes("crm.example")).length, 1);
  assert.deepEqual(f.calls.find(c => c.url.includes("entitlements"))?.body, { project: "atlashub-si", customer_id: "customer-1" });
  assert.equal(f.calls[0].headers.Authorization, "Bearer sk");
});

test("LL01: same email with another order's entitlement cannot confirm", async () => {
  const f = fixture(); f.entitlement.source_order_id = "older-order";
  await assert.rejects(handleEvent(f.event, f.d), /confirmation_pending/);
  assert.equal(f.confirms(), 0); assert.equal(f.events.size, 0);
  delete f.entitlement.source_order_id;
  assert.equal(await verifyLl01Purchase(f.reg, f.d.aro, f.d.fetch, now), false);
});

test("LL01: an entitlement notification does not prove APPROVED payment", async () => {
  for (const status of ["CREATED", "PENDING", "CANCELED", "REFUNDED", "CHARGEBACK"] as const) {
    const f = fixture(); f.order.status = status;
    await assert.rejects(handleEvent(f.event, f.d), /confirmation_pending/);
    assert.equal(f.confirms(), 0);
  }
});

test("LL01: order/project/amount/currency/offer mismatches are rejected", async () => {
  const mutations: ((o: Order) => void)[] = [o => { o.id = "other"; }, o => { o.project = "other"; },
    o => { o.amount.amount_minor = 1; }, o => { o.amount.currency = "EUR"; },
    o => { o.items[0].offer = "other"; }, o => { o.items[0].quantity = 2; },
    o => { o.items[0].unit_amount.amount_minor = 1; }, o => { o.items = []; }];
  for (const mutate of mutations) {
    const f = fixture(); mutate(f.order);
    assert.equal(await verifyLl01Purchase(f.reg, f.d.aro, f.d.fetch, now), false);
  }
});

test("LL01: inactive, future, malformed or expired entitlement never grants a ticket", async () => {
  const mutations: ((e: Entitlement) => void)[] = [e => { e.status = "REVOKED"; }, e => { e.key = "other"; },
    e => { e.starts_at = "2027-01-01T00:00:00Z"; }, e => { e.starts_at = "bad"; },
    e => { e.expires_at = now.toISOString(); }, e => { e.expires_at = "bad"; }];
  for (const mutate of mutations) {
    const f = fixture(); mutate(f.entitlement);
    assert.equal(await verifyLl01Purchase(f.reg, f.d.aro, f.d.fetch, now), false);
  }
});

test("LL01: canonical outage leaves event retryable and later confirms without browser", async () => {
  const f = fixture(); f.setAro(false);
  await assert.rejects(handleEvent(f.event, f.d));
  assert.equal(f.events.size, 0); assert.equal(f.confirms(), 0);
  f.setAro(true);
  assert.equal(await handleEvent(f.event, f.d), "processed");
  assert.equal(f.confirms(), 1);
});

test("LL01: entitlement arriving later can retry the same signed notification", async () => {
  const f = fixture(); f.entitlement.status = "EXPIRED";
  await assert.rejects(handleEvent(f.event, f.d));
  f.entitlement.status = "ACTIVE";
  assert.equal(await handleEvent(f.event, f.d), "processed");
});

test("LL01: CRM failure retries with stable idempotency key and no duplicate ticket", async () => {
  const f = fixture(); f.setCrm(false);
  await assert.rejects(handleEvent(f.event, f.d), /crm_retry_required/);
  assert.equal(f.events.size, 0); assert.equal(f.reg.crm_notified_at, null);
  f.setCrm(true);
  assert.equal(await handleEvent(f.event, f.d), "processed");
  assert.equal(f.confirms(), 1);
  const calls = f.calls.filter(c => c.url.includes("crm.example"));
  assert.equal(calls.length, 2);
  assert.equal(calls[0].headers["Idempotency-Key"], calls[1].headers["Idempotency-Key"]);
});

test("LL01: refund CRM failure retries after local revocation; late approval cannot restore ticket", async () => {
  const f = fixture(); f.setCrm(false);
  const refund = { ...f.event, type: "payment.refunded" as const };
  await assert.rejects(handleEvent(refund, f.d), /crm_retry_required/);
  assert.equal(f.reg.status, "revoked"); assert.equal(f.events.size, 0);
  f.setCrm(true); await handleEvent(refund, f.d);
  await handleEvent({ ...f.event, id: "late-approval" }, f.d);
  assert.equal(f.confirms(), 0); assert.equal(f.reg.status, "revoked");
});

test("LL01: confirmed ticket requires valid checkout possession, not any cookie", async () => {
  const f = fixture(); await handleEvent(f.event, f.d);
  assert.deepEqual(await getStatus(f.reg.id, null, f.d), { state: "CONFIRMED", workshop: "LL01", ticket: null });
  await assert.rejects(getStatus(f.reg.id, "wrong-secret", f.d));
  assert.deepEqual(await getStatus(f.reg.id, "valid-secret", f.d), { state: "CONFIRMED", workshop: "LL01", ticket: "LL01-TICKET" });
  f.order.status = "REFUNDED";
  assert.deepEqual(await getStatus(f.reg.id, "valid-secret", f.d), { state: "REVOKED", workshop: "LL01" });
});
