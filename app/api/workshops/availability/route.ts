import { availability } from "../../../../lib/commerce/checkout";
import { runtimeDeps } from "../../../../lib/commerce/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Vendas abertas/esgotadas e lote atual por workshop (sem dados pessoais nem contagens exatas). */
export async function GET() {
  const a = await availability(runtimeDeps()).catch(() => null);
  return Response.json(a ?? {}, { headers: { "Cache-Control": "public, max-age=30" } });
}
