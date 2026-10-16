-- AtlasHub.SI · inscrições pagas dos workshops (W01, EL01). Schema isolado `si_workshops`.
-- Só o servidor do site acede (papel `si_workshops_app`, ligação SI_DATABASE_URL); nenhum papel público.
-- Autoridade de preço e pagamento: ARO. Esta base guarda a intenção de inscrição, a reserva de lugar
-- (contra sobrevenda), a ligação à sessão ARO e o bilhete emitido só depois de pagamento aprovado
-- e direito ACTIVE no ARO. Reexecutável.
begin;

create schema if not exists si_workshops;
revoke all on schema si_workshops from public;

create table if not exists si_workshops.workshops (
  code text primary key check (code in ('W01', 'EL01')),
  capacity int not null check (capacity > 0),
  sales_open boolean not null default false
);
insert into si_workshops.workshops (code, capacity) values ('W01', 25), ('EL01', 12)
  on conflict (code) do nothing;

create table if not exists si_workshops.registrations (
  id uuid primary key default gen_random_uuid(),
  workshop text not null references si_workshops.workshops(code),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'released', 'revoked')),
  email text not null check (email = lower(email) and length(email) <= 160),
  name text not null check (length(name) between 2 and 160),
  phone text check (length(phone) <= 30),
  company text check (length(company) <= 160),
  role text check (length(role) <= 120),
  document text check (length(document) <= 20),
  campaign text not null check (campaign ~ '^(W01|EL01)-[A-Z]{2,5}$'),
  consent_terms_version text not null,
  consent_marketing boolean not null default false,
  consent_whatsapp_group boolean not null default false,
  ip_hash text,
  offer text,
  amount_minor int,
  aro_session_id text unique,
  aro_order_id text unique,
  hold_until timestamptz not null default now() + interval '30 minutes',
  ticket text unique,
  over_capacity boolean not null default false,
  crm_notified_at timestamptz,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  ended_at timestamptz,
  end_reason text
);
-- Uma inscrição viva (pendente ou confirmada) por e-mail e workshop: impede pagamento duplicado.
create unique index if not exists registrations_one_live
  on si_workshops.registrations (workshop, email) where status in ('pending', 'confirmed');
create index if not exists registrations_ip_recent on si_workshops.registrations (ip_hash, created_at);

create table if not exists si_workshops.webhook_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

-- Lugares ocupados = confirmados + pendentes ainda dentro da reserva.
create or replace function si_workshops.seats_taken(p_workshop text) returns int
language sql stable as $$
  select count(*)::int from si_workshops.registrations
  where workshop = p_workshop
    and (status = 'confirmed' or (status = 'pending' and hold_until > now()));
$$;

-- Reserva um lugar ou devolve a inscrição viva existente (mesmo e-mail).
-- Resultado: (id, status, ticket, outcome) com outcome in ('new','resume','already_confirmed').
create or replace function si_workshops.reserve(
  p_workshop text, p_email text, p_name text, p_phone text, p_company text, p_role text, p_document text,
  p_campaign text, p_terms_version text, p_marketing boolean, p_wa_group boolean, p_ip_hash text
) returns table (id uuid, status text, ticket text, outcome text)
language plpgsql as $$
declare
  w si_workshops.workshops;
  r si_workshops.registrations;
begin
  -- Serializa as reservas do mesmo workshop: a contagem e a inserção são atómicas.
  select * into w from si_workshops.workshops where code = p_workshop for update;
  if not found then raise exception 'workshop_unknown' using errcode = 'P0001'; end if;
  if not w.sales_open then raise exception 'sales_closed' using errcode = 'P0001'; end if;

  -- Expira reservas pendentes vencidas deste workshop (liberta lugares e o e-mail).
  update si_workshops.registrations g set status = 'released', ended_at = now(), end_reason = 'hold_expired'
    where g.workshop = p_workshop and g.status = 'pending' and g.hold_until <= now();

  select * into r from si_workshops.registrations g
    where g.workshop = p_workshop and g.email = lower(p_email) and g.status in ('pending', 'confirmed');
  if found then
    return query select r.id, r.status, r.ticket,
      case when r.status = 'confirmed' then 'already_confirmed' else 'resume' end;
    return;
  end if;

  if p_ip_hash is not null and (select count(*) from si_workshops.registrations g
      where g.ip_hash = p_ip_hash and g.created_at > now() - interval '10 minutes') >= 8 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  if si_workshops.seats_taken(p_workshop) >= w.capacity then
    raise exception 'sold_out' using errcode = 'P0001';
  end if;

  insert into si_workshops.registrations (workshop, email, name, phone, company, role, document, campaign,
      consent_terms_version, consent_marketing, consent_whatsapp_group, ip_hash)
    values (p_workshop, lower(p_email), p_name, nullif(p_phone, ''), nullif(p_company, ''), nullif(p_role, ''),
      nullif(p_document, ''), p_campaign, p_terms_version, coalesce(p_marketing, false), coalesce(p_wa_group, false), p_ip_hash)
    returning * into r;
  return query select r.id, r.status, r.ticket, 'new'::text;
end $$;

-- Liga a sessão ARO (a reserva passa a durar até à expiração do PIX + margem).
create or replace function si_workshops.attach_checkout(
  p_id uuid, p_session text, p_order text, p_offer text, p_amount int, p_expires timestamptz
) returns void language plpgsql as $$
begin
  update si_workshops.registrations
    set aro_session_id = p_session, aro_order_id = p_order, offer = p_offer, amount_minor = p_amount,
        hold_until = greatest(hold_until, coalesce(p_expires, now() + interval '30 minutes') + interval '5 minutes')
    where id = p_id and status = 'pending'
      and (aro_session_id is null or aro_session_id = p_session);
  if not found then raise exception 'not_pending' using errcode = 'P0001'; end if;
end $$;

-- Confirma (idempotente). Só deve ser chamada depois de ARO APPROVED + direito ACTIVE.
-- Aceita também inscrições cuja reserva expirou ou foi libertada (aprovação tardia): o pagamento manda;
-- marca over_capacity se isso exceder a capacidade, para a equipa decidir (nunca falha um pagamento).
create or replace function si_workshops.confirm(p_id uuid, p_order text)
returns table (id uuid, ticket text, newly_confirmed boolean, over_capacity boolean)
language plpgsql as $$
declare
  r si_workshops.registrations;
  w si_workshops.workshops;
  taken int;
begin
  select * into r from si_workshops.registrations g where g.id = p_id for update;
  if not found or r.aro_order_id is distinct from p_order then raise exception 'order_mismatch' using errcode = 'P0001'; end if;
  if r.status = 'confirmed' then return query select r.id, r.ticket, false, r.over_capacity; return; end if;
  if r.status = 'revoked' then raise exception 'revoked' using errcode = 'P0001'; end if;
  select * into w from si_workshops.workshops where code = r.workshop for update;
  select count(*) into taken from si_workshops.registrations g
    where g.workshop = r.workshop and g.id <> r.id
      and (g.status = 'confirmed' or (g.status = 'pending' and g.hold_until > now()));
  update si_workshops.registrations g
    set status = 'confirmed', confirmed_at = now(), ended_at = null, end_reason = null,
        over_capacity = (taken >= w.capacity),
        ticket = r.workshop || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
    where g.id = r.id
    returning * into r;
  return query select r.id, r.ticket, true, r.over_capacity;
end $$;

-- Liberta uma reserva pendente (pagamento falhou/expirou/cancelado). Não toca em confirmadas.
create or replace function si_workshops.release(p_id uuid, p_reason text) returns void
language sql as $$
  update si_workshops.registrations set status = 'released', ended_at = now(), end_reason = p_reason
  where id = p_id and status = 'pending';
$$;

-- Reembolso/estorno/direito revogado: o lugar volta a ficar livre e o bilhete deixa de valer.
create or replace function si_workshops.revoke(p_order text, p_reason text) returns int
language sql as $$
  with u as (
    update si_workshops.registrations set status = 'revoked', ended_at = now(), end_reason = p_reason
    where aro_order_id = p_order and status in ('pending', 'confirmed') returning 1)
  select count(*)::int from u;
$$;

-- Deduplicação de webhooks: true só na primeira vez que o id aparece.
create or replace function si_workshops.record_event(p_event text, p_type text) returns boolean
language sql as $$
  with i as (insert into si_workshops.webhook_events (event_id, type) values (p_event, p_type)
             on conflict (event_id) do nothing returning 1)
  select exists (select 1 from i);
$$;

create or replace function si_workshops.mark_crm_notified(p_id uuid) returns void
language sql as $$ update si_workshops.registrations set crm_notified_at = now() where id = p_id; $$;

-- Papel da aplicação: só executa funções e lê as suas linhas; sem DDL, sem acesso fora do schema.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'si_workshops_app') then
    create role si_workshops_app nologin;
  end if;
end $$;
grant usage on schema si_workshops to si_workshops_app;
grant select on si_workshops.registrations, si_workshops.workshops to si_workshops_app;
revoke insert, update, delete on all tables in schema si_workshops from si_workshops_app;
revoke all on all functions in schema si_workshops from public;
grant execute on all functions in schema si_workshops to si_workshops_app;
alter function si_workshops.reserve(text,text,text,text,text,text,text,text,text,boolean,boolean,text) security definer;
alter function si_workshops.attach_checkout(uuid,text,text,text,int,timestamptz) security definer;
alter function si_workshops.confirm(uuid,text) security definer;
alter function si_workshops.release(uuid,text) security definer;
alter function si_workshops.revoke(text,text) security definer;
alter function si_workshops.record_event(text,text) security definer;
alter function si_workshops.mark_crm_notified(uuid) security definer;
alter function si_workshops.reserve(text,text,text,text,text,text,text,text,text,boolean,boolean,text) set search_path = si_workshops, public;
alter function si_workshops.attach_checkout(uuid,text,text,text,int,timestamptz) set search_path = si_workshops, public;
alter function si_workshops.confirm(uuid,text) set search_path = si_workshops, public;
alter function si_workshops.release(uuid,text) set search_path = si_workshops, public;
alter function si_workshops.revoke(text,text) set search_path = si_workshops, public;
alter function si_workshops.record_event(text,text) set search_path = si_workshops, public;
alter function si_workshops.mark_crm_notified(uuid) set search_path = si_workshops, public;

commit;
