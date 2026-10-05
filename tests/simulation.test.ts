import test from "node:test";
import assert from "node:assert/strict";
import { simulateCapacity } from "../lib/simulation";
const base = {
  volume: 600,
  minutes: 12,
  coverage: 60,
  exceptions: 20,
  reviewMinutes: 2,
};
test("capacity subtracts exceptions and includes per-case review", () => {
  const r = simulateCapacity(base);
  assert.equal(r.baselineHours, 120);
  assert.equal(r.futureHours, 72);
  assert.equal(r.savedHours, 48);
  assert.equal(r.exceptions, 72);
});
test("no eligible work or all exceptions gives no saving", () => {
  assert.equal(simulateCapacity({ ...base, coverage: 0 }).savedHours, 0);
  assert.equal(simulateCapacity({ ...base, exceptions: 100 }).savedHours, 0);
  assert.equal(simulateCapacity({ ...base, volume: 0 }).rate, 0);
});
test("extra review can produce a negative result; invalid inputs rejected", () => {
  assert.ok(simulateCapacity({ ...base, reviewMinutes: 30 }).savedHours < 0);
  assert.throws(() => simulateCapacity({ ...base, volume: NaN }));
  assert.throws(() => simulateCapacity({ ...base, coverage: 101 }));
});
