import { cases } from "./cases";

export function validateLead(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Invalid request");
  const body = input as Record<string, unknown>;
  if (body.consent !== true || body.website) throw Error("Invalid consent");
  const field = (name: string, max: number) => {
    const value = body[name];
    if (value !== undefined && typeof value !== "string")
      throw Error("Invalid field");
    const text = (value as string | undefined) || "";
    if (text.length > max) throw Error("Too long");
    return text.trim();
  };
  const name = field("name", 100),
    company = field("company", 160),
    email = field("email", 160),
    phone = field("phone", 30),
    intent = field("intent", 20),
    requestId = field("requestId", 50),
    preferredWindow = field("preferredWindow", 160);
  if (
    !name ||
    (!email && !phone) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    (phone && !/^\+[\d ()-]{7,25}$/.test(phone)) ||
    !["contact", "meeting", "quote"].includes(intent) ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      requestId,
    )
  )
    throw Error("Invalid contact");
  if (intent === "meeting" && !preferredWindow)
    throw Error("Missing preferred window");
  if (!body.diagnostic || typeof body.diagnostic !== "object")
    throw Error("Invalid diagnostic");
  const d = body.diagnostic as Record<string, unknown>,
    c = cases.find((c) => c.id === d.scenario);
  if (!c) throw Error("Invalid scenario");
  const options = {
    channel: ["email", "whatsapp", "system", "manual"],
    systems: ["api", "sheets", "docs", "unknown"],
    frequency: ["low", "daily", "high"],
    approach: ["draft", "bounded", "explore"],
  };
  const diagnostic: Record<string, string> = { scenario: c.id, title: c.title };
  for (const [key, values] of Object.entries(options)) {
    if (typeof d[key] !== "string" || !values.includes(d[key] as string))
      throw Error("Invalid answer");
    diagnostic[key] = d[key] as string;
  }
  return {
    requestId,
    name,
    company,
    email,
    phone,
    intent,
    preferredWindow,
    route: "human" as const,
    consent: true,
    consentVersion: "clara-contact-v1",
    diagnostic,
  };
}

const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function receiveLead(req: Request): Promise<Response> {
  if (
    req.headers.get("origin") !==
    (process.env.PUBLIC_ORIGIN || "https://atlashub.si")
  )
    return json(403, { accepted: false });
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return json(415, { accepted: false });
  let lead: ReturnType<typeof validateLead>;
  try {
    // Bound the stream before parsing rather than buffering arbitrary request bodies.
    const reader = req.body?.getReader();
    if (!reader) throw Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12000) {
        await reader.cancel();
        return json(413, { accepted: false });
      }
      chunks.push(value);
    }
    lead = validateLead(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return json(400, { accepted: false });
  }
  const endpoint = process.env.LEAD_WEBHOOK_URL,
    token = process.env.LEAD_WEBHOOK_TOKEN;
  if (!endpoint?.startsWith("https://") || !token)
    return json(503, { accepted: false });
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "error",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "Idempotency-Key": lead.requestId,
      },
      body: JSON.stringify({
        ...lead,
        receivedAt: new Date().toISOString(),
        source: "atlashub-clara",
      }),
      signal: AbortSignal.timeout(8000),
    });
    const result = await response.json();
    if (
      response.status !== 202 ||
      typeof result.id !== "string" ||
      !result.id.trim() ||
      result.id.length > 160 ||
      result.route !== "human"
    )
      throw Error("Unconfirmed");
    return json(202, { id: result.id, route: "human" });
  } catch {
    return json(502, { accepted: false });
  }
}
