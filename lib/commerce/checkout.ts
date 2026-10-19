// Percurso de compra dos workshops: reserva → sessão ARO → PIX → aprovação → direito ACTIVE → bilhete.
// Regras: preço e oferta decididos no servidor; valor devolvido pelo ARO tem de bater com o catálogo;
// bilhete só com ARO APPROVED + direito ACTIVE; tudo idempotente (inscrição por e-mail, Idempotency-Key,
// confirmação, webhooks). Dependências injetadas para os testes.
import QRCode from "qrcode";
import {
  AroError, createCheckoutSession, getCheckoutSession, hasActiveEntitlement, terminalCheckoutStates,
  type AroConfig, type CheckoutSession,
} from "../aro/client";
import { workshops, type Workshop } from "../workshops";
import { notifyCrm } from "./crm";
import { earlyUntil, termsVersion } from "./policy";
import { storeErrorCode, type Code, type Registration, type RegistrationCode, type Store } from "./store";
import type { SignupInput } from "./validate";
import type { AroEvent } from "../aro/webhook";

export type Deps = {
  aro: AroConfig | null;
  store: Store | null;
  env: Record<string, string | undefined>;
  fetch: typeof fetch;
  now: () => Date;
};

/** LL01 integra a confirmação ARO/CRM do mesmo motor, sem alterar os 2 workshops presenciais. */
export const byCode = (code: RegistrationCode): Pick<Workshop,"code" | "aroOffers" | "aroEntitlement" | "pricing"> => {
  if (code === "LL01") return {
    code: "LL01" as never,
    aroOffers: { antecipado: "ll01-promocional-br", regular: "ll01-regular-br" },
    aroEntitlement: "atlashub-si:workshop:ll01",
    pricing: { antecipado: 24900, regular: 49700 },
  };
  return workshops.find((w) => w.code === code)!;
};

export function salesOpen(code: Code, d: Pick<Deps, "aro" | "store" | "env">): boolean {
  const flags = (d.env.WORKSHOPS_SALES_OPEN || "").split(",").map((s) => s.trim());
  return Boolean(d.aro?.paymentsEnabled && d.store && flags.includes(code));
}

export function currentLot(code: Code, d: Pick<Deps, "env" | "now">): "antecipado" | "regular" {
  return d.now() <= earlyUntil(code, d.env) ? "antecipado" : "regular";
}

export async function availability(d: Deps) {
  const out: Record<string, { open: boolean; soldOut: boolean; lot: "antecipado" | "regular"; priceMinor: number }> = {};
  const db = salesOpen("W01", d) || salesOpen("EL01", d) ? await d.store!.availability().catch(() => null) : null;
  for (const w of workshops) {
    const lot = currentLot(w.code, d);
    const row = db?.[w.code];
    const open = salesOpen(w.code, d) && Boolean(row?.open);
    out[w.code] = { open, soldOut: open && row!.taken >= row!.capacity, lot, priceMinor: w.pricing[lot] };
  }
  return out;
}

type Fail = { ok: false; status: number; error: string };
const fail = (status: number, error: string): Fail => ({ ok: false, status, error });

export async function startCheckout(
  input: SignupInput & { code: Code },
  ipHash: string | null,
  d: Deps,
): Promise<{ ok: true; id: string; checkoutSecret?: string } | Fail> {
  if (!salesOpen(input.code, d)) return fail(503, "sales_closed");
  const store = d.store!, aro = d.aro!;
  const w = byCode(input.code);
  let reg;
  try {
    reg = await store.reserve({
      workshop: input.code, email: input.email, name: input.name, phone: input.phone, company: input.company,
      role: input.role, document: input.document, campaign: input.campaign, termsVersion,
      marketing: input.marketing, waGroup: input.waGroup, ipHash,
    });
  } catch (e) {
    const c = storeErrorCode(e);
    if (c === "sold_out") return fail(409, "sold_out");
    if (c === "sales_closed") return fail(503, "sales_closed");
    if (c === "rate_limited") return fail(429, "rate_limited");
    return fail(503, "store_unavailable");
  }
  if (reg.outcome === "already_confirmed") return fail(409, "already_registered");

  const lot = currentLot(input.code, d);
  const offers = lot === "antecipado" ? [w.aroOffers.antecipado, w.aroOffers.regular] : [w.aroOffers.regular];
  let session: CheckoutSession | null = null, offer = "";
  for (const o of offers) {
    try {
      session = await createCheckoutSession(aro, {
        offer: o,
        payer: { name: input.name, email: input.email, phone: input.phone, ...(input.document ? { document: input.document } : {}) },
        idempotencyKey: `si:${reg.id}:${o}`,
        metadata: { registration_id: reg.id, workshop: input.code, campaign: input.campaign },
        attribution: { utm_campaign: input.campaign, utm_source: input.campaign.split("-").pop()!.toLowerCase() },
      }, d.fetch);
      offer = o;
      break;
    } catch (e) {
      // Lote antecipado inativo/esgotado no ARO → tenta o regular. Outros erros param aqui.
      if (e instanceof AroError && e.code === "http_error" && (e.status === 409 || e.status === 422) && o !== offers.at(-1)) continue;
      if (reg.outcome === "new") await store.release(reg.id, "aro_unavailable").catch(() => {});
      return fail(503, "aro_unavailable");
    }
  }
  const expected = offer === w.aroOffers.antecipado ? w.pricing.antecipado : w.pricing.regular;
  if (!session || session.project !== aro.project || session.offer !== offer
      || session.amount?.amount_minor !== expected || session.amount?.currency !== "BRL") {
    await store.release(reg.id, "price_mismatch").catch(() => {});
    return fail(502, "price_mismatch");
  }
  try {
    await store.attachCheckout(reg.id, session.id, session.order_id, offer, expected,
      session.expires_at ?? (session.payment?.kind === "PIX" ? session.payment.expires_at : null));
  } catch {
    return fail(409, "checkout_conflict");
  }
  return { ok: true, id: reg.id, checkoutSecret: session.checkout_secret };
}

export type StatusView =
  | { state: "PENDING"; workshop: RegistrationCode; offer: string | null; amountMinor: number | null; payment: { copyPaste: string; qrSvg: string; expiresAt: string } | null }
  | { state: "PROCESSING"; workshop: RegistrationCode }
  | { state: "CONFIRMED"; workshop: RegistrationCode; ticket: string | null }
  | { state: "FAILED" | "EXPIRED" | "CANCELED" | "RELEASED" | "REVOKED"; workshop: RegistrationCode };

/** Concede o bilhete só com direito ACTIVE no ARO. Idempotente; avisa o CRM uma vez. */
export async function finalize(reg: Registration, d: Deps): Promise<{ ticket: string } | null> {
  const w = byCode(reg.workshop);
  if (!reg.aro_order_id) return null;
  const active = await hasActiveEntitlement(d.aro, { email: reg.email }, w.aroEntitlement, d.fetch, d.now());
  if (!active) return null;
  const c = await d.store!.confirm(reg.id, reg.aro_order_id);
  const fresh = await d.store!.get(reg.id);
  if (fresh && !fresh.crm_notified_at && (await notifyCrm("workshop.registration.confirmed", fresh, d.env, d.fetch))) {
    await d.store!.markCrmNotified(reg.id);
  }
  return { ticket: c.ticket };
}

export async function getStatus(id: string, secret: string | null, d: Deps): Promise<StatusView | null> {
  if (!d.store || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const reg = await d.store.get(id);
  if (!reg) return null;
  const workshop = reg.workshop;
  if (reg.status === "confirmed") return { state: "CONFIRMED", workshop, ticket: secret ? reg.ticket : null };
  if (reg.status === "released") return { state: "RELEASED", workshop };
  if (reg.status === "revoked") return { state: "REVOKED", workshop };
  if (!secret || !d.aro || !reg.aro_session_id) return { state: "PENDING", workshop, offer: reg.offer, amountMinor: reg.amount_minor, payment: null };

  let s: CheckoutSession;
  try {
    s = await getCheckoutSession(d.aro, reg.aro_session_id, secret, d.fetch);
  } catch {
    return { state: "PENDING", workshop, offer: reg.offer, amountMinor: reg.amount_minor, payment: null };
  }
  if (s.id !== reg.aro_session_id || s.order_id !== reg.aro_order_id) return null;
  if (s.state === "APPROVED") {
    const done = await finalize(reg, d);
    return done ? { state: "CONFIRMED", workshop, ticket: done.ticket } : { state: "PROCESSING", workshop };
  }
  if (s.state === "REFUNDED" || s.state === "CHARGEBACK") {
    await d.store.revoke(reg.aro_order_id!, `aro_${s.state.toLowerCase()}`);
    return { state: "REVOKED", workshop };
  }
  if (terminalCheckoutStates.includes(s.state)) {
    await d.store.release(reg.id, `aro_${s.state.toLowerCase()}`);
    return { state: s.state as "FAILED" | "EXPIRED" | "CANCELED", workshop };
  }
  const pix = s.payment?.kind === "PIX" ? s.payment : null;
  return {
    state: "PENDING", workshop, offer: reg.offer, amountMinor: reg.amount_minor,
    payment: pix ? { copyPaste: pix.copy_paste, expiresAt: pix.expires_at,
      qrSvg: await QRCode.toString(pix.qr_payload, { type: "svg", margin: 1, errorCorrectionLevel: "M" }) } : null,
  };
}

/** Webhook ARO já verificado. Processa (idempotente) e regista o id; repetições são inofensivas. */
export async function handleEvent(event: AroEvent, d: Deps): Promise<"processed" | "duplicate" | "ignored"> {
  const store = d.store!;
  const orderId = typeof event.data.order_id === "string" ? event.data.order_id : null;
  const reg = orderId ? await store.findByOrder(orderId) : null;
  let result: "processed" | "ignored" = "ignored";
  if (reg) {
    result = "processed";
    switch (event.type) {
      case "payment.approved": case "order.approved": case "entitlement.granted":
        await finalize(reg, d); break;
      case "payment.failed":
        await store.release(reg.id, "aro_payment_failed"); break;
      case "payment.refunded": case "payment.chargeback": case "entitlement.revoked": {
        if ((await store.revoke(orderId!, event.type)) > 0) {
          const fresh = await store.get(reg.id);
          if (fresh) await notifyCrm("workshop.registration.revoked", fresh, d.env, d.fetch);
        }
        break;
      }
      default: result = "ignored";
    }
  }
  const fresh = await store.recordEvent(event.id, event.type);
  return fresh ? result : "duplicate";
}
