import Link from "next/link";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import MockupCanvas, { type MockScreen } from "../../../components/MockupCanvas";
import screen from "../../../lib/mockups/ai-workforce.json";
import RoleLibrary from "../../../components/RoleLibrary";
import { workforceSteps, supervision } from "../../../lib/site";

export const metadata: Metadata = {
  title: "AI Workforce",
  description: "Reforce sua operação com colaboradores digitais geridos pela AtlasHub, com limites, supervisão humana e acompanhamento definidos.",
  alternates: { canonical: "/solucoes/ai-workforce" },
  openGraph: { url: "/solucoes/ai-workforce", title: "AI Workforce · AtlasHub.SI" },
};

// P03 — AI Workforce (managed digital employees). States come from the real role registry.
// Desktop (≥ 900 px) renders the approved Visual Pack V1 mockup 1:1; narrow screens keep the sections below.
export default function AiWorkforce() {
  return (
    <>
      <div id="conteudo">
        <main className="mk-desktop">
          <h1 className="mk-sr">AI Workforce — Reforce sua operação com colaboradores digitais geridos.</h1>
          <MockupCanvas screen={screen as MockScreen} />
        </main>
        <div className="mk-mobile">
      <Header current="/solucoes/ai-workforce" />
      <main>
        <section className="vp-hero" aria-labelledby="aiw-title">
          <div className="vp-wrap" style={{ gridTemplateColumns: "1fr", minHeight: 0, paddingTop: 96, paddingBottom: 96 }}>
            <div>
              <p className="vp-eyebrow">AI Workforce · Mais capacidade. Menos complexidade.</p>
              <h1 className="vp-h1" id="aiw-title">Reforce sua operação com <em>colaboradores digitais geridos.</em></h1>
              <p className="vp-lead">Perfis digitais preparados para tarefas específicas e operados pela AtlasHub, com limites, supervisão e acompanhamento definidos.</p>
              <div className="vp-actions">
                <Link className="vp-btn vp-btn-primary" href="/?clara=managed#clara">Falar com a Clara <span aria-hidden="true">→</span></Link>
                <a className="vp-btn vp-btn-secondary" href="#perfis">Conheça os perfis</a>
              </div>
              <div className="vp-hero-chips">{["Atendimento", "Leads", "Processos", "Agenda", "Relatórios"].map((b) => <span className="vp-chip" key={b}>{b}</span>)}</div>
            </div>
          </div>
        </section>
        <section className="vp-section" id="perfis" aria-labelledby="perfis-title">
          <div className="vp-wrap">
            <div className="vp-intro">
              <p className="vp-eyebrow">Perfis por função</p>
              <h2 className="vp-h2" id="perfis-title">Oito colaboradores digitais, em demonstração.</h2>
              <p>Todos funcionam em ambiente de teste supervisionado, com dados fictícios. Nenhum está em operação com clientes antes de homologação.</p>
            </div>
            <RoleLibrary />
          </div>
        </section>
        <section className="vp-section vp-band" aria-labelledby="como">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Como funciona</p><h2 className="vp-h2" id="como">Da tarefa à missão gerida.</h2></div>
            <ol className="vp-grid vp-grid-5" style={{ listStyle: "none", padding: 0, margin: 0 }}>{workforceSteps.map((s, i) => <li className="vp-step" key={s.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
          </div>
        </section>
        <section className="vp-section" aria-labelledby="comparar">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Missão ou capacidade própria?</p><h2 className="vp-h2" id="comparar">Quem opera faz a diferença.</h2></div>
            <div className="vp-compare">
              <article className="vp-card vp-offer"><div className="vp-offer-head"><span>AI Workforce Managed</span></div><h3>A AtlasHub opera.</h3><p>Você contrata a capacidade; nós configuramos, supervisionamos e acompanhamos a missão.</p><Link className="vp-card-link" href="/?clara=managed#clara">Falar com a Clara →</Link></article>
              <article className="vp-card vp-offer"><div className="vp-offer-head"><span>Build & Transfer</span></div><h3>Sua equipe opera após o projeto.</h3><p>Construímos no seu ambiente e transferimos por contrato, depois da aceitação.</p><Link className="vp-card-link" href="/solucoes/enterprise-transformation">Ver Enterprise Transformation →</Link></article>
            </div>
          </div>
        </section>
        <section className="vp-section vp-band" aria-labelledby="supervisao">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Operação responsável</p><h2 className="vp-h2" id="supervisao">Supervisão por desenho, não por promessa.</h2></div>
            <div className="vp-grid vp-grid-5">{supervision.map((s) => <article className="vp-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
          </div>
        </section>
        <section className="vp-section" aria-labelledby="resultados">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Resultados</p><h2 className="vp-h2" id="resultados">Ainda sem medições publicadas.</h2><p>Só publicaremos indicadores medidos em operação real e autorizados pelos clientes. Até lá, a simulação da Clara mostra hipóteses com os seus próprios números.</p></div>
          </div>
        </section>
        <section className="vp-section" aria-labelledby="cta-aiw">
          <div className="vp-wrap"><div className="vp-cta">
            <h2 className="vp-h2" id="cta-aiw">Que tarefa mais consome tempo na sua empresa?</h2>
            <div className="vp-actions"><Link className="vp-btn vp-btn-primary" href="/?clara=managed#clara">Conversar com a Clara <span aria-hidden="true">→</span></Link></div>
          </div></div>
        </section>
      </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
