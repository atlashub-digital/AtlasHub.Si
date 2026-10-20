// Armazenamento das inscrições (schema `si_workshops`, db/si_workshops/001_registrations.sql).
// Só servidor. Sem `SI_DATABASE_URL` não há vendas (fail-closed).
import postgres from "postgres";

export type Code = "W01" | "EL01";
export type RegistrationCode = Code | "LL01";
export type Registration = {
  id: string;
  workshop: RegistrationCode;
  status: "pending" | "confirmed" | "released" | "revoked";
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  campaign: string;
  consent_marketing: boolean;
  consent_whatsapp_group: boolean;
  offer: string | null;
  amount_minor: number | null;
  aro_session_id: string | null;
  aro_order_id: string | null;
  ticket: string | null;
  over_capacity: boolean;
  crm_notified_at: Date | null;
  ticket_emailed_at?: Date | null;
};
export type ReserveInput = {
  workshop: Code; email: string; name: string; phone: string; company: string; role: string; document: string;
  campaign: string; termsVersion: string; marketing: boolean; waGroup: boolean; ipHash: string | null;
};
export type ReserveResult = { id: string; status: Registration["status"]; ticket: string | null; outcome: "new" | "resume" | "already_confirmed" };

export interface Store {
  availability(): Promise<Record<Code, { open: boolean; capacity: number; taken: number }>>;
  reserve(i: ReserveInput): Promise<ReserveResult>;
  get(id: string): Promise<Registration | null>;
  findByOrder(orderId: string): Promise<Registration | null>;
  attachCheckout(id: string, sessionId: string, orderId: string, offer: string, amount: number, expiresAt: string | null): Promise<void>;
  confirm(id: string, orderId: string): Promise<{ ticket: string; newlyConfirmed: boolean; overCapacity: boolean }>;
  release(id: string, reason: string): Promise<void>;
  revoke(orderId: string, reason: string): Promise<number>;
  recordEvent(eventId: string, type: string): Promise<boolean>;
  markCrmNotified(id: string): Promise<void>;
  markTicketEmailed(id: string): Promise<void>;
}

/** Erros de negócio levantados pelas funções SQL (`raise exception '<código>'`). */
export const storeErrors = ["sales_closed", "sold_out", "rate_limited", "workshop_unknown", "not_pending", "order_mismatch", "revoked"] as const;
export type StoreErrorCode = (typeof storeErrors)[number];
export function storeErrorCode(e: unknown): StoreErrorCode | null {
  const msg = e instanceof Error ? e.message : String(e);
  return storeErrors.find((c) => msg === c || msg.includes(c)) ?? null;
}

let cached: Store | null | undefined;
export function getStore(env: Record<string, string | undefined> = process.env): Store | null {
  if (cached !== undefined) return cached;
  const url = env.SI_DATABASE_URL;
  cached = url ? pgStore(url) : null;
  return cached;
}

export function pgStore(url: string): Store {
  // `prepare: false` para funcionar atrás do pooler (modo transação).
  const sql = postgres(url, { max: 3, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  const one = async <T>(q: Promise<T[]>): Promise<T | null> => (await q)[0] ?? null;
  return {
    async availability() {
      const rows = await sql<{ code: Code; sales_open: boolean; capacity: number; taken: number }[]>`
        select code, sales_open, capacity, si_workshops.seats_taken(code) as taken from si_workshops.workshops`;
      const out = {} as Record<Code, { open: boolean; capacity: number; taken: number }>;
      for (const r of rows) out[r.code] = { open: r.sales_open, capacity: r.capacity, taken: r.taken };
      return out;
    },
    async reserve(i) {
      const r = await one(sql<ReserveResult[]>`select * from si_workshops.reserve(${i.workshop}, ${i.email}, ${i.name}, ${i.phone},
        ${i.company}, ${i.role}, ${i.document}, ${i.campaign}, ${i.termsVersion}, ${i.marketing}, ${i.waGroup}, ${i.ipHash})`);
      if (!r) throw Error("reserve_failed");
      return r;
    },
    get: (id) => one(sql<Registration[]>`select * from si_workshops.registrations where id = ${id}`),
    findByOrder: (orderId) => one(sql<Registration[]>`select * from si_workshops.registrations where aro_order_id = ${orderId}`),
    async attachCheckout(id, sessionId, orderId, offer, amount, expiresAt) {
      await sql`select si_workshops.attach_checkout(${id}, ${sessionId}, ${orderId}, ${offer}, ${amount}, ${expiresAt})`;
    },
    async confirm(id, orderId) {
      const r = await one(sql<{ ticket: string; newly_confirmed: boolean; over_capacity: boolean }[]>`
        select ticket, newly_confirmed, over_capacity from si_workshops.confirm(${id}, ${orderId})`);
      if (!r) throw Error("confirm_failed");
      return { ticket: r.ticket, newlyConfirmed: r.newly_confirmed, overCapacity: r.over_capacity };
    },
    async release(id, reason) { await sql`select si_workshops.release(${id}, ${reason})`; },
    async revoke(orderId, reason) {
      const r = await one(sql<{ n: number }[]>`select si_workshops.revoke(${orderId}, ${reason}) as n`);
      return r?.n ?? 0;
    },
    async recordEvent(eventId, type) {
      const r = await one(sql<{ fresh: boolean }[]>`select si_workshops.record_event(${eventId}, ${type}) as fresh`);
      return Boolean(r?.fresh);
    },
    async markTicketEmailed(id) {
      await sql`select si_workshops.mark_ticket_emailed(${id})`;
    },
    async markCrmNotified(id) { await sql`select si_workshops.mark_crm_notified(${id})`; },
  };
}
