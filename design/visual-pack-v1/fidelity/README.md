# Fidelidade 1:1: maquete → página

Este pipeline transforma uma maquete aprovada (imagem 1672×941) numa página que lhe é idêntica, mas com **texto real, selecionável e editável** e **links reais**.

| Ecrã | Maquete | Rota | Dados |
|---|---|---|---|
| 01 Homepage | `assets/screens/01_site_home.webp` | atlashub.si `/` | `lib/mockups/home.json` |
| 02 Enterprise Transformation | `02_enterprise_transformation.webp` | `/solucoes/enterprise-transformation` | `lib/mockups/enterprise-transformation.json` |
| 03 AI Workforce | `03_ai_workforce.webp` | `/solucoes/ai-workforce` | `lib/mockups/ai-workforce.json` |
| 04 Biblioteca de Agentes | `04_agent_library.webp` | app.atlashub.si `/biblioteca` | App: `src/data/mockups/agent-library.json` |
| 05 Painel da operação | `05_app_dashboard.webp` | app.atlashub.si `/` | App: `src/data/mockups/dashboard.json` |

## Como funciona

1. **`specs/sN.json`** indica, para cada bloco de texto da maquete, a zona onde está, as linhas exatas (com `{…}` nas palavras de destaque), o peso e a família (`f: "bsc"` para Barlow Semi Condensed nos botões e na navegação; o resto é Figtree).
2. **`engine.py`** encontra cada linha na imagem, mede a caixa da tinta e calcula o tamanho, a posição da baseline e a cor. A seguir apaga o texto do fundo por *inpainting* e gera `bg.png`, `items.json` e uma pré-visualização a 2x.
3. **`export.py`** grava o fundo em WebP e os dados em JSON no repositório, junto com os links de `links/lN.json` (retângulos em px da maquete).
4. **`MockupCanvas`** (nos dois repositórios) mostra o fundo e coloca cada linha com container queries, tudo em unidades de maquete.
5. **`shoot.cjs` + `calib.py`** confirmam no Chromium que a largura de cada linha coincide com a medida. O desvio médio é de 0,05 % e o máximo de 0,3 %. **`sbs.py`** gera uma comparação lado a lado.

```sh
# a partir da raiz do repositório (Python 3 com Pillow, numpy e opencv; Playwright para as verificações)
python3 design/visual-pack-v1/fidelity/engine.py design/visual-pack-v1/fidelity/specs/s1.json /tmp/o1
python3 design/visual-pack-v1/fidelity/export.py /tmp/o1 home "Mais capacidade. Menos complexidade." \
  lib/mockups/home.json public/mockups/home.webp design/visual-pack-v1/fidelity/links/l1.json
npm run build && npm start &
node design/visual-pack-v1/fidelity/shoot.cjs http://localhost:3000/ /tmp/web1.png 1672 /tmp/meas1.json
python3 design/visual-pack-v1/fidelity/sbs.py design/visual-pack-v1/assets/screens/01_site_home.webp /tmp/web1.png /tmp/sbs1.png
```

Para mudar uma frase sem nova maquete, edita-se o texto no JSON do ecrã. Se a frase ficar mais comprida do que a original, ajusta-se `s` (tamanho) ou cria-se uma nova linha. O fundo já não tem texto, por isso não fica nada por baixo.

## Resultado verificado (Chromium, 1672 px, 08/10/2026)

| Ecrã | Semelhança pixel a pixel com a maquete |
|---|---|
| 01 Homepage | 96,7 % |
| 02 Enterprise Transformation | 95,8 % |
| 03 AI Workforce | 95,9 % |
| 04 Biblioteca de Agentes | 96,9 % |
| 05 Painel | 97,7 % |

A semelhança mede a diferença média absoluta de cor em todos os píxeis. A diferença que resta vem quase toda do desenho das letras: a maquete foi gerada por IA, com letras ligeiramente mais suaves e grossas do que um tipo de letra real. Posição, tamanho, cor e composição coincidem. Lado a lado à escala normal, as diferenças não se notam.

## Notas

- **Tipografia.** A maquete não usa uma fonte identificável. Figtree foi a que mais se aproximou das proporções medidas (títulos e corpo), e Barlow Semi Condensed a que mais se aproximou da navegação e dos botões.
- **Imagens.** As fotografias, os ícones e o logótipo vêm da própria maquete, à resolução dela (1672 px). Acima de ~1900 px de largura, o fundo é ampliado.
- **Dados.** Os números, os nomes e os resultados são os da maquete: são ilustrativos e servem para apresentar a clientes como simulação. No app aparece "Demonstração · dados ilustrativos" por baixo do ecrã (`NEXT_PUBLIC_DEMO_BADGE=off` esconde-o).
