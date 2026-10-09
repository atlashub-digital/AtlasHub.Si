# Documentação técnica — atlashub.si

Ponto de entrada para quem vai rever ou implementar o **backend, a base de dados e a infraestrutura** por trás do site institucional. O site é um front Next.js; tudo o que guarda dados vive no **AtlasHub-AI-WaaS** (API NestJS + Postgres/Supabase com RLS).

| Documento | Para quem | O que responde |
|---|---|---|
| [ARQUITETURA.md](ARQUITETURA.md) | todos | Que partes são estáticas, simuladas ou servidor; fluxos e dependências |
| [INTEGRACAO-BACKEND.md](INTEGRACAO-BACKEND.md) | backend | Contrato exato de `POST /api/lead`, destino no AI-WaaS e a diferença entre os dois contratos |
| [DADOS-E-PRIVACIDADE.md](DADOS-E-PRIVACIDADE.md) | DB · jurídico | Que dados pessoais entram, onde ficam, consentimento, retenção |
| [AMBIENTES.md](AMBIENTES.md) | infra · DevOps | Variáveis de ambiente, estado real na Vercel, como testar |
| [BACKLOG-BACKEND.md](BACKLOG-BACKEND.md) | gestão técnica | Tarefas por área (Backend, DB, Infra, Front, Decisão), por prioridade |

Documentos já existentes no repositório: [`../README.md`](../README.md) (produto e ecrãs 1:1), [`../DEPLOYMENT.md`](../DEPLOYMENT.md) (publicação e contactos), [`../design/visual-pack-v1/`](../design/visual-pack-v1/) (pipeline das maquetes).

## Ecossistema

| Repositório | Papel | Documentação técnica |
|---|---|---|
| `AtlasHub.Si` (este) | Site público, Clara de pré-análise, laboratório | `docs/` |
| `App.AtlasHub.Si` | Painel, biblioteca, simuladores, assessment, portal do cliente | `docs/` |
| `AtlasHub-AI-WaaS` | **Backend**: API, worker, motor de roles, CRM, faturação, RLS | `docs/` (API.md, DATA-MODEL-v2.md, ARCHITECTURE.md, THREAT-MODEL.md, ROUND-2-STATUS.md) e `docs/FRONTENDS.md` |
| `atlas-agent-packs` | Packs dos colaboradores digitais (fonte do catálogo dos simuladores) | `README.md`, `CLAUDE.md` |
| `atlas-ops` (privado) | Operação, auditoria das VPS, decisões | `projects/atlashub-si/` |

> Estado em 2026-10-09: **nenhuma variável de ambiente configurada na Vercel** para este projeto. O formulário de contacto automático da Clara está escondido e o contacto segue só pelo WhatsApp oficial. Ver [AMBIENTES.md](AMBIENTES.md).
