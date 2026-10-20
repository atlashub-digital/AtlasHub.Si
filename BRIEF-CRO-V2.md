# BRIEF — CRO V2 (GO do PDG: direto em produção)

Maquetes + brief em `docs/cro-v2/` (ler `BRIEF_CODEX_HELENA_CRO_V2.md` e os 4 HTML). GO dado: implementar e publicar em produção.

## Regras invioláveis (do brief, mantidas)
- NÃO tocar em: ARO, checkout, preços, promoções, capacidades, entitlements, webhooks, tickets, Resend/Evolution, CRM, confirmação, gates server-side (`statusAvailability`, `salesReady`, validação, store).
- NÃO inventar: depoimentos, vagas restantes, certificados, horários LL01, local em Anápolis.
- Livro: leitura digital pública; envio aos inscritos é mensagem posterior — nunca "acesso exclusivo".
- Identidade visual: navy/blue/cyan, foto real do formador, logotipo existente.
- Sem pixels/analytics externos sem consentimento.
- `termsVersion` intocado (não há mudança material de termos).
- CTAs em estados `open:true` devem ter ação de compra real — NUNCA "lista de interesse"/WhatsApp de aviso.
- Nunca mostrar preço client-authoritative; preço sempre do servidor (ll01Offer/statusAvailability).

## P0 — correções (fazer primeiro)
1. `components/Workshops.tsx` + `lib/workshops.ts`: em `open:true` NADA de "lista de interesse"/WhatsApp-aviso; CTA direto `#inscricao`.
2. `components/WorkshopDetail.tsx` + `WorkshopSignup.tsx`: SEM flash de "Inscrições em breve" — SSR do `statusAvailability()` (como LL01 já faz) + revalidação; preço só do servidor.
3. OG/Twitter metadata corretas nas 4 rotas (`app/workshops/page.tsx` + 3 páginas de detalhe) com imagens próprias por workshop (usar assets de `docs/cro-v2/assets/` copiados para `public/assets/`); manter `noindex` (só sai após revisão editorial — regista como pendência).
4. `components/Footer.tsx`: trocar "Privacidade e termos: em revisão jurídica" por links reais. VERIFICAR se existem páginas de privacidade/termos publicadas; se não existirem, apontar para as condições já publicadas em cada página de workshop (`#condicoes`) e registar blocker legal no relatório — não fingir conformidade.

## P1 — maquete visual (seguir `index.html`, `ll01.html`, `w01.html`, `el01.html` como referência visual, ADAPTANDO aos componentes React existentes)
1. **Índice**: 3 cards com imagem, badge ONLINE/PRESENCIAL, datas, preço do servidor, CTA por card para `#inscricao` da respetiva página. LL01 primeiro (evento mais próximo).
2. **LL01**: hero segundo maquete ("Pare de colecionar ferramentas…"), card lateral de inscrição com preço R$249 do servidor + lista do incluído + CTA "GARANTIR INSCRIÇÃO — R$249" → `#inscricao`; manter SSR + relógio serverNow; confiança junto do CTA (pagamento Pix, confirmação WhatsApp/e-mail, bilhete digital).
3. **W01**: preço+CTA acima da dobra, benefícios executivos, sem prometer consultoria personalizada; manter formulário homologado.
4. **EL01**: explicar "R$990 por empresa · 1 representante", entregáveis (matriz, blueprint, indicadores), turma até 12 empresas, SEM inferir vagas remanescentes.
5. **Mobile**: primeira dobra = proposta + essenciais + CTA; formulário legível; sticky CTA sem sobrepor conteúdo.
6. WhatsApp é canal de dúvidas (secundário), nunca substitui o pagamento.

## Processo
- Reaproveitar componentes/funções existentes (WorkshopSignup, statusAvailability, runtimeDeps) — refactor visual APENAS.
- Testes: unit dos componentes alterados + E2E browser desktop/mobile das 4 páginas + trajeto reserve→checkout→PIX gerado SEM pagamento (smoke, depois libertar vaga como já praticado).
- CI verde obrigatório.
- **Commit direto na main + deploy produção** (GO do PDG, sem preview-gate). Deploy via Vercel API como de costume (Helena dispara).
- Reportar: SHA/PR, screenshots antes/depois, 4 URLs 200, smoke E2E, blockers (ex.: páginas legais em falta).

NÃO mergear branchs antigos pendentes; trabalhar sobre main atual.
