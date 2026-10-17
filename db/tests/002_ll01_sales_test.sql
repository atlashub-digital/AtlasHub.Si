-- LL01 — smoke real da migração numa base descartável
BEGIN;
DO $$
DECLARE a record; b record; q timestamptz; n int;
BEGIN
  IF NOT EXISTS(SELECT 1 FROM si_workshops.workshops WHERE code='LL01' AND sales_open=false)
  THEN RAISE EXCEPTION 'll01 default off failed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_proc WHERE proname='reserve_ll01')
  THEN RAISE EXCEPTION 'll01 reserve function missing'; END IF;
  UPDATE si_workshops.workshops SET sales_open=true WHERE code='LL01';
  SELECT * INTO a FROM si_workshops.reserve_ll01(
    'll01@example.test','Pessoa Teste','+5562999999999',
    repeat('a',64),'1234','LL01-SITE','ll01-2026-10-v1',false,'test_ip');
  IF a.outcome <> 'new' OR a.promo_expires_at <= now() THEN
     RAISE EXCEPTION 'first reservation invalid'; END IF;
  SELECT * INTO b FROM si_workshops.reserve_ll01(
    'll01@example.test','Pessoa Teste','+5562999999999',
    repeat('a',64),'1234','LL01-SITE','ll01-2026-10-v1',false,'test_ip');
  IF b.outcome <> 'resume' OR a.id <> b.id OR a.promo_expires_at <> b.promo_expires_at THEN
     RAISE EXCEPTION 'quote duplicated or timer reset'; END IF;
  SELECT count(*) INTO n FROM si_workshops.registrations
    WHERE workshop='LL01' AND document='***1234' AND identity_hash=repeat('a',64);
  IF n <> 1 THEN RAISE EXCEPTION 'LL01 document privacy/idempotence failed'; END IF;
  RAISE NOTICE 'PASS LL01 reserve first once, repeat no timer reset, document masked';
END $$;
ROLLBACK;
