// E2E local do checkout dos workshops contra as rotas reais (next start), Postgres local e ARO simulado.
import { createHmac } from "node:crypto";
const base = process.env.BASE || "http://localhost:3200", aro = process.env.ARO || "http://localhost:4010";
const origin = "https://www.atlashub.si";
let pass = 0;
const ok = (c, m) => { if (!c) { console.error("FALHA:", m); process.exit(1); } pass++; console.log("OK", m); };
const post = (p, b, h = {}) => fetch(base + p, { method: "POST", headers: { "content-type": "application/json", origin, ...h }, body: JSON.stringify(b) });
const form = (o = {}) => ({ slug: "empresa-aumentada-2027-2030", name: "Teste E2E", email: "e2e@example.com", phone: "62999990000", acceptTerms: true, termsVersion: "workshops-2026-10-v1", campaign: "W01-IG", ...o });

let r = await fetch(base + "/api/workshops/availability"); let a = await r.json();
ok(a.W01.open && a.W01.lot === "antecipado" && a.W01.priceMinor === 29700, "disponibilidade W01 aberta, lote antecipado R$ 297");
ok((await post("/api/workshops/checkout", form(), { origin: "https://evil.example" })).status === 403, "origem estranha recusada");
ok((await post("/api/workshops/checkout", form({ acceptTerms: false }))).status === 400, "sem aceitar condições: 400, nada criado");
r = await post("/api/workshops/checkout", form({ amount_minor: 1, offer: "barato" }));
ok(r.status === 201, "inscrição criada (valor/oferta do browser ignorados)");
const { id, next } = await r.json();
const cookie = r.headers.get("set-cookie").split(";")[0];
ok(/HttpOnly/i.test(r.headers.get("set-cookie")) && !next.includes("cs_"), "segredo só em cookie httpOnly, fora do URL");
const page = await fetch(base + next); ok(page.status === 200, "página de pagamento 200");
let s = await (await fetch(`${base}/api/workshops/checkout/${id}`, { headers: { cookie } })).json();
ok(s.state === "PENDING" && s.amountMinor === 29700 && s.payment.qrSvg.startsWith("<svg") && s.payment.copyPaste.startsWith("000201"), "PIX com QR e Copia e Cola, R$ 297");
const r2 = await post("/api/workshops/checkout", form()); ok(r2.status === 201 && (await r2.json()).id === id, "dupla tentativa retoma a mesma inscrição");
const sessions = await (await fetch(aro + "/_test/sessions")).json(); ok(sessions.length === 1, "um único pagamento criado no ARO");
s = await (await fetch(`${base}/api/workshops/checkout/${id}`)).json(); ok(s.state === "PENDING" && s.payment === null, "sem cookie: estado sem PIX nem dados");

// Aprovação chega por webhook assinado (utilizador fora da página), depois repetido
await fetch(`${aro}/_test/approve/${sessions[0].order}`);
const ev = JSON.stringify({ id: "evt-1", type: "payment.approved", created_at: new Date().toISOString(), project: "atlashub-si", data: { order_id: sessions[0].order } });
const ts = String(Math.floor(Date.now() / 1000));
const sig = "v1=" + createHmac("sha256", "whsec_test").update(`${ts}.${ev}`).digest("hex");
const hook = (body, sg = sig) => fetch(base + "/api/aro/webhook", { method: "POST", body, headers: { "x-aro-event-id": "evt-1", "x-aro-timestamp": ts, "x-aro-signature": sg } });
ok((await hook(ev, "v1=00")).status === 401, "webhook com assinatura errada recusado");
let h = await (await hook(ev)).json(); ok(h.outcome === "processed", "webhook aprovado processado");
h = await (await hook(ev)).json(); ok(h.outcome === "duplicate", "webhook repetido sem efeito");
s = await (await fetch(`${base}/api/workshops/checkout/${id}`, { headers: { cookie } })).json();
ok(s.state === "CONFIRMED" && /^W01-[0-9A-F]{8}$/.test(s.ticket), `bilhete emitido só após APPROVED + ACTIVE: ${s.ticket}`);
ok((await post("/api/workshops/checkout", form())).status === 409, "mesmo e-mail depois de pago: 409, sem novo pagamento");

// Sobrevenda: capacidade EL01 reduzida a 1 pelo script de preparação
const el = (e) => post("/api/workshops/checkout", form({ slug: "enterprise-lab-ecommerce", email: e, company: "Loja X", campaign: "EL01-SITE" }));
ok((await el("a@loja.com")).status === 201, "EL01 primeira empresa");
ok((await el("b@loja.com")).status === 409, "EL01 esgotado: segunda empresa recusada (sem sobrevenda)");
r = await fetch(base + "/api/workshops/availability"); a = await r.json(); ok(a.EL01.soldOut === true, "disponibilidade mostra EL01 esgotado");
console.log(`E2E CHECKOUT WORKSHOPS: ${pass} verificações passaram`);
