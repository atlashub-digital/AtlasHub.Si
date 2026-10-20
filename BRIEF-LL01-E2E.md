# BRIEF — LL01 E2E R$5 (GO do PDG): ticket real de teste, sem tocar nos preços públicos

Estado: oferta `ll01-e2e-test-br` (500 BRL) já criada e ACTIVE no ARO (sincronizada, revision 0ded49d6).
Preços públicos intocados: `ll01-promocional-br` 24900 + `ll01-regular-br` 49700.

## Problema a resolver
O fluxo LL01 (`lib/sales/ll01-offer.ts`) escolhe a oferta por flags de campanha — não há override de teste.
Para o E2E com a oferta de R$5 SEM tocar nos preços públicos nem ativar os gates comerciais
(`LL01_SALES_OPEN`/`LL01_RELEASE_V3_VERIFIED` continuam "no"), acrescenta um override de teste:

1. Em `lib/sales/ll01-offer.ts`: se `LL01_E2E_TEST_OFFER=yes` e `LL01_E2E_TEST_CODE` estiverem definidos,
   `ll01Offer()` devolve `{approved:true, promotional:false, code:env.LL01_E2E_TEST_CODE, amount:500, deadline:null, serverNow}`.
   O override SÓ é honrado se `LL01_RELEASE_V3_VERIFIED !== "yes"` (nunca interfere em vendas reais abertas).
   Documenta o par de envs no .env.example (comentado).
2. Testes: com o override, `ll01Offer()` devolve a oferta de teste; sem o override, comportamento atual intacto.
3. `lib/commerce/checkout.ts` byCode("LL01") mantém `ll01-regular-br`/24900 como fallback de validação — verificar que
   o caminho LL01 do checkout (ll01-commerce.ts) não passa pelo byCode (usa ll01Offer() diretamente) e que a
   validação price_mismatch compara contra offer.amount (500) — sem conflito.

## Envio do bilhete por e-mail (o gap real)
O fluxo atual emite ticket (finalize → confirm → reg.ticket) mas não envia nada ao participante.
Implementa envio transacional mínimo, reutilizando o padrão EspelhoMeu (transport Resend):
- Disparo: quando o webhook processa `payment.approved`/`order.approved`/`entitlement.granted` e o `finalize`
  confirma (LL01), agenda/envia 1 e-mail ao inscrito com: código único do bilhete, evento "LL01 — Automação com
  Pessoas no Centro", modalidade "100% ONLINE · ao vivo", datas "27 e 29 de outubro de 2026", e a linha
  "BILHETE DE TESTE — não vale como inscrição comercial" quando o amountMinor === 500 (marca de teste na própria entrega).
- Transporte: `RESEND_API_KEY` + `RESEND_FROM` (mesma lib/padrão do EspelhoMeu); gates: só envia em
  produção com env explícito `LL01_TICKET_EMAIL=live`; falha de envio NÃO bloqueia o webhook (log + retry
  natural do ARO); nada de segredos no repo.
- Assunto: "Bilhete LL01 — Automação com Pessoas no Centro". Texto simples e neutro (nada de marketing).

## Execução do E2E (helena orquestra; tu preparas o ambiente)
Após o PR merged + deploy: com `LL01_E2E_TEST_OFFER=yes`, `LL01_E2E_TEST_CODE=ll01-e2e-test-br`,
`LL01_TICKET_EMAIL=live`, `RESEND_*`, e os envs base já provisionados, Helena executa:
reserve → checkout → PIX R$5 gerado → pagamento → webhook → APPROVED → entitlement ACTIVE mesma ordem →
ticket emitido → e-mail entregue (read-back Resend) → refund → revogação → vaga liberta → oferta de teste desativada.
NÃO ativa `LL01_RELEASE_V3_VERIFIED` nem `LL01_SALES_OPEN`.

## Entrega
PR pequeno sobre main, CI verde, push, SHA+PR no relatório. NÃO mergear.
