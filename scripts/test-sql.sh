#!/usr/bin/env bash
# Aplica db/si_workshops num Postgres descartável e corre os testes. Nunca contra produção.
set -euo pipefail
case "${PGHOST:-}" in /*|localhost|127.0.0.1) ;; *) echo "Recusado: PGHOST tem de ser local"; exit 1;; esac
db="si_workshops_test_$$"
createdb "$db"; trap 'dropdb --if-exists "$db"' EXIT
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/001_registrations.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/si_workshops/001_registrations.sql   # reexecutável
psql -q -v ON_ERROR_STOP=1 -d "$db" -f db/tests/001_registrations_test.sql | tail -3
