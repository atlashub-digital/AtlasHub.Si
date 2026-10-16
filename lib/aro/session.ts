/**
 * Capacidade de checkout guardada num cookie httpOnly, selada com AES-256-GCM
 * (mesma técnica do EspelhoMeu). O browser nunca vê o `checkout_secret` do ARO:
 * vê apenas o blob selado, e o polling/status passa sempre pelo servidor.
 * Sem dependências: corre em Node (rota) e nos testes (`npm test`).
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const checkoutCookie = "atlashub_aro_checkout";

export type CheckoutCapability = {
  id: string;
  orderId: string;
  offer: string;
  slug: string;
  email: string;
  secret: string;
  exp: number;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function key(secret: string) {
  return createHash("sha256").update("atlashub-si:aro:cookie:v1:").update(secret).digest();
}

export function sealSession(capability: CheckoutCapability, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(capability), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function openSession(value: string | undefined, secret: string, now = Date.now()): CheckoutCapability | null {
  if (!value || value.length > 4000) return null;
  try {
    const data = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(secret), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const c = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8")) as CheckoutCapability;
    if (
      !UUID.test(c.id) ||
      !UUID.test(c.orderId) ||
      typeof c.secret !== "string" ||
      c.secret.length < 16 ||
      typeof c.slug !== "string" ||
      typeof c.email !== "string" ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email) ||
      !Number.isFinite(c.exp) ||
      c.exp <= now
    )
      return null;
    return c;
  } catch {
    return null;
  }
}

/**
 * Intenção de inscrição + limites de uso. Em memória por instância (V1):
 * guarda a intenção ANTES de qualquer pagamento e o contador server-side de sessões
 * criadas por workshop (capacidade-alvo). Limitação conhecida, documentada no PR:
 * multi-instância requer um store partilhado (Helena/Vercel) para oversell real.
 */
export type RegistrationIntent = {
  idempotencyKey: string;
  slug: string;
  lot: string;
  emailHash: string;
  createdAt: number;
};

const intents = new Map<string, RegistrationIntent>();
const counters = new Map<string, { count: number; windowStart: number }>();
const rateBuckets = new Map<string, { count: number; windowStart: number }>();

function emailHash(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 24);
}

export function seenIntent(idempotencyKey: string): boolean {
  return intents.has(idempotencyKey);
}

export function recordIntent(intent: Omit<RegistrationIntent, "emailHash" | "createdAt"> & { email: string }): void {
  if (intents.size > 5000) intents.clear(); // salvaguarda de memória; intenção real vive no ARO
  intents.set(intent.idempotencyKey, { ...intent, emailHash: emailHash(intent.email), createdAt: Date.now() });
}

export function bumpCapacity(slug: string, max: number, now = Date.now()): boolean {
  const entry = counters.get(slug);
  const fresh = !entry || now - entry.windowStart > 3_600_000;
  const count = fresh ? 0 : entry!.count;
  if (count >= max) return false;
  counters.set(slug, { count: count + 1, windowStart: fresh ? now : entry!.windowStart });
  return true;
}

export function rateLimited(ip: string, now = Date.now(), max = 8, windowMs = 60_000): boolean {
  const entry = rateBuckets.get(ip);
  const fresh = !entry || now - entry.windowStart > windowMs;
  const count = fresh ? 0 : entry!.count;
  if (count >= max) return true;
  rateBuckets.set(ip, { count: count + 1, windowStart: fresh ? now : entry!.windowStart });
  if (rateBuckets.size > 5000) rateBuckets.clear();
  return false;
}

/** Origem esperada (same-origin), igual ao route de leads. */
export function sameOrigin(origin: string | null, host: string | null, fallbackOrigin: string | undefined): boolean {
  if (!origin || !host) return false;
  try {
    const o = new URL(origin);
    return o.host === host && (o.protocol === "https:" || o.host === new URL(fallbackOrigin ?? origin).host);
  } catch {
    return false;
  }
}
