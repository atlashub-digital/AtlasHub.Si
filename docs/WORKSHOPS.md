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
| `aroOfferId` | `workshop-01-empresa-aumentada` | `enterprise-lab-01-ecommerce` |
| Código de captação | `W01-SITE` | `EL01-SITE` |

O programa hora a hora, entregáveis, exclusões e FAQ estão em `lib/workshops.ts` (fonte única das páginas).

## 2. Condições comerciais — **propostas, não publicadas**
Valores das fichas de 13/10/2026, **não homologados**; ficam aqui para decisão e nunca em `lib/workshops.ts` até aprovação (o teste `tests/workshops.test.ts` recusa `R$` nas páginas).

| | Workshop 01 | Enterprise Lab 01 |
|---|---|---|
| Lote inicial proposto | R$ 297 (15 bilhetes) | R$ 990 por empresa (4 primeiras) |
| Regular proposto | R$ 347 | R$ 1.290 por empresa |
| Capacidade-alvo | meta 40, lotação 45–50 (depende do local) | 10–12 empresas |
| Mínimo para realizar | definido pelo orçamento do local | ≥ 8 empresas pagantes |
| Go/no-go | a fixar (sugestão: 07/11) | quinta 19/11 (aditamento v0.2) |

**A decidir pelo Sérgio antes da publicação comercial:** preço final e lotes; local e capacidade reais; política de cancelamento, reembolso e transferência (CDC art. 49 para compra à distância); condições de grupo / segundo representante; emissão de recibo/nota fiscal (entidade BR); certificado de participação.

## 3. Inscrição
- **Agora (pré-lançamento):** lista de interesse pelo WhatsApp oficial com mensagem pré-preenchida e código (`W01-SITE`, `EL01-SITE`). A mensagem só sai quando a pessoa toca em enviar; nenhum dado é recolhido pelo site. A equipe regista o contacto e o código no CRM com consentimento explícito para receber a abertura.
- **Depois da aprovação:** formulário de inscrição com os campos da ficha (nome, empresa/atividade, função, cidade, e-mail, telefone opcional, segmento, principal dificuldade operacional) e três consentimentos separados (comunicações do evento; marketing facultativo; grupo WhatsApp). Marketing nunca é condição para comprar.
- **Pagamento:** pedido criado no ARO a partir do `aroOfferId`; o site só mostra o estado devolvido pelo ARO. Acesso à Clínica e à comunidade de 30 dias é um direito (`WORKSHOP_TICKET`) emitido pelo ARO após pagamento confirmado por webhook.

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
3. Oferta registada no ARO e piloto financeiro EspelhoMeu homologado; teste ponta a ponta em sandbox.
4. Atendimento (WhatsApp/e-mail) com responsável e horário definidos; aviso de privacidade publicado.
5. Facilitador, equipa e materiais prontos.
6. Go/no-go formal. Só então: retirar `noindex`, acrescentar ao `public/sitemap.xml`, publicar preço e trocar o CTA para inscrição.

## 6. Reversão
Reverter o PR: a homepage volta ao estado anterior (a maquete 1:1 do Visual Pack V1 não foi alterada).
