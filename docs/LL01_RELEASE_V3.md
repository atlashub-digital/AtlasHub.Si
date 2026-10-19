# LL01 V3 — release em captação, vendas bloqueadas

## Implementado
- 100% ONLINE, 27 e 29/10/2026, dois encontros; construção guiada de agente.
- Assets exatos do pack V3, capa pública Editions sem exclusividade.
- Oferta 24900/49700 BRL no código; deadline somente aprovado, explícito e com fuso.
- Vendas exigem LL01_RELEASE_V3_VERIFIED=yes além dos gates existentes. Default fechado.
- Migração 003 aditiva: remove janela individual de cinco minutos, não reprecifica histórico,
  não liberta automaticamente reservas com sessão financeira por reconciliar.
- Bilhete permanece visível; referência de checkout retida no sessionStorage (sem PII/segredo).
- Modo fechado: formulário de interesse encaminha mensagem ao WhatsApp oficial com consentimento;
  só é enviado quando o visitante confirma no WhatsApp. Não representa gravação automática no CRM.

## Bloqueios de vendas — atlas-ops #23
- Helena confirmar catálogo ARO, deadline proposto 2026-10-27T02:59:59Z, horários/plataforma,
  condições e prazo/canal de acesso; aplicar migração após backup.
- Homologar entrega transacional/outbox e reconciliação independente do browser. Não foi encontrada
  implementação completa de scheduler/retry no repositório auditado.
- Validar vínculo APPROVED + ACTIVE por ordem: motor existente resolve entitlement por email;
  evento entitlement.granted sozinho não prova pagamento da ordem desta inscrição.
- Homologar recuperação em expiração/retry e perda de resposta na fronteira da campanha:
  chave idempotente estável evita uma segunda cobrança, mas resposta da oferta anterior precisa
  de reconciliação antes de novo Pix. Não ativar vendas sem este cenário PASS.
- Validar CRM de pendências/erros/reembolso e comunicação com retry; hoje payload de confirmação
  inclui datas/modalidade, mas isso não comprova envio de e-mail ou WhatsApp.
- Testes locais e CI não equivalem a E2E financeiro de produção. Nenhuma cobrança real executada.

## Rollout
Publicar landing em captação (permitido pelo pack) após CI/visual PASS. Não levantar noindex.
Não definir LL01_RELEASE_V3_VERIFIED=yes enquanto qualquer gate acima estiver pendente.
Registar catálogo/DB/flags/entrega/E2E no issue antes da abertura. Preservar W01/EL01 e histórico.
Rollback: reverter PR visual se necessário; manter vendas LL01 fechadas (não reativar a oferta antiga).
