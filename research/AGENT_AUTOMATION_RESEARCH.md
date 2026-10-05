# AtlasHub — agentes, automação e desenho da Clara

Data: 4 de outubro de 2026. Pesquisa aplicada para orientar produto e implementação, não inventário de todos os fornecedores do mercado. As propostas e prioridades abaixo são avaliação técnica AtlasHub, não resultados de clientes nem funcionalidades já instaladas.

## Conclusão

A oportunidade inicial mais sólida está na combinação de processos previsíveis com interpretação de linguagem: classificar pedidos, extrair informação, consultar fontes autorizadas, preparar ações e encaminhar exceções. Nem todos os passos precisam de um agente. Regras, validação de dados e APIs são preferíveis para cálculos, permissões, deduplicação, estados e transações. O modelo ajuda sobretudo na interpretação e síntese.

A primeira versão da Clara implementa um diagnóstico por regras, identificado como simulação guiada. Não consulta um LLM nem executa workflows. A conversa serve para obter contexto e gerar um mapa inicial sem custo por mensagem, latência de modelo ou recolha obrigatória de dados pessoais. Uma camada de conversação generativa pode ser adicionada após estabilizar os cenários, as fontes e o canal de entrega.

## O que as plataformas permitem

| Família | Capacidades verificadas | Critério de escolha AtlasHub |
|---|---|---|
| n8n | Workflows, webhooks, ferramentas de agentes, revisão humana e integração WhatsApp | Avaliar para orquestração de várias aplicações, com equipa responsável pela operação e credenciais |
| Microsoft Copilot Studio | Agentes iniciados por eventos, ferramentas e limites de autonomia | Avaliar onde a organização já opera no ecossistema Microsoft e precisa de gestão integrada |
| Make AI Agents | Ferramentas de módulos, cenários e MCP | Avaliar para equipas que já mantêm cenários Make |
| Zapier Agents | Ações para encontrar e alterar dados de aplicações conectadas | Avaliar para processos SaaS simples com conectores existentes |
| Código próprio + APIs | Maior controlo do contrato, UX e validação | Usar na interface e nas fronteiras críticas; exige manutenção e testes próprios |

Não foi feita comparação de preços: o custo real depende de volume, número de passos, modelo, alojamento, mensagens, retenção e operação. A seleção deve resultar de um piloto com dados representativos, não apenas de demonstrações.

Fontes primárias: [n8n Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook.md), [Microsoft: agentes autónomos](https://learn.microsoft.com/microsoft-copilot-studio/guidance/autonomous-agents), [Make: ferramentas MCP](https://help.make.com/make-ai-agents-new-mcp-tools-are-now-available), [Zapier: ações de agentes](https://help.zapier.com/hc/en-us/articles/26028298697485-Use-actions-on-Zapier-Agents).

## Referências indicadas pelo autor

### NexTrustX

Inspecionado o repositório `iahub360-stack/NexTrustX`, commit `386eb201e820442c924c744827e0204a3bfbed2a`. O README e a homepage descrevem serviços financeiros/cripto, preços, cards expansíveis e contacto contextual. Não é evidência de implementações AtlasHub de agentes em empresas. Aproveitou-se o padrão de expandir um serviço para mostrar contexto e ação seguinte; não foram transportados preços, contactos, alegações de segurança, transações ou código financeiro. A leitura web do deployment falhou; a análise incidiu no código clonado.

### Coleção n8n

Auditoria estrutural de todos os JSONs na pasta workflows, commit `94007c1445d9258a7da116646b79473e7c7c3282`: **2 061 ficheiros**, todos com JSON válido; **937 contêm pelo menos um nó noOp** e **694 têm connections vazio**. As contagens são da cópia inspecionada, não da alegação promocional do README. Um noOp pode ser intencional, mas nestes exemplos há nós com nomes de modelos/agentes cujo tipo efetivo é noOp. JSON válido não comprova execução válida.

Amostras lidas:

- `Whatsapp/2030_Whatsapp_Respondtowebhook_Automate_Webhook.json`: receção e eco de mensagem; não é um agente comercial completo.
- `Gmail/0319_Gmail_Googlecalendartool_Send_Triggered.json`: nós intitulados Agent, Classify appointment e OpenAI Chat Model tipados como noOp.
- `Facebookleadads/0896_Facebookleadads_Stickynote_Automate_Triggered.json`: trigger e integração comercial, mas sem ligações no objeto connections.
- `Googlecalendar/1620_GoogleCalendar_Form_Automation_Triggered.json`: intenção de marcação com aprovação, mas vários noOp e ligações limitadas.

Nenhum workflow foi executado, importado ou apresentado como pronto. [Repositório analisado](https://github.com/Zie619/n8n-workflows).

## Portefólio de possibilidades

Prioridade A: bom candidato a piloto limitado. B: depende de integração e qualidade de dados. C: âmbito sensível; começar apenas por apoio à decisão. Todas as classificações são propostas, a confirmar por cliente.

| Processo | Primeiro resultado implementável | Dependências e limite | Prioridade |
|---|---|---|---|
| Leads do site | Registo, resumo e encaminhamento | CRM, regras de consentimento, deduplicação | A |
| Inbox comercial | Classificação e rascunho de resposta | Acesso limitado ao email; aprovação de envio | A |
| Atendimento documental | Resposta com fontes e passagem a humano | Base atualizada, permissões, avaliação de respostas | A |
| Pedidos de orçamento | Briefing estruturado para vendedor | Catálogo; sem preço vinculativo gerado pelo modelo | A |
| Follow-up | Preparar lembretes e próximos passos | Preferências de contacto e limites de frequência | A |
| CRM | Detetar campos ausentes e duplicados | Identificadores estáveis e validação antes de fusão | B |
| Agenda | Propor horários e recolher preferência | Consulta de disponibilidade e confirmação real | B |
| Cancelamentos | Encaminhar e propor remarcação | Regras de agenda e prevenção de conflitos | B |
| Stock | Alertas e rascunhos de reposição | ERP/POS atualizado; cálculo determinístico | B |
| Fornecedores | Extrair alterações de entrega | Correspondência com encomendas e datas verificadas | A |
| Compras | Comparativo de propostas | Regras objetivas; compra aprovada por responsável | B |
| Faturas | Extração e comparação com encomenda | Conferência de valores/duplicados, sem pagar sozinho | B |
| Despesas | Verificação preliminar de documentação | Política interna e revisão de exceções | B |
| Conciliação | Sinalizar diferenças | Fontes reconciliadas e controlos contabilísticos | C |
| Imobiliário | Preferências e imóveis candidatos | Catálogo atualizado; sem discriminação ou decisão de crédito | B |
| Saúde administrativa | Encaminhamento e lembretes | Separar dados clínicos; sem diagnóstico | C |
| RH administrativo | FAQs e checklist de onboarding | Permissões por pessoa; sem decisão de contratação | B |
| IT interno | Triagem e sugestão de resolução | Base técnica; acessos elevados sujeitos a aprovação | A |
| Operações | Resumo de indicadores e tarefas | Cálculos fora do modelo e referência aos dados | A |
| Manutenção | Triagem de ocorrências | Sem comando de máquinas; responsável operacional | C |
| Marketing | Rascunhos por briefing aprovado | Revisão editorial e direitos sobre fontes | A |
| Contratos | Extrair cláusulas e obrigações | Revisão especializada; sem aconselhamento ou assinatura automática | C |
| Logística | Alertas de exceções e pedidos de atualização | APIs de transporte e identificadores | B |
| Conhecimento interno | Pesquisa contextual por equipa | Controlo de acesso aplicado antes da recuperação | B |

## Arquitetura recomendada para os pilotos

Evento → validação/deduplicação → obtenção de contexto permitido → interpretação do agente → validação do resultado → aprovação quando necessária → ação via API → registo do resultado e gestão de falhas.

No n8n, a revisão humana de ferramentas pode suspender a ação para aprovação. A integração oficial WhatsApp inclui envio de mensagens/templates e espera por resposta; exige conta e credenciais próprias. Não confundir a disponibilidade do conector com autorização para contactar qualquer número. [Revisão humana](https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools.md), [WhatsApp Business Cloud](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp.md).

Avaliar com exemplos reais anonimizados: precisão por categoria, campos extraídos corretos, exceções, respostas sem fonte, tempo de execução e custo por pedido. Usar conjunto separado para verificar regressões. Definir quem pode interromper uma execução e recuperar de falhas. O índice oficial documenta avaliações e recuperação de contexto; não se assume que estes mecanismos eliminam erros. [Índice técnico n8n](https://docs.n8n.io/sitemap.md).

## Clara: produto implementado e evolução

Implementado: oito cenários, cinco perguntas, entrada direta por caso, voltar/recomeçar, mapa progressivo, critérios de medição, pré-requisitos e resumo descarregável. Sem armazenamento de contactos em localStorage ou envio durante as perguntas.

Preparado: formulário voluntário no final, nome, empresa opcional, email ou WhatsApp, finalidade de contacto/reunião/orçamento e autorização explícita. API valida no servidor, limita campos, aceita apenas opções conhecidas e só confirma receção se o destino confirmar. Credenciais ficam no servidor. meeting_url permanece null. Recolhe a janela preferida e pede confirmação por WhatsApp/email; não afirma marcação, encaminhamento, nem consulta a CRM/agenda.

Pendente de dados operacionais: contactos comerciais reais, webhook autenticado, CRM, política de retenção e responsável pela eliminação. O endpoint público deve ter limitação de pedidos no gateway e/ou mecanismo antiabuso antes de ativar a recolha. O webhook precisa de deduplicar por requestId e persistir antes de responder 202 com { id, route: "human" }. O frontend usa exclusivamente POST /api/lead no mesmo domínio. Honeypot e verificação de Origin não substituem rate limiting.

Evolução generativa: permitir descrição livre, extrair estrutura validada e pedir confirmação ao visitante; recuperar apenas catálogo aprovado; nunca permitir que texto do visitante altere ferramentas, permissões, destino do lead ou preços. Orçamento continua dependente de análise técnica. Instrumentar o funil com eventos sem dados pessoais: início, conclusão, descarregamento e pedido confirmado.

