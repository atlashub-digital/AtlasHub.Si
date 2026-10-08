import { offers, capabilities } from "../lib/site";

// P01 pillars: the two offers with equal editorial weight, then the structural capabilities.
export default function Offers() {
  return (
    <section className="vp-section" id="solucoes" aria-labelledby="solucoes-title">
      <div className="vp-wrap">
        <div className="vp-intro">
          <p className="vp-eyebrow">Duas formas de avançar</p>
          <h2 className="vp-h2" id="solucoes-title">Capacidade gerida ou capacidade própria.</h2>
          <p>Escolha a AtlasHub para operar por você, para construir com você, ou combine os dois.</p>
        </div>
        <div className="vp-grid vp-grid-2">
          {offers.map((o) => (
            <article className="vp-card vp-offer" key={o.id}>
              <div className="vp-offer-head"><span>{o.title}</span></div>
              <h3>{o.headline}</h3>
              <p>{o.description}</p>
              <ul>{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <a className="vp-card-link" href={o.href}>{o.cta} <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
        <h3 className="vp-eyebrow" style={{ marginTop: 64 }}>Capacidades estruturantes</h3>
        <div className="vp-grid vp-grid-4">
          {capabilities.map((c) => (
            <article className="vp-card" key={c.title}><h3>{c.title}</h3><p>{c.text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}
