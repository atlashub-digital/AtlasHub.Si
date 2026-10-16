// Condições comerciais dos workshops, mostradas antes do pagamento e aceites no formulário.
// Mudar o texto exige subir `termsVersion` (fica gravado em cada inscrição).
export const termsVersion = "workshops-2026-10-v1";

export const venueNotice = "Anápolis — local a divulgar";
export const venueDeadline = "O endereço é comunicado por e-mail e WhatsApp até 7 dias antes do evento.";

export const conditions: { title: string; text: string }[] = [
  { title: "Local", text: `${venueNotice}. ${venueDeadline} Se não for possível confirmar o local até essa data, o evento é adiado ou cancelado e você escolhe entre a nova data e o reembolso integral.` },
  { title: "Pagamento", text: "PIX pelo sistema de pagamentos da AtlasHub (ARO). A inscrição só fica confirmada, com bilhete, depois de o pagamento ser aprovado. Não aceitamos comprovantes por WhatsApp como confirmação." },
  { title: "Desistência", text: "Reembolso integral se pedir em até 7 dias depois do pagamento (direito de arrependimento, CDC art. 49)." },
  { title: "Transferência", text: "Depois desse prazo, a inscrição pode ser transferida para outra pessoa da sua empresa, sem custo, até 48 horas antes do evento." },
  { title: "Adiamento ou cancelamento pela AtlasHub", text: "Você escolhe entre a nova data e o reembolso integral, sem custos." },
  { title: "Lotes", text: "O valor antecipado vale até a data indicada ou enquanto o lote estiver ativo; depois aplica-se o valor regular. O valor cobrado é sempre o confirmado na tela de pagamento." },
];

/** Fim do lote antecipado por workshop (BRT). Pode ser antecipado por env `WORKSHOP_EARLY_UNTIL_<CODE>` (ISO). */
const earlyDefaults: Record<"W01" | "EL01", string> = {
  W01: "2026-11-06T23:59:59-03:00",
  EL01: "2026-11-20T23:59:59-03:00",
};
export function earlyUntil(code: "W01" | "EL01", env: Record<string, string | undefined> = process.env): Date {
  const raw = env[`WORKSHOP_EARLY_UNTIL_${code}`];
  const d = raw ? new Date(raw) : new Date(earlyDefaults[code]);
  return Number.isNaN(d.getTime()) ? new Date(earlyDefaults[code]) : d;
}
