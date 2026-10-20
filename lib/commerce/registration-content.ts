import type { Registration } from "./store";

export function registrationContent(reg: Registration, ticket: string): string {
  return [
    `Pagamento confirmado. Inscrição garantida no ${reg.workshop}.`,
    ...(reg.workshop === "LL01" ? [
      "LL01 — Automação com Pessoas no Centro",
      "100% ONLINE · ao vivo", "27 e 29 de outubro de 2026",
      "Participação com Sérgio Monteiro e equipa AtlasHub.",
      'O livro "Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente" é uma oferta de boas-vindas à comunidade, a enviar em breve.',
      "A ligação e as instruções da live serão enviadas posteriormente, antes do encontro.",
    ] : ["Encontro presencial em Anápolis. O endereço e as instruções presenciais serão enviados posteriormente."]),
    `Código do bilhete: ${ticket}`,
    ...(reg.amount_minor === 500 ? ["BILHETE DE TESTE — não vale como inscrição comercial"] : []),
    "Suporte: WhatsApp oficial +55 62 99190-3462 — https://wa.me/5562991903462",
  ].join("\n");
}
