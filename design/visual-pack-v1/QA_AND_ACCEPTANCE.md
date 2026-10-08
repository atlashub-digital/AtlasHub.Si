# Visual QA & Acceptance — AtlasHub Design V1
O pack visual está aprovado como **direção artística**, não prova de qualidade do software.

## A. Identidade
- [ ] Logo oficial aplicado sem deformação a todos os headers/end cards.
- [ ] Gradientes e paleta coerentes, logo legível e contrastes validados.
- [ ] Avatar humano ilustrativo identificado como representação digital; sem nomes/dados pessoais inventados.
- [ ] Public/operacional/editions usam a mesma marca, mas densidade visual adequada a cada produto.

## B. Conteúdo
- [ ] PT-BR consistente nas novas interfaces; sem erros de acentuação/ortografia de mockup.
- [ ] AI Workforce e Enterprise Transformation em pé de igualdade na homepage.
- [ ] `Mais capacidade. Menos complexidade.` vinculado à campanha Workforce; a marca AtlasHub.SI não se limita a ela.
- [ ] Título do livro `Empresa Aumentada` preservado.
- [ ] Sem SLAs, ROI, quantidades, percentuais, selos `Pronto` ou `Online` sem evidência; claims de demonstração rotulados.
- [ ] Estados e CTAs correspondem à capacidade **real**.

## C. Site público
- [ ] Desktop 1440×900, tablet 768×1024, mobile 390×844 e 320×640 verificados.
- [ ] Sem scroll horizontal, overlapping ou texto cortado.
- [ ] Header mobile acessível, todos os links com destino existente.
- [ ] Clara mantém diagnóstico e leads sem regressões.
- [ ] SEO title/description/open graph corretos, locale revisto e canonical.
- [ ] Imagens otimizadas Next/Image, LCP aceitável, lazy-load abaixo da dobra.
- [ ] Sem imagens de mockup completas servidas como UI.

## D. App
- [ ] Autenticação real e validação de tenant antes de mostrar dados.
- [ ] Dados operacionais não são valores hardcoded na UI em produção.
- [ ] Estados loading/empty/error/offline/permission-denied para cada módulo.
- [ ] Missões, approvals, pausas e retries delegados ao backend com auditoria.
- [ ] Testes de cross-tenant e autorização negativos; sem segredos na UI.
- [ ] A app V0 e simulador permanecem acessíveis.
- [ ] Feature flags aplicadas para módulos sem API de staging.

## E. Editions
- [ ] Manter repositório próprio; funcionalidades do Reader intactas.
- [ ] Apenas publicações reais e aprovadas.
- [ ] Sem newsletters fictícias; consentimento, unsubscribe e privacy compliance.

## F. Acessibilidade e performance
- [ ] Navegação 100% por teclado e focus visível.
- [ ] WCAG 2.2 AA contraste/alvos; motion reduzido respeitado.
- [ ] Sem efeitos parallax que atrapalhem leitura.
- [ ] Alt e aria labels significativos, sem redundância.
- [ ] Responder a media queries sem layout quebrado.
- [ ] Teste Web Vitals com baseline e mudanças documentadas.

## G. Testes por repo
```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```
Executar apenas conforme `package.json` real de cada repo; scripts faltantes devem ser documentados, não marcados como PASS.

## H. Evidências e aceite
Para cada pack: JSON completo ✔, PNG oficial importado ✔, componente real ✔, URL preview ✔, screenshot desktop/mobile ✔, testes ✔, revisão comercial ✔, owner sign-off ✔.
Anotar **PASS/FAIL/NOT RUN** honestamente.
Antes de deploy de produção pedir autorização explícita e registar rollback.
