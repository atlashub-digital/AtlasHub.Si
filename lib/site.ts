// Conteúdo das páginas do Visual Pack V1 (design/visual-pack-v1/packs/01–03).
// Fonte única de texto: os testes em tests/site.test.ts verificam que nada aqui faz afirmações
// sem evidência (percentagens, 24/7, "pronto", "online", SLA, clientes).

export const APP_URL = "https://app.atlashub.si";
export const EDITIONS_URL = "https://editions.atlashub.si";

export const nav = [
  { label: "Soluções", href: "/#solucoes" },
  { label: "Plataforma", href: APP_URL, external: true },
  { label: "Casos de uso", href: "/#areas" },
  { label: "Conhecimento", href: EDITIONS_URL, external: true },
  { label: "Sobre", href: "/#ecossistema" },
] as const;

export const offers = [
  {
    id: "workforce",
    title: "AI Workforce",
    headline: "Contrate capacidade gerida.",
    description:
      "Colaboradores digitais por missão ou operação continuada, operados e supervisionados pela AtlasHub.",
    points: ["Missão ou contrato contínuo", "Limites e aprovações definidos", "Operação e acompanhamento AtlasHub"],
    cta: "Explorar AI Workforce",
    href: "/solucoes/ai-workforce",
  },
  {
    id: "transformation",
    title: "Enterprise Transformation",
    headline: "Construa sua própria capacidade.",
    description:
      "Desenvolvimento, integração e capacitação no seu ecossistema, para a sua equipe operar com autonomia.",
    points: ["Build & Transfer", "Co-Build & Enablement", "Governança e segurança desde o início"],
    cta: "Explorar Enterprise Transformation",
    href: "/solucoes/enterprise-transformation",
  },
] as const;

export const capabilities = [
  { icon: "users", title: "Employee Factory", text: "Perfis digitais com funções, competências e limites versionados." },
  { icon: "shield", title: "Integração e segurança", text: "Ligação aos seus sistemas com permissões mínimas, isolamento e auditoria." },
  { icon: "gear", title: "Gestão e evolução", text: "Acompanhamento da operação, revisão humana e melhoria contínua." },
  { icon: "heart", title: "Pessoas + agentes", text: "As decisões continuam com a sua equipe; os agentes ampliam a capacidade." },
] as const;

export const journey = [
  { icon: "search", title: "Diagnóstico", text: "Entender a operação, os dados e o que deve mudar." },
  { icon: "bolt", title: "Reforço operacional", text: "Começar com uma missão supervisionada e de âmbito limitado." },
  { icon: "gear", title: "Implantação e capacitação", text: "Integrar no seu ambiente e preparar a sua equipe." },
  { icon: "chart", title: "Capacidade permanente", text: "Operar com autonomia, com governança e evolução." },
] as const;

// Estados reais dos colaboradores (AtlasHub-AI-WaaS, docs/ROLES.md): todos em demonstração; ROLE-001..008
// funcionam em staging supervisionado com sistemas de teste. Nenhum está homologado para clientes.
export type RoleStatus = "demonstração" | "teste" | "piloto" | "homologado";
export const roles = [
  { id: "ROLE-001", name: "Recepcionista Digital", area: "Atendimento", slug: "clinic-appointment-confirmation", summary: "Confirma e remarca consultas com aprovação, encaminha exceções para a equipe." },
  { id: "ROLE-002", name: "Assistente Comercial", area: "Leads", slug: "sales-assistant", summary: "Qualifica leads, organiza o CRM e prepara follow-ups que a equipe aprova." },
  { id: "ROLE-003", name: "Secretária Administrativa", area: "Agenda", slug: "administrative-secretary", summary: "Organiza a caixa de entrada e a agenda; só prepara rascunhos." },
  { id: "ROLE-004", name: "Consultor Imobiliário Digital", area: "Leads", slug: "real-estate-consultant", summary: "Responde apenas com imóveis reais da carteira e pede visitas com aprovação." },
  { id: "ROLE-005", name: "Assistente E-commerce", area: "Atendimento", slug: "ecommerce-assistant", summary: "Informa sobre pedidos depois de verificar a identidade; reembolsos com aprovação." },
  { id: "ROLE-006", name: "Assistente de Marketing", area: "Relatórios", slug: "marketing-assistant", summary: "Pesquisa fontes aprovadas, redige e agenda conteúdo com aprovação." },
  { id: "ROLE-007", name: "Assistente Financeiro Administrativo", area: "Processos", slug: "finance-assistant", summary: "Registra faturas e propõe conciliações; nunca movimenta dinheiro." },
  { id: "ROLE-008", name: "Assistente de RH", area: "Processos", slug: "hr-assistant", summary: "Recebe candidaturas e organiza entrevistas; nunca decide sobre pessoas." },
].map((r) => ({ ...r, status: "demonstração" as RoleStatus }));
export const roleAreas = ["Todos", "Atendimento", "Leads", "Processos", "Agenda", "Relatórios"] as const;

export const workforceSteps = [
  { icon: "chat", title: "Assessment", text: "Entendemos a tarefa, o volume, os canais e os sistemas." },
  { icon: "target", title: "Função e limites", text: "Escolhemos o perfil, as ações permitidas e o que exige aprovação." },
  { icon: "gear", title: "Configuração e testes", text: "Integramos em ambiente de teste e validamos com dados de teste." },
  { icon: "users", title: "Missão gerida", text: "A AtlasHub opera com supervisão humana e trilha de auditoria." },
  { icon: "chart", title: "Relatório e evolução", text: "Acompanhamos o que foi feito e decidimos o próximo passo." },
] as const;

export const supervision = [
  { icon: "lock", title: "Permissões e escopo", text: "Cada colaborador só usa as ferramentas autorizadas para o seu cliente." },
  { icon: "file", title: "Auditoria e métricas", text: "Cada execução fica registrada; as métricas vêm da operação real." },
  { icon: "check", title: "Aprovação humana", text: "Envios, compromissos e ações sensíveis esperam por uma pessoa." },
  { icon: "alert", title: "Gestão de incidentes", text: "Falhas abrem incidentes visíveis e reprocessamento controlado." },
  { icon: "pause", title: "Suspensão e encerramento", text: "A operação pode ser pausada a qualquer momento, com histórico preservado." },
] as const;

export const transformationOffers = [
  {
    id: "build",
    title: "Build & Transfer",
    description:
      "A AtlasHub desenha, implementa, testa, documenta e transfere a solução para a equipe autorizada.",
    deliverables: ["Arquitetura", "Integrações", "Testes", "Documentação", "Handover"],
  },
  {
    id: "cobuild",
    title: "Co-Build & Enablement",
    description:
      "A AtlasHub desenvolve em conjunto com RH, Operações e TI para formar capacidade própria.",
    deliverables: ["Design colaborativo", "Mapa de skills", "Governança", "Capacitação", "Evolução"],
  },
] as const;

export const transformationDomains = [
  { icon: "database", title: "Processos", text: "Fluxos ponta a ponta redesenhados com agentes e regras claras." },
  { icon: "chart", title: "Operações", text: "Agentes que executam e acompanham tarefas no dia a dia." },
  { icon: "users", title: "Pessoas & RH", text: "Apoio a recrutamento, desenvolvimento e experiência do colaborador." },
  { icon: "cloud", title: "TI & Integrações", text: "Ligação segura aos seus sistemas e ambientes." },
  { icon: "shield", title: "Governança", text: "Controles, rastreabilidade e uso responsável da IA." },
] as const;
export const transformationMethod = [
  { icon: "search", title: "Diagnóstico", text: "Oportunidades, riscos e pré-requisitos." },
  { icon: "map", title: "Roadmap", text: "Prioridades, responsáveis e critérios de aceitação." },
  { icon: "network", title: "Arquitetura e integração", text: "Desenho técnico no seu ambiente e com os seus sistemas." },
  { icon: "graduation", title: "Capacitação e transferência", text: "Formação da equipe e passagem contratual da operação." },
  { icon: "trending", title: "Escala e evolução", text: "Novos casos de uso com a mesma governança." },
] as const;
export const transformationTrust = ["IP e licenças explícitos", "DPA / LGPD", "Políticas de permissão", "Auditoria e rollback", "Aceitação operacional"] as const;
export const transformationFaq = [
  {
    q: "A solução fica na nossa infraestrutura?",
    a: "No Build & Transfer, sim: é desenhada para o seu ambiente e entregue após aceitação. Onde ficam os dados, as credenciais e as licenças fica definido em contrato antes de começar.",
  },
  {
    q: "Nossa equipe precisa de conhecimento técnico?",
    a: "Não para começar. O diagnóstico identifica quem precisa de formação; no Co-Build essa capacitação faz parte do projeto.",
  },
  {
    q: "É possível internalizar uma missão AI Workforce?",
    a: "Pode ser avaliado caso a caso. A transferência não é automática: depende de contrato próprio sobre IP, dados, suporte e licenças.",
  },
  {
    q: "Quem suporta a solução após a transferência?",
    a: "A sua equipe, com o suporte que for contratado. Âmbito, prazos de resposta e responsabilidades ficam escritos antes da transferência.",
  },
] as const;

// P01 "Aplicações por área": illustrative scenarios (not proven clients), environment photos only.
export const verticals = [
  { icon: "chat", title: "Atendimento ao cliente", text: "Respostas consistentes e encaminhamento para a equipe.", image: "/assets/case-healthcare.jpg" },
  { icon: "target", title: "Prospecção de leads", text: "Qualificação e próximo passo comercial com aprovação.", image: "/assets/case-realestate.jpg" },
  { icon: "file", title: "Back-office e operações", text: "Tarefas administrativas com regras e auditoria.", image: "/assets/case-industry.jpg" },
  { icon: "megaphone", title: "Marketing e conteúdo", text: "Pesquisa e rascunhos que a equipe revê antes de publicar.", image: "/assets/case-retail.jpg" },
] as const;
export const areaIcon: Record<string, string> = { Atendimento: "chat", Leads: "target", Processos: "file", Agenda: "calendar", "Relatórios": "megaphone" };
