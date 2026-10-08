import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import home from "../lib/mockups/home.json";
import et from "../lib/mockups/enterprise-transformation.json";
import aiw from "../lib/mockups/ai-workforce.json";

// Visual Pack V1 · 1:1 screens: every line of copy and every link stays inside the canvas,
// the plate exists and links point to real routes or known hosts.
const routes = ["/", "/solucoes/ai-workforce", "/solucoes/enterprise-transformation"];
const hosts = ["https://app.atlashub.si", "https://editions.atlashub.si"];
for (const s of [home, et, aiw]) {
  test(`${s.id}: plate, copy and links are consistent`, () => {
    assert.ok(existsSync(`public${s.bg}`), `missing plate ${s.bg}`);
    assert.ok(s.items.length > 40);
    for (const it of s.items) {
      assert.ok(it.x >= 0 && it.x < s.W && it.y >= -10 && it.y < s.H, `${it.t} outside canvas`);
      assert.ok(it.s > 6 && it.s < 90, `${it.t} has an odd size`);
      assert.match(it.c, /^#[0-9a-f]{6}$/);
    }
    for (const l of s.links) {
      const [x1, y1, x2, y2] = l.r;
      assert.ok(x1 < x2 && y1 < y2 && x2 <= s.W && y2 <= s.H, `${l.label} rect`);
      assert.ok(l.label.length > 2);
      const path = l.href.split(/[?#]/)[0];
      assert.ok(l.href.startsWith("#") || routes.includes(path) || hosts.some((h) => l.href.startsWith(h)), `${l.href}`);
    }
  });
}
