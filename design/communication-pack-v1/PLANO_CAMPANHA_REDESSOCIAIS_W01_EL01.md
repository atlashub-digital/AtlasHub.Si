# AtlasHub.SI — Campanha orgânica W01 + EL01 (v1.0)
**Preparação:** 16/10/2026 · **Estado:** READY FOR EDITORIAL REVIEW · **Publicação:** NÃO AUTORIZADA AUTOMATICAMENTE
**Fonte visual:** `design/communication-pack-v1/exports/` (58 PNG; duas variantes), `content.mjs`, `COPIES_E_ROTEIROS.md`.
**Objetivo:** criar interesse qualificado e inscrições efetivamente pagas para W01 e EL01, com cada peça encaminhada diretamente para o workshop correto — não para homepage, Club ou checkout ARO cru.

## 1. Regras inegociáveis
- **Variante PRÉ:** antes do GO de checkout, usar apenas `01_PRE_LANCAMENTO`, CTA **Conheça o programa**, sem dizer "inscrições abertas" ou prometer vaga. Página mantém lista WhatsApp se vendas fechadas.
- **Variante COMERCIAL:** usar `02_COMERCIAL` apenas depois de Helena provar página em `open:true`, compra real via WEBSITE → PIX ARO APPROVED → entitlement ACTIVE → bilhete persistido + CRM. Basta PASS por workshop para liberar só esse workshop.
- **Vigência de preços:** criativos que exibem "a partir de R$297" W01 expiram para uso na madrugada de **07/11** (antecipado até 06/11, BRT); criativos R$990 EL01 expiram para uso na madrugada de **21/11** (antecipado até 20/11). Após a virada usar preço regular real e regenerar arte antes de publicar; não continuar a impulsionar preço vencido.
- **Logística:** 14/11 W01, 14h–17h; 28/11 EL01, 14h–19h; Anápolis — **local a divulgar**. Informar endereço até 07/11 W01 e 21/11 EL01 ou adiar/cancelar com opção de reembolso integral, conforme termos aprovados.
- **Não misturar públicos nem CTAs**: W01 por pessoa (R$297/R$347), EL01 por empresa e 1 representante (R$990/R$1.290).
- Não afirmar escassez inventada, depoimentos, percentuais de resultado, local reservado, datas dos ateliers Genesis, nem atendimento 24/7. Envio WA em massa apenas com consentimento explícito. **Campanha paga** precisa de GO específico do fundador.
- Visuais são arquivos versionados, não publicados no site automaticamente. Logótipo oficial do pack, Visual Pack V1. O PR #12 é só `design/`: não alterar venda/checkout.

## 2. Links canónicos, rastreio `?origem=`
A aplicação lê `?origem=` no formulário `WorkshopSignup.tsx` e valida códigos `W01-[A-Z]{2,5}`/`EL01-[A-Z]{2,5}` no servidor.

| Canal | W01 · Empresa Aumentada | EL01 · E-commerce e Operações Vivas |
| --- | --- | --- |
| Instagram post / bio | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-IG | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-IG |
| Instagram Story link sticker | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-ST | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-ST |
| Reels / vídeo | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-VID | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-VID |
| Facebook | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-FB | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-FB |
| LinkedIn | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-LI | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-LI |
| WhatsApp opt-in / atendimento | https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-WA | https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-WA |

**Instagram:** URL em post não é link clicável; usar link na bio / Story sticker com o destino do workshop específico. Se houver apenas um link na bio, usar duas ligações em página de links com rótulo W01/EL01, mas manter códigos nos destinos. **Facebook/LinkedIn/WhatsApp:** colar URL completa na legenda, CTA e botões.

## 3. Peças / sequência sugerida (datas editoriais, ajustáveis)
| Data | Campanha | Canal | Criativo do PR #12 | Estado / CTA |
| --- | --- | --- | --- | --- |
| 18/10 | W01 · despertar | IG feed + FB | W01 PRE FEED A | Conheça o programa — W01-IG/W01-FB |
| 20/10 | W01 · decisores | LinkedIn AtlasHub + perfil fundador | W01 PRE KEY VISUAL / banner | W01-LI |
| 22/10 | EL01 · despertar | IG feed + FB | EL01 PRE FEED A | EL01-IG/EL01-FB |
| 24/10 | W01 · educação | IG carrossel + LinkedIn | W01 PRE CARROSSEL 1–5 | W01-IG/W01-LI |
| 27/10 | W01 · prova de programa | Reels/LinkedIn vídeo | W01 CAPA + roteiro 45 s | W01-VID |
| 29/10 | EL01 · dores operacionais | LinkedIn + IG feed | EL01 PRE FEED B | EL01-LI/EL01-IG |
| 02/11 | W01 · conversão | Stories 1–3 e feed COMERCIAL se já LIVE | W01 STORY / FEED A | W01-ST / W01-IG |
| 05–06/11 | W01 · último dia do lote antecipado, se LIVE | Story + LinkedIn | W01 COMERCIAL válido até 06/11 | W01-ST/W01-LI, sem falsa escassez |
| 09–12/11 | W01 · preço regular | Stories/convite aos interessados | **REGERAR** arte R$347, não usar arte R$297 | W01-ST/W01-WA |
| 12/11 | EL01 · oportunidade | IG feed + FB | EL01 PRE ou COMERCIAL consoante LIVE | EL01-IG/EL01-FB |
| 17/11 | EL01 · cinco gargalos | IG carrossel 1–6 + LinkedIn | EL01 carrossel | EL01-IG/EL01-LI |
| 19/11 | EL01 · empresas | LinkedIn pessoal/AtlasHub | EL01 COMERCIAL se LIVE | EL01-LI |
| 20/11 | EL01 · sem disparos massivos no feriado | — | — | — |
| 23/11 | EL01 · explicação prática | Reels 35 s + Stories | EL01 CAPA + roteiro | EL01-VID/ST, **regerar R$1290** |
| 25–27/11 | EL01 · detalhes finais | IG Story / WhatsApp opt-in | Stories EL01 | EL01-ST/WA |

**Em qualquer dia do calendário:** quando Helena declarar checkout OPEN no workshop, pode-se substituir a variante PRE pela COMERCIAL correspondente sem reabrir o plano; nunca trocar antes. Publicação manual/programada apenas após revisão do fundador.

## 4. Cópias principais, prontas para uso

### W01 — Instagram/Facebook (PRE)
**Ter IA não é ser uma Empresa Aumentada.**
Adicionar bots e GPTs resolve tarefas. Transformar a empresa é outra coisa: integrar pessoas, processos, dados, decisões e inteligência artificial, com supervisão humana.

No **Workshop Empresa Aumentada 2027–2030**, vamos explorar cenários de diferentes setores, mapear fricções e construir o primeiro mapa de oportunidades da sua organização.

📅 **14/11 · 14h–17h** · 📍 **Anápolis — local a divulgar**
Inclui Clínica de Ideias online em **16/11**, mediante as condições do programa.

Conheça o programa e manifeste interesse:
https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-FB

Instagram: substituir o URL clicável na legenda por "Link na bio" e configurar a bio com `?origem=W01-IG`.
#AtlasHub #EmpresaAumentada #TransformacaoEmpresarial #Anapolis

### W01 — LinkedIn (PRE)
**Ter ferramentas de IA não significa operar como uma Empresa Aumentada.**

A questão deixa de ser "qual ferramenta usamos?" e passa a ser "como organizamos pessoas, dados, processos e decisões de ponta a ponta?".

Dia **14 de novembro**, em **Anápolis**, a AtlasHub.SI realiza um workshop presencial de três horas para empresários, gestores e profissionais que querem discutir essa transformação de forma prática, sem exigir conhecimento de programação.

Inclui exercício de mapa de fricções e Clínica de Ideias online em 16/11.

**Conheça o programa:** https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-LI

### W01 — Versão COMERCIAL (substituir o fecho da copy só após GO)
**Inscrições abertas.** Lote antecipado **R$297 por pessoa**, válido até **06/11**, se o lote estiver ativo; depois **R$347**. Pagamento PIX pela página oficial, confirmação somente após aprovação. Local em Anápolis comunicado até 07/11, com condições de adiamento e reembolso na página.
**Inscreva-se:** https://www.atlashub.si/workshops/empresa-aumentada-2027-2030?origem=W01-FB#inscricao

### EL01 — Instagram/Facebook (PRE)
**Você vende em vários canais. Mas quem coordena a operação?**

Marketplace, loja própria, estoque, conciliação, logística e margem precisam funcionar como uma operação — não como ilhas.

No **Enterprise Lab: E-commerce e Operações Vivas**, cada empresa vai mapear o fluxo de um pedido, identificar gargalos e elaborar um blueprint inicial de melhoria. Exercícios com **dados sintéticos**; não pedimos acesso às suas contas.

📅 **28/11 · 14h–19h** · 📍 **Anápolis — local a divulgar**
Formato presencial · **1 representante por empresa**.

Conheça o programa:
https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-FB

Instagram: "Link na bio" usando `?origem=EL01-IG`.
#AtlasHub #Ecommerce #Operacoes #Marketplace #Anapolis

### EL01 — LinkedIn (PRE)
**Uma operação de e-commerce não termina quando a venda é aprovada.**

O pedido atravessa marketplaces, loja própria, ERP, pagamentos, expedição, rastreio e conciliação. Quando cada sistema trabalha isolado, os gargalos aparecem tarde.

Em **28/11**, em Anápolis, a AtlasHub.SI reúne até 12 empresas num laboratório presencial para mapear o fluxo de um pedido, explorar alternativas de melhoria e construir um blueprint inicial, com dados sintéticos e sem acesso aos sistemas dos participantes.

**Conheça o Enterprise Lab:** https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-LI

### EL01 — Versão COMERCIAL (só após GO)
**Inscrições abertas por empresa, com um representante.** Lote antecipado **R$990 até 20/11** enquanto ativo; depois **R$1290**. Pagamento PIX na página oficial. Endereço em Anápolis comunicado até 21/11; ver as condições de cancelamento e reembolso.
**Inscreva-se:** https://www.atlashub.si/workshops/enterprise-lab-ecommerce?origem=EL01-FB#inscricao

## 5. Carrosséis e Stories já desenhados
- **W01 5 slides:** (1) Ter IA ≠ Empresa Aumentada; (2) Bots/GPTs isolados; (3) integração de pessoas+processos+dados+decisões+IA; (4) 3 horas práticas+Clínica; (5) data/local+CTA. Origem no Story `W01-ST` e bio `W01-IG`.
- **EL01 6 slides:** (1) estoque duplicado; (2) pagamento sem conciliação; (3) rastreio atrasado; (4) mudança de regras marketplace; (5) vendas sem margem; (6) blueprint+28/11+CTA. Story `EL01-ST` e bio `EL01-IG`.
- **Reels:** W01 45s e EL01 35s, exatamente conforme roteiros em `COPIES_E_ROTEIROS.md`. Não são vídeos renderizados: apenas capa, roteiro e imagens estáticas existem no pack.

## 6. Checklist de ativação e métricas
- [ ] Fundador aprova artes por pack na revisão W01 PRE/COMERCIAL e EL01 PRE/COMERCIAL; este plano não autoriza publicações.
- [ ] Helena confirma **por URL e GET do endpoint** `/api/workshops/availability` `open` e primeiro E2E real completado com bilhete; não confiar apenas em ARO PIX PENDING.
- [ ] Confirmar que os 58 PNG estão no Drive AMF canónico; os PNGs no PR #12 não são banners do site.
- [ ] Landing com hero/thumbnail para W01 e EL01: confirmar no DOM; hoje `WorkshopDetail.tsx` **não referencia** assets do pack de comunicação (apenas texto/CTA). Preparar PR UI pequeno para 1 imagem hero de cada workshop, com alt e compressão, sem mudar checkout/Visual Pack V1, sujeito a aprovação visual.
- [ ] Toda peça tem URL específico com `?origem=` e a equipa testa o rastreio no CRM após uma compra controlada.
- [ ] Instagram: links em bio e adesivos Story; LinkedIn/FB/WA: URLs clicáveis nos textos.
- [ ] Medir por origem: cliques na página (analytics consentidos), início checkout, PIX criado, pagamento APPROVED, bilhete emitido. Atribuição usa códigos de origem já validados; não inventar conversões.
- [ ] Não enviar campanhas em massa sem consentimento; não publicar anúncios pagos sem GO da direção.

**Referências:** AtlasHub.SI PR #11 (checkout implementado; ainda gate comercial), PR #12 (pack criativo, DRAFT), issue #9 (políticas aprovadas/GO condicionado).
