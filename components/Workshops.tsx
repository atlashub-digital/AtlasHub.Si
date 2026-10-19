import Link from "next/link";
import { formatBRL, workshops, workshopStatus } from "../lib/workshops";

// Secção Workshops da homepage. Fica fora do ecrã 1:1 do Visual Pack V1 (que não é alterado): no desktop
// aparece por baixo da maquete, no telemóvel depois dos casos, com a linguagem de app/theme.css.
export default function Workshops({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section className="vp-section vp-band" id="workshops" aria-labelledby="workshops-title">
      <div className="vp-wrap">
        <div className="vp-intro">
          <p className="vp-eyebrow">Workshops empresariais — online e em Anápolis</p>
          <H className="vp-h2" id="workshops-title">Comece por repensar a empresa.</H>
          <p>Encontros online e presenciais da AtlasHub Enterprise Transformation para líderes e equipes que querem organizar pessoas, dados, processos e agentes supervisionados.</p>
        </div>
        <div className="vp-grid vp-grid-2">
          <article className="vp-card vp-offer">
            <div className="vp-offer-head"><span>Live Lab LL01 · Enterprise Transformation</span></div>
            <p className="vp-chip">100% ONLINE · 27 e 29 de outubro · ao vivo</p>
            <h3>Automação com Pessoas no Centro</h3>
            <p><strong>27 e 29 de outubro de 2026</strong> · 2 encontros online ao vivo</p>
            <p>A Nova Era da IA 2027–2030. Conecte pessoas, processos, dados e agentes inteligentes e crie um agente do zero no segundo encontro, em um cenário de negócio simulado.</p>
            <ul>
              <li>Construção guiada de um agente no segundo encontro</li>
              <li>Livro Empresa Aumentada (AtlasHub Editions) como leitura complementar</li>
              <li>{formatBRL(24900)} promocional · {formatBRL(49700)} regular</li>
            </ul>
            <Link className="vp-card-link" href="/workshops/automacao-pessoas-no-centro">Reservar <span aria-hidden="true">→</span></Link>
          </article>
          {workshops.map((w) => (
            <article className="vp-card vp-offer" key={w.slug}>
              <div className="vp-offer-head"><span>{w.kicker}</span></div>
              <h3>{w.title}</h3>
              <p><strong>{w.date}</strong> · {w.time} · {w.city}</p>
              <p>{w.headline} {w.summary}</p>
              <ul>
                <li>{w.format}</li>
                <li>Anápolis — {w.venue}</li>
                <li>{formatBRL(w.pricing.antecipado)} antecipado · {formatBRL(w.pricing.regular)} regular, {w.priceUnit}</li>
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
