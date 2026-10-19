# LL01 — confirmation and webhook recovery delta

Source: V3 pack, files 00–05 read from the founder's Drive folder on 2026-10-19.

## Code corrections
- LL01 confirmation reads the canonical ARO order using the existing project server key.
- Requires APPROVED, matching project/order/offer/BRL amount and an ACTIVE entitlement
  whose source_order_id matches this purchase. Uses customer_id when returned by ARO.
- Uses the stored price, preserving historical purchases and promotional Pix after deadline.
- ARO errors or entitlement propagation delay leave the signed notification retryable.
- Failed LL01 confirmation/refund CRM delivery returns an error to ARO for redelivery;
  CRM keys remain idempotent and ticket confirmation remains idempotent.
- Missing registration storage returns HTTP 503 rather than acknowledging and losing an event.
- An LL01 ticket requires a validated checkout secret, not merely a non-empty cookie.
- Polling retries HTTP failures and invalid payloads; standalone Pix view identifies ONLINE/dates.

## Limits / sales gate
This is not a completed transactional delivery system. It uses existing ARO webhook retries;
it does not claim an independent scheduler, durable outbox, delivered email or WhatsApp.
Helena must confirm retry retention, reconciliation after exhausted retries, CRM receiver
idempotency, transport delivery, campaign deadline, schedule/platform, catalogue and DB/flags.
No provider integration, new checkout, production SQL, sales flag change or real charge.
W01/EL01 confirmation rules and pricing are unchanged. Shared webhook now returns 503 when DB is absent.

Tests cover same-order confirmation, another purchase's entitlement, non-approved orders,
amount/offer/project divergence, entitlement validity, ARO outage, delayed entitlement,
CRM retry, refund retry, late approval after revocation and checkout-secret verification.
Run the full existing Quality workflow for W01/EL01 regression, TypeScript, lint, build and SQL.

READY FOR SALES: NO until atlas-ops #23 has operational PASS evidence.
