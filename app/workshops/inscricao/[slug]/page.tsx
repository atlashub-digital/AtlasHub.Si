import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { workshopBySlug } from "../../../../lib/workshops";
import { commerceByWorkshop, formatBRL, workshopPolicies } from "../../../../lib/workshop-commerce";
import InscricaoForm from "./InscricaoForm";

export const dynamic = "force-dynamic";

// Formulário de inscrição: fora do índice.
export const metadata: Metadata = {
  title: "Inscrição no workshop",
  robots: { index: false, follow: false },
};

export default async function InscricaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = workshopBySlug(slug);
  if (!w) notFound();
  const commerce = commerceByWorkshop(w);
  const policies = workshopPolicies(w);

  return (
    <>
      <Header current="/workshops" />
      <main>
        <section className="vp-section" aria-labelledby="insc-title">
          <div className="vp-wrap" style={{ maxWidth: 720 }}>
            <p className="vp-eyebrow">{w.kicker}</p>
            <h1 className="vp-h2" id="insc-title">Inscrever-me · {w.title}</h1>
            <p className="vp-lead">
              {w.date} · {w.time} · {w.city}. {w.format}.
            </p>
            <InscricaoForm
              slug={w.slug}
              lots={Object.values(commerce.offers).map((o) => ({ lot: o.lot, label: o.lot === "antecipado" ? "Lote antecipado" : "Lote regular", price: formatBRL(o.catalogAmountMinor) }))}
            />
            <div className="vp-card" style={{ padding: 24, marginTop: 24 }} aria-labelledby="politicas-title">
              <h2 className="vp-h3" id="politicas-title">Condições e políticas — leia antes de pagar</h2>
              <dl>
                <dt>Local</dt>
                <dd>{policies.local}</dd>
                <dt>Prazo de comunicação do local</dt>
                <dd>{policies.prazoLocal}</dd>
                <dt>Adiamento</dt>
                <dd>{policies.adiamento}</dd>
                <dt>Cancelamento e reembolso</dt>
                <dd>{policies.cancelamento}</dd>
                <dt>Seus dados (LGPD)</dt>
                <dd>{policies.dados}</dd>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
