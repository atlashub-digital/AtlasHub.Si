# Visual Pack V1 — relatório de implementação · AtlasHub.Si (P01–P03)

**Branch:** `feat/visual-pack-v1-site` · **Estado:** PR para revisão, **sem deploy**. · **Data:** 2026-10-09

## Gate G0 — baseline
- Next 16.3.8, React 19, CSS global, Node 24. Rotas: `/` e `/api/lead` (contrato 202/502/503 preservado).
- Componentes preservados: Clara (+ laboratório de operações e fluxo de leads), Áreas, Casos, Ecossistema, Editions, Closing, SiteInteractions. Reescritos no lugar: Header, Hero, Footer e Method (jornada). `Approach.tsx` mantém-se no repositório, fora da composição (os pilares People/Technology/Results passaram a chips do hero).
- **Assets:** o ZIP do Visual Pack (11 PNG + `Logo_Oficial_AtlasHub.png`, SHA256SUMS) **ainda não foi importado**. Usa-se a marca atual do site (`public/assets/atlashub-logo.webp`, 128×128) e a foto `hero-office.jpg`. Nada foi extraído das maquetes. Substituir quando o ZIP chegar.

## O que foi implementado
| Pack | Rota | Implementação |
|---|---|---|
| P01 Homepage | `/` | Header partilhado (menu móvel em diálogo com focus trap e Escape), hero 52/48, duas ofertas com o mesmo peso, 4 capacidades, áreas (existente), jornada em 4 passos, casos, Clara, ecossistema, Editions, rodapé |
| P02 Enterprise Transformation | `/solucoes/enterprise-transformation` | Hero, separadores Build & Transfer / Co-Build (padrão ARIA, setas/Home/End), 5 áreas, método em 5 passos, contratos e segurança, FAQ com respostas revistas, CTA |
| P03 AI Workforce | `/solucoes/ai-workforce` | Hero, 8 perfis com estado real (**Demonstração**) e filtro por área, links para os simuladores da App, como funciona, Managed vs Build & Transfer, operação responsável, "Ainda sem medições publicadas", CTA |
| Clara | `#clara` | 6.ª pergunta de triagem: Managed / Build / Co-Build / Ainda não sei. Chegada com `?clara=` sugere a opção (sem a escolher). `model` opcional na rota de leads |
| Base | — | `app/tokens.css` (tokens.json), Inter (next/font), `lang="pt-BR"`, OG `pt_BR`, metadata e canonical por página, sitemap com as rotas novas |

Removido das maquetes, por regra: percentagens, 3x/-60%/+45%, 24/7, "online", "pronto", nomes de pessoas e logótipos de clientes.

## Verificações
| Verificação | Resultado |
|---|---|
| `npm ci` · `typecheck` · `lint` · `test` · `build` | PASS (Node 24, container) |
| Testes de conteúdo (`tests/site.test.ts`): sem alegações proibidas, estados reais, ofertas equivalentes, transferência contratual | PASS |
| Lead com `model` (`tests/leads.test.ts`) | PASS |
| Scroll horizontal (1440×900 e 390×844, 3 rotas) | PASS (0 px) |
| Erros de consola | PASS (0) |
| Menu móvel: abre, Escape fecha, foco volta ao botão | PASS |
| Separadores por teclado (P02) | PASS |
| Filtro de perfis (P03, "Leads" → 2) | PASS |
| 768×1024 e 320×640 | NOT RUN |
| Contraste WCAG medido por ferramenta, Web Vitals | NOT RUN |
| Preview remoto | depende da integração Vercel do PR |
| Revisão comercial e sign-off do owner | pendente |

Capturas: `previews/site-v1/` (com `SHA256SUMS.txt`).

## Pendências
1. Importar o ZIP (logo oficial e imagens editoriais com pessoas) e substituir a marca e a foto do hero.
2. Páginas de Privacidade e Termos (o rodapé indica "em revisão jurídica").
3. Migrar para PT-BR os textos antigos que ainda estão em PT-PT (Clara, áreas, casos), sem perder conteúdo.
4. P04–P07 (App) e P08 (Editions) em PRs próprios.

**Rollback:** fechar o PR (nada foi publicado). Depois do merge: reverter o commit do merge.
**Recomendação:** GO para preview e revisão; NO-GO para produção até importar o logo oficial e aprovar o conteúdo.
