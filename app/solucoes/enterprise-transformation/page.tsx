import Link from "next/link";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import MockupCanvas, { type MockScreen } from "../../../components/MockupCanvas";
import screen from "../../../lib/mockups/enterprise-transformation.json";
import OfferTabs from "../../../components/OfferTabs";
import { transformationDomains, transformationMethod, transformationTrust, transformationFaq } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Enterprise Transformation",
  description: "Construa sua própria capacidade digital: agentes e processos inteligentes no seu ecossistema, com integração, governança e capacitação da sua equipe.",
  alternates: { canonical: "/solucoes/enterprise-transformation" },
  openGraph: { url: "/solucoes/enterprise-transformation", title: "Enterprise Transformation · AtlasHub.SI" },
};

// P02 — Enterprise Transformation (Build & Transfer / Co-Build & Enablement).
// Desktop (≥ 900 px) renders the approved Visual Pack V1 mockup 1:1; narrow screens keep the sections below.
export default function EnterpriseTransformation() {
  return (
    <>
      <div id="conteudo">
        <main className="mk-desktop">
          <h1 className="mk-sr">Enterprise Transformation — Construa sua própria capacidade digital.</h1>
          <MockupCanvas screen={screen as MockScreen} />
        </main>
        <div className="mk-mobile">
      <Header current="/solucoes/enterprise-transformation" />
      <main>
        <section className="vp-hero" aria-labelledby="et-title">
          <div className="vp-wrap" style={{ gridTemplateColumns: "1fr", minHeight: 0, paddingTop: 96, paddingBottom: 96 }}>
            <div>
              <p className="vp-eyebrow">Enterprise Transformation</p>
              <h1 className="vp-h1" id="et-title">Construa sua própria <em>capacidade digital.</em></h1>
              <p className="vp-lead">Implementamos agentes e processos inteligentes no seu ecossistema, com integração, governança e capacitação da sua equipe.</p>
              <div className="vp-actions">
                <Link className="vp-btn vp-btn-primary" href="/?clara=build#clara">Agendar diagnóstico <span aria-hidden="true">→</span></Link>
                <a className="vp-btn vp-btn-secondary" href="#metodologia">Conheça nossa abordagem</a>
              </div>
              <div className="vp-hero-chips"><span className="vp-chip">No seu ambiente</span><span className="vp-chip">Com seu time</span><span className="vp-chip">Governança nativa</span></div>
            </div>
          </div>
        </section>
        <section className="vp-section" aria-labelledby="modalidades">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Duas modalidades</p><h2 className="vp-h2" id="modalidades">Entregamos a solução ou construímos com a sua equipe.</h2></div>
            <OfferTabs />
          </div>
        </section>
        <section className="vp-section vp-band" aria-labelledby="areas-et">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Áreas de transformação</p><h2 className="vp-h2" id="areas-et">Onde trabalhamos.</h2></div>
            <ul className="vp-grid vp-grid-5" style={{ listStyle: "none", padding: 0, margin: 0 }}>{transformationDomains.map((d) => <li className="vp-card" key={d}><h3>{d}</h3></li>)}</ul>
          </div>
        </section>
        <section className="vp-section" id="metodologia" aria-labelledby="metodo-et">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Da oportunidade à autonomia</p><h2 className="vp-h2" id="metodo-et">Uma abordagem por etapas, com critérios de aceitação.</h2></div>
            <ol className="vp-grid vp-grid-5" style={{ listStyle: "none", padding: 0, margin: 0 }}>{transformationMethod.map((s, i) => <li className="vp-step" key={s.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
          </div>
        </section>
        <section className="vp-section vp-band" aria-labelledby="confianca">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Contratos e segurança</p><h2 className="vp-h2" id="confianca">Tudo explícito antes de começar.</h2><p>A transferência é contratual, não automática: IP, dados, suporte, licenças e credenciais ficam definidos por escrito.</p></div>
            <div className="vp-hero-chips">{transformationTrust.map((t) => <span className="vp-chip" key={t}>{t}</span>)}</div>
          </div>
        </section>
        <section className="vp-section vp-faq" aria-labelledby="faq-et">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Perguntas frequentes</p><h2 className="vp-h2" id="faq-et">O que perguntam antes do diagnóstico.</h2></div>
            {transformationFaq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </section>
        <section className="vp-section" aria-labelledby="cta-et">
          <div className="vp-wrap"><div className="vp-cta">
            <h2 className="vp-h2" id="cta-et">A inteligência deve ficar ao alcance da sua equipe.</h2>
            <p className="vp-lead" style={{ margin: "0 auto" }}>Comece por um diagnóstico com a Clara. Sem compromisso e sem prometer prazos antes de conhecer o seu contexto.</p>
            <div className="vp-actions"><Link className="vp-btn vp-btn-primary" href="/?clara=build#clara">Agendar diagnóstico <span aria-hidden="true">→</span></Link></div>
          </div></div>
        </section>
      </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
