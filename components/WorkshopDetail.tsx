import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { formatBRL, waInterestUrl, workshops, workshopStatus, type Workshop } from "../lib/workshops";
import { conditions, earlyUntil, venueNotice } from "../lib/commerce/policy";
import WorkshopSignup, { SignupCta } from "./WorkshopSignup";

// Página comercial de um workshop: programa, preço, condições e inscrição paga (PIX via ARO). Sem maquete 1:1 aprovada para estas rotas:
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
                  {[w.date, w.time, venueNotice, w.format].map((c) => <span className="vp-chip" key={c}>{c}</span>)}
                </div>
                <div className="vp-actions">
                  <SignupCta w={w} waUrl={wa} />
                </div>
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

          <section className="vp-section" id="condicoes" aria-labelledby="condicoes-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Investimento e condições</p><h2 className="vp-h2" id="condicoes-title">Antes de se inscrever.</h2></div>
              <div className="vp-grid vp-grid-3">
                <article className="vp-card"><h3>Investimento</h3><p><strong>{formatBRL(w.pricing.antecipado)}</strong> no lote antecipado, até {earlyUntil(w.code).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })} ou enquanto o lote estiver ativo.</p><p><strong>{formatBRL(w.pricing.regular)}</strong> no valor regular.</p><p>{w.priceUnit[0].toUpperCase() + w.priceUnit.slice(1)}, pagamento por PIX.</p></article>
                <article className="vp-card"><h3>Capacidade</h3><p>{w.capacity}</p></article>
                {conditions.map((c) => <article className="vp-card" key={c.title}><h3>{c.title}</h3><p>{c.text}</p></article>)}
              </div>
            </div>
          </section>

          <section className="vp-section vp-band" id="inscricao" aria-labelledby="inscricao-title">
            <div className="vp-wrap">
              <div className="vp-intro"><p className="vp-eyebrow">Inscrição</p><h2 className="vp-h2" id="inscricao-title">Garanta a sua participação.</h2><p>{workshopStatus.note}</p></div>
              <WorkshopSignup w={w} waUrl={wa} />
            </div>
          </section>

          <section className="vp-section" aria-labelledby="faq-title">
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
              <p>Dúvidas sobre o programa ou a inscrição? Fale com a equipe pelo WhatsApp.</p>
              <div className="vp-actions">
                <a className="vp-btn vp-btn-primary" href="#inscricao">Ir para a inscrição <span aria-hidden="true">→</span></a>
                <a className="vp-btn vp-btn-secondary" href={wa} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp</a>
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
