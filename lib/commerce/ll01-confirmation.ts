import { getOrder, resolveEntitlements, type AroConfig } from "../aro/client";
import type { Registration } from "./store";

/** Network errors propagate so the signed webhook remains retryable. */
export async function verifyLl01Purchase(
  reg: Registration, aro: AroConfig | null, fetchImpl: typeof fetch, now: Date,
  entitlementKey = "atlashub-si:ll01",
): Promise<boolean> {
  if (!aro || !reg.aro_order_id || !reg.offer || reg.amount_minor === null || reg.status === "revoked") return false;
  const order = await getOrder(aro, reg.aro_order_id, fetchImpl);
  // Compare the persisted purchase, never today's campaign price (historical Pix stays valid).
  if (order.id !== reg.aro_order_id || order.project !== aro.project || order.status !== "APPROVED"
    || order.amount?.currency !== "BRL" || order.amount?.amount_minor !== reg.amount_minor
    || !Array.isArray(order.items) || order.items.length !== 1
    || order.items[0].offer !== reg.offer || order.items[0].quantity !== 1
    || order.items[0].unit_amount?.currency !== "BRL"
    || order.items[0].unit_amount?.amount_minor !== reg.amount_minor) return false;
  const entitlements = await resolveEntitlements(aro,
    order.customer_id ? { customerId: order.customer_id } : { email: reg.email }, fetchImpl);
  return entitlements.some(e => e.key === entitlementKey && e.status === "ACTIVE"
    && e.source_order_id === order.id && new Date(e.starts_at).getTime() <= now.getTime()
    && (!e.expires_at || new Date(e.expires_at).getTime() > now.getTime()));
}
