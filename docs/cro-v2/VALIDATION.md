# Validação CRO V2 — 20/10/2026

Continuação da implementação existente na branch `feat/cro-v2`. Entrega em PR draft, sem merge nem deploy, conforme instrução atual.

- `npm test`: 66/66 passaram. Os testes novos verificam preço servidor no HTML inicial, formulário e empresa obrigatória em EL01, estados aberto/fechado/esgotado/sem snapshot, CTA LL01 e condições no rodapé.
- `npm run typecheck`: passou.
- `npm run lint`: passou sem erros; aviso preexistente de variável `text` não usada em `lib/commerce/ll01-ticket-email.ts`, fora do escopo comercial/visual.
- `npm run build`: passou.
- Browser Chromium contra build local (`next start`), 390px e 1440px: quatro páginas HTTP 200, um H1, OG image, noindex, âncoras existentes, sem overflow horizontal e sem erros JavaScript. Capturas locais em `/tmp/cro-v2-review/` (oito PNGs; não publicadas).
- Checkout, ARO, store, gates comerciais, termos versionados e transportes de confirmação não foram alterados. A suite existente de checkout/PIX/entitlements passou com adapters de teste.

## Pendências para revisão

- Não existem rotas próprias de privacidade/termos em `app/`. O rodapé aponta para condições publicadas dos eventos; isso não substitui uma política geral de privacidade aprovada. Blocker legal permanece.
- `noindex` nas quatro páginas até revisão editorial; não declarar pronto para anúncios.
- Smoke real reserve → checkout → PIX, sem pagamento e com libertação de reserva, não executado nesta continuação. Verificação no browser usou os gates fechados do ambiente local; testes unitários cobrem snapshots abertos e preços servidor.
- Revisão visual humana, comparativo antes/depois publicado e validação da partilha social pendentes. Nenhum deploy realizado.
