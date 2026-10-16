// Validação do formulário de inscrição (servidor). O browser nunca envia preço, oferta nem valor.
import { termsVersion } from "./policy";
import type { Code } from "./store";

export type SignupInput = {
  slug: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  document: string;
  campaign: string;
  marketing: boolean;
  waGroup: boolean;
};

const slugToCode: Record<string, Code> = { "empresa-aumentada-2027-2030": "W01", "enterprise-lab-ecommerce": "EL01" };
export const codeForSlug = (slug: string): Code | undefined => slugToCode[slug];

function cpfOk(d: string) {
  if (!/^\d{11}$/.test(d) || /^(\d)\1+$/.test(d)) return false;
  const dv = (n: number) => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === +d[9] && dv(10) === +d[10];
}
function cnpjOk(d: string) {
  if (!/^\d{14}$/.test(d) || /^(\d)\1+$/.test(d)) return false;
  const calc = (n: number) => { const w = n === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2]; let s = 0; for (let i = 0; i < n; i++) s += +d[i] * w[i]; const r = s % 11; return r < 2 ? 0 : 11 - r; };
  return calc(12) === +d[12] && calc(13) === +d[13];
}

export class InvalidSignup extends Error {}

/** Devolve a inscrição normalizada ou lança `InvalidSignup` com o campo em causa. */
export function validateSignup(body: unknown, opts: { requireDocument: boolean }): SignupInput & { code: Code } {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new InvalidSignup("body");
  const b = body as Record<string, unknown>;
  const str = (k: string, max: number) => {
    const v = b[k];
    if (v !== undefined && typeof v !== "string") throw new InvalidSignup(k);
    const t = ((v as string) || "").trim().replace(/\s+/g, " ");
    if (t.length > max) throw new InvalidSignup(k);
    return t;
  };
  if (b.website) throw new InvalidSignup("website"); // honeypot
  const slug = str("slug", 60);
  const code = codeForSlug(slug);
  if (!code) throw new InvalidSignup("slug");
  if (b.acceptTerms !== true || b.termsVersion !== termsVersion) throw new InvalidSignup("acceptTerms");
  const name = str("name", 160);
  if (name.length < 2) throw new InvalidSignup("name");
  const email = str("email", 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new InvalidSignup("email");
  const phone = str("phone", 30);
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 13) throw new InvalidSignup("phone");
  const company = str("company", 160);
  if (code === "EL01" && company.length < 2) throw new InvalidSignup("company");
  const role = str("role", 120);
  const docDigits = str("document", 20).replace(/\D/g, "");
  if (opts.requireDocument && !docDigits) throw new InvalidSignup("document");
  if (docDigits && !cpfOk(docDigits) && !cnpjOk(docDigits)) throw new InvalidSignup("document");
  const campaignRaw = str("campaign", 12).toUpperCase();
  const campaign = new RegExp(`^${code}-[A-Z]{2,5}$`).test(campaignRaw) ? campaignRaw : `${code}-SITE`;
  return {
    slug, code, name, email,
    phone: phoneDigits.length <= 11 ? `+55${phoneDigits}` : `+${phoneDigits}`,
    company, role, document: docDigits, campaign,
    marketing: b.marketing === true, waGroup: b.waGroup === true,
  };
}
