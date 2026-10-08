import test from "node:test";
import assert from "node:assert/strict";
import * as site from "../lib/site";

// Visual Pack V1 guardrails: no unproven claims in public copy, real states only, equal offers.
const text = JSON.stringify(site);
test("public copy makes no unproven claims", () => {
  for (const banned of [/\d+\s?%/, /24\s?\/\s?7/i, /\bonline\b/i, /\bpronto\b/i, /\bSLA\b/, /garantid/i, /\b\d+x\b/i]) assert.doesNotMatch(text, banned);
});
test("roles carry real states only and link to the existing demos", () => {
  assert.equal(site.roles.length, 8);
  for (const r of site.roles) { assert.equal(r.status, "demonstração"); assert.match(r.slug, /^[a-z-]+$/); }
  for (const a of new Set(site.roles.map((r) => r.area))) assert.ok((site.roleAreas as readonly string[]).includes(a));
});
test("the two offers have equal editorial weight and real destinations", () => {
  assert.equal(site.offers.length, 2);
  assert.deepEqual(site.offers.map((o) => o.points.length), [3, 3]);
  assert.deepEqual(site.offers.map((o) => o.href), ["/solucoes/ai-workforce", "/solucoes/enterprise-transformation"]);
});
test("transfer is described as contractual, never automatic", () => {
  assert.ok(site.transformationFaq.some((f) => /não é automática/.test(f.a)));
});
