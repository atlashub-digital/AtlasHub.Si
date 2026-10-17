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
  eyebrow: "ATLASHUB.SI · LIVE LAB 01 · LIVE ONLINE",
  titleStart: "Automação com",
  titleAccent: "Pessoas no Centro",
  subtitle: "Estratégias, processos e casos reais para operações mais capazes.",
  promise: "Deixe de tratar a IA como mais uma ferramenta isolada. Aprenda a conectar pessoas, procedimentos, dados e agentes inteligentes aos processos do seu negócio — com supervisão humana.",
  dateLabel: "22 e 29/11 · 05 e 12/12 de 2026 · 18h–20h (Brasília)",
  schedule: [
    { when: "Domingo · 22/11", title: "01 — De ferramenta a ecossistema", description: "Mapear as pessoas, processos, sistemas e oportunidades da sua operação." },
    { when: "Domingo · 29/11", title: "02 — Processos que trabalham", description: "Redesenhar um fluxo, identificar exceções e decidir o que automatizar." },
    { when: "Sábado · 05/12", title: "03 — Construa a sua própria solução", description: "Com apoio da IA, desenvolver um protótipo inicial em ambiente controlado." },
    { when: "Sábado · 12/12", title: "04 — Inteligência em operação", description: "Definir métricas, responsáveis, riscos e um plano de implementação de 30 dias." },
  ],
  benefits: [
    { title: "Menos ferramentas isoladas", description: "Identifique o que vale a pena integrar, automatizar ou construir." },
    { title: "Agentes com missões reais", description: "Conheça o princípio de agentes conectados a processos e ferramentas autorizadas." },
    { title: "Pessoas no controlo", description: "Aprenda a manter critérios, supervisão, privacidade e decisões importantes nas pessoas." },
    { title: "Uma solução que faz sentido", description: "Desenhe uma arquitetura inicial adequada à sua atividade e recursos." },
  ],
  audiences: [
    "Comércio online e lojas físicas",
    "Escritórios, advocacia e serviços profissionais",
    "Clínicas e estética — processos administrativos",
    "Marketing e produtores digitais",
    "Empresários, especialistas e estudantes",
  ],
  deliverables: [
    "Mapa do seu ecossistema operacional",
    "Canvas do processo atual e futuro",
    "Protótipo inicial ou blueprint técnico, conforme o caso",
    "Plano de ação de 30 dias com prioridades e indicadores",
  ],
  faq: [
    { q: "Preciso saber programar?", a: "Não. O programa foca o desenho de processos e a construção assistida. Algumas demonstrações são técnicas, mas têm explicação acessível." },
    { q: "Vou sair com uma automação pronta?", a: "O objetivo é um mapa de oportunidades, um protótipo ou blueprint inicial e um plano. Não inclui implementação produtiva personalizada." },
    { q: "São aulas gravadas?", a: "Os quatro encontros são ao vivo e online. Gravações e eventuais condições de acesso ainda serão informadas." },
    { q: "Qual o valor e como faço a inscrição?", a: "Lote antecipado aprovado: R$397. Regular: R$497. Uma promoção adicional de 10% (R$357,30 sobre R$397) só vale se for ativada por reserva válida no servidor. Enquanto o checkout não abrir, manifeste interesse pelo WhatsApp." },
    { q: "Sou estudante ou trabalho sozinho. Faz sentido?", a: "Sim. A metodologia pode ser aplicada desde processos pessoais e pequenas operações até empresas com várias equipas." },
  ],
  contactPhone: "5562991903462",
  contactMessage: "Olá! Quero reservar meu interesse no Live Lab 01 — Automação com Pessoas no Centro (4 encontros LIVE ONLINE: 22 e 29/11, 05 e 12/12, 18h–20h, Brasília).",
};

export function salesWhatsAppUrl(page: SalesPageConfig, origin: string) {
  const source = new RegExp("^" + page.code + "-(IG|FB|LI|ST|VID|WA|SITE)$").test(origin) ? origin : page.code + "-SITE";
  return "https://wa.me/" + page.contactPhone + "?text=" + encodeURIComponent(page.contactMessage + "\nOrigem: " + source + "\nPode enviar os detalhes do programa?");
}
