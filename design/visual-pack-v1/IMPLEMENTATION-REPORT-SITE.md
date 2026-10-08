# Visual Pack V1 — relatório de implementação · AtlasHub.Si (P01–P03)

**Branch:** `feat/visual-pack-v1-site` · **Estado:** PR para revisão, **sem deploy**. · **Data:** 2026-10-09

## Gate G0 — baseline
- Next 16.3.8, React 19, CSS global, Node 24. Rotas: `/` e `/api/lead` (contrato 202/502/503 preservado).
- Componentes preservados: Clara (+ laboratório de operações e fluxo de leads), Áreas, Casos, Ecossistema, Editions, Closing, SiteInteractions. Reescritos no lugar: Header, Hero, Footer e Method (jornada). `Approach.tsx` mantém-se no repositório, fora da composição (os pilares People/Technology/Results passaram a chips do hero).
- **Assets:** ZIP `AtlasHub_Visual_Implementation_Pack_V1_20261008.zip` (SHA256 `d6ee31d4…c203`) importado com `scripts/import-assets.sh`: 11 PNG, todos com SHA256 conferido contra o `SHA256SUMS.txt` do ZIP (`assets/SHA256SUMS.txt`).
- **Logo oficial:** `Logo_Oficial_AtlasHub.png` (1254×1254, fundo opaco) apenas redimensionado para `public/brand/` (64–512 px, webp) e mostrado com máscara circular que segue o anel do símbolo; favicon e apple-touch-icon a partir do mesmo ficheiro. Nada foi extraído ou recortado das maquetes.
- **Fotografia:** as maquetes usam retratos de pessoas geradas e imagens com texto embutido. Por regra do pack não são usadas como UI. O hero usa a foto existente do escritório com o símbolo luminoso; ofertas e áreas usam as fotos de ambiente já existentes. **Falta fotografia editorial aprovada com pessoas** para igualar as maquetes.

## O que foi implementado
| Pack | Rota | Implementação |
|---|---|---|
| P01 Homepage | `/` | Header partilhado (menu móvel em diálogo com focus trap e Escape), hero 52/48, duas ofertas com o mesmo peso, 4 capacidades, áreas (existente), jornada em 4 passos, casos, Clara, ecossistema, Editions, rodapé |
| P02 Enterprise Transformation | `/solucoes/enterprise-transformation` | Hero, separadores Build & Transfer / Co-Build (padrão ARIA, setas/Home/End), 5 áreas, método em 5 passos, contratos e segurança, FAQ com respostas revistas, CTA |
| P03 AI Workforce | `/solucoes/ai-workforce` | Hero, 8 perfis com estado real (**Demonstração**) e filtro por área, links para os simuladores da App, como funciona, Managed vs Build & Transfer, operação responsável, "Ainda sem medições publicadas", CTA |
| Clara | `#clara` | 6.ª pergunta de triagem: Managed / Build / Co-Build / Ainda não sei. Chegada com `?clara=` sugere a opção (sem a escolher). `model` opcional na rota de leads |
| Composição | todas | Hero fotográfico com símbolo oficial em órbita (desligada com movimento reduzido), cartões flutuantes, ícones SVG próprios, ofertas e áreas com imagem, jornada e métodos com passos numerados |
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
1. Fotografia editorial aprovada (pessoas) para o hero e os cartões das ofertas, com licença registada.
2. Páginas de Privacidade e Termos (o rodapé indica "em revisão jurídica").
3. Migrar para PT-BR os textos antigos que ainda estão em PT-PT (Clara, áreas, casos), sem perder conteúdo.
4. P04–P07 (App) e P08 (Editions) em PRs próprios.

**Rollback:** fechar o PR (nada foi publicado). Depois do merge: reverter o commit do merge.
**Recomendação:** GO para preview e revisão visual; produção após aprovação do owner (fotografia editorial pode seguir num PR posterior).
