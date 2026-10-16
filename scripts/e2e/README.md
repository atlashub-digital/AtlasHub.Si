# E2E local do checkout dos workshops

Rotas reais (`next start`) + Postgres local com `db/si_workshops` + ARO simulado (`mock-aro.mjs`, nunca em produção).

```bash
createdb si_e2e && psql -d si_e2e -f db/si_workshops/001_registrations.sql
psql -d si_e2e -c "update si_workshops.workshops set sales_open = true; update si_workshops.workshops set capacity = 1 where code = 'EL01';"
npm run build
MOCK_ARO_PORT=4010 node scripts/e2e/mock-aro.mjs &
ARO_API_URL=http://localhost:4010 ARO_PROJECT_SLUG=atlashub-si ARO_PUBLIC_KEY=pk_test ARO_SERVER_KEY=sk_test \
  ARO_WEBHOOK_SECRET=whsec_test ARO_PAYMENTS_ENABLED=yes WORKSHOPS_SALES_OPEN=W01,EL01 \
  SI_DATABASE_URL=postgres://postgres@localhost:5432/si_e2e npx next start -p 3200 &
node scripts/e2e/checkout-e2e.mjs
```
