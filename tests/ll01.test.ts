import test from 'node:test';
import assert from 'node:assert/strict';
import { ll01Offer } from '../lib/sales/ll01-offer';
import { statusAvailability } from '../lib/sales/ll01-commerce';
const env = { LL01_CAMPAIGN_APPROVED: 'yes', LL01_PROMO_ENABLED: 'yes', LL01_PROMO_ENDS_AT: '2026-10-27T02:59:59Z' };
test('LL01 campaign uses the approved server deadline and transitions exactly once', () => {
  assert.equal(ll01Offer(env, new Date('2026-10-27T02:59:58Z')).amount, 24900);
  assert.equal(ll01Offer(env, new Date('2026-10-27T02:59:59Z')).amount, 49700);
  assert.equal(ll01Offer(env, new Date('2026-10-28T00:00:00Z')).code, 'll01-regular-br');
});
test('LL01 never invents an unapproved, invalid or timezone-free deadline', () => {
  for (const settings of [{}, { ...env, LL01_CAMPAIGN_APPROVED: 'no' }, { ...env, LL01_PROMO_ENDS_AT: 'invalid' }, { ...env, LL01_PROMO_ENDS_AT: '2026-10-26T23:59:59' }]) {
    assert.equal(ll01Offer(settings).deadline, null);
    assert.equal(ll01Offer(settings).promotional, false);
  }
});
test('LL01 cannot open sales with legacy flags alone', async () => {
  assert.equal((await statusAvailability()).open, false);
});
test('LL01 test override requires both envs and cannot override verified sales', () => {
  const now = new Date('2026-10-20T00:00:00Z');
  const settings = { ...env, LL01_E2E_TEST_OFFER: 'yes', LL01_E2E_TEST_CODE: 'll01-e2e-test-br' };
  assert.deepEqual(ll01Offer(settings, now), { approved: true, promotional: false,
    code: 'll01-e2e-test-br', amount: 500, deadline: null, serverNow: now.toISOString() });
  for (const safe of [{ ...settings, LL01_E2E_TEST_OFFER: 'no' },
    { ...settings, LL01_E2E_TEST_CODE: '' }, { ...settings, LL01_E2E_TEST_CODE: '  ' },
    { ...settings, LL01_RELEASE_V3_VERIFIED: 'yes' }]) {
    assert.deepEqual(ll01Offer(safe, now), ll01Offer(env, now));
  }
});
