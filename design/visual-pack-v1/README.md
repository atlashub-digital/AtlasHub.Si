# AtlasHub.SI — Visual Implementation Pack V1.0
**Data:** 08/10/2026 · **Status:** direção visual validada, implementação pendente · **Owner:** AtlasHub.SI
**Branch de revisão:** `design/visual-pack-v1-20261008`

## Objetivo
Traduzir as maquetes editoriais aprovadas em páginas reais de **AtlasHub.SI**, **App.AtlasHub.Si** e **Editions.AtlasHub.Si**, preservando a identidade original, o código já existente e a distinção comercial entre **AI Workforce Managed** e **Enterprise Transformation (Build & Transfer / Co-Build & Enablement)**.

**Não entregar maquetes rasterizadas como páginas.** Implementar componentes, conteúdo em PT-BR, acessibilidade, dados reais ou estados de demonstração explícitos, navegação e rotas reais.

## Oito packs individuais (JSONs completos)
| Nº | Pack visual | Ficheiro | Repo de implementação |
|---|---|---|---|
| 01 | Homepage institucional | [01-corporate-home.json](packs/01-corporate-home.json) | AtlasHub.Si |
| 02 | Enterprise Transformation | [02-enterprise-transformation.json](packs/02-enterprise-transformation.json) | AtlasHub.Si |
| 03 | AI Workforce | [03-ai-workforce.json](packs/03-ai-workforce.json) | AtlasHub.Si |
| 04 | Biblioteca de Agentes | [04-agent-library.json](packs/04-agent-library.json) | App.AtlasHub.Si |
| 05 | Dashboard Operacional | [05-app-dashboard.json](packs/05-app-dashboard.json) | App.AtlasHub.Si |
| 06 | Ficha do Agente / Clara | [06-app-agent-detail.json](packs/06-app-agent-detail.json) | App.AtlasHub.Si |
| 07 | Missões e Operações | [07-app-missions.json](packs/07-app-missions.json) | App.AtlasHub.Si |
| 08 | AtlasHub Editions | [08-editions.json](packs/08-editions.json) | Editions.AtlasHub.Si |

## Ficheiros complementares
- [manifest.json](manifest.json): inventário de oito ecrãs, responsáveis, rotas, estados e entregas.
- [tokens.json](tokens.json): design tokens tipográficos, cor, grid, componentes, movimento e acessibilidade.
- [routes.json](routes.json): mapa de rotas, URLs e autenticação.
- [asset-inventory.json](asset-inventory.json): correspondência maquete ↔ nome normalizado.
- [CONTENT_AND_ROUTING.md](CONTENT_AND_ROUTING.md): mensagens aprovadas e arquitetura.
- [CLAUDE_CODE_HANDOFF.md](CLAUDE_CODE_HANDOFF.md): ordem de implementação por repositório e gates.
- [QA_AND_ACCEPTANCE.md](QA_AND_ACCEPTANCE.md): quality gate e testes visuais/funcionais.
- [assets/README.md](assets/README.md): importação de imagens e logo original.

## Situação do código auditado em 08/10/2026
**AtlasHub.Si:** Next.js 16 App Router, React 19, TypeScript, Node 24.x. `app/page.tsx` usa Header, Hero, Approach, Areas, Cases, Clara, Method, Ecosystem, Editions, Closing. `components/Clara.tsx` é um simulador guiado, com integração de leads server-side opcional. **Preservar** este trabalho; evoluir por PR.

**App.AtlasHub.Si:** Next.js 16, React 19 e Tailwind 4; catálogo/simulador V0 de packs e portal da primeira ronda. `ROUND-1.md` indica autenticação Supabase e portal ainda por validar remotamente. Os visuais 04–07 representam a **arquitetura de produto pretendida**, não o estado funcional do frontend hoje.

**Editions.AtlasHub.Si:** aplicação independente com conteúdo editorial próprio; o visual 08 é um briefing, não autorização para alterar livro, Reader ou Registry.

## Regras de verdade, marca e produção
1. **Logo oficial:** `assets/brand/Logo_Oficial_AtlasHub.png`. As imagens geradas podem mostrar interpretações imperfeitas; substituí-las pelo símbolo exato em componentes de marca.
2. **Visuais são maquetes** e podem conter erros de texto, supostos nomes de empregados, métricas de performance ou mock data. Nunca publicar estas afirmações como factos.
3. **AI Workforce** não é a empresa toda; Enterprise Transformation tem protagonismo equivalente na homepage.
4. **“Empresa Aumentada”** continua como livro e património editorial; não renomear nem usar como nome empresarial imposto.
5. **Clara** é assistente digital, não humana; rotas Managed, Build, Co-Build, Assessment; evitar promessas não comprovadas.
6. **Homepage pública não deve requerer login**; app autentica-se, autoriza e isola tenants antes de ler dados operacionais.
7. **Não utilizar PaperClip/atlas-si-os** como dependência do frontend.
8. Sem resultados, SLA, disponibilidade 24/7, client logos ou diagnósticos reais sem evidências.
9. **Nada neste PR é deploy.** Necessárias implementação, testes, aprovação editorial e release.

## Onde estão os screenshots e como adicionar
A correspondência exata está no [asset-inventory.json](asset-inventory.json). As imagens PNG completas são entregues num ZIP de ativos à direção, separadamente do PR textual. **Ainda não presumir que estes binários estão commitados:** a integração só fica completa após importação pela equipa, validação do símbolo oficial e inclusão de commits na pasta `assets/`.

## Ordem recomendada
1. Importar assets com nomes normalizados e confirmar resolução das imagens.
2. Implementar tokens e componentes partilhados.
3. Refatorar homepage e criar duas páginas de soluções sem quebrar Clara.
4. Implementar a app em PR autónomo a partir da V0 existente, preservando demos e portal; começar por catálogo e estados reais, depois painéis.
5. Integrar Editions com aprovação editorial autónoma.
6. Executar QA e preparar staging previews; solicitar aprovação antes de produção.

**É permitido adaptar a composição para UX, contraste e acessibilidade, mas não mudar a estratégia de marca sem validação.**
