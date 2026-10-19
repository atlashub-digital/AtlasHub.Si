/**
 * AtlasHub Sales Pages V1 — conteúdo comercial configurável.
 * Nunca colocar credenciais ARO ou preço financeiro nesta camada.
 * Checkout pago só através de oferta canónica ARO e gate server-side.
 */
export type SalesPageConfig = {
  code: string;
  slug: string;
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  promise: string;
  dateLabel: string;
  schedule: { when: string; title: string; description: string }[];
  benefits: { title: string; description: string }[];
  audiences: string[];
  deliverables: string[];
  faq: { q: string; a: string }[];
  contactPhone: string;
  contactMessage: string;
};

export const ll01: SalesPageConfig = {
  code: "LL01",
  slug: "automacao-pessoas-no-centro",
  eyebrow: "ATLASHUB.SI · LIVE LAB LL01 · 100% ONLINE · AO VIVO",
  titleStart: "PARE DE COLECIONAR FERRAMENTAS.",
  titleAccent: "CRIE O SEU PRÓPRIO AGENTE DE IA.",
  subtitle: "Automação com Pessoas no Centro — A Nova Era da IA 2027–2030",
  promise: "Em dois encontros ONLINE, vamos ligar pessoas, processos, dados e agentes inteligentes — e construir um agente do zero, juntos, num cenário de negócio simulado.",
  dateLabel: "27 e 29 de outubro de 2026 · 2 encontros ONLINE ao vivo",
  schedule: [
    { when: "Terça · 27 de outubro", title: "01 — A nova era da IA", description: "Assistentes, automações e agentes. Empresa Aumentada e oportunidades no seu negócio. Entrega: mapa de oportunidades e missão inicial do agente." },
    { when: "Quinta · 29 de outubro", title: "02 — Vamos criar um agente do zero", description: "Construção guiada, juntos: atendimento WhatsApp simulado, pesquisa de concorrência e preços públicos, planeamento de conteúdos e criação assistida de uma ferramenta. Entrega: protótipo demonstrativo e próximos passos." },
  ],
  benefits: [
    { title: "PMEs e comércio", description: "Organizar pedidos e preparar respostas de WhatsApp para revisão humana." },
    { title: "E-commerce", description: "Pesquisar concorrência e preços públicos para identificar oportunidades." },
    { title: "Marketing e criadores", description: "Preparar um calendário de conteúdos e rascunhos para publicação autorizada." },
    { title: "Profissionais e estudantes", description: "Organizar documentos, tarefas, investigação e projetos com contexto." },
  ],
  audiences: ["PMEs e comércio", "E-commerce e serviços", "Profissionais independentes", "Marketing e criadores", "Estudantes"],
  deliverables: ["Mapa de oportunidades", "Missão inicial do agente", "Protótipo ou blueprint demonstrativo", "Próximos passos para uma implementação supervisionada"],
  faq: [
    { q: "É online?", a: "Sim. 100% ONLINE e ao vivo, em 27 e 29 de outubro de 2026. Horários e plataforma serão informados antes da abertura das compras." },
    { q: "Preciso saber programar?", a: "Não. A construção é guiada e acessível a não-programadores. Alguns exemplos técnicos podem exigir apoio." },
    { q: "Vamos criar um agente?", a: "Sim, passo a passo no segundo encontro, num ambiente controlado. A implementação na sua empresa exige integrações, permissões e testes próprios. APIs podem ter custos adicionais." },
    { q: "Recebo gravações?", a: "A oferta é de dois encontros ao vivo. Não inclui promessa de gravações." },
    { q: "Qual o investimento?", a: "R$249 promocional e R$497 regular. A condição vigente é validada no servidor e apresentada antes da emissão do Pix." },
    { q: "E se fechar o Pix?", a: "Fechar a janela não cancela o pagamento. Retome pelo mesmo navegador enquanto a sessão estiver válida. A inscrição depende de aprovação real." },
    { q: "Como leio Empresa Aumentada?", a: "A leitura digital já é gratuita na AtlasHub Editions. É uma leitura complementar, sem exclusividade para inscritos." },
    { q: "Como funciona o cancelamento?", a: "Consulte as condições comerciais nesta página e contacte a equipa para solicitar cancelamento ou esclarecer os seus direitos." },
  ],
  contactPhone: "5562991903462",
  contactMessage: "Olá! Tenho interesse no LL01 — Automação com Pessoas no Centro, 100% ONLINE, 27 e 29 de outubro de 2026, 2 encontros ao vivo.",
};

export function salesWhatsAppUrl(page: SalesPageConfig, origin: string) {
  const source = new RegExp("^" + page.code + "-(IG|FB|LI|ST|VID|WA|SITE)$").test(origin) ? origin : page.code + "-SITE";
  return "https://wa.me/" + page.contactPhone + "?text=" + encodeURIComponent(page.contactMessage + "\nOrigem: " + source + "\nPode enviar os detalhes do programa?");
}
