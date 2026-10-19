BEGIN;
UPDATE si_workshops.workshops SET sales_open=true WHERE code='LL01';
DO $$
DECLARE a record; b record;
BEGIN
SELECT * INTO a FROM si_workshops.reserve_ll01('v3-test@example.test','Test V3','+5562999999999',repeat('c',64),'0000','LL01-SITE','ll01-2026-10-v1',false,null);
IF a.promo_expires_at IS NOT NULL THEN RAISE EXCEPTION 'individual promo still active'; END IF;
SELECT * INTO b FROM si_workshops.reserve_ll01('v3-test@example.test','Test V3','+5562999999999',repeat('c',64),'0000','LL01-SITE','ll01-2026-10-v1',false,null);
IF a.id <> b.id OR b.outcome <> 'resume' THEN RAISE EXCEPTION 'reserve not idempotent'; END IF;
END $$;
ROLLBACK;
