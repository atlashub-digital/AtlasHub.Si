# Integração com o backend — atlashub.si

O site tem **um único ponto de integração**: `POST /api/lead` (`app/api/lead/route.ts` → `lib/leads.ts`). Este documento descreve o contrato atual, o destino previsto no AtlasHub-AI-WaaS e o que falta para os ligar.

## 1. Contrato atual — browser → `POST /api/lead`

Pedido (JSON, ≤ 12 KB):

| Campo | Tipo | Regra |
|---|---|---|
| `requestId` | string | UUID v4 gerado no browser; reutilizado em reenvios (idempotência) |
| `name` | string | obrigatório, ≤ 100 |
| `company` | string | opcional, ≤ 160 |
| `email` | string | ≤ 160, formato email — **email ou phone obrigatório** |
| `phone` | string | ≤ 30, `^\+[\d ()-]{7,25}$` |
| `intent` | enum | `contact` · `meeting` · `quote` |
| `preferredWindow` | string | ≤ 160; obrigatório se `intent = meeting` |
| `consent` | boolean | tem de ser `true` |
| `website` | string | honeypot, tem de vir vazio |
| `diagnostic.scenario` | enum | id de `lib/cases.ts`: `sales`, `support`, `retail`, `industry`, `realestate`, `healthcare`, `documents`, `operations` |
| `diagnostic.channel` | enum | `email` · `whatsapp` · `system` · `manual` |
| `diagnostic.systems` | enum | `api` · `sheets` · `docs` · `unknown` |
| `diagnostic.frequency` | enum | `low` · `daily` · `high` |
| `diagnostic.approach` | enum | `draft` · `bounded` · `explore` |
| `diagnostic.model` | enum, opcional | `managed` · `build` · `cobuild` · `unsure` |

Respostas: `202 {id, route:"human"}` · `400` inválido · `403` origem · `413` tamanho · `415` tipo · `502` destino não confirmou · `503` webhook não configurado.

## 2. Contrato atual — site → webhook (`LEAD_WEBHOOK_URL`)

```
POST <LEAD_WEBHOOK_URL>            (só https)
Authorization: Bearer <LEAD_WEBHOOK_TOKEN>
Idempotency-Key: <requestId>
Content-Type: application/json

{ requestId, name, company, email, phone, intent, preferredWindow,
  route: "human", consent: true, consentVersion: "clara-contact-v1",
  diagnostic: { scenario, title, channel, systems, frequency, approach, model? },
  receivedAt: "<ISO>", source: "atlashub-clara" }
```

O site **só confirma ao visitante** se o webhook devolver exatamente `202` com `{ id: string (1–160), route: "human" }`. Qualquer outra resposta → 502 e a Clara diz que não foi possível confirmar.

**Obrigações do recetor:** deduplicar por `Idempotency-Key`; gravar lead, consentimento e diagnóstico **antes** de responder 202; nunca marcar reuniões automaticamente (`meeting_url` não existe).

## 3. Destino previsto — AtlasHub-AI-WaaS

O backend já tem o funil comercial (migration `202610090006_commercial`, Checkpoint 8 do `ROUND-2-STATUS.md`):

| Endpoint AI-WaaS | Uso |
|---|---|
| `GET /v1/public/consent-text?purpose=contact_sales&locale=pt-BR` | Texto e versão do consentimento (`v1-2026-10`) |
| `POST /v1/public/leads` → `202 {status:"received"}` | Cria/atualiza `crm_contact`, `crm_company`, `crm_lead`, `crm_consent`, `crm_activity` no tenant `atlashub` |
| `POST /v1/public/concierge/sessions` (chave de serviço) | Sessão da Clara (metadados e qualificação) |

### Diferenças que impedem ligar diretamente

| Tema | Site hoje | AI-WaaS `leadInput` | Tratamento proposto |
|---|---|---|---|
| Nome | `name` | `fullName` (≥ 2) | Mapear no adaptador |
| Contacto | email **ou** telefone | **email obrigatório**, telefone opcional | Decisão: aceitar lead só com WhatsApp no backend (recomendado — é o canal principal no Brasil) ou exigir email no site |
| Consentimento | `consentVersion: "clara-contact-v1"`, texto no próprio site | `consentTextVersion` tem de ser `v1-2026-10`; texto servido pela API | O site passa a mostrar o texto de `/v1/public/consent-text` e envia essa versão |
| Origem | `source: "atlashub-clara"` | `source: site · simulator · clara` | `clara` |
| Diagnóstico | `diagnostic{…}` | sem campo equivalente (`simulation` é do simulador) | Guardar em `crm_lead.fit` (jsonb) ou numa `crm_activity` `kind=diagnostic`; requer pequena extensão do schema `leadInput` |
| Intenção / janela | `intent`, `preferredWindow` | não existem | `crm_activity` (`lead.intent`) + `stage` inicial (`meeting` → pedido de reunião) |
| Resposta | `202 {id, route:"human"}` | `202 {status:"received"}` sem id | Devolver referência do lead (sem expor o UUID interno, ex.: hash curto) |
| Idempotência | `Idempotency-Key = requestId` | dedupe por email normalizado (upsert) | Aceitar `Idempotency-Key` também |
| Autenticação | Bearer partilhado | endpoint público, rate limit 120 POST/min **por IP direto** | Pedido vem sempre dos IPs da Vercel → criar endpoint/credencial servidor-a-servidor ou confiar em `X-Forwarded-For` só do proxy conhecido |

### Recomendação

1. **Backend:** novo endpoint versionado, p. ex. `POST /v1/public/leads/site` (ou `leads` v2), autenticado por chave de serviço (`x-atlas-service-key`, como a Clara/Hermes), que aceita o payload do site tal como está, faz o mapeamento acima e devolve `202 {id, route:"human"}`. Mantém o contrato público atual intacto (regra do AI-WaaS: OpenAPI só muda com versão).
2. **Site:** sem alterações de código — só configurar `LEAD_WEBHOOK_URL` (esse endpoint) e `LEAD_WEBHOOK_TOKEN` (a chave) na Vercel e fazer novo deploy.
3. **Consentimento:** alinhar o texto mostrado na Clara com o texto versionado da API antes de ativar.

## 4. O que **não** é integração

- Ecrãs 1:1 (desktop): dados ilustrativos; links reais para páginas, app e editions.
- OperationLab: cálculo local (`lib/simulation.ts`), descarregável; botão "Analisar com a equipa" abre WhatsApp.
- Botões sem destino próprio (ex.: Academy) abrem o WhatsApp oficial com mensagem pré-preenchida.
