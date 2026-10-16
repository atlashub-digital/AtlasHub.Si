import { verifyAroWebhook } from "../../../../lib/aro/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de saída do ARO (atlashub-finance docs/35). Fail-closed: sem `ARO_WEBHOOK_SECRET` e
 * `ARO_PROJECT_SLUG` responde 503. O evento é só notificação: não concede nem retira acesso
 * (isso decide-se com `resolveEntitlements`), por isso reentregas e duplicados não têm efeito.
 * Não regista corpo, cabeçalhos de assinatura nem dados do pagador.
 */
export async function POST(request: Request) {
  const secret = process.env.ARO_WEBHOOK_SECRET;
  const project = process.env.ARO_PROJECT_SLUG;
  if (!secret || !project) return Response.json({ error: "aro_not_configured" }, { status: 503 });

  const rawBody = await request.text();
  if (rawBody.length > 64_000) return Response.json({ error: "too_large" }, { status: 413 });
  const result = verifyAroWebhook({
    rawBody,
    eventId: request.headers.get("x-aro-event-id"),
    timestamp: request.headers.get("x-aro-timestamp"),
    signature: request.headers.get("x-aro-signature"),
    secret,
    project,
  });
  if (!result.ok) return Response.json({ error: result.reason }, { status: result.status });

  console.info(JSON.stringify({ aro_event: result.event.type, id: result.event.id }));
  return Response.json({ received: true });
}
