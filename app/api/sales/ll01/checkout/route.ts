// Rota reservada ao futuro checkout LL01. Sem persistência e preço ARO homologado: NUNCA cobrar.
// Engenharia substitui isto por reserva persistente + idempotência + ARO + webhook verificado.
export const runtime = "nodejs";
export async function POST() {
  return Response.json({ error: "ll01_checkout_not_integrated" }, {
    status: 503, headers: { "Cache-Control": "no-store" }
  });
}
