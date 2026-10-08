# AtlasHub — Arquitetura de conteúdo e rotas
**Idioma prioritário:** PT-BR. O código atual contém strings em PT-PT; migrar gradualmente sem destruir conteúdo nem internacionalização futura.

## Hierarquia de comunicação
**Marca:** AtlasHub.SI — `People | Technology | Results`.
**Mensagem institucional candidata:** `Inteligência em operação.` (naming público em análise; não assumir já validado como slogan exclusivo).
**Mensagem da campanha AI Workforce validada:** `Mais capacidade. Menos complexidade.`.
**Enterprise Transformation:** `Construa sua própria capacidade digital.`.
**Editions:** `Conhecimento para empresas que querem evoluir.`.
**Livro existente:** `Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente`; preservar título.

## Oferta comercial — três modos, dois eixos
1. **AI Workforce Managed:** a AtlasHub desenha, configura e opera perfis por missão/período ou contrato contínuo, com limites e supervisão.
2. **Enterprise Build & Transfer:** a AtlasHub constrói e entrega capacidade na infraestrutura do cliente, depois de aceitação e transferência.
3. **Enterprise Co-Build & Enablement:** desenvolvemos com a equipa do cliente, competências, agentes, governança e operações próprias.

**Não representar transferência como automática:** IP, dados, suporte, licenças, credenciais e rollout dependem de contrato próprio.

## Navegação corporativa
- `/` — homepage.
- `/solucoes/ai-workforce` — serviço gerido.
- `/solucoes/enterprise-transformation` — Build & Co-Build.
- `#clara` — diagnóstico no site até rota dedicada validada.
- `https://app.atlashub.si` — App / login / V0.
- `https://editions.atlashub.si` — Editions; aplicação independente.
- `https://github.com/atlashub-digital/AtlasHub-AI-WaaS` — engenharia interna, não CTA comercial.
- `https://app.notion.com/p/3f3652fc5b9d817e8ba2e2fa231e8ede` — fonte de estratégia (INTERNAL).

## Jornada da Clara
Pergunta: “Sua necessidade é temporária ou a empresa quer operar essa capacidade permanentemente?”
Se temporária → avaliação AI Workforce; se capacidade própria → Build & Transfer; se capacitação → Co-Build; se não sabe → assessment aberto.
A Clara atual na AtlasHub.Si é **simulador determinístico** com `POST /api/lead` dependente de webhook. Não declarar agendamento concluído se apenas foi solicitada janela de reunião.

## Regras de texto e reivindicações
- Preferir `colaborador digital` + `serviço operado`; nunca falar em contrato de trabalho humano.
- Perfis demo apresentados como demonstração, sem inventar `online`, `24/7`, `projetos entregues` e resultados.
- Quando o backend não disponibilizar métricas, representar `Ainda sem medições` ou `—`.
- A imagem de um rosto é recurso ilustrativo, não referência a funcionário humano identificado.
- Retirar todos os percentuais, metas, números de agentes e charts inventados presentes nas maquetes antes do release.

## Tom
Premium, sóbrio, institucional, sem sensacionalismo. Primeiro a dor empresarial, depois a possibilidade e a supervisão. Mensagens diretas, orientadas à operação.

## Links e segurança
Os CTAs devem ser rotas internas verdadeiras ou integrações validadas; `#clara` no site institucional atual. Não inventar URLs de produto. Navegação entre repos deve respeitar login e redirect seguro.
