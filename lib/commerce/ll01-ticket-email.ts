import { registrationContent, registrationEmailHtml } from "./registration-content";
import type { Registration } from "./store";

/** Server-only transactional delivery. The webhook catches failures and may retry on redelivery. */
export async function sendLl01Ticket(
  reg: Registration, ticket: string, env: Record<string, string | undefined>, fetchImpl: typeof fetch,
): Promise<boolean> {
  if (env.NODE_ENV !== "production" || env.LL01_TICKET_EMAIL !== "live") return false;
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) throw Error("ll01_ticket_email_not_configured");
  const text = registrationContent(reg, ticket);
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json",
      "Idempotency-Key": `ll01-ticket:${reg.id}` },
    body: JSON.stringify({ from: env.RESEND_FROM, to: [reg.email],
      subject: reg.workshop === "LL01" ? "Bilhete LL01 — Automação com Pessoas no Centro" : `Bilhete ${reg.workshop} — encontro presencial`,
      html: registrationEmailHtml(reg, ticket), text: registrationContent(reg, ticket) }),
    redirect: "error", signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw Error("ll01_ticket_email_failed");
  const result = await response.json() as { id?: string };
  if (typeof result.id !== "string" || !result.id) throw Error("ll01_ticket_email_failed");
  return true;
}
