-- Apply before deploying ticket e-mail delivery. No commercial gates changed.
BEGIN;
ALTER TABLE si_workshops.registrations ADD COLUMN IF NOT EXISTS ticket_emailed_at timestamptz;
CREATE OR REPLACE FUNCTION si_workshops.mark_ticket_emailed(p_id uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = si_workshops, public AS $$
  UPDATE si_workshops.registrations SET ticket_emailed_at = now()
  WHERE id = p_id AND workshop = 'LL01' AND status = 'confirmed' AND ticket_emailed_at IS NULL;
$$;
REVOKE ALL ON FUNCTION si_workshops.mark_ticket_emailed(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION si_workshops.mark_ticket_emailed(uuid) TO si_workshops_app;
COMMIT;
