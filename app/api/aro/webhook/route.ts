import { verifyAroWebhook } from "../../../../lib/aro/webhook";
import { handleEvent } from "../../../../lib/commerce/checkout";
import { runtimeDeps } from "../../../../lib/commerce/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de saída do ARO (atlashub-finance docs/35). Fail-closed: sem `ARO_WEBHOOK_SECRET` e
 * `ARO_PROJECT_SLUG` responde 503. O evento é só um gatilho: o bilhete só é emitido depois de voltar a
 * confirmar o direito ACTIVE no ARO (`finalize`), e reembolso/estorno/revogação libertam o lugar.
 * Processamento idempotente e id registado: reentregas e duplicados não têm efeito.
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

  const deps = runtimeDeps();
  if (!deps.store) {
    console.info(JSON.stringify({ aro_event: result.event.type, id: result.event.id, processed: false }));
    return Response.json({ received: true });
  }
  try {
    const outcome = await handleEvent(result.event, deps);
    console.info(JSON.stringify({ aro_event: result.event.type, id: result.event.id, outcome }));
    return Response.json({ received: true, outcome });
  } catch {
    // 5xx: o ARO volta a entregar (entrega pelo menos uma vez).
    return Response.json({ error: "processing_failed" }, { status: 500 });
  }
}
