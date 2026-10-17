import Header from "./Header";
import Footer from "./Footer";
import type { SalesPageConfig } from "../lib/sales/pages";

/** Landing comercial replicável, mobile-first, sem dependência de CMS ou provider de pagamento. */
export default function SalesLanding({ offer, whatsapp }: { offer: SalesPageConfig; whatsapp: string }) {
  const cta = "Reservar meu interesse";
  return (
    <>
      <Header current="/workshops" />
      <main id="conteudo">
        <section className="vp-hero" aria-labelledby="sales-title" style={{ backgroundImage: "linear-gradient(105deg, rgba(2, 13, 30, .96), rgba(2, 13, 30, .87) 54%, rgba(2, 13, 30, .42)), url('/assets/hero-office.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="vp-wrap" style={{ gridTemplateColumns: "1fr", minHeight: 0, paddingTop: 96, paddingBottom: 96 }}>
            <div style={{ maxWidth: 900 }}>
              <p className="vp-eyebrow">{offer.eyebrow}</p>
              <h1 className="vp-h1" id="sales-title">{offer.titleStart}<br /><em>{offer.titleAccent}</em></h1>
              <p className="vp-lead" style={{ fontWeight: 600 }}>{offer.subtitle}</p>
              <p style={{ maxWidth: 730, fontSize: "1.1rem", lineHeight: 1.6, color: "#e3f0ff" }}>{offer.promise}</p>
              <div className="vp-hero-chips">
                <span className="vp-chip">4 encontros ao vivo</span>
                <span className="vp-chip">8 horas · 100% online</span>
                <span className="vp-chip">{offer.dateLabel}</span>
              </div>
              <div className="vp-actions" style={{ marginTop: 26 }}>
                <a className="vp-btn vp-btn-primary" href={whatsapp} target="_blank" rel="noopener noreferrer">{cta} <span aria-hidden="true">→</span></a>
                <a className="vp-btn vp-btn-secondary" href="#programa">Conhecer o programa</a>
              </div>
              <p className="vp-note" style={{ color: "#c9dff4", marginTop: 12 }}>Interesse gratuito, sem cobrança ou confirmação automática de vaga. Inscrições pagas serão anunciadas após aprovação da oferta.</p>
            </div>
          </div>
        </section>

        <section className="vp-section" aria-labelledby="porque">
          <div className="vp-wrap">
            <div className="vp-intro">
              <p className="vp-eyebrow">A mudança de mentalidade</p>
              <h2 className="vp-h2" id="porque">A sua operação precisa de mais uma ferramenta — ou de trabalhar de outra forma?</h2>
              <p>Em vez de passar o dia entre aplicações separadas, aprenda a combinar processos, pessoas, dados e inteligência artificial num mesmo ecossistema de trabalho.</p>
            </div>
            <div className="vp-grid vp-grid-4">
              {offer.benefits.map(b => <article key={b.title} className="vp-card"><h3>{b.title}</h3><p>{b.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="vp-section vp-band" id="programa" aria-labelledby="programa-ll01">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Quatro encontros · 18h–20h Brasília</p><h2 className="vp-h2" id="programa-ll01">Do diagnóstico ao plano de ação.</h2><p>Conteúdo transversal, com exemplos em diferentes atividades e aplicação à realidade de cada participante.</p></div>
            <div className="vp-grid vp-grid-4">
              {offer.schedule.map(s => <article className="vp-card" key={s.when}><p className="vp-eyebrow">{s.when}</p><h3>{s.title}</h3><p>{s.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="vp-section" aria-labelledby="paraquem">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Para quem</p><h2 className="vp-h2" id="paraquem">Inteligência aplicada a operações reais.</h2><p>O princípio é o mesmo para quem vende, atende, produz, gere ou aprende — o ponto de partida é um processo e um objetivo.</p></div>
            <div className="vp-grid vp-grid-3">
              <article className="vp-card"><h3>Áreas e públicos</h3><ul>{offer.audiences.map(a => <li key={a}>{a}</li>)}</ul></article>
              <article className="vp-card"><h3>O que leva consigo</h3><ul>{offer.deliverables.map(a => <li key={a}>{a}</li>)}</ul></article>
              <article className="vp-card"><h3>Sem promessas artificiais</h3><p>Não é uma certificação técnica nem uma implementação de software personalizada. É um laboratório para construir capacidade de avaliação, desenho e execução responsável.</p></article>
            </div>
          </div>
        </section>

        <section className="vp-section vp-band" aria-labelledby="faq-ll01">
          <div className="vp-wrap"><div className="vp-intro"><p className="vp-eyebrow">Dúvidas frequentes</p><h2 className="vp-h2" id="faq-ll01">Antes de participar.</h2></div>
            <div className="vp-faq">{offer.faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
          </div>
        </section>

        <section className="vp-section" id="reserva" aria-labelledby="reserva-ll01">
          <div className="vp-wrap">
            <div className="vp-cta">
              <p className="vp-eyebrow">LIVE ONLINE · QUATRO ENCONTROS</p>
              <h2 className="vp-h2" id="reserva-ll01">Quer colocar a IA a trabalhar na sua operação?</h2>
              <p>{offer.dateLabel}. Manifeste já o seu interesse e receba as informações quando as inscrições abrirem.</p>
              <div className="vp-actions">
                <a className="vp-btn vp-btn-primary" href={whatsapp} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp e reservar interesse <span aria-hidden="true">→</span></a>
              </div>
              <p className="vp-note">WhatsApp: +55 62 99190-3462. O envio da mensagem depende da sua confirmação no WhatsApp. Não se trata de um pagamento nem da garantia de lugar.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
