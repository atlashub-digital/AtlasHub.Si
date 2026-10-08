import Link from "next/link";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Image from "next/image";
import OfferTabs from "../../../components/OfferTabs";
import Icon, { type IconName } from "../../../components/Icon";
import { Symbol } from "../../../components/Brand";
import { transformationDomains, transformationMethod, transformationTrust, transformationFaq } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Enterprise Transformation",
  description: "Construa sua própria capacidade digital: agentes e processos inteligentes no seu ecossistema, com integração, governança e capacitação da sua equipe.",
  alternates: { canonical: "/solucoes/enterprise-transformation" },
  openGraph: { url: "/solucoes/enterprise-transformation", title: "Enterprise Transformation · AtlasHub.SI" },
};

// P02 — Enterprise Transformation (Build & Transfer / Co-Build & Enablement).
export default function EnterpriseTransformation() {
  return (
    <>
      <Header current="/solucoes/enterprise-transformation" />
      <main id="conteudo">
        <section className="vp-hero vp-hero-photo" aria-labelledby="et-title">
          <Image className="vp-hero-bg" src="/assets/case-industry.jpg" alt="" fill sizes="100vw" priority />
          <div className="vp-wrap">
            <div>
              <p className="vp-eyebrow">Enterprise Transformation</p>
              <h1 className="vp-h1" id="et-title">Construa sua própria <em>capacidade digital.</em></h1>
              <p className="vp-lead">Implementamos agentes e processos inteligentes no seu ecossistema, com integração, governança e capacitação da sua equipe.</p>
              <div className="vp-actions">
                <Link className="vp-btn vp-btn-primary" href="/?clara=build#clara"><Icon name="calendar" size={18} /> Agendar diagnóstico <span aria-hidden="true">→</span></Link>
                <a className="vp-btn vp-btn-secondary" href="#metodologia">Conheça nossa abordagem <span aria-hidden="true">→</span></a>
              </div>
              <ul className="vp-badges">
                <li><Icon name="check" /><div><strong>No seu ambiente</strong><span>Implantação segura e integrada</span></div></li>
                <li><Icon name="users" /><div><strong>Com seu time</strong><span>Transferência de conhecimento</span></div></li>
                <li><Icon name="shield" /><div><strong>Governança nativa</strong><span>Segurança desde o início</span></div></li>
              </ul>
            </div>
            <div className="vp-hero-visual" aria-hidden="true">
              <ul className="vp-float">{transformationDomains.slice(0, 3).map((d) => <li key={d.title}><Icon name={d.icon as IconName} /> {d.title}</li>)}</ul>
              <div className="vp-orbit"><span /><span /><Symbol size={300} priority /></div>
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
            <ul className="vp-grid vp-grid-5 vp-plain">{transformationDomains.map((d) => <li className="vp-card" key={d.title}><span className="vp-icon-box"><Icon name={d.icon as IconName} /></span><h3>{d.title}</h3><p>{d.text}</p></li>)}</ul>
          </div>
        </section>
        <section className="vp-section" id="metodologia" aria-labelledby="metodo-et">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Da oportunidade à autonomia</p><h2 className="vp-h2" id="metodo-et">Uma abordagem por etapas, com critérios de aceitação.</h2></div>
            <ol className="vp-steps vp-steps-5">{transformationMethod.map((s, i) => <li key={s.title}><span className="vp-step-num">{String(i + 1).padStart(2, "0")}</span><span className="vp-icon-box"><Icon name={s.icon as IconName} /></span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol>
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
      <Footer />
    </>
  );
}
