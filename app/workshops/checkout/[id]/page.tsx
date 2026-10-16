import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { aroConfig, getCheckoutSession } from "../../../../lib/aro/client";
import { checkoutCookie, openSession } from "../../../../lib/aro/session";
import { commerceBySlug } from "../../../../lib/workshop-commerce";
import CheckoutClient, { type CheckoutView } from "./CheckoutClient";

export const dynamic = "force-dynamic";

// Página do checkout: fora do índice e sem cache.
export const metadata: Metadata = {
  title: "Checkout · Inscrição no workshop",
  robots: { index: false, follow: false },
};

/**
 * Servidor: abre o cookie selado (httpOnly), consulta o ARO com o checkout_secret
 * e entrega à UI apenas dados públicos do PIX (QR/copia-e-cola, valor e validade).
 * O secret nunca chega ao browser, nem no URL nem no HTML.
 */
export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cfg = aroConfig();
  const secret = process.env.ARO_SERVER_KEY;
  const store = await cookies();
  const capability = cfg && secret ? openSession(store.get(checkoutCookie)?.value, secret) : null;
  if (!cfg || !capability || capability.id !== id) redirect("/workshops");
  const commerce = commerceBySlug(capability.slug);
  if (!commerce) notFound();

  let view: CheckoutView;
  try {
    const session = await getCheckoutSession(cfg, capability.id, capability.secret);
    if (session.id !== capability.id || session.order_id !== capability.orderId) notFound();
    const pix = session.payment?.kind === "PIX" ? session.payment : null;
    view = {
      slug: capability.slug,
      checkoutId: session.id,
      orderId: session.order_id,
      state: session.state,
      amountMinor: session.amount?.amount_minor ?? 0,
      currency: session.amount?.currency ?? "BRL",
      copyPaste: pix?.copy_paste ?? null,
      qrDataUrl: pix?.qr_payload ? await QRCode.toDataURL(pix.qr_payload, { margin: 4, width: 320 }) : null,
      expiresAt: pix?.expires_at ?? session.expires_at ?? null,
    };
  } catch {
    // Fail-closed: sem resposta do ARO, página neutra pede nova tentativa pelo link original.
    view = { slug: capability.slug, checkoutId: capability.id, orderId: capability.orderId, state: "UNAVAILABLE", amountMinor: 0, currency: "BRL", copyPaste: null, qrDataUrl: null, expiresAt: null };
  }

  return (
    <>
      <Header current="/workshops" />
      <main>
        <section className="vp-section" aria-labelledby="checkout-title">
          <div className="vp-wrap" style={{ maxWidth: 720 }}>
            <p className="vp-eyebrow">Inscrição · checkout seguro</p>
            <h1 className="vp-h2" id="checkout-title">Pagamento via PIX</h1>
            <CheckoutClient initial={view} entitlementKey={commerce.aroEntitlement} attributionCode={commerce.attributionCode} code={commerce.code} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
