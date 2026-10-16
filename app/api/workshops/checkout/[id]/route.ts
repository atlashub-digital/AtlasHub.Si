import { getStatus } from "../../../../../lib/commerce/checkout";
import { runtimeDeps, secretCookie } from "../../../../../lib/commerce/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Estado normalizado da inscrição (polling). O segredo da sessão ARO vem do cookie httpOnly. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${secretCookie(id)}=([^;]+)`));
  const view = await getStatus(id, m ? decodeURIComponent(m[1]) : null, runtimeDeps()).catch(() => undefined);
  if (view === undefined) return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (!view) return Response.json({ error: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return Response.json(view, { headers: { "Cache-Control": "no-store" } });
}
