# Claude Code — Handoff de implementação do Visual Pack
**Responsável pela execução:** equipa Claude Code com acesso à infraestrutura existente.
**Escopo deste documento:** implementar visuais com componentes funcionais. **Não significa ativar a AI Workforce em produção.**

## Pré-voo
1. Ler [README.md](README.md), [manifest.json](manifest.json), [tokens.json](tokens.json), oito `packs/*.json`, [asset-inventory.json](asset-inventory.json) e [QA_AND_ACCEPTANCE.md](QA_AND_ACCEPTANCE.md).
2. Auditar os três repositórios (branch, CI, rotas, design tokens, autenticação e estado real de deployed services).
3. Usar esta branch **apenas para design/documentação**. Criar PRs separados nos repositórios de implementação.
4. Confirmar se os PNGs e o logo oficial foram importados em `design/visual-pack-v1/assets`; se ausentes, solicitar o ZIP à direção. Não inventar imagens nem assumir que os assets GitHub já existem.

## Matriz por repositório
**AtlasHub.Si — P01, P02, P03**
- Stack auditada: Next.js 16, React 19, CSS global, Node 24.
- Componentes existentes a preservar: `Header.tsx`, `Hero.tsx`, `Approach.tsx`, `Areas.tsx`, `Cases.tsx`, `Clara.tsx`, `Method.tsx`, `Ecosystem.tsx`, `Editions.tsx`, `Closing.tsx`.
- Refatorar `/index` usando a identidade premium e apresentar duas ofertas equivalentes.
- Criar `/solucoes/ai-workforce` e `/solucoes/enterprise-transformation`.
- Preservar `app/api/lead/route.ts`, contrato 202/502/503, consentimento e Clara determinística. Não modificar credenciais nem publicação sem gate.
- Revisar `<html lang>`, metadata, Open Graph e PT-BR (hoje `pt-PT`), após decisão de locale, sem quebrar SEO existente.

**App.AtlasHub.Si — P04, P05, P06, P07**
- Estado V0: `/simulador/[slug]`, catálogo e assessment; portal com autenticação ainda não validada em staging remoto.
- Não apagar o simulador e nem reclassificar demo como operacional.
- Criar um design system coerente; trabalhar por feature flags e rotas privadas.
- **Fase 1:** biblioteca com dados reais do catálogo e estados explícitos.
- **Fase 2:** login real, dashboard/mission/agent detail após integração AI-WaaS, sem inventar KPI.
- **Fase 3:** tools, grants, approvals, pause, incident views com RBAC server-side.
- Exigir prova de isolamento por tenant A/B; nunca exportar dados entre clientes.

**Editions.AtlasHub.Si — P08**
- Auditar Reader/Registry existente. O screenshot 08 é sugestão de layout, não confirmação de lançamentos fictícios.
- Preservar `Empresa Aumentada` como título do livro e não substituí-lo por “Intelligent Enterprise”.
- Usar publicações com status aprovado, autor, licenças de media e URLs canónicas.

## Fases com gates
**G0 — Inspeção / baseline:** reportar componentes atuais, rotas, vulnerabilidades, status do vídeo/brand e disponibilidade de assets; não implementar sem baseline.
**G1 — Tokens e layout:** criar CSS vars/tokens, componentes reutilizáveis, menu, botões, cards e responsividade; testes de contraste e keyboard.
**G2 — Site público:** implementar P01–P03, previews, casos ilustrativos, clara CTA, manter fluxo de leads.
**G3 — App:** implementar P04–P07 contra contratos reais. Se endpoint em falta, mostrar estado de demonstração explícito e criar issue de integração.
**G4 — Editions:** PR autónomo para P08, revisão editorial e Reader.
**G5 — Quality gate:** executar comandos do repo e as verificações em QA, screenshots desktop/mobile, relatórios, previews, commits, rollback.

## Enviar relatório final
- Alterações por repo/branch/PR
- Rotas implementadas e publicamente disponíveis ou preview
- Componentes e páginas ainda em modo conceito
- Testes e ecrãs verificados
- API/tenant security e RBAC validados
- Images/logo importados com SHA
- Lista de problemas e instruções de rollback
- Recomendação GO/NO-GO; produção só após autorização.

## Segurança de infraestrutura
Não alterar rede, DNS, certificação, segredos, base de dados ou serviços de produção para aplicar o redesign. Não executar deploy remoto antes de aprovação. PaperClip/atlas-si-os está fora do escopo.

## Quality bar
Páginas não são imagens estáticas; design deve ser reconstruído. A maquete é referência **de composição e atmosfera**. O JSON é a fonte de verdade de conteúdo, interações e comportamento. Dados de AI-WaaS são autoridade única para funções operacionais.
