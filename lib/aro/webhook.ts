/**
 * Verificação dos webhooks de saída do ARO (atlashub-finance docs/35 §"Signature verification").
 * Sem dependências: corre em Node (rota) e nos testes (`npm test`).
 * Um webhook é só NOTIFICAÇÃO: acesso a produto decide-se sempre por `resolveEntitlements` (client.ts).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const aroEventTypes = [
  "checkout.started",
  "payment.pending",
  "payment.approved",
  "payment.failed",
  "payment.refunded",
  "payment.chargeback",
  "order.approved",
  "entitlement.granted",
  "entitlement.revoked",
] as const;
export type AroEventType = (typeof aroEventTypes)[number];

export type AroEvent = {
  id: string;
  type: AroEventType;
  created_at: string;
  project: string;
  data: Record<string, unknown>;
};

export type WebhookInput = {
  rawBody: string;
  eventId: string | null;
  timestamp: string | null;
  signature: string | null;
  secret: string;
  project: string;
  nowSeconds?: number;
  toleranceSeconds?: number;
};

export type WebhookResult =
  | { ok: true; event: AroEvent }
  | { ok: false; status: 400 | 401; reason: string };

export function signAroPayload(secret: string, timestamp: string, rawBody: string): string {
  return "v1=" + createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
}

export function verifyAroWebhook(input: WebhookInput): WebhookResult {
  const { rawBody, eventId, timestamp, signature, secret, project } = input;
  if (!eventId || !timestamp || !signature) return { ok: false, status: 401, reason: "missing_headers" };
  if (!/^\d{1,12}$/.test(timestamp)) return { ok: false, status: 401, reason: "bad_timestamp" };
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > (input.toleranceSeconds ?? 300)) return { ok: false, status: 401, reason: "stale_timestamp" };

  const expected = Buffer.from(signAroPayload(secret, timestamp, rawBody));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, status: 401, reason: "bad_signature" };

  let event: AroEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, reason: "bad_json" };
  }
  if (!event || typeof event !== "object" || event.id !== eventId) return { ok: false, status: 400, reason: "event_id_mismatch" };
  if (event.project !== project) return { ok: false, status: 400, reason: "wrong_project" };
  if (!aroEventTypes.includes(event.type)) return { ok: false, status: 400, reason: "unknown_type" };
  if (!event.data || typeof event.data !== "object") return { ok: false, status: 400, reason: "bad_data" };
  return { ok: true, event };
}
