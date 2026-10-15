import Link from "next/link";
import { workshops, workshopStatus } from "../lib/workshops";

// Secção Workshops da homepage. Fica fora do ecrã 1:1 do Visual Pack V1 (que não é alterado): no desktop
// aparece por baixo da maquete, no telemóvel depois dos casos, com a linguagem de app/theme.css.
export default function Workshops({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="vp-section vp-band" id="workshops" aria-labelledby="workshops-title">
      <div className="vp-wrap">
        <div className="vp-intro">
          <p className="vp-eyebrow">Workshops empresariais · Anápolis</p>
          <H className="vp-h2" id="workshops-title">Comece por repensar a empresa.</H>
          <p>Encontros presenciais da AtlasHub Enterprise Transformation para líderes e equipes que querem organizar pessoas, dados, processos e agentes supervisionados.</p>
        </div>
        <div className="vp-grid vp-grid-2">
          {workshops.map((w) => (
            <article className="vp-card vp-offer" key={w.slug}>
              <div className="vp-offer-head"><span>{w.kicker}</span></div>
              <h3>{w.title}</h3>
              <p><strong>{w.date}</strong> · {w.time} · {w.city}</p>
              <p>{w.headline} {w.summary}</p>
              <ul>
                <li>{w.format}</li>
                <li>{w.venue}</li>
                <li>{w.priceLabel}</li>
              </ul>
              <Link className="vp-card-link" href={`/workshops/${w.slug}`}>Ver programa <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
        <p className="vp-note"><span className="vp-chip">{workshopStatus.label}</span> {workshopStatus.note}</p>
      </div>
    </section>
  );
}
