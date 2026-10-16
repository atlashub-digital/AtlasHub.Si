import type { Metadata } from "next";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import CheckoutView from "../../../../components/CheckoutView";

export const metadata: Metadata = { title: "Pagamento · Workshop", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <div id="conteudo">
        <Header current="/workshops" />
        <main>
          <section className="vp-section" aria-label="Pagamento da inscrição">
            <div className="vp-wrap"><CheckoutView id={id} /></div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
