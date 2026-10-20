import type { Registration } from "./store";

const firstName = (name?: string) => (name && name.trim() ? name.trim().split(/\s+/)[0] : "participante");

/** Texto canónico (WhatsApp e e-mail em texto simples). Conteúdo aprovado pelo PDG. */
export function registrationContent(reg: Registration, ticket: string): string {
  return [
    `Olá, ${firstName(reg.name)}! 👋`,
    "",
    "Seja muito bem-vindo(a) à AtlasHub!",
    "",
    "✅ O seu pagamento foi confirmado e a inscrição está garantida!",
    "",
    ...(reg.workshop === "LL01" ? [
      "WORKSHOP — AUTOMAÇÃO COM PESSOAS NO CENTRO",
      "A Nova Era da IA · 2027–2030",
      "",
      "📅 27 e 29 de outubro de 2026",
      "🌐 100% ONLINE · AO VIVO",
      "🎙️ Com Sérgio Monteiro e a equipa AtlasHub",
      "",
      "🎁 Uma oferta especial de boas-vindas",
      "",
      "Como agradecimento pela sua participação e acolhimento na comunidade AtlasHub, vamos enviar-lhe em breve o livro:",
      "",
      "📘 EMPRESA AUMENTADA",
      "Da Inteligência Artificial à Organização Inteligente",
      "Sérgio Monteiro · AtlasHub Editions",
      "",
      "📩 E quanto ao acesso à transmissão?",
      "",
      "Não precisa de fazer mais nada neste momento.",
      "",
      "Em breve, vamos enviar-lhe todas as informações necessárias para se conectar aos dois encontros ao vivo, incluindo a ligação de acesso e as orientações de participação.",
      "",
      "Acompanhe este WhatsApp e o e-mail utilizado na inscrição.",
      "",
      "Estamos muito satisfeitos por ter você connosco nesta jornada!",
      "",
      "Bem-vindo à nova era da inteligência em operação.",
      "",
      "Equipa AtlasHub",
      "People · Technology · Results",
    ] : [
      `WORKSHOP — ${reg.workshop}`,
      "",
      "Encontro presencial em Anápolis.",
      "O endereço e as instruções presenciais serão enviados posteriormente por este canal e por e-mail.",
      "",
      "Equipa AtlasHub",
      "People · Technology · Results",
    ]),
    "",
    ...(reg.amount_minor === 500 ? ["— BILHETE DE TESTE — não vale como inscrição comercial —", ""] : []),
    `Bilhete: ${ticket}`,
    "Suporte: WhatsApp oficial +55 62 99190-3462 — https://wa.me/5562991903462",
  ].join("\n");
}

/** HTML do e-mail transacional com o logo AtlasHub (hospedado no site). */
export function registrationEmailHtml(reg: Registration, ticket: string): string {
  const text = registrationContent(reg, ticket).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const blocks = text.split("\n\n").map((b) =>
    `<p style="margin:0 0 14px;white-space:pre-line">${b.replace(/\n/g, "<br>")}</p>`);
  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px 28px">
  <img src="https://www.atlashub.si/assets/atlashub-logo-welcome.jpg" alt="AtlasHub" width="190" style="display:block;margin-bottom:22px;border-radius:12px" style="display:block;margin-bottom:22px">
  <div style="font-size:15px;line-height:1.55;color:#1a2233">${blocks.join("\n")}</div>
  <hr style="border:none;border-top:1px solid #e4e7ee;margin:22px 0">
  <p style="margin:0;font-size:12px;color:#6b7280">AtlasHub — People · Technology · Results<br>atlashub.si</p>
</div></body></html>`;
}
