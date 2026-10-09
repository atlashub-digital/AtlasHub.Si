# Backlog técnico — atlashub.si ↔ backend

Prioridades: **P0** bloqueia a recolha de leads · **P1** necessário antes de tráfego pago · **P2** melhoria.

| # | P | Área | Tarefa | Depende de | Critério de aceitação |
|---|---|---|---|---|---|
| 1 | P0 | Decisão | Lead só com WhatsApp é aceite? (backend hoje exige email) | — | Decisão registada em `atlas-ops/decisions` |
| 2 | P0 | Backend | Endpoint servidor-a-servidor para leads do site (ver INTEGRACAO-BACKEND §3): chave de serviço, mapeamento, `Idempotency-Key`, `202 {id, route:"human"}`, versão nova no OpenAPI | 1 | Teste E2E com o payload real do site; reenvio não duplica; RLS tenant `atlashub` |
| 3 | P0 | DB | Onde guardar o diagnóstico da Clara (`crm_lead.fit` vs `crm_activity`) e o `intent`/`preferredWindow` | 2 | Migration forward-only com RLS e grants só `waas_runtime` |
| 4 | P0 | Infra | Hostname público HTTPS para a API (staging e depois produção) | autorização owner VPS | `GET /health` 200 a partir da Vercel |
| 5 | P0 | Infra | Configurar `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN`, `PUBLIC_ORIGIN` na Vercel (preview primeiro) e redeploy | 2, 4 | Formulário visível; lead de teste no CRM |
| 6 | P1 | Jurídico/Front | Texto de consentimento único (API `consent-text`) na Clara + aviso de privacidade | 2 | Versão do texto gravada = versão mostrada |
| 7 | P1 | Backend | Rate limit por origem real (o pedido chega sempre dos IPs da Vercel) | 2 | 429 por visitante, não por Vercel |
| 8 | P1 | Front | Anti-bot no `/api/lead` (Turnstile/hCaptcha ou desafio leve) | — | Bots bloqueados sem prejudicar acessibilidade |
| 9 | P1 | Backend | Notificar a equipa de um lead novo (n8n → WhatsApp/Chatwoot interno) | 2 | Alerta < 1 min, sem dados sensíveis na notificação |
| 10 | P2 | Backend | Registar sessão da Clara (`concierge/sessions`) mesmo sem contacto, só metadados | 2 | Funil mensurável sem PII |
| 11 | P2 | Infra | Monitorização de 5xx de `/api/lead` (Vercel logs/alertas) | 5 | Alerta em 502/503 |
| 12 | P2 | Front | Conteúdos dos ecrãs 1:1 passam a vir de dados reais (casos homologados) | decisão de direção | Sem números inventados |
