# Dados e privacidade — atlashub.si

## 1. O que o site recolhe

| Dado | Onde nasce | Sai do browser? | Destino |
|---|---|---|---|
| Respostas da Clara (cenário, canal, sistemas, frequência, abordagem, modelo) | Clara | Só se o visitante pedir contacto automático | Webhook → CRM |
| Nome, empresa, email, WhatsApp, intenção, janela preferida | Formulário da Clara | Idem | Webhook → CRM |
| Hipóteses do laboratório (volume, minutos, cobertura, exceções) | OperationLab | **Não** (só ficheiro descarregado ou texto no WhatsApp escrito pelo visitante) | — |
| Mensagens WhatsApp | `wa.me` | Enviadas pelo próprio visitante na app WhatsApp | WhatsApp da AtlasHub (Evolution/Chatwoot no Atendimento.Center) |

Sem cookies, sem analytics, sem localStorage com dados pessoais, sem logs aplicacionais de conteúdo de leads no site.

## 2. Mapeamento para a base de dados (AI-WaaS, tenant `atlashub`)

| Campo do site | Tabela / coluna alvo | Observação |
|---|---|---|
| `name` | `crm_contact.fullName` | |
| `email` | `crm_contact.emailNorm` (normalizado) | chave de deduplicação |
| `phone` | `crm_contact.phoneE164` | |
| `company` | `crm_company.name` | |
| `consent`, versão, data | `crm_consent` (`purpose`, `textVersion`, `grantedAt`, `evidence`) | finalidade `contact_sales`; prova de consentimento |
| `diagnostic.*` | `crm_lead.fit` (jsonb) ou `crm_activity` | a decidir (ver INTEGRACAO-BACKEND §3) |
| `intent`, `preferredWindow` | `crm_activity` + `crm_lead.stage` | |
| `source` | `crm_lead.source = 'clara'` | |
| `requestId` | chave de idempotência (não guardar como PII) | |

Todas as tabelas `crm_*` têm `tenantId` e RLS (`tenant_isolation` + `platform_operator`); a app liga-se como `waas_runtime` (ver `AtlasHub-AI-WaaS/docs/DATA-MODEL-v2.md`).

## 3. Regras a cumprir antes de ativar a recolha automática

- [ ] Aviso de privacidade publicado (hoje o rodapé diz "em revisão jurídica").
- [ ] Texto de consentimento único e versionado (API `consent-text`) mostrado na Clara.
- [ ] Responsável e prazos de retenção por tabela (lead não convertido, supressões).
- [ ] Exportação e eliminação por titular (LGPD art. 18 / RGPD art. 15–17) — operações de tenant já previstas no backlog do AI-WaaS.
- [ ] Transferência internacional formalizada (emissores UK/BR; ponto aberto no Checkpoint 8).
- [ ] Rate limiting / anti-bot no `/api/lead` (honeypot e Origin não chegam).
- [ ] Sem dados clínicos: o cenário `healthcare` só recolhe contexto administrativo — manter a validação por enumeração (nunca texto livre clínico).
