# Ambientes e configuração — atlashub.si

## 1. Variáveis de ambiente

| Variável | Onde | Obrigatória | Efeito | Produção (Vercel, 2026-10-09) |
|---|---|---|---|---|
| `LEAD_WEBHOOK_URL` | servidor (build + runtime) | para leads automáticos | URL HTTPS do recetor de leads. **Lida no build**: sem ela, a Clara esconde o formulário | ❌ não definida |
| `LEAD_WEBHOOK_TOKEN` | servidor | idem | Bearer enviado ao webhook. Nunca em `NEXT_PUBLIC_*` nem em `public/` | ❌ não definida |
| `PUBLIC_ORIGIN` | servidor | não | Origem aceite em `/api/lead` (defeito `https://atlashub.si`). Num preview, pôr a origem exata do preview | ❌ (usa defeito) |

Modelo: [`../.env.example`](../.env.example). `public/clara-config.json` é público — só configuração não sensível (endpoint relativo, WhatsApp).

Depois de definir as variáveis na Vercel: **novo deploy** (o formulário depende do build).

## 2. Infraestrutura

| Item | Valor |
|---|---|
| Hospedagem | Vercel, equipa AtlasHub, projeto `atlashub-si` |
| Repositório | `atlashub-digital/AtlasHub.Si`, branch `main` → produção automática |
| Runtime | Node 24.x (`package.json` → `engines`), `/api/lead` em `runtime = "nodejs"` |
| Build | `npm ci` → `npm run build` (`vercel.json`) |
| CI | `.github/workflows/quality.yml`: typecheck, lint, test, build |
| Domínio | `atlashub.si` |

## 3. Testar a integração sem tocar em produção

1. Preview da Vercel (branch) com `PUBLIC_ORIGIN=<url do preview>`, `LEAD_WEBHOOK_URL=<endpoint de staging>`, `LEAD_WEBHOOK_TOKEN=<chave de staging>`.
2. Percorrer a Clara até ao formulário, enviar com dados **fictícios**.
3. Confirmar no staging do AI-WaaS: `crm_lead` criado, `crm_consent` com versão, reenvio com o mesmo `requestId` não duplica.
4. Testes automáticos locais: `npm test` (`tests/leads.test.ts` usa um webhook simulado; nunca envia contactos reais).

## 4. Ligação ao staging do AI-WaaS — bloqueio de rede

A API de staging corre na VPS **só em loopback** (`127.0.0.1:14000`, sem rota no Caddy). A Vercel **não consegue chegar-lhe**. Para ligar o site é preciso um hostname público HTTPS para a API (rota no edge/Caddy partilhado → exige autorização do owner da VPS; ver `atlas-ops/projects/atlashub-si/operations/AI-WAAS-ROUND2-INFRA-AUDIT-2026-10-08.md`, G0 item 4).
