import { validateFrenchLead } from "../../../../lib/francophonie-leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const reply = (status: number, body: object) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * French lead intake: no email/CRM messages are sent from the browser.
 * A lead is acknowledged only after the configured server endpoint
 * explicitly accepts it and returns { id, route: "human" } with HTTP 202.
 */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || origin !== new URL(req.url).origin) return reply(403, { accepted: false });
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return reply(415, { accepted: false });
  let raw = "";
  try {
    const stream = req.body?.getReader();
    if (!stream) throw Error("Empty body");
    let size = 0;
    const parts: Uint8Array[] = [];
    while (true) {
      const chunk = await stream.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 8000) { await stream.cancel(); return reply(413, { accepted: false }); }
      parts.push(chunk.value);
    }
    raw = Buffer.concat(parts).toString("utf8");
  } catch { return reply(400, { accepted: false }); }
  let lead;
  try { lead = validateFrenchLead(JSON.parse(raw)); }
  catch { return reply(400, { accepted: false }); }

  // Explicit operational + GDPR review gate. A valid form alone must NOT silently
  // activate foreign-market data collection.
  if (process.env.FR_LEAD_ENABLED !== "true") return reply(503, { accepted: false });
  const endpoint = process.env.FR_LEAD_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  const token = process.env.FR_LEAD_WEBHOOK_TOKEN || process.env.LEAD_WEBHOOK_TOKEN;
  if (!endpoint?.startsWith("https://") || !token) return reply(503, { accepted: false });

  // Keep the existing AtlasHub CRM webhook contract for compatibility,
  // while recording the offer and consent separately in explicit metadata.
  const payload = {
    requestId: lead.requestId,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: "",
    intent: lead.interest === "qualification" ? "meeting" : "contact",
    preferredWindow: lead.preferredWindow || (lead.interest === "qualification" ? "À confirmer avec le prospect" : ""),
    route: "human" as const,
    consent: true,
    consentVersion: "atlashub-fr-lead-v1",
    diagnostic: {
      scenario: "sales", title: "Projet francophone — " + lead.interest,
      channel: "email", systems: "unknown", frequency: "low", approach: "explore", model: "unsure",
    },
    source: "atlashub-francophonie",
    receivedAt: new Date().toISOString(),
    locale: "fr-FR",
    market: lead.country,
    offerInterest: lead.interest,
    requestDetails: lead.message,
    consentMarketing: lead.consentMarketing,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST", redirect: "error",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, "Idempotency-Key": lead.requestId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    const accepted = await response.json();
    if (response.status !== 202 || typeof accepted.id !== "string" || !accepted.id.trim() ||
        accepted.id.length > 160 || accepted.route !== "human") throw Error("Unconfirmed");
    return reply(202, { id: accepted.id, route: "human" });
  } catch {
    return reply(502, { accepted: false });
  }
}
