BEGIN;
INSERT INTO si_workshops.registrations
  (id,workshop,email,name,campaign,consent_terms_version,status,ticket)
VALUES ('00000000-0000-4000-8000-000000000004','LL01','ticket@example.test','Ticket','LL01-SITE','test','confirmed','LL01-TEST');
SET LOCAL ROLE si_workshops_app;
SELECT si_workshops.mark_ticket_emailed('00000000-0000-4000-8000-000000000004');
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM si_workshops.registrations
    WHERE id='00000000-0000-4000-8000-000000000004' AND ticket_emailed_at IS NOT NULL) THEN
    RAISE EXCEPTION 'ticket delivery was not persisted';
  END IF;
END $$;
SELECT si_workshops.mark_ticket_emailed('00000000-0000-4000-8000-000000000004');
ROLLBACK;
