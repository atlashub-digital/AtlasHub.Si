BEGIN;
INSERT INTO si_workshops.registrations
 (id,workshop,email,name,campaign,consent_terms_version,status,ticket,aro_order_id)
VALUES ('00000000-0000-4000-8000-000000000005','LL01','omni@example.test','Omni','LL01-SITE','test','confirmed','LL01-OMNI','order-omni');
SET LOCAL ROLE si_workshops_app;
SELECT si_workshops.communication_event('00000000-0000-4000-8000-000000000005');
SELECT si_workshops.communication_event('00000000-0000-4000-8000-000000000005');
DO $$
DECLARE i uuid := '00000000-0000-4000-8000-000000000005'; h jsonb;
BEGIN
  BEGIN
    PERFORM si_workshops.communication_transition(i,'live_access_sent');
    RAISE EXCEPTION 'accepted out of order';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'invalid_transition' THEN RAISE; END IF;
  END;
  IF NOT si_workshops.communication_claim(i,'email') THEN RAISE EXCEPTION 'first claim failed'; END IF;
  IF si_workshops.communication_claim(i,'email') THEN RAISE EXCEPTION 'concurrent claim accepted'; END IF;
  PERFORM si_workshops.communication_result(i,'email','failed');
  IF NOT si_workshops.communication_claim(i,'email') THEN RAISE EXCEPTION 'retry failed'; END IF;
  PERFORM si_workshops.communication_result(i,'email','sent');
  IF si_workshops.communication_claim(i,'email') THEN RAISE EXCEPTION 'duplicate delivery'; END IF;
  IF NOT si_workshops.communication_claim(i,'whatsapp') THEN RAISE EXCEPTION 'channels coupled'; END IF;
  PERFORM si_workshops.communication_result(i,'whatsapp','uncertain');
  IF si_workshops.communication_claim(i,'whatsapp') THEN RAISE EXCEPTION 'ambiguous WA repeated'; END IF;
  PERFORM si_workshops.communication_transition(i,'book_sent');
  PERFORM si_workshops.communication_transition(i,'live_access_sent');
  SELECT history INTO h FROM si_workshops.registration_communications WHERE registration_id=i;
  PERFORM si_workshops.communication_transition(i,'book_sent');
  IF h <> (SELECT history FROM si_workshops.registration_communications WHERE registration_id=i)
     OR NOT h ?& ARRAY['payment_confirmed','welcome_sent','book_pending','book_sent','live_access_pending','live_access_sent']
     THEN RAISE EXCEPTION 'history lost or duplicate transition'; END IF;
END $$;
RESET ROLE;
UPDATE si_workshops.registration_communications SET channels=jsonb_build_object('email',
  jsonb_build_object('status','failed','first_attempt_at',now()-interval '24 hours'))
WHERE registration_id='00000000-0000-4000-8000-000000000005';
SET LOCAL ROLE si_workshops_app;
DO $$ BEGIN
 IF si_workshops.communication_claim('00000000-0000-4000-8000-000000000005','email') THEN
   RAISE EXCEPTION 'expired provider idempotency window retried';
 END IF;
END $$;
RESET ROLE;
UPDATE si_workshops.registrations SET status='revoked' WHERE id='00000000-0000-4000-8000-000000000005';
SET LOCAL ROLE si_workshops_app;
DO $$ BEGIN
 BEGIN
  PERFORM si_workshops.communication_event('00000000-0000-4000-8000-000000000005');
  RAISE EXCEPTION 'revoked accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'not_confirmed' THEN RAISE; END IF;
 END;
END $$;
ROLLBACK;
