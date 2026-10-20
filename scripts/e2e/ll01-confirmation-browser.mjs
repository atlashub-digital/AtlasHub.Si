// Only run against a disposable local DB and mock ARO. No commercial gates or live transports.
import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
import { chromium } from 'playwright';
import postgres from 'postgres';
const base = process.env.BASE || 'http://localhost:3200';
const aro = process.env.ARO || 'http://localhost:4010';
const database = new URL(process.env.SI_DATABASE_URL);
for (const url of [new URL(base), new URL(aro), database]) {
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw Error('Local disposable services only');
}
const sql = postgres(database.toString(), { max: 1 });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const id = randomUUID(), email = `${id}@example.test`;
  const session = await (await fetch(`${aro}/v1/checkout-sessions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-ARO-Public-Key': 'pk_test', 'Idempotency-Key': id },
    body: JSON.stringify({ offer: 'll01-e2e-test-br', payer: { email } }),
  })).json();
  await sql`insert into si_workshops.registrations
    (id,workshop,email,name,campaign,consent_terms_version,offer,amount_minor,aro_session_id,aro_order_id)
    values (${id},'LL01',${email},'Browser Test','LL01-SITE','test','ll01-e2e-test-br',500,${session.id},${session.order_id})`;
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.context().addCookies([{ name: `si_co_${id.replaceAll('-', '')}`, value: session.checkout_secret, url: base }]);
  await page.goto(`${base}/workshops/checkout/${id}`);
  await page.getByRole('img', { name: 'QR Code PIX' }).waitFor();
  await fetch(`${aro}/_test/approve/${session.order_id}`);
  const eventId = randomUUID(), timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify({ id: eventId, type: 'payment.approved', project: 'atlashub-si',
    created_at: new Date().toISOString(), data: { order_id: session.order_id } });
  const signature = 'v1=' + createHmac('sha256', 'whsec_test').update(`${timestamp}.${body}`).digest('hex');
  for (let i = 0; i < 2; i++) {
    const result = await fetch(`${base}/api/aro/webhook`, { method: 'POST', body, headers: {
      'x-aro-event-id': eventId, 'x-aro-timestamp': timestamp, 'x-aro-signature': signature } });
    assert.equal(result.status, 200);
    assert.equal((await result.json()).outcome, i ? 'duplicate' : 'processed');
  }
  await page.getByRole('heading', { name: 'Inscrição confirmada.' }).waitFor({ timeout: 15000 });
  assert.match(await page.locator('body').innerText(), /Bilhete: LL01-/);
  const rows = await sql`select * from si_workshops.registration_communications where registration_id=${id}`;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].event_type, 'workshop.registration.confirmed');
  assert.ok(rows[0].history.payment_confirmed);
  assert.deepEqual(rows[0].channels, {}); // Gates remain off.
  assert.deepEqual(errors, []);
  console.log('PASS: browser PIX → signed webhook twice → one durable event/ticket → visible confirmation; transports off');
} finally {
  await browser.close();
  await sql.end();
}
