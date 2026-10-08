# Visual Pack V1: relatório de fidelidade 1:1 (08/10/2026)

**Pedido da direção:** publicar as maquetes 01–05 com 99 % de fidelidade, com dados mock, para apresentar a clientes como simulação. As restrições anteriores sobre números e afirmações nas maquetes foram levantadas pela direção para estes ecrãs.

## O que mudou

**AtlasHub.Si**
- `/`, `/solucoes/enterprise-transformation` e `/solucoes/ai-workforce` mostram, a partir dos 900 px, a maquete reproduzida 1:1 (fundo + texto real + links). Abaixo dos 900 px mantém-se o site responsivo anterior, sem alterações.
- A Clara (diagnóstico e envio de leads) fica logo abaixo da maquete na home, e todos os botões "Fale com a Clara" levam lá. O rodapé mantém-se.
- As fontes passaram a ser alojadas no próprio site: Inter (antes vinha do Google Fonts), Figtree e Barlow Semi Condensed.
- Os testes de integridade dos dados dos ecrãs estão em `tests/mockups.test.ts`.
- O pipeline de regeneração está em `design/visual-pack-v1/fidelity/` e as maquetes de origem em `assets/screens/`.

**App.AtlasHub.Si**
- `/`: painel da operação (maquete 05). `/biblioteca`: biblioteca de agentes (maquete 04).
- O catálogo de packs passou de `/` para `/packs`. Simuladores, assessment, login e portal mantêm-se, agrupados em `(site)` com o cabeçalho de sempre.
- Os perfis da biblioteca e do painel levam aos simuladores reais (por exemplo, Clara para Confirmação de consultas, Rafael para Assistente Comercial).

## Verificação
Typecheck, lint, testes e build passam nos dois repositórios. A semelhança pixel a pixel no Chromium a 1672 px ficou entre 95,8 % e 97,7 % (ver `fidelity/README.md`). Não há scroll horizontal a 390, 1280 e 1920 px, nem erros na consola.
