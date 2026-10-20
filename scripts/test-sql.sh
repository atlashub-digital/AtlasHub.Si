#!/usr/bin/env bash
# Aplica db/si_workshops num Postgres descartável e corre os testes. Nunca contra produção.
set -euo pipefail
case "${PGHOST:-}" in /*|localhost|127.0.0.1) ;; *) echo "Recusado: PGHOST tem de ser local"; exit 1;; esac
db="si_workshops_test_$$"
createdb "$db"; trap 'dropdb --if-exists "$db"' EXIT
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/001_registrations.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/001_registrations.sql   # reexecutável
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/tests/001_registrations_test.sql | tail -3

# Migração LL01 é idempotente e testada apenas nesta DB descartável.
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/002_ll01_sales.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/002_ll01_sales.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/tests/002_ll01_sales_test.sql | tail -3

# V3: preserva histórico e remove a janela individual de desconto.
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/003_ll01_campaign.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/003_ll01_campaign.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/tests/003_ll01_campaign_test.sql

# Durable ticket delivery marker; repeatable and callable by the application role.
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/004_ll01_ticket_email.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/004_ll01_ticket_email.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/tests/004_ll01_ticket_email_test.sql
