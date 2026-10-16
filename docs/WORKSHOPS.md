# Workshops empresariais — dossiê comercial (pré-lançamento)

**Estado:** páginas em pré-lançamento, com `noindex` e fora do sitemap. **Sem inscrição paga, sem checkout, sem local publicado.**
**Dono da decisão:** Sérgio Monteiro. **Cobrança:** exclusivamente pelo ARO (Atlas Revenue Operations), depois de homologado o piloto financeiro EspelhoMeu.
**Fonte:** Drive `EMPRESA_AUMENTADA_2027-2030_WORKSHOPS` (fichas de produto, programa, landing candidata e aditamento de datas v0.2), adaptado para PT-BR.

## 1. Ofertas
| | Workshop 01 | Enterprise Lab 01 |
|---|---|---|
| Rota | `/workshops/empresa-aumentada-2027-2030` | `/workshops/enterprise-lab-ecommerce` |
| Título | Empresa Aumentada 2027–2030 — O futuro das operações começa hoje | E-commerce e Operações Vivas — Do marketplace à operação aumentada |
| Data / hora (BRT) | sáb. 14/11/2026, 14h–17h + Clínica de Ideias a distância seg. 16/11, 16h–18h | sáb. 28/11/2026, 14h–19h (substitui 21/11, revogado) |
| Cidade | Anápolis/GO (local a confirmar) | Anápolis/GO (local a confirmar) |
| Público | decisores PME, gestores, comerciantes, profissionais liberais | sellers Mercado Livre/Shopee/loja própria, gestores operacionais |
| Unidade de venda | bilhete individual | inscrição por empresa (1 representante) |
| Produto ARO (`aroProduct`) | `workshop-01-empresa-aumentada` | `enterprise-lab-01-ecommerce` |
| Código de captação | `W01-SITE` | `EL01-SITE` |

O programa hora a hora, entregáveis, exclusões e FAQ estão em `lib/workshops.ts` (fonte única das páginas).

## 2. Condições comerciais — base de planeamento (Sérgio, 15/10/2026), **não publicadas**
Base para planeamento, ainda sujeita a aprovação comercial final. Fica aqui e no rascunho `aro.project.yaml` (ofertas `draft`); **nunca** em `lib/workshops.ts` até à aprovação (o teste `tests/workshops.test.ts` recusa `R$` nas páginas e qualquer oferta `active` no manifesto).

| | Workshop 01 | Enterprise Lab 01 |
|---|---|---|
| Antecipado | R$ 297 (oferta ARO `workshop-01-empresa-aumentada-antecipado-br`) | R$ 990 por empresa (`enterprise-lab-01-ecommerce-antecipado-br`) |
| Regular | R$ 347 (`…-regular-br`) | R$ 1.290 por empresa, 1 representante (`…-regular-br`) |
| Capacidade-alvo (Si#7, 15/10) | 25 pessoas | 12 empresas (1 representante cada) |
| Ponto de decisão comercial | **20/10/2026** | go/no-go 19/11 (≥ 8 empresas pagantes, aditamento v0.2) |

**Local (Si#7):** não escolher, orçamentar nem anunciar o local exato agora; decide-se conforme o volume de adesões. Nunca afirmar espaço reservado. **Condição de venda:** antes de abrir pagamento, publicar "local a divulgar", o prazo em que o local será comunicado e as regras de adiamento, cancelamento e reembolso.

**A apurar (Helena/equipa) antes da decisão:** espaço e custos; capacidade efetiva; tamanho e prazo do lote antecipado; política de cancelamento, reembolso e transferência (CDC art. 49); condições de grupo / segundo representante; recibo/nota fiscal (entidade BR); certificado de participação. Até lá: **apenas pré-lançamento e manifestação de interesse.**

## 3. Inscrição
- **Agora (pré-lançamento):** lista de interesse pelo WhatsApp oficial com mensagem pré-preenchida e código (`W01-SITE`, `EL01-SITE`). A mensagem só sai quando a pessoa toca em enviar; nenhum dado é recolhido pelo site. A equipe regista o contacto e o código no CRM com consentimento explícito para receber a abertura.
- **Depois da aprovação:** formulário de inscrição com os campos da ficha (nome, empresa/atividade, função, cidade, e-mail, telefone opcional, segmento, principal dificuldade operacional) e três consentimentos separados (comunicações do evento; marketing facultativo; grupo WhatsApp). Marketing nunca é condição para comprar.
- **Pagamento (futuro):** pelo ARO real (`atlashub-digital/atlashub-finance`: `openapi/aro-v1.yaml`, `docs/35_PROJECT_INTEGRATION_CONTRACT_V1.md`, kit `docs/developer/`). O site cria a sessão `POST /v1/checkout-sessions` com o código da oferta do lote ativo, mostra o estado devolvido e concede o bilhete só com o direito `atlashub-si:workshop:<produto>` em `ACTIVE` (`POST /v1/entitlements/resolve`); webhook verificado com `X-ARO-Signature`. Projeto `atlashub-si` a registar no ARO.
- **Consumidor preparado (fail-closed):** `lib/aro/client.ts` (sessão com `X-ARO-Public-Key` + `Idempotency-Key`; polling com `X-ARO-Checkout-Secret`; `entitlements/resolve`; só `ACTIVE` não expirado conta, qualquer erro nega), `lib/aro/webhook.ts` + `POST /api/aro/webhook` (HMAC `v1=` sobre `timestamp.corpo`, janela 300 s, tempo constante; 503 sem `ARO_WEBHOOK_SECRET`/`ARO_PROJECT_SLUG`; o evento é só notificação). Sem configuração completa nada é chamado; o checkout exige ainda `ARO_PAYMENTS_ENABLED=yes` (após E7 + políticas publicadas + GO). Nenhuma rota de checkout nem preço nas páginas. Códigos de oferta/direito em `lib/workshops.ts` (`aroOffers`, `aroEntitlement`), testados contra o manifesto. Nenhuma integração direta com PixGo, MisticPay ou Stripe.

## 4. Materiais a produzir (checklist)
- [ ] Apresentação W01 (30–40 telas) e roteiro do facilitador
- [ ] Demonstração segura com dados fictícios (automação × agente)
- [ ] Ficha do participante e Mapa Inicial de Oportunidades
- [ ] Guia de reflexão (pessoas, dados, fluxos, sistemas, gargalos, governança)
- [ ] EL01: casos didáticos (estoque em dois canais, pagamento sem conciliação, rastreio desatualizado, mudança de regra do marketplace, margem destruída por campanha), matriz de gargalos, template de blueprint e de indicadores
- [ ] QR de inscrição/avaliação; regras de participação e privacidade
- [ ] Artes de campanha (ver `atlashub-club/docs/21_CAMPANHAS_RETOMA.md`) verificadas antes de publicação

## 5. Gates de publicação comercial (todos)
1. Local contratado/reservado e orçamento aprovado.
2. Preço, lotes, capacidade e política de cancelamento aprovados pelo Sérgio.
3. Projeto `atlashub-si` registado no ARO, `aro.project.yaml` revisto e sincronizado, fluxo ARO homologado no EspelhoMeu; pagamento controlado de teste.
4. Atendimento (WhatsApp/e-mail) com responsável e horário definidos; aviso de privacidade publicado.
5. Facilitador, equipa e materiais prontos.
6. Go/no-go formal. Só então: retirar `noindex`, acrescentar ao `public/sitemap.xml`, publicar preço e trocar o CTA para inscrição.

## 6. Reversão
Reverter o PR: a homepage volta ao estado anterior (a maquete 1:1 do Visual Pack V1 não foi alterada).
