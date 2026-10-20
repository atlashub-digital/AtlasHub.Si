// ARO simulado para o E2E local (nunca usar em produção). Implementa só o contrato usado pelo site.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
const prices = { "ll01-e2e-test-br": 500, "workshop-01-empresa-aumentada-antecipado-br": 29700, "workshop-01-empresa-aumentada-regular-br": 34700,
  "enterprise-lab-01-ecommerce-antecipado-br": 99000, "enterprise-lab-01-ecommerce-regular-br": 129000 };
const sessions = new Map(), byIdem = new Map(), entitled = new Set();
const view = (id, secret) => { const s = sessions.get(id); return { id, order_id: s.order, project: "atlashub-si", offer: s.offer, state: s.state,
  amount: { amount_minor: prices[s.offer], currency: "BRL" }, ...(secret ? { checkout_secret: s.secret } : {}), expires_at: new Date(Date.now() + 30 * 60e3).toISOString(),
  payment: { kind: "PIX", copy_paste: `00020126580014BR.GOV.BCB.PIX-${id.slice(0, 8)}`, qr_payload: `00020126580014BR.GOV.BCB.PIX-${id.slice(0, 8)}`, expires_at: new Date(Date.now() + 30 * 60e3).toISOString() } }; };
createServer(async (req, res) => {
  let raw = ""; for await (const c of req) raw += c;
  const body = raw ? JSON.parse(raw) : {};
  const send = (s, b) => { res.writeHead(s, { "content-type": "application/json" }); res.end(JSON.stringify(b)); };
  if (req.url === "/v1/checkout-sessions" && req.method === "POST") {
    if (req.headers["x-aro-public-key"] !== "pk_test") return send(401, {});
    const idem = req.headers["idempotency-key"];
    if (byIdem.has(idem)) return send(201, view(byIdem.get(idem), true));
    const id = randomUUID(); sessions.set(id, { offer: body.offer, state: "PENDING", order: randomUUID(), secret: "cs_" + randomUUID(), email: body.payer.email });
    byIdem.set(idem, id); return send(201, view(id, true));
  }
  let m = req.url.match(/^\/v1\/checkout-sessions\/([^/]+)$/);
  if (m) return sessions.get(m[1])?.secret === req.headers["x-aro-checkout-secret"] ? send(200, view(m[1], false)) : send(401, {});
  m = req.url.match(/^\/v1\/orders\/([^/]+)$/);
  if (m) {
    const s = [...sessions.values()].find(s => s.order === m[1]);
    return s ? send(200, { id: s.order, project: "atlashub-si", status: s.state,
      amount: { amount_minor: prices[s.offer], currency: "BRL" },
      items: [{ offer: s.offer, quantity: 1, unit_amount: { amount_minor: prices[s.offer], currency: "BRL" } }] }) : send(404, {});
  }
  if (req.url === "/v1/entitlements/resolve") {
    if (req.headers.authorization !== "Bearer sk_test") return send(401, {});
    const e = body.identity?.email;
    return send(200, { project: "atlashub-si", entitlements: [...entitled].filter((k) => k.startsWith(e + "|")).map((k) => ({ key: k.split("|")[1], status: "ACTIVE", source_order_id: [...sessions.values()].find(s => s.email === e && s.state === "APPROVED")?.order, starts_at: new Date().toISOString() })) });
  }
  // Controlo do teste
  m = req.url.match(/^\/_test\/approve\/(.+)$/);
  if (m) { for (const [, s] of sessions) if (s.order === m[1]) { s.state = "APPROVED"; entitled.add(`${s.email}|atlashub-si:ll01`); entitled.add(`${s.email}|atlashub-si:workshop:workshop-01-empresa-aumentada`); entitled.add(`${s.email}|atlashub-si:workshop:enterprise-lab-01-ecommerce`); } return send(200, {}); }
  if (req.url === "/_test/sessions") return send(200, [...sessions.entries()].map(([id, s]) => ({ id, order: s.order, state: s.state })));
  send(404, {});
}).listen(Number(process.env.MOCK_ARO_PORT || 4010));
