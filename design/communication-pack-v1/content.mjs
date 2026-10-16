// Textos do AtlasHub.SI Workshops — Communication Pack V1 (PT-BR). Fonte editável única das artes.
// Regras: datas reais; "Anápolis — local a divulgar" (sem endereço); sem clientes, resultados ou depoimentos;
// variante "pre" = CTA "Conheça o programa" (antes do checkout homologado); "comercial" = "Inscreva-se" + preço + link.
export const packs = {
  W01: {
    name: "W01_EMPRESA_AUMENTADA",
    eyebrow: "WORKSHOP 01 · ENTERPRISE TRANSFORMATION",
    title: "Empresa Aumentada 2027–2030",
    concept: "Ter IA não é ser uma Empresa Aumentada.",
    sub: "Pessoas, processos, dados, decisões e inteligência artificial trabalhando como uma só organização.",
    when: "Sáb. 14/11/2026 · 14h–17h",
    where: "Anápolis — local a divulgar",
    extra: "+ Clínica de Ideias online · seg. 16/11",
    url: "atlashub.si/workshops/empresa-aumentada-2027-2030",
    price: "A partir de R$ 297 · lote antecipado",
    priceRegular: "R$ 347 por pessoa",
    priceFull: "R$ 297 antecipado · R$ 347 regular · por pessoa",
    photo: "assets/photo-w01.jpg",
    nodes: ["Pessoas", "Processos", "Dados", "Decisões", "IA"],
    hub: "Empresa\nAumentada",
    feed2: { kicker: "A diferença", title: "Ferramentas somam.\nUma organização multiplica.", body: "Bots e GPTs isolados resolvem tarefas. A Empresa Aumentada redesenha como pessoas, dados e decisões trabalham juntos — com governança." },
    carousel: [
      { n: "01", title: "Ter IA não é ser uma Empresa Aumentada.", body: "Comprar ferramentas é fácil. Mudar a forma como a empresa trabalha é outra conversa." },
      { n: "02", title: "Bots e GPTs abriram possibilidades.", body: "Mas, isolados, aceleram tarefas sem mudar o fluxo, os papéis nem as decisões." },
      { n: "03", title: "A mudança está na integração.", body: "Pessoas, processos, dados, decisões e inteligência artificial desenhados em conjunto, com supervisão humana." },
      { n: "04", title: "Três horas para repensar a empresa.", body: "Cenários reais de cinco setores, um exercício de mapa de fricções e a Clínica de Ideias online na segunda-feira, 16/11." },
      { n: "05", title: "Sáb. 14/11 · Anápolis", body: "Workshop presencial · 14h–17h · local a divulgar." , cta: true },
    ],
    stories: [
      { big: "Ter IA\nnão é ser uma\nEmpresa Aumentada.", small: "Workshop 01 · AtlasHub.SI" },
      { big: "Pessoas.\nProcessos.\nDados.\nDecisões.\nIA.", small: "Desenhados como uma só organização." },
      { big: "14/11\nAnápolis", small: "Workshop presencial · 14h–17h", cta: true },
    ],
    video: { seconds: 45 },
  },
  EL01: {
    name: "EL01_ENTERPRISE_LAB_ECOMMERCE",
    eyebrow: "ENTERPRISE LAB 01 · E-COMMERCE E OPERAÇÕES VIVAS",
    title: "E-commerce e Operações Vivas",
    concept: "Você vende em vários canais. Mas quem coordena a operação?",
    sub: "Marketplaces, loja própria, estoque, pagamentos, logística e margem num só fluxo — com automação e agentes supervisionados.",
    when: "Sáb. 28/11/2026 · 14h–19h",
    where: "Anápolis — local a divulgar",
    extra: "Laboratório prático · 1 representante por empresa",
    url: "atlashub.si/workshops/enterprise-lab-ecommerce",
    price: "A partir de R$ 990 por empresa · lote antecipado",
    priceRegular: "R$ 1.290 por empresa",
    priceFull: "R$ 990 antecipado · R$ 1.290 regular · por empresa",
    photo: "assets/photo-el01.jpg",
    nodes: ["Marketplaces", "Loja própria", "Estoque", "Pagamentos", "Logística", "Margem"],
    hub: "Operação\ncoordenada",
    feed2: { kicker: "O gargalo", title: "As vendas atravessam canais.\nA operação precisa acompanhar.", body: "Estoque, conciliação, rastreio e margem decididos em sistemas separados custam caro. No laboratório, você mapeia o fluxo de um pedido e sai com um blueprint." },
    carousel: [
      { n: "01", title: "Estoque reservado errado em dois canais.", body: "O mesmo produto vendido duas vezes — e um cliente esperando." },
      { n: "02", title: "Pagamento aprovado sem conciliação.", body: "O dinheiro entrou. Ninguém sabe a que pedido corresponde." },
      { n: "03", title: "Rastreio desatualizado.", body: "O cliente pergunta; a operação descobre o problema depois dele." },
      { n: "04", title: "Mudou a regra do marketplace.", body: "Prazos, taxas e políticas mudam — e o processo continua igual." },
      { n: "05", title: "A campanha vendeu e destruiu a margem.", body: "Volume sem visão de custo, frete e comissão." },
      { n: "06", title: "Mapeie, priorize e saia com um blueprint.", body: "Sáb. 28/11 · Anápolis · 14h–19h · local a divulgar. Dados sintéticos: nunca pedimos acesso às suas contas.", cta: true },
    ],
    stories: [
      { big: "Você vende\nem vários canais.", small: "Enterprise Lab 01 · AtlasHub.SI" },
      { big: "Mas quem\ncoordena\na operação?", small: "Estoque · pagamentos · logística · margem" },
      { big: "28/11\nAnápolis", small: "Laboratório prático · 14h–19h", cta: true },
    ],
    video: { seconds: 35 },
  },
};

export const variants = {
  pre: { label: "Conheça o programa", short: "Conheça o programa" },
  comercial: { label: "Inscreva-se", short: "Inscreva-se" },
};
