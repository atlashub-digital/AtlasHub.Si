import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { waInterestUrl, workshops, workshopStatus, type Workshop } from "../lib/workshops";

// Página comercial de um workshop (pré-lançamento). Sem maquete 1:1 aprovada para estas rotas:
// usa a linguagem responsiva do Visual Pack V1 (app/theme.css) em todas as larguras.
export default function WorkshopDetail({ w }: { w: Workshop }) {
  const wa = waInterestUrl(w);
  const other = workshops.find((o) => o.slug !== w.slug);
  return (
    <>
      <div id="conteudo">
        <Header current="/workshops" />
        <main>
          <section className="vp-hero" aria-labelledby="ws-title">
            <div className="vp-wrap" style={{ gridTemplateColumns: "1fr", minHeight: 0, paddingTop: 96, paddingBottom: 96 }}>
              <div>
                <p className="vp-eyebrow">{w.kicker}</p>
                <h1 className="vp-h1" id="ws-title">{w.title}<br /><em>{w.headline}</em></h1>
                <p className="vp-lead">{w.summary}</p>
                <div className="vp-hero-chips">
                  {[w.date, w.time, w.city, w.format].map((c) => <span className="vp-chip" key={c}>{c}</span>)}
                </div>
                <div className="vp-actions">
                  <Link className="vp-btn vp-btn-primary" href={w.inscricaoHref}>Inscrever-me <span aria-hidden="true">→</span></Link>
                  <a className="vp-btn vp-btn-secondary" href={wa} target="_blank" rel="noopener noreferrer">Entrar na lista de interesse</a>
                </div>
                <p className="vp-note"><span className="vp-chip">{workshopStatus.label}</span> {workshopStatus.note}</p>
              </div>
            </div>
          </section>

          <section className="vp-section" id="programa" aria-labelledby="programa-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Programa · {w.time}</p><h2 className="vp-h2" id="programa-title">O que acontece na sala.</h2></div>
              <ol className="vp-grid vp-grid-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {w.agenda.map((a) => (
                  <li className="vp-card" key={a.time}><p className="vp-eyebrow">{a.time}</p><h3>{a.topic}</h3><p>{a.activity}</p></li>
                ))}
              </ol>
            </div>
          </section>

          <section className="vp-section vp-band" aria-labelledby="leva-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Para quem</p><h2 className="vp-h2" id="leva-title">O que você leva.</h2><p>{w.audience}</p></div>
              <div className="vp-grid vp-grid-3">
                <article className="vp-card"><h3>Entregáveis</h3><ul>{w.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></article>
                <article className="vp-card"><h3>Inclui</h3><ul>{w.extras.map((d) => <li key={d}>{d}</li>)}</ul></article>
                <article className="vp-card"><h3>Não inclui</h3><ul>{w.notIncluded.map((d) => <li key={d}>{d}</li>)}</ul></article>
              </div>
            </div>
          </section>

          <section className="vp-section" aria-labelledby="condicoes-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Condições</p><h2 className="vp-h2" id="condicoes-title">Antes de pagar, as regras claras.</h2></div>
              <div className="vp-grid vp-grid-3">
                <article className="vp-card"><h3>Local</h3><p>{w.city} · {w.venue}. Nenhum espaço fica reservado pela inscrição nesta fase de divulgação.</p></article>
                <article className="vp-card"><h3>Capacidade</h3><p>{w.capacity}</p></article>
                <article className="vp-card"><h3>Investimento</h3><p>{w.priceLabel}. Condições de adiamento, cancelamento e reembolso exibidas na página de inscrição, antes do pagamento.</p></article>
              </div>
            </div>
          </section>

          <section className="vp-section vp-band" aria-labelledby="faq-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Perguntas frequentes</p><h2 className="vp-h2" id="faq-title">Antes de se inscrever.</h2></div>
              <div className="vp-faq">
                {w.faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
              </div>
            </div>
          </section>

          <section className="vp-section" aria-labelledby="cta-ws">
            <div className="vp-wrap"><div className="vp-cta">
              <h2 className="vp-h2" id="cta-ws">Pare de adicionar tecnologia a processos antigos.</h2>
              <p>Garanta a sua participação: inscrição via PIX, bilhete automático após a confirmação do pagamento.</p>
              <div className="vp-actions">
                <Link className="vp-btn vp-btn-primary" href={w.inscricaoHref}>Garantir participação <span aria-hidden="true">→</span></Link>
                <a className="vp-btn vp-btn-secondary" href={wa} target="_blank" rel="noopener noreferrer">Lista de interesse pelo WhatsApp</a>
                {other && <Link className="vp-btn vp-btn-secondary" href={`/workshops/${other.slug}`}>Ver {other.title}</Link>}
              </div>
              <p className="vp-note">{workshopStatus.waNote}</p>
            </div></div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
