// Envio para o CRM/Atendimento.Center (Clara) dos eventos de inscrição. Só servidor.
// Sem `WORKSHOP_CRM_WEBHOOK_URL` (https) e token, não envia nada; a inscrição continua válida
// e `crm_notified_at` fica vazio para reenvio.
import type { Registration } from "./store";

export type CrmEvent = "workshop.registration.confirmed" | "workshop.registration.revoked";

export async function notifyCrm(
  event: CrmEvent,
  r: Registration,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const url = env.WORKSHOP_CRM_WEBHOOK_URL, token = env.WORKSHOP_CRM_WEBHOOK_TOKEN;
  if (!url?.startsWith("https://") || !token) return false;
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      redirect: "error",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Idempotency-Key": `${event}:${r.id}` },
      body: JSON.stringify({
        event,
        source: "atlashub-si-workshops",
        registrationId: r.id,
        workshop: r.workshop,
        ticket: r.ticket,
        campaign: r.campaign,
        offer: r.offer,
        amountMinor: r.amount_minor,
        aroOrderId: r.aro_order_id,
        contact: { name: r.name, email: r.email, phone: r.phone, company: r.company },
        consents: { event: true, marketing: r.consent_marketing, whatsappGroup: r.consent_whatsapp_group },
        at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
