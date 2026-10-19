/**
 * Cliente servidor do ARO (atlashub-finance openapi/aro-v1.yaml). FAIL-CLOSED:
 * - sem configuração completa → `aroConfig()` devolve null e nada é chamado;
 * - checkout exige ainda `ARO_PAYMENTS_ENABLED=yes` (só depois da homologação E7 no EspelhoMeu e do GO comercial).
 * Nunca integra provedores (PixGo, MisticPay, Stripe): o ARO escolhe o provedor.
 * Nunca importar em componentes de cliente: as chaves ficam no servidor.
 */
import { randomUUID } from "node:crypto";

export type AroConfig = {
  apiUrl: string;
  project: string;
  publicKey: string;
  serverKey: string;
  paymentsEnabled: boolean;
};

type Env = Record<string, string | undefined>;

export function aroConfig(env: Env = process.env): AroConfig | null {
  const apiUrl = env.ARO_API_URL?.replace(/\/+$/, "");
  const project = env.ARO_PROJECT_SLUG;
  const publicKey = env.ARO_PUBLIC_KEY;
  const serverKey = env.ARO_SERVER_KEY;
  if (!apiUrl || !project || !publicKey || !serverKey) return null;
  if (!/^https:\/\//.test(apiUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(apiUrl)) return null;
  return { apiUrl, project, publicKey, serverKey, paymentsEnabled: env.ARO_PAYMENTS_ENABLED === "yes" };
}

export type CheckoutState = "CREATED" | "PENDING" | "APPROVED" | "FAILED" | "CANCELED" | "EXPIRED" | "REFUNDED" | "CHARGEBACK";
export const terminalCheckoutStates: readonly CheckoutState[] = ["APPROVED", "FAILED", "CANCELED", "EXPIRED", "REFUNDED", "CHARGEBACK"];

export type CheckoutSession = {
  id: string;
  order_id: string;
  project: string;
  offer: string;
  state: CheckoutState;
  amount: { amount_minor: number; currency: string };
  /** Só devolvido na criação: guardar de forma efémera e nunca registar em logs. */
  checkout_secret?: string;
  payment?: { kind: "PIX"; copy_paste: string; qr_payload: string; expires_at: string } | { kind: "CARD"; redirect_url?: string };
  expires_at?: string;
};

export type CreateCheckoutInput = {
  offer: string;
  payer: { name: string; email: string; document?: string; phone?: string };
  paymentMethod?: "PIX" | "CARD";
  /** Repetir a mesma chave para repetir o mesmo pedido (ex.: id da intenção no Club). */
  idempotencyKey?: string;
  metadata?: Record<string, string>;
  attribution?: Record<string, string>;
};

export type Entitlement = { key: string; status: "ACTIVE" | "REVOKED" | "EXPIRED"; source_order_id?: string; starts_at: string; expires_at?: string };

export type Order = {
  id: string; project: string;
  status: "CREATED" | "PENDING" | "APPROVED" | "CANCELED" | "REFUNDED" | "CHARGEBACK";
  amount: { amount_minor: number; currency: string };
  items: { offer: string; quantity: number; unit_amount: { amount_minor: number; currency: string } }[];
  customer_id?: string;
};

export type AroErrorCode = "not_configured" | "payments_disabled" | "http_error" | "network_error";

export class AroError extends Error {
  readonly code: AroErrorCode;
  readonly status?: number;
  constructor(code: AroErrorCode, status?: number) {
    super(`aro_${code}${status ? `_${status}` : ""}`);
    this.code = code;
    this.status = status;
  }
}

type Fetch = typeof fetch;

async function call<T>(url: string, init: RequestInit, fetchImpl: Fetch, timeoutMs = 20_000): Promise<T> {
  let res: Response;
  try {
    res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
  } catch {
    throw new AroError("network_error");
  }
  if (!res.ok) throw new AroError("http_error", res.status);
  return (await res.json()) as T;
}

export async function createCheckoutSession(cfg: AroConfig | null, input: CreateCheckoutInput, fetchImpl: Fetch = fetch): Promise<CheckoutSession> {
  if (!cfg) throw new AroError("not_configured");
  if (!cfg.paymentsEnabled) throw new AroError("payments_disabled");
  return call<CheckoutSession>(
    `${cfg.apiUrl}/v1/checkout-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ARO-Public-Key": cfg.publicKey,
        "Idempotency-Key": input.idempotencyKey ?? randomUUID(),
      },
      body: JSON.stringify({
        project: cfg.project,
        offer: input.offer,
        market: "BR",
        currency: "BRL",
        payment_method: input.paymentMethod ?? "PIX",
        payer: input.payer,
        ...(input.metadata ? { metadata: input.metadata } : {}),
        ...(input.attribution ? { attribution: input.attribution } : {}),
      }),
    },
    fetchImpl,
  );
}

/** Polling do estado normalizado (o browser nunca chama o ARO diretamente: passa pelo servidor do projeto). */
export async function getCheckoutSession(cfg: AroConfig | null, id: string, checkoutSecret: string, fetchImpl: Fetch = fetch): Promise<CheckoutSession> {
  if (!cfg) throw new AroError("not_configured");
  return call<CheckoutSession>(
    `${cfg.apiUrl}/v1/checkout-sessions/${encodeURIComponent(id)}`,
    { method: "GET", headers: { "X-ARO-Checkout-Secret": checkoutSecret } },
    fetchImpl,
  );
}

export async function resolveEntitlements(
  cfg: AroConfig | null,
  who: { customerId: string } | { email: string },
  fetchImpl: Fetch = fetch,
): Promise<Entitlement[]> {
  if (!cfg) throw new AroError("not_configured");
  const body = "customerId" in who ? { project: cfg.project, customer_id: who.customerId } : { project: cfg.project, identity: { email: who.email } };
  const res = await call<{ project: string; entitlements: Entitlement[] }>(
    `${cfg.apiUrl}/v1/entitlements/resolve`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.serverKey}` }, body: JSON.stringify(body) },
    fetchImpl,
  );
  if (res.project !== cfg.project || !Array.isArray(res.entitlements)) throw new AroError("http_error", 502);
  return res.entitlements;
}

/** Canonical order read using the existing project-scoped server credential. */
export async function getOrder(cfg: AroConfig | null, id: string, fetchImpl: Fetch = fetch): Promise<Order> {
  if (!cfg) throw new AroError("not_configured");
  return call<Order>(`${cfg.apiUrl}/v1/orders/${encodeURIComponent(id)}`,
    { method: "GET", headers: { Authorization: `Bearer ${cfg.serverKey}` } }, fetchImpl);
}

/** Regra de acesso do contrato ARO: só `ACTIVE` (e não expirado) desbloqueia; qualquer erro nega. */
export async function hasActiveEntitlement(
  cfg: AroConfig | null,
  who: { customerId: string } | { email: string },
  key: string,
  fetchImpl: Fetch = fetch,
  now = new Date(),
): Promise<boolean> {
  try {
    const list = await resolveEntitlements(cfg, who, fetchImpl);
    return list.some((e) => e.key === key && e.status === "ACTIVE" && (!e.expires_at || new Date(e.expires_at) > now));
  } catch {
    return false;
  }
}

