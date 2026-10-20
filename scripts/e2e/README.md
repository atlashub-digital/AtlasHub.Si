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

LL01 browser (DB local descartável com migrações 001–005, gates comerciais e
transportes desligados): instalar Playwright apenas para o teste com
`npm install --no-save --package-lock=false playwright` e ter Chromium instalado.
Iniciar `mock-aro.mjs`, construir e iniciar Next com `SI_DATABASE_URL`,
`ARO_API_URL=http://localhost:4010`, `ARO_PROJECT_SLUG=atlashub-si`,
`ARO_PUBLIC_KEY=pk_test`, `ARO_SERVER_KEY=sk_test`, `ARO_WEBHOOK_SECRET=whsec_test`.
Não definir `LL01_TICKET_EMAIL=live` nem `LL01_WA_CONFIRM=live`.
Executar:

```bash
SI_DATABASE_URL=postgres://postgres@localhost:5432/si_e2e node scripts/e2e/ll01-confirmation-browser.mjs
```

O teste prepara uma inscrição de teste isolada no Postgres, mostra o PIX no browser,
aprova no ARO simulado, envia duas vezes o webhook assinado, verifica evento único
persistido e confirmação/bilhete visíveis, sem erros JavaScript. Não contacta
Resend ou Evolution reais.
