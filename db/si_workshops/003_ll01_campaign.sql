-- LL01 V3: no historical repricing. Apply after backup; no sales flags changed.
BEGIN;
CREATE OR REPLACE FUNCTION si_workshops.reserve_ll01(
  p_email text,p_name text,p_phone text,p_identity_hash text,p_doc_last4 text,
  p_campaign text,p_terms text,p_marketing boolean,p_ip_hash text
) RETURNS TABLE(id uuid, promo_expires_at timestamptz, outcome text)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path=si_workshops,public AS $$
DECLARE w si_workshops.workshops;
        r si_workshops.registrations;

BEGIN
  SELECT * INTO w FROM si_workshops.workshops WHERE code='LL01' FOR UPDATE;
  IF NOT FOUND OR NOT w.sales_open THEN
    RAISE EXCEPTION 'sales_closed' USING ERRCODE='P0001';
  END IF;
  IF p_email IS NULL OR p_identity_hash IS NULL OR length(p_identity_hash)<>64
    OR p_phone IS NULL OR p_terms IS NULL THEN
    RAISE EXCEPTION 'invalid' USING ERRCODE='P0001';
  END IF;

  UPDATE si_workshops.registrations g
    SET status='released',ended_at=now(),end_reason='hold_expired'
    WHERE g.workshop='LL01' AND g.status='pending' AND g.hold_until<=now() AND g.aro_session_id IS NULL;

  SELECT * INTO r FROM si_workshops.registrations g
    WHERE g.workshop='LL01'
      AND (g.identity_hash=p_identity_hash OR g.email=lower(p_email))
      AND g.status IN ('pending','confirmed')
    ORDER BY g.created_at DESC LIMIT 1 FOR UPDATE;
  IF FOUND THEN
    id:=r.id; promo_expires_at:=r.promo_expires_at;
    outcome:=CASE WHEN r.status='confirmed' THEN 'already_confirmed' ELSE 'resume' END;
    RETURN NEXT; RETURN;
  END IF;

  IF p_ip_hash IS NOT NULL AND
    (SELECT count(*) FROM si_workshops.registrations g
     WHERE g.ip_hash=p_ip_hash AND g.created_at>now()-interval '10 minutes')>=8 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE='P0001';
  END IF;

  IF si_workshops.seats_taken('LL01')>=w.capacity THEN
    RAISE EXCEPTION 'sold_out' USING ERRCODE='P0001';
  END IF;

  INSERT INTO si_workshops.registrations
    (workshop,email,name,phone,document,identity_hash,campaign,consent_terms_version,
     consent_marketing,hold_until,promo_expires_at,ip_hash)
  VALUES
    ('LL01',lower(p_email),p_name,p_phone,'***'||p_doc_last4,p_identity_hash,p_campaign,
     p_terms,coalesce(p_marketing,false),now()+interval '30 minutes',
     NULL,p_ip_hash)
  RETURNING * INTO r;
  id:=r.id; promo_expires_at:=r.promo_expires_at; outcome:='new';
  RETURN NEXT;
END $$;

REVOKE ALL ON FUNCTION si_workshops.reserve_ll01(text,text,text,text,text,text,text,boolean,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION si_workshops.reserve_ll01(text,text,text,text,text,text,text,boolean,text) TO si_workshops_app;
COMMIT;
