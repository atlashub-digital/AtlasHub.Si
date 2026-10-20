BEGIN;
CREATE TABLE IF NOT EXISTS si_workshops.registration_communications (
  registration_id uuid PRIMARY KEY REFERENCES si_workshops.registrations(id),
  event_type text NOT NULL DEFAULT 'workshop.registration.confirmed' CHECK (event_type = 'workshop.registration.confirmed'),
  created_at timestamptz NOT NULL DEFAULT now(),
  history jsonb NOT NULL DEFAULT jsonb_build_object('payment_confirmed', now()),
  channels jsonb NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT ON si_workshops.registration_communications TO si_workshops_app;
CREATE OR REPLACE FUNCTION si_workshops.communication_event(p_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = si_workshops, public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM registrations WHERE id=p_id AND status='confirmed' AND aro_order_id IS NOT NULL) THEN
    RAISE EXCEPTION 'not_confirmed';
  END IF;
  INSERT INTO registration_communications(registration_id, history, channels)
    SELECT id, jsonb_build_object('payment_confirmed',now()) ||
      CASE WHEN ticket_emailed_at IS NULL THEN '{}'::jsonb ELSE
        jsonb_build_object('welcome_sent',ticket_emailed_at,'book_pending',ticket_emailed_at) END, CASE WHEN ticket_emailed_at IS NULL THEN '{}'::jsonb
      ELSE jsonb_build_object('email',jsonb_build_object('status','sent','at',ticket_emailed_at)) END
    FROM registrations WHERE id=p_id ON CONFLICT DO NOTHING;
END $$;
CREATE OR REPLACE FUNCTION si_workshops.communication_claim(p_id uuid, p_channel text) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = si_workshops, public AS $$
DECLARE n integer;
BEGIN
  IF p_channel NOT IN ('email','whatsapp') THEN RAISE EXCEPTION 'invalid_channel'; END IF;
  UPDATE registration_communications SET channels=jsonb_set(channels,ARRAY[p_channel],
    jsonb_build_object('status','sending','at',now(),'first_attempt_at',
      coalesce(channels->p_channel->'first_attempt_at',to_jsonb(now()))))
  WHERE registration_id=p_id AND coalesce(channels->p_channel->>'status','pending') IN ('pending','failed')
    AND (p_channel <> 'email' OR NOT channels ? p_channel OR
      (channels->p_channel->>'first_attempt_at')::timestamptz > now() - interval '23 hours')
    AND EXISTS (SELECT 1 FROM registrations WHERE id=p_id AND status='confirmed');
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n=1;
END $$;
CREATE OR REPLACE FUNCTION si_workshops.communication_result(p_id uuid, p_channel text, p_status text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = si_workshops, public AS $$
BEGIN
  IF p_channel NOT IN ('email','whatsapp') OR p_status NOT IN ('sent','failed','uncertain') THEN RAISE EXCEPTION 'invalid_result'; END IF;
  UPDATE registration_communications SET channels=jsonb_set(channels,ARRAY[p_channel],
    (channels->p_channel) || jsonb_build_object('status',p_status,'at',now())),
    history=CASE WHEN p_status='sent' AND NOT history ? 'welcome_sent'
      THEN history || jsonb_build_object('welcome_sent',now(),'book_pending',now()) ELSE history END
    WHERE registration_id=p_id AND channels->p_channel->>'status'='sending';
END $$;
CREATE OR REPLACE FUNCTION si_workshops.communication_transition(p_id uuid, p_state text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = si_workshops, public AS $$
DECLARE h jsonb;
BEGIN
  SELECT history INTO h FROM registration_communications WHERE registration_id=p_id FOR UPDATE;
  IF h IS NULL OR NOT EXISTS (SELECT 1 FROM registrations WHERE id=p_id AND status='confirmed') THEN RAISE EXCEPTION 'not_confirmed'; END IF;
  IF p_state NOT IN ('book_sent','live_access_sent') THEN RAISE EXCEPTION 'invalid_transition'; END IF;
  IF h ? p_state THEN RETURN; END IF;
  IF (p_state='book_sent' AND NOT h ? 'book_pending') OR
     (p_state='live_access_sent' AND NOT h ? 'live_access_pending') THEN RAISE EXCEPTION 'invalid_transition'; END IF;
  UPDATE registration_communications SET history=history || jsonb_build_object(p_state,now()) ||
    CASE WHEN p_state='book_sent' THEN jsonb_build_object('live_access_pending',now()) ELSE '{}'::jsonb END
    WHERE registration_id=p_id;
END $$;
REVOKE ALL ON FUNCTION si_workshops.communication_event(uuid), si_workshops.communication_claim(uuid,text),
 si_workshops.communication_result(uuid,text,text), si_workshops.communication_transition(uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION si_workshops.communication_event(uuid), si_workshops.communication_claim(uuid,text),
 si_workshops.communication_result(uuid,text,text), si_workshops.communication_transition(uuid,text) TO si_workshops_app;
COMMIT;
