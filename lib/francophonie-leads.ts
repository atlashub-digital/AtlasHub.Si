export const frenchInterests = ["qualification", "atelier", "diagnostic", "integration"] as const;
export type FrenchInterest = (typeof frenchInterests)[number];
const countries = ["FR", "BE", "CH", "CA", "LU", "AUTRE"] as const;
export type FrenchLead = {
  requestId: string;
  name: string;
  email: string;
  company: string;
  country: (typeof countries)[number];
  interest: FrenchInterest;
  preferredWindow: string;
  message: string;
  consentContact: true;
  consentMarketing: boolean;
};
export function validateFrenchLead(input: unknown): FrenchLead {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Invalid input");
  const body = input as Record<string, unknown>;
  if (body.consentContact !== true || body.website) throw Error("Invalid consent");
  if (body.consentMarketing !== undefined && typeof body.consentMarketing !== "boolean")
    throw Error("Invalid marketing preference");
  const field = (name: string, max: number) => {
    const value = body[name];
    if (value !== undefined && typeof value !== "string") throw Error("Invalid field");
    const text = (value as string | undefined) || "";
    if (text.length > max) throw Error("Field too long");
    return text.trim();
  };
  const requestId = field("requestId", 50);
  const name = field("name", 100);
  const email = field("email", 160);
  const company = field("company", 160);
  const country = field("country", 10);
  const interest = field("interest", 20);
  const preferredWindow = field("preferredWindow", 160);
  const message = field("message", 1000);
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(requestId) ||
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !countries.includes(country as (typeof countries)[number]) ||
    !frenchInterests.includes(interest as FrenchInterest)
  ) throw Error("Invalid contact");
  return {
    requestId, name, email, company,
    country: country as FrenchLead["country"],
    interest: interest as FrenchInterest,
    preferredWindow, message,
    consentContact: true,
    consentMarketing: body.consentMarketing === true,
  };
}
