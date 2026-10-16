-- Testes do schema si_workshops (Postgres descartável). Corre como superutilizador e depois como a app.
\set ON_ERROR_STOP on
create or replace function pg_temp.expect_fail(sql text, msg text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then
    if position(msg in sqlerrm) = 0 then raise exception 'esperava % mas veio %', msg, sqlerrm; end if;
    return;
  end;
  raise exception 'esperava falha: %', msg;
end $$;

-- vendas fechadas por defeito
select pg_temp.expect_fail($$select * from si_workshops.reserve('W01','a@x.com','Ana','','','','','W01-SITE','v1',false,false,null)$$, 'sales_closed');
update si_workshops.workshops set sales_open = true, capacity = 2 where code = 'W01';

-- reserva nova, depois retoma (mesmo e-mail, maiúsculas): não cria segunda inscrição
create temp table t as select * from si_workshops.reserve('W01','Ana@X.com','Ana','+55 62 9','','','','W01-SITE','v1',true,false,'ip1');
select assert_one from (select count(*) = 1 as assert_one from t where outcome = 'new') q where assert_one;
do $$ begin
  if (select outcome from si_workshops.reserve('W01','ana@x.com','Ana','','','','','W01-IG','v1',false,false,'ip1')) <> 'resume'
  then raise exception 'esperava resume'; end if;
  if (select count(*) from si_workshops.registrations where email='ana@x.com') <> 1 then raise exception 'duplicou'; end if;
end $$;

-- capacidade 2: segunda pessoa entra, terceira recebe sold_out
select * from si_workshops.reserve('W01','bia@x.com','Bia','','','','','W01-SITE','v1',false,false,'ip2');
select pg_temp.expect_fail($$select * from si_workshops.reserve('W01','caio@x.com','Caio','','','','','W01-SITE','v1',false,false,'ip3')$$, 'sold_out');

-- campanha inválida recusada pela restrição
update si_workshops.workshops set capacity = 10 where code = 'W01';
select pg_temp.expect_fail($$select * from si_workshops.reserve('W01','d@x.com','Duda','','','','','<script>','v1',false,false,null)$$, 'registrations_campaign_check');

-- liga sessão e confirma (idempotente); ordem errada recusada
do $$ declare rid uuid; t1 text; t2 text; nc boolean; begin
  select id into rid from si_workshops.registrations where email='ana@x.com';
  perform si_workshops.attach_checkout(rid, 's1', 'o1', 'workshop-01-empresa-aumentada-antecipado-br', 29700, now() + interval '30 minutes');
  perform pg_temp.expect_fail(format('select * from si_workshops.confirm(%L, %L)', rid, 'o-errada'), 'order_mismatch');
  select ticket, newly_confirmed into t1, nc from si_workshops.confirm(rid, 'o1');
  if not nc or t1 !~ '^W01-[0-9A-F]{8}$' then raise exception 'bilhete inválido %', t1; end if;
  select ticket, newly_confirmed into t2, nc from si_workshops.confirm(rid, 'o1');
  if nc or t2 <> t1 then raise exception 'confirm não idempotente'; end if;
  -- confirmada: nova tentativa devolve already_confirmed
  if (select outcome from si_workshops.reserve('W01','ana@x.com','Ana','','','','','W01-SITE','v1',false,false,null)) <> 'already_confirmed'
  then raise exception 'esperava already_confirmed'; end if;
end $$;

-- reserva expirada liberta lugar; aprovação tardia ainda confirma e marca over_capacity se lotado
update si_workshops.workshops set capacity = 2 where code = 'W01';
do $$ declare rid uuid; oc boolean; begin
  select id into rid from si_workshops.registrations where email='bia@x.com';
  perform si_workshops.attach_checkout(rid, 's2', 'o2', 'workshop-01-empresa-aumentada-antecipado-br', 29700, now() - interval '1 hour');
  update si_workshops.registrations set hold_until = now() - interval '1 minute' where id = rid;
  perform si_workshops.reserve('W01','caio@x.com','Caio','','','','','W01-SITE','v1',false,false,null);  -- ocupa o lugar libertado
  if (select status from si_workshops.registrations where id = rid) <> 'released' then raise exception 'não libertou'; end if;
  select over_capacity into oc from si_workshops.confirm(rid, 'o2');
  if not oc then raise exception 'esperava over_capacity'; end if;
end $$;

-- reembolso revoga e liberta; webhook deduplicado
do $$ begin
  if si_workshops.revoke('o1', 'payment.refunded') <> 1 then raise exception 'revoke'; end if;
  if (select status from si_workshops.registrations where aro_order_id='o1') <> 'revoked' then raise exception 'estado'; end if;
  if not si_workshops.record_event('e1','payment.approved') then raise exception 'primeiro evento'; end if;
  if si_workshops.record_event('e1','payment.approved') then raise exception 'duplicado aceite'; end if;
end $$;

-- rate limit por IP (8 em 10 min)
update si_workshops.workshops set capacity = 100 where code = 'EL01';
update si_workshops.workshops set sales_open = true where code = 'EL01';
do $$ begin for i in 1..8 loop perform si_workshops.reserve('EL01', 'r'||i||'@x.com','Rui','','Loja','','','EL01-SITE','v1',false,false,'ipX'); end loop; end $$;
select pg_temp.expect_fail($$select * from si_workshops.reserve('EL01','r9@x.com','Rui','','Loja','','','EL01-SITE','v1',false,false,'ipX')$$, 'rate_limited');

-- papel da app: sem escrita direta, só funções
set role si_workshops_app;
select pg_temp.expect_fail($$insert into si_workshops.registrations (workshop,email,name,campaign,consent_terms_version) values ('W01','z@x.com','Zé','W01-SITE','v1')$$, 'permission denied');
select pg_temp.expect_fail($$update si_workshops.workshops set capacity = 999$$, 'permission denied');
select count(*) >= 0 from si_workshops.seats_taken('W01');
select * from si_workshops.reserve('EL01','app@x.com','App','','Loja','','','EL01-SITE','v1',false,false,null);
reset role;
select 'TODOS OS TESTES si_workshops PASSARAM';
