// LL01: fail closed até integração transacional, ofertas canónicas ARO e validação comercial.
// Não declarar OPEN com base numa variável isolada: requer API/reserva/CRM ativos.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    open: false,
    pricing: { earlyMinor: 39700, regularMinor: 49700, promoMinor: 35730 },
    promo: null,
    reason: "ll01_checkout_not_integrated",
  }, { headers: { "Cache-Control": "no-store" } });
}
