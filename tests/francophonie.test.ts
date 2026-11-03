import test from "node:test";
import assert from "node:assert/strict";
import { validateFrenchLead } from "../lib/francophonie-leads";
import { POST } from "../app/api/fr/lead/route";

const lead = () => ({
  requestId: "11111111-1111-4111-8111-111111111111",
  name: "Élodie Martin", email: "elodie@example.com", company: "PME",
  interest: "qualification", country: "FR", preferredWindow: "Mardi matin",
  message: "Comprendre les opportunités", consentContact: true, consentMarketing: false, website: "",
});
const request = (input: unknown = lead(), origin = "https://atlashub.si") =>
  new Request("https://atlashub.si/api/fr/lead", {
    method: "POST", headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

test("lead FR : consentement requis, marketing séparé", () => {
  assert.equal(validateFrenchLead(lead()).consentMarketing, false);
  assert.equal(validateFrenchLead({ ...lead(), consentMarketing: true }).consentMarketing, true);
  assert.throws(() => validateFrenchLead({ ...lead(), consentContact: false }));
  assert.throws(() => validateFrenchLead({ ...lead(), consentMarketing: "on" }));
});
test("lead FR : protège champs et objectifs", () => {
  for (const bad of [
    { interest: "free-money" }, { email: "non valide" }, { country: "NONE" },
    { website: "bot" }, { message: "x".repeat(1001) },
    { requestId: "invalid" }, { name: "A" },
  ]) assert.throws(() => validateFrenchLead({ ...lead(), ...bad }));
  const result = validateFrenchLead({ ...lead(), dangerous: "ignore" });
  assert.equal("dangerous" in result, false);
});
test("API FR : refuse origine externe et gros corps", async () => {
  assert.equal((await POST(request(lead(), "https://other.test"))).status, 403);
  assert.equal((await POST(request({ extra: "x".repeat(8500) }))).status, 413);
});
test("API FR : sans activation ne prétend pas avoir capturé un lead", async () => {
  const prev = process.env.FR_LEAD_ENABLED;
  delete process.env.FR_LEAD_ENABLED;
  try { assert.equal((await POST(request())).status, 503); }
  finally { if (prev === undefined) delete process.env.FR_LEAD_ENABLED; else process.env.FR_LEAD_ENABLED = prev; }
});
test("API FR : succès seulement pour livraison confirmée et route humaine", async () => {
  const prev = { enabled: process.env.FR_LEAD_ENABLED, url: process.env.FR_LEAD_WEBHOOK_URL, token: process.env.FR_LEAD_WEBHOOK_TOKEN };
  const original = global.fetch;
  try {
    process.env.FR_LEAD_ENABLED = "true";
    process.env.FR_LEAD_WEBHOOK_URL = "https://example.invalid/lead";
    process.env.FR_LEAD_WEBHOOK_TOKEN = "test-secret";
    global.fetch = async (_url, options) => {
      assert.equal((options?.headers as Record<string,string>)["Idempotency-Key"], lead().requestId);
      const payload = JSON.parse(String(options?.body));
      assert.equal(payload.source, "atlashub-francophonie");
      assert.equal(payload.route, "human");
      assert.equal(payload.offerInterest, "qualification");
      assert.equal(payload.consentMarketing, false);
      return Response.json({ id: "lead-fr-test", route: "human" }, { status: 202 });
    };
    assert.equal((await POST(request())).status, 202);
    global.fetch = async () => Response.json({ id: "test", route: "agent" }, { status: 202 });
    assert.equal((await POST(request())).status, 502);
    global.fetch = async () => { throw Error("offline"); };
    assert.equal((await POST(request())).status, 502);
  } finally {
    global.fetch = original;
    for (const [key,value] of [
      ["FR_LEAD_ENABLED",prev.enabled],["FR_LEAD_WEBHOOK_URL",prev.url],["FR_LEAD_WEBHOOK_TOKEN",prev.token]
    ] as const) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
