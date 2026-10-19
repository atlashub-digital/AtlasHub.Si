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
