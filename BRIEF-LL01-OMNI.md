# BRIEF — LL01 comunicação pós-pagamento omnicanal (GO do PDG, 19/10)

Base: main (38fe6db merged). PR pequeno-médio. Sem nova arquitetura: ARO (pagamentos) + AtlasHub.Si (inscrições/bilhetes) + Resend (e-mail) + Atendimento.Center (WhatsApp via adaptador existente).

## 1. Evento canónico
Após ARO APPROVED + entitlement ACTIVE da mesma ordem + inscrição CONFIRMED, emitir estado interno
`workshop.registration.confirmed` (tabela/log próprio em si_workshops — migração aditiva 005) que produz:

1. Bilhete persistido (já existe).
2. Confirmação visível na página de compra (já existe via getStatus CONFIRMED).
3. E-mail transacional via Resend (implementado no PR #23 — ampliar conteúdo).
4. Mensagem WhatsApp pelo adaptador EXISTENTE do Atendimento.Center (Evolution API interna,
   instância `atlashub-wa` — VERIFICAR o caminho exato que a Clara/bridge usa; NÃO criar novo gateway).
5. Registo de estado de envio por canal (migração 005: coluna/tabela de delivery states).
6. Reenvio idempotente (sem duplicar mensagens/inscrições) — comando interno ou flag de reenvio por inscrição.

## 2. Estados operacionais (persistidos, consultáveis)
`payment_confirmed` → `welcome_sent` → `book_pending` → `book_sent` → `live_access_pending` → `live_access_sent`.
- Estados por inscrição (coluna jsonb/array em 005); transições registadas com timestamp.
- `book_sent` e `live_access_sent` são executados MANUALMENTE/por comando futuro — o sistema só precisa
  de suportar a transição sem novo pagamento e sem exigir visita ao site (endpoint interno protegido por
  token, ou comando CLI documentado — escolhe o mais simples e seguro).
- Falha do WhatsApp NÃO bloqueia nem invalida o e-mail (cada canal independente, estado separado).

## 3. Conteúdo da confirmação LL01 (e-mail E WhatsApp)
- Pagamento confirmado.
- Inscrição garantida no LL01.
- 100% ONLINE, ao vivo, 27 e 29 de outubro de 2026.
- Participação com Sérgio Monteiro e equipa AtlasHub.
- Livro "Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente" como oferta de
  boas-vindas à comunidade, A ENVIAR EM BREVE (não afirmar entrega feita).
- Ligação e instruções da live: A ENVIAR POSTERIORMENTE, antes do encontro (não afirmar enviado).
- Contacto de suporte (WhatsApp oficial).
Marca TESTE quando amountMinor=500 (linha inequívoca). Não inscrever em grupos/promoções sem consentimento.

## 4. WhatsApp — adaptador existente
Adaptadores existentes verificados (usar um, não criar novo):
(a) Chatwoot API como o bridge da Clara: POST /api/v1/accounts/5/conversations/{id}/messages (api_access_token
    em /etc/atlashub/clara-bridge.env) — exige conversa aberta, é o canal do atendimento;
(b) Evolution interna: POST http://atendimento-evolution:8080/message/sendText/atlashub-wa (apikey do
    container atendimento-evolution) — envio direto server-side, o padrão PROVADO pelo EspelhoMeu.
Para bilhete pós-pagamento usar (b) via envs `ATENDIMENTO_EVOLUTION_URL=https://evo-relay.lia.doctor`
+ `ATENDIMENTO_EVOLUTION_KEY` (o relay publica a Evolution com TLS; autenticação é a própria apikey da
Evolution, 48-hex, server-side apenas — nunca no repo). WhatsApp atrás de flag
`LL01_WA_CONFIRM=live` (default off) — se indisponível ou falhar, e-mail segue independente.
Enviar do servidor, não do browser: o evento nasce no webhook do ARO (server-side).

## 5. W01/EL01 (presenciais)
Mesmo evento/estados, mas conteúdo futuro de endereço/instruções presenciais — o sistema NÃO deve enviar
link de live a presenciais. Parametrizar o conteúdo por workshop (LL01 online / W01-EL01 presencial).

## 6. Migração 005 (aditiva)
Estados de comunicação + timestamps por inscrição. Idempotência no reenvio (unique ou marca por canal).

## 7. Testes
Unitários (estados, idempotência, conteúdo por workshop, marca TESTE, falha WA não bloqueia e-mail,
falha Resend mantém retry) + SQL (005) + E2E browser do confirmado→confirmação visível.

## Entrega
PR pequeno-médio sobre main, CI verde, push, SHA+PR. NÃO mergear (revisão Helena). NÃO ativar gates.
