# ATLASHUB.SI — WORKSHOPS CRO V2 · BRIEF DE IMPLEMENTAÇÃO

**Status:** PROPOSTA PARA REVISÃO VISUAL / COMERCIAL. Não autorizada para deploy automático.

**Referência:** as maquetes `index.html`, `ll01.html`, `w01.html`, `el01.html` e previews desktop/mobile desta pasta.

## Objetivo
Aumentar a clareza do valor e reduzir fricção antes do Pix nas quatro páginas existentes, preservando os sistemas comerciais já homologados.

- `/workshops`
- `/workshops/automacao-pessoas-no-centro` (LL01)
- `/workshops/empresa-aumentada-2027-2030` (W01)
- `/workshops/enterprise-lab-ecommerce` (EL01)

## Restrições absolutas
- Não substituir ARO, pagamentos, preços, promoções, capacidades, entitlements, webhooks, tickets, outbox Resend/Evolution, CRM e confirmação.
- Não alterar os termos comerciais materialmente sem revisão jurídica/editorial. O texto dos termos aceites é versionado; alterações exigem novo `termsVersion` quando aplicável.
- Não inventar depoimentos, taxa de retorno, vagas restantes, certificados, horários LL01 ou local exato em Anápolis.
- O formato do livro Empresa Aumentada deve continuar claro: leitura digital já pública; o envio aos inscritos é mensagem de boas-vindas posterior, não acesso exclusivo.
- Manter a identidade visual validada: navy/blue/cyan, fotografia verdadeira do formador e logotipo existente. Não substituir a face por IA.
- Não ligar ferramentas analytics/pixels sem consentimento e verificação de privacidade.
- Não enviar tráfego para páginas que apresentem «interesse» por engano quando checkout estiver aberto.

## P0 — Correções rápidas sem redesign
1. `components/Workshops.tsx` e `lib/workshops.ts`: eliminar “lista de interesse” e mensagem de WhatsApp a pedir aviso de abertura em estados `open:true`.
2. `components/WorkshopDetail.tsx` + `components/WorkshopSignup.tsx`: não apresentar por instantes “Inscrições em breve” antes de ler disponibilidade. Adotar snapshot do servidor conforme LL01 + revalidação, sem preço client-authoritative.
3. `app/workshops/page.tsx`, `app/workshops/empresa-aumentada-2027-2030/page.tsx`, `app/workshops/enterprise-lab-ecommerce/page.tsx`: metadados social Open Graph corretos; retirar `noindex` apenas depois de revisão editorial/contratual.
4. `components/Footer.tsx`: substituir «Privacidade e termos: em revisão jurídica» por URLs de políticas/termos **realmente publicados e aprovados**. Se inexistentes, abrir blocker legal; não fingir conformidade.

## P1 — Maquete comercial
1. Índice com três cards visuais, diferenciação ONLINE / PRESENCIAL, datas, preço e CTA explícito. LL01 primeiro enquanto for evento mais próximo.
2. LL01: preservar hero, SSR de `statusAvailability()`, preço R$249 e relógio com serverNow; facilitar preenchimento, confiança no Pix e boas-vindas logo junto do CTA.
3. W01: preço e CTA acima da dobra, benefícios executivos, mapa inicial de oportunidades, Clínica de Ideias posterior. Não prometer consultoria personalizada.
4. EL01: explicar “R$990 por empresa, 1 representante”; apresentar entregáveis (matriz, blueprint, indicadores) e turma até 12 empresas, sem inferir vagas remanescentes.
5. CTA principal usa `#inscricao` com formulário verdadeiro e preço servidor. WhatsApp é canal secundário para dúvidas, não substitui pagamento.
6. Mobile: primeira dobra com proposta + informações essenciais + CTA; formulário legível, sticky CTA sem sobreposição/obstrução.

## P1 — SEO, share e medição
- OG/Twitter title, description e imagem própria para as quatro rotas. Testar partilha nas plataformas sociais; não usar imagem hero genérica da homepage.
- Registar fontes `origem`, `utm_source`, `utm_medium`, `utm_campaign` com validação e privacidade, e preservar até ao pagamento/entitlement.
- Definir baseline de `view_item`, `begin_checkout`, `pix_generated`, `payment_approved`, `registration_confirmed`, `ticket_sent` deduplicados por IDs não sensíveis, com o backend/ARO como autoridade do resultado financeiro.

## Gates de publicação
- CI/typecheck/lint/unit/build GREEN, preview Vercel pronto, screenshots em 390px/1440px e acessibilidade básica.
- HTML inicial e após hidratação coerentes com o gate real de vendas. Nunca mostrar preço desatualizado no botão.
- Quatro URLs 200; âncoras funcionam; links WhatsApp abrem mensagem atualizada.
- Testar trajeto real até abertura do Pix **sem cobrar dinheiro novamente**, incluindo formato/datas/valor e campos obrigatórios de W01/EL01.
- `READY FOR ADS` separado de `READY FOR PAID SALES`.
- Validação humana final de copy, imagem, preço e termos; rollout isolado e rollback simples.

## Resultado esperado
PR(s) de alteração visual/comercial, captura antes/depois, SHA, CI, estado real da produção e evidência de que nenhum fluxo de checkout ou entrega regrediu.
