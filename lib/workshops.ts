// Workshops empresariais AtlasHub.SI · Enterprise Transformation.
// Fonte: Drive EMPRESA_AUMENTADA_2027-2030_WORKSHOPS (FICHA_E_PROGRAMA, FICHA_PRODUTO_E_PROGRAMA,
// LANDING_PAGINAS_VENDA, ALTERACAO_DATAS_v0.2), adaptado para PT-BR.
//
// Regras (tests/workshops.test.ts):
// - pré-lançamento: local, preço final e abertura de inscrições só depois da aprovação do Sérgio;
// - nenhum preço aparece na página enquanto `pricing` for "pending" (os valores propostos ficam em
//   docs/WORKSHOPS.md para decisão, nunca aqui);
// - a cobrança futura passa pelo ARO (Atlas Revenue Operations): `aroProduct` é o código do produto no
//   catálogo (aro.project.yaml; ofertas por lote ficam lá, em draft). Este site nunca cria checkout próprio;
// - o CTA atual é a lista de interesse pelo WhatsApp oficial, com código de campanha na mensagem.

export const WHATSAPP_NUMBER = "5562991903462";

export type WorkshopSlug = "empresa-aumentada-2027-2030" | "enterprise-lab-ecommerce";

export type Workshop = {
  slug: WorkshopSlug;
  code: "W01" | "EL01";
  aroProduct: "workshop-01-empresa-aumentada" | "enterprise-lab-01-ecommerce";
  kicker: string;
  title: string;
  headline: string;
  summary: string;
  date: string;
  dateIso: string;
  time: string;
  city: string;
  venue: string;
  format: string;
  extras: string[];
  audience: string;
  capacity: string;
  pricing: "pending";
  priceLabel: string;
  agenda: { time: string; topic: string; activity: string }[];
  deliverables: string[];
  notIncluded: string[];
  faq: { q: string; a: string }[];
  waMessage: string;
};

const pendingPrice = "Investimento a confirmar antes da abertura das inscrições";

export const workshops: Workshop[] = [
  {
    slug: "empresa-aumentada-2027-2030",
    code: "W01",
    aroProduct: "workshop-01-empresa-aumentada",
    kicker: "Workshop 01 · Enterprise Transformation",
    title: "Empresa Aumentada 2027–2030",
    headline: "O futuro das operações começa hoje.",
    summary:
      "Uma conversa executiva para empresários e profissionais que querem entender como as empresas estão mudando e como preparar pessoas, processos e tecnologia para trabalhar em conjunto.",
    date: "Sábado, 14 de novembro de 2026",
    dateIso: "2026-11-14",
    time: "14h–17h",
    city: "Anápolis/GO",
    venue: "Local a confirmar",
    format: "Presencial",
    extras: [
      "Clínica de Ideias a distância na segunda-feira, 16/11, das 16h às 18h",
      "30 dias de comunidade AtlasHub moderada, com adesão voluntária",
      "Material digital de apoio",
    ],
    audience:
      "Empresários, gestores, comerciantes, profissionais liberais, diretores de operações, responsáveis de tecnologia e quem participa da evolução de empresas. Não é preciso saber programar.",
    capacity: "Turma presencial com capacidade definida pelo local, confirmada antes da abertura das inscrições.",
    pricing: "pending",
    priceLabel: pendingPrice,
    agenda: [
      { time: "14h00", topic: "Abertura", activity: "Quem somos, expectativas e pergunta inicial" },
      { time: "14h15", topic: "Duas revoluções ao mesmo tempo", activity: "Industrial, digital e agentic; ritmos diferentes por setor e região" },
      { time: "14h45", topic: "Da ferramenta à empresa", activity: "Bots, GPTs, automação linear, integração, gestão e operação" },
      { time: "15h20", topic: "O trabalho em 2027–2030", activity: "Funções, competências, direitos, supervisão e responsabilidade" },
      { time: "15h35", topic: "Intervalo", activity: "Networking" },
      { time: "15h45", topic: "Cinco cenários", activity: "Imobiliária, farmácia, indústria, clínica e comércio digital" },
      { time: "16h15", topic: "Exercício", activity: "Mapa de fricções e primeira hipótese de transformação" },
      { time: "16h40", topic: "Conversa aberta", activity: "Perguntas, troca de experiências e preparação da Clínica de Ideias" },
    ],
    deliverables: [
      "Mapa Inicial de Oportunidades (ficha de uma página)",
      "Guia de reflexão: pessoas, dados, fluxos, sistemas, gargalos e governança",
      "Acesso à Clínica de Ideias e à comunidade moderada por 30 dias, mediante adesão expressa",
      "Leituras selecionadas da AtlasHub Editions, sujeitas a direitos e revisão",
    ],
    notIncluded: [
      "Integração pronta, agente autônomo personalizado ou diagnóstico técnico completo",
      "Consultoria individual: é um evento formativo, não uma promessa de implementação",
    ],
    faq: [
      { q: "Não sou da área técnica. Posso participar?", a: "Sim. A primeira edição é voltada à organização da empresa, não a código." },
      { q: "É uma palestra de vendas?", a: "Não. É um workshop de formação e debate. Se houver opções de continuidade, elas são apresentadas à parte do programa." },
      { q: "Qual é o local?", a: "Em Anápolis, com endereço divulgado somente depois da reserva confirmada." },
      { q: "Quanto custa e como pago?", a: "O investimento e a política de cancelamento, reembolso e transferência são publicados antes da abertura das inscrições. Nenhuma cobrança acontece nesta fase." },
      { q: "Há certificado?", a: "Está previsto um certificado simples de participação, se for viável operacionalmente. Não é uma certificação profissional." },
      { q: "Posso levar minha equipe?", a: "Cada inscrição é individual. Condições para grupos de uma mesma empresa ainda estão em definição." },
    ],
    waMessage:
      "Olá! Quero receber a abertura das inscrições do Workshop 01 — Empresa Aumentada 2027–2030 (14/11, Anápolis). Código: W01-SITE",
  },
  {
    slug: "enterprise-lab-ecommerce",
    code: "EL01",
    aroProduct: "enterprise-lab-01-ecommerce",
    kicker: "Enterprise Lab 01 · Enterprise Transformation",
    title: "E-commerce e Operações Vivas",
    headline: "Do marketplace à operação aumentada.",
    summary:
      "As vendas atravessam canais e a operação precisa acompanhar. Neste laboratório, donos de lojas, sellers e gestores de e-commerce mapeiam o fluxo de um pedido realista, identificam gargalos, comparam automações com agentes de IA e constroem um blueprint de melhoria para levar para a empresa.",
    date: "Sábado, 28 de novembro de 2026",
    dateIso: "2026-11-28",
    time: "14h–19h",
    city: "Anápolis/GO",
    venue: "Local a confirmar",
    format: "Presencial · laboratório prático",
    extras: ["Mercado Livre · Shopee · loja própria · ERP · pagamentos · logística · atendimento", "Demonstração com dados sintéticos"],
    audience:
      "Vendedores em Mercado Livre, Shopee e loja própria, gestores operacionais, profissionais de marketing e parceiros logísticos. Inscrição por empresa, com um representante.",
    capacity: "Grupo reduzido de empresas para preservar o acompanhamento; capacidade confirmada antes da abertura das inscrições.",
    pricing: "pending",
    priceLabel: pendingPrice,
    agenda: [
      { time: "14h00", topic: "Do clique ao resultado", activity: "Fluxo do pedido e da margem" },
      { time: "14h25", topic: "Marketplaces x loja própria", activity: "Sistemas, regras, estoque, prazos e conciliação" },
      { time: "15h10", topic: "Dor operacional real", activity: "Identificação do gargalo e mapa atual" },
      { time: "15h55", topic: "Intervalo", activity: "Networking" },
      { time: "16h10", topic: "Quatro soluções alternativas", activity: "Processo, automação, IA assistiva e agente supervisionado" },
      { time: "17h00", topic: "Construção acompanhada", activity: "Blueprint de um fluxo e das suas exceções" },
      { time: "17h45", topic: "Demonstração guiada de um ecossistema vivo", activity: "Contexto, ferramentas, decisão limitada, execução de teste e supervisão" },
      { time: "18h25", topic: "Avaliação econômica e compromisso", activity: "Indicadores, riscos, prioridades e próximos 30 dias" },
    ],
    deliverables: [
      "Matriz de gargalos da sua operação",
      "Blueprint inicial do processo escolhido",
      "Modelo de indicadores para acompanhar a melhoria",
      "Participação na demonstração com dados sintéticos",
    ],
    notIncluded: [
      "Implementação de software ou integrações em produção",
      "Acesso administrativo às suas contas de marketplace, ERP ou pagamentos",
      "Equipe de agentes residente na sua empresa",
    ],
    faq: [
      { q: "Preciso levar dados da minha loja?", a: "Não. Os exercícios usam casos didáticos e dados sintéticos. Nunca pedimos senhas nem acesso às suas contas." },
      { q: "Quantas pessoas por empresa?", a: "A inscrição inclui um representante. Condições para um segundo participante ainda estão em definição." },
      { q: "Qual é o local?", a: "Em Anápolis, com endereço divulgado somente depois da reserva confirmada." },
      { q: "Quanto custa e como pago?", a: "O investimento e a política de cancelamento, reembolso e transferência são publicados antes da abertura das inscrições. Nenhuma cobrança acontece nesta fase." },
      { q: "A data pode mudar?", a: "A realização depende de uma decisão de go/no-go prévia. Se houver mudança, quem estiver na lista de interesse é avisado por escrito." },
    ],
    waMessage:
      "Olá! Quero receber a abertura das inscrições do Enterprise Lab 01 — E-commerce e Operações Vivas (28/11, Anápolis). Código: EL01-SITE",
  },
];

export function workshopBySlug(slug: string): Workshop | undefined {
  return workshops.find((w) => w.slug === slug);
}

export function waInterestUrl(w: Workshop): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(w.waMessage)}`;
}

/** Estado comercial comum (até à aprovação: local, preço final, política de cancelamento e ARO homologado). */
export const workshopStatus = {
  label: "Pré-lançamento",
  note: "Datas previstas. Local, investimento e abertura das inscrições são confirmados antes de qualquer cobrança. A lista de interesse não reserva lugar nem cria obrigação de compra.",
  waNote: "A mensagem só é enviada quando você tocar em enviar no WhatsApp. Não envie documentos nem dados de clientes.",
};
