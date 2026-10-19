/**
 * LL01 Sales / ARO: reserva promocional verdadeira no servidor e checkout sem preço do browser.
 * Nenhum dado de cartão ou credenciais do provider. Não armazenar CPF/CNPJ em claro na BD ou logs.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import postgres from "postgres";
import { aroConfig, AroError, createCheckoutSession } from "../aro/client";
import { ipHash, secretCookie } from "../commerce/runtime";
import { cpfOk, cnpjOk } from "../commerce/validate";
import { getStore } from "../commerce/store";

import { ll01Offer } from "./ll01-offer";
const json = (status: number, body: unknown, headers: Record<string,string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
type Input = { name: string; phone: string; email: string; document: string; marketing: boolean; campaign: string };
type Quote = { id: string; promo_expires_at: Date; outcome: string };
type Row = { id: string; email: string; name: string; phone: string; identity_hash: string; promo_expires_at: Date; status: string; aro_session_id: string | null };

let db: ReturnType<typeof postgres> | undefined;
function sql() {
  if (!process.env.SI_DATABASE_URL) throw Error("db_not_configured");
  return (db ??= postgres(process.env.SI_DATABASE_URL, { max: 2, prepare: false, idle_timeout: 20, connect_timeout: 10 }));
}
function key() { const k = process.env.LL01_DOCUMENT_HASH_KEY; if (!k || k.length < 32) throw Error("ll01_key_missing"); return k; }
function sigKey() { const k = process.env.LL01_RESERVATION_SECRET; if (!k || k.length < 32) throw Error("ll01_secret_missing"); return k; }
function hashedDoc(d: string) { return createHmac("sha256", key()).update(d).digest("hex"); }
function cookieSignature(id: string) { return createHmac("sha256", sigKey()).update("LL01:" + id).digest("hex"); }
function verifyCookie(req: Request, id: string) {
  const c = req.headers.get("cookie") || "";
  const m = c.match(/(?:^|;\s*)ll01_q=([^;]+)/);
  if (!m) return false;
  const expected = id + "." + cookieSignature(id);
  const received = decodeURIComponent(m[1]);
  return received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}
function clean(body: unknown): Input {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw Error("invalid");
  const b = body as Record<string,unknown>;
  if (b.website || b.acceptTerms !== true || b.termsVersion !== "ll01-2026-10-v1") throw Error("invalid");
  const field = (k: string, max: number) => {
    const v = b[k]; if (typeof v !== "string" || v.length > max) throw Error("invalid");
    return v.trim();
  };
  const name = field("name", 160), email = field("email", 160).toLowerCase();
  const phone = field("phone", 30).replace(/\D/g, "");
  const document = field("document", 20).replace(/\D/g, "");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
      || phone.length < 10 || phone.length > 13 || !(cpfOk(document) || cnpjOk(document))) throw Error("invalid");
  const campaign = typeof b.campaign === "string" && /^LL01-[A-Z]{2,5}$/.test(b.campaign) ? b.campaign : "LL01-SITE";
  return { name, email, phone: phone.length <= 11 ? "+55" + phone : "+" + phone, document,
    marketing: b.marketing === true, campaign };
}
export function salesReady() {
  const aro = aroConfig();
  return process.env.LL01_SALES_OPEN === "yes" && process.env.LL01_RELEASE_V3_VERIFIED === "yes" && ll01Offer().approved && Boolean(aro?.paymentsEnabled && aro.project === "atlashub-si"
    && process.env.SI_DATABASE_URL && process.env.LL01_DOCUMENT_HASH_KEY && process.env.LL01_RESERVATION_SECRET);
}
export async function statusAvailability() {
  const campaign = ll01Offer();
  const price = { earlyMinor: campaign.amount, regularMinor: 49700, promoMinor: 24900, currentMinor: campaign.amount };
  const promo = campaign.promotional ? { expiresAt: campaign.deadline, serverNow: campaign.serverNow } : null;
  if (!salesReady()) return { open:false, pricing:price, promo, reason:"not_ready" };
  try {
    const rows = await sql()<Array<{sales_open:boolean;capacity:number;taken:number}>>`
      select sales_open,capacity,si_workshops.seats_taken('LL01') as taken
      from si_workshops.workshops where code='LL01'`;
    const w = rows[0]; return {open:Boolean(w?.sales_open && w.taken < w.capacity), pricing: price, promo,
      reason: w?.sales_open ? (w.taken >= w.capacity ? "full" : null) : "closed"};
  } catch {return {open:false,pricing:price,promo,reason:"unavailable"};}
}
export async function reserve(req: Request, body: unknown): Promise<Response> {
  if (!salesReady()) return json(503,{error:"sales_closed"});
  let i:Input; try{i=clean(body);}catch{return json(400,{error:"invalid"});}
  try {
    const hash = hashedDoc(i.document);
    const r = await sql()<Quote[]>`
      select * from si_workshops.reserve_ll01(${i.email},${i.name},${i.phone},${hash},
        ${i.document.slice(-4)},${i.campaign},'ll01-2026-10-v1',${i.marketing},${ipHash(req)})`;
    const q = r[0]; if (!q) return json(503,{error:"unavailable"});
    if (q.outcome==="already_confirmed") return json(409,{error:"already_registered"});
    const cookie = `ll01_q=${encodeURIComponent(q.id+"."+cookieSignature(q.id))}; HttpOnly; Secure; SameSite=Lax; Path=/api/sales/ll01; Max-Age=7200`;
    return json(201,{id:q.id,expiresAt:ll01Offer().deadline,
      promoEligible:ll01Offer().promotional,
      currentPrice:ll01Offer().amount}, {"Set-Cookie":cookie});
  } catch { return json(503,{error:"unavailable"}); }
}
export async function checkout(req: Request, body: unknown): Promise<Response> {
  if (!salesReady()) return json(503,{error:"sales_closed"});
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400,{error:"invalid"});
  const b=body as Record<string,unknown>, id=b.id, doc=b.document;
  if (typeof id!=="string"|| !/^[0-9a-f-]{36}$/i.test(id)||typeof doc!=="string"||!verifyCookie(req,id))
    return json(403,{error:"invalid_reservation"});
  const digits=doc.replace(/\D/g,"");
  if (!(cpfOk(digits)||cnpjOk(digits))) return json(400,{error:"document"});
  const aro=aroConfig(),store=getStore();
  if (!aro || !aro.paymentsEnabled || !store) return json(503,{error:"unavailable"});
  try {
    const rows=await sql()<Row[]>`
      select id,email,name,phone,identity_hash,promo_expires_at,status,aro_session_id
      from si_workshops.registrations where id=${id} and workshop='LL01'`;
    const r=rows[0];
    if (!r || r.identity_hash!==hashedDoc(digits) || r.status!=="pending") return json(409,{error:"reservation_invalid"});
    if (r.aro_session_id) return json(409,{error:"already_pending",next:`/workshops/checkout/${id}`});
    const offer = ll01Offer();
    const session=await createCheckoutSession(aro,{
      offer:offer.code,payer:{name:r.name,email:r.email,phone:r.phone,document:digits},
      idempotencyKey:`si:LL01:${id}`,
      metadata:{registration_id:id,workshop:"LL01"},attribution:{utm_campaign:"LL01-SITE"},
    });
    if (session.project!==aro.project || session.offer!==offer.code
      || session.amount?.amount_minor!==offer.amount || session.amount?.currency!=="BRL") return json(502,{error:"price_mismatch"});
    await store.attachCheckout(id,session.id,session.order_id,offer.code,offer.amount,
      session.expires_at ?? (session.payment?.kind==="PIX"?session.payment.expires_at:null));
    const headers:Record<string,string>={};
    if(session.checkout_secret)headers["Set-Cookie"]=`${secretCookie(id)}=${encodeURIComponent(session.checkout_secret)}; Path=/api/workshops/checkout; HttpOnly; Secure; SameSite=Lax; Max-Age=7200`;
    return json(201,{id,next:`/workshops/checkout/${id}`},headers);
  }catch(e){
    if(e instanceof AroError && e.code==="http_error")return json(503,{error:"aro_unavailable"});
    return json(503,{error:"unavailable"});
  }
}
