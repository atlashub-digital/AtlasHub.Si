# LL01: oferta de teste e bilhete

O par `LL01_E2E_TEST_OFFER=yes` / `LL01_E2E_TEST_CODE=ll01-e2e-test-br`
seleciona 500 BRL minor units somente enquanto `LL01_RELEASE_V3_VERIFIED`
não for `yes`. Não altera catálogo, preços públicos nem abre os gates de vendas.
O checkout LL01 usa `ll01Offer()` diretamente e compara a resposta ARO com
`offer.amount`; não usa o fallback `byCode("LL01")` do motor genérico.

Antes do deploy, aplicar `db/si_workshops/004_ll01_ticket_email.sql`.
Para entrega, configurar `NODE_ENV=production`, `LL01_TICKET_EMAIL=live`,
`RESEND_API_KEY` e `RESEND_FROM`. Nenhum valor secreto deve ser versionado.
O webhook envia após confirmação canônica de pagamento/direito LL01 e inclui
marca de teste quando o valor persistido for 500. Outros workshops não enviam.

O envio aceito pelo Resend é registrado em `ticket_emailed_at`; isso não prova
entrega na caixa postal (verificar o read-back Resend no E2E). A chave
`ll01-ticket:<registration id>` protege tentativas concorrentes no período de
idempotência do Resend. Falha de transporte/configuração/persistência gera log
sem dados pessoais e não bloqueia o webhook. Reentregas do ARO tentam novamente
mesmo para eventos já registrados. Não há retry autônomo: uma resposta de sucesso
ao ARO não força reentrega. Uma falha de persistência após envio requer atenção
antes de repetir fora da janela de idempotência do Resend.

Com `LL01_SALES_OPEN=no` e `LL01_RELEASE_V3_VERIFIED=no`, `salesReady()` continua
fechado: este override isoladamente não habilita reserve → checkout via API.
O percurso E2E completo precisa de um mecanismo de acesso de teste separado;
não ativar os gates comerciais para contornar essa restrição.
