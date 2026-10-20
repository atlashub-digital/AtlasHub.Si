import type { Registration, Store } from "./store";
import { sendLl01Ticket } from "./ll01-ticket-email";
import { registrationContent } from "./registration-content";

export async function deliverRegistration(reg: Registration, store: Store,
  env: Record<string, string | undefined>, fetchImpl: typeof fetch): Promise<void> {
  if (reg.status !== "confirmed" || !reg.ticket) return;
  await store.communicationEvent(reg.id);
  // Sequential independent attempts: a failed transport cannot suppress the other channel.
  for (const channel of ["email", "whatsapp"] as const) {
    if (env.NODE_ENV !== "production") continue;
    if (channel === "email" && env.LL01_TICKET_EMAIL !== "live") continue;
    if (channel === "whatsapp" && (env.LL01_WA_CONFIRM !== "live" || !reg.phone)) continue;
    if (!await store.communicationClaim(reg.id, channel)) continue;
    let attempted = false;
    try {
      if (channel === "email") {
        await sendLl01Ticket(reg, reg.ticket, env, fetchImpl);
      } else {
        const url = new URL(env.ATENDIMENTO_EVOLUTION_URL || "https://evo-relay.lia.doctor");
        if (url.protocol !== "https:" || !env.ATENDIMENTO_EVOLUTION_KEY) throw Error("whatsapp_not_configured");
        const number = reg.phone!.replace(/\D/g, "");
        if (!/^\d{10,15}$/.test(number)) throw Error("invalid_phone");
        attempted = true;
        const response = await fetchImpl(new URL("/message/sendText/atlashub-wa", url), {
          method: "POST", headers: { apikey: env.ATENDIMENTO_EVOLUTION_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ number, text: registrationContent(reg, reg.ticket) }),
          redirect: "error", signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw Error("whatsapp_failed");
        const body = await response.json() as { key?: { id?: string } };
        if (!body.key?.id) throw Error("whatsapp_invalid_reply");
      }
      await store.communicationResult(reg.id, channel, "sent");
      if (channel === "email") await store.markTicketEmailed(reg.id);
    } catch {
      // Evolution has no proven provider idempotency: ambiguous requests require reconciliation.
      await store.communicationResult(reg.id, channel, channel === "whatsapp" && attempted ? "uncertain" : "failed");
      console.error("registration_delivery_failed", { registrationId: reg.id, channel });
    }
  }
}
