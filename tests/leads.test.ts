import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/lead/route";
import { validateLead } from "../lib/leads";
const base = () => ({
  requestId: "11111111-1111-4111-8111-111111111111",
  name: "Teste",
  email: "test@example.com",
  consent: true,
  intent: "contact",
  diagnostic: {
    scenario: "sales",
    channel: "email",
    systems: "api",
    frequency: "daily",
    approach: "draft",
  },
});
const req = (body: unknown = base(), origin = "https://atlashub.si") =>
  new Request("https://atlashub.si/api/lead", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
test("requires explicit consent and a valid contact", () => {
  assert.throws(() => validateLead({ ...base(), email: "" }));
  assert.throws(() => validateLead({ ...base(), consent: false }));
  assert.equal(
    validateLead({ ...base(), email: "", phone: "+351 900000000" }).phone,
    "+351 900000000",
  );
});
test("rejects excessive, invalid or fabricated input", () => {
  for (const change of [
    { name: "a".repeat(101) },
    { email: "invalid" },
    { phone: "123" },
    { website: "spam" },
    { diagnostic: { scenario: "fake" } },
    { requestId: "-".repeat(36) },
  ])
    assert.throws(() => validateLead({ ...base(), ...change }));
  assert.equal(
    "secret" in validateLead({ ...base(), secret: "discard" }),
    false,
  );
});
test("meeting needs preferred window and remains human", () => {
  assert.throws(() => validateLead({ ...base(), intent: "meeting" }));
  assert.equal(
    validateLead({
      ...base(),
      intent: "meeting",
      preferredWindow: "Terça, 10h Lisboa",
    }).route,
    "human",
  );
});
test("route rejects cross-origin, oversized and malformed requests", async () => {
  assert.equal((await POST(req(base(), "https://other.test"))).status, 403);
  assert.equal((await POST(req({ extra: "a".repeat(12001) }))).status, 413);
  assert.equal(
    (
      await POST(
        new Request("https://atlashub.si/api/lead", {
          method: "POST",
          headers: {
            origin: "https://atlashub.si",
            "Content-Type": "application/json",
          },
          body: "{bad",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await POST(
        new Request("https://atlashub.si/api/lead", {
          method: "POST",
          headers: { origin: "https://atlashub.si" },
        }),
      )
    ).status,
    415,
  );
});
test("fails closed without configuration; acknowledges only confirmed human delivery", async () => {
  const original = global.fetch;
  const prior = {
    url: process.env.LEAD_WEBHOOK_URL,
    token: process.env.LEAD_WEBHOOK_TOKEN,
  };
  try {
    delete process.env.LEAD_WEBHOOK_URL;
    delete process.env.LEAD_WEBHOOK_TOKEN;
    assert.equal((await POST(req())).status, 503);
    process.env.LEAD_WEBHOOK_URL = "https://example.invalid/webhook";
    process.env.LEAD_WEBHOOK_TOKEN = "test-only";
    global.fetch = async () => Response.json({ accepted: true });
    assert.equal((await POST(req())).status, 502);
    global.fetch = async () =>
      Response.json({ id: "lead-test", route: "agent" }, { status: 202 });
    assert.equal((await POST(req())).status, 502);
    global.fetch = async (_url, init) => {
      assert.equal(
        (init?.headers as Record<string, string>)["Idempotency-Key"],
        base().requestId,
      );
      assert.equal(JSON.parse(String(init?.body)).route, "human");
      return Response.json(
        { id: "lead-test", route: "human" },
        { status: 202 },
      );
    };
    const response = await POST(req());
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), {
      id: "lead-test",
      route: "human",
    });
    assert.equal(response.headers.get("cache-control"), "no-store");
    global.fetch = async () => {
      throw Error("timeout");
    };
    assert.equal((await POST(req())).status, 502);
  } finally {
    global.fetch = original;
    if (prior.url === undefined) delete process.env.LEAD_WEBHOOK_URL;
    else process.env.LEAD_WEBHOOK_URL = prior.url;
    if (prior.token === undefined) delete process.env.LEAD_WEBHOOK_TOKEN;
    else process.env.LEAD_WEBHOOK_TOKEN = prior.token;
  }
});
