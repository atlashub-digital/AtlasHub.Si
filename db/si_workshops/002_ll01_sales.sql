-- LL01 Live Lab: migração aditiva. Nunca executar sem backup/smoke e env/config do projeto.
-- Mesma base si_workshops (motor idempotente, webhooks, CRM). Sem alteração da lógica W01/EL01.
BEGIN;

ALTER TABLE si_workshops.workshops DROP CONSTRAINT IF EXISTS workshops_code_check;
ALTER TABLE si_workshops.workshops ADD CONSTRAINT workshops_code_check CHECK (code IN ('W01','EL01','LL01'));
-- 10000 é teto técnico provisório para não anunciar escassez fictícia.
-- Helena define capacidade real se houver limite; vendas ficam DESLIGADAS até homologação.
INSERT INTO si_workshops.workshops(code,capacity,sales_open)
  VALUES ('LL01',10000,false) ON CONFLICT(code) DO NOTHING;

ALTER TABLE si_workshops.registrations DROP CONSTRAINT IF EXISTS registrations_campaign_check;
ALTER TABLE si_workshops.registrations ADD CONSTRAINT registrations_campaign_check
  CHECK (campaign ~ '^(W01|EL01|LL01)-[A-Z]{2,5}$');
ALTER TABLE si_workshops.registrations ADD COLUMN IF NOT EXISTS identity_hash text;
ALTER TABLE si_workshops.registrations ADD COLUMN IF NOT EXISTS promo_expires_at timestamptz;
CREATE INDEX IF NOT EXISTS registrations_ll01_identity
  ON si_workshops.registrations(identity_hash,created_at DESC)
  WHERE workshop='LL01' AND identity_hash IS NOT NULL;

-- Reserva com identidade HMAC do CPF/CNPJ (nunca documento em claro na DB).
-- Uma promoção por identidade; recarregar, reentrar ou criar novo e-mail NÃO reinicia os 5 minutos.
CREATE OR REPLACE FUNCTION si_workshops.reserve_ll01(
  p_email text,p_name text,p_phone text,p_identity_hash text,p_doc_last4 text,
  p_campaign text,p_terms text,p_marketing boolean,p_ip_hash text
) RETURNS TABLE(id uuid, promo_expires_at timestamptz, outcome text)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path=si_workshops,public AS $$
DECLARE w si_workshops.workshops;
        r si_workshops.registrations;
        prior_promo timestamptz;
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
    WHERE g.workshop='LL01' AND g.status='pending' AND g.hold_until<=now();

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

  -- A primeira janela de 5 minutos é definitiva por CPF/CNPJ.
  SELECT g.promo_expires_at INTO prior_promo FROM si_workshops.registrations g
    WHERE g.workshop='LL01' AND g.identity_hash=p_identity_hash
    ORDER BY g.created_at ASC LIMIT 1;
  INSERT INTO si_workshops.registrations
    (workshop,email,name,phone,document,identity_hash,campaign,consent_terms_version,
     consent_marketing,hold_until,promo_expires_at,ip_hash)
  VALUES
    ('LL01',lower(p_email),p_name,p_phone,'***'||p_doc_last4,p_identity_hash,p_campaign,
     p_terms,coalesce(p_marketing,false),now()+interval '5 minutes',
     coalesce(prior_promo,now()+interval '5 minutes'),p_ip_hash)
  RETURNING * INTO r;
  id:=r.id; promo_expires_at:=r.promo_expires_at; outcome:='new';
  RETURN NEXT;
END $$;

REVOKE ALL ON FUNCTION si_workshops.reserve_ll01(text,text,text,text,text,text,text,boolean,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION si_workshops.reserve_ll01(text,text,text,text,text,text,text,boolean,text) TO si_workshops_app;
COMMIT;
