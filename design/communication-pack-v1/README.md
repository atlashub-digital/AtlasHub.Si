# AtlasHub.SI Workshops — Communication Pack V1

Dois packs separados, **W01 — Empresa Aumentada** e **EL01 — Enterprise Lab E-commerce**, cada um em duas variantes:
`01_PRE_LANCAMENTO` (CTA "Conheça o programa", sem preço) e `02_COMERCIAL` (CTA "Inscreva-se", preço e link real — usar só depois do GO LIVE do checkout).

| Peça | Formato | W01 | EL01 |
|---|---|---|---|
| Key visual | 1920×1080 | 1 | 1 |
| Post feed A / B | 1080×1350 | 2 | 2 |
| Carrossel | 1080×1350 | 5 cartões | 6 cartões |
| Stories | 1080×1920 | 3 | 3 |
| Banner horizontal | 1920×600 | 1 | 1 |
| Banner LinkedIn | 1584×396 | 1 | 1 |
| Capa de vídeo / Reels | 1080×1920 | 1 | 1 |
| Roteiro de vídeo + legendas | `COPIES_E_ROTEIROS.md` | 45 s | 35 s |

- **Identidade:** tokens de `../visual-pack-v1/tokens.json` (navy `#040C18`, ciano `#16D8ED`, azul elétrico `#008DFF`, branco), Inter, gradiente da marca; **logótipo oficial** `assets/Logo_Oficial_AtlasHub.png` (Drive "Logo_Oficial_AtlasHub.png", SHA-256 `c7bfe2b7…1e6e`), nunca redesenhado.
- **Imagens:** fotografias já aprovadas no site (`public/assets/hero-office.jpg`, `case-industry.jpg`, `case-retail.jpg`); pessoas, processos e dados representados por diagramas — sem rostos gerados nem pessoas inventadas.
- **Fontes editáveis:** `content.mjs` (todos os textos) e `sources/**.html` (uma página por peça, abre em qualquer browser). Para regenerar os PNG: `PLAYWRIGHT=<pacote playwright> node build.mjs`.
- **PNG finais:** `exports/<PACK>/<VARIANTE>/ATLASHUB_SI_<CÓDIGO>_<PEÇA>_<VARIANTE>_V1.png` e `exports/MANIFEST.json` (pasta versionada; `out/` é ignorada pelo .gitignore do projeto).
- **Publicação:** nada é publicado nem impulsionado automaticamente; revisão final do fundador antes de qualquer uso.
