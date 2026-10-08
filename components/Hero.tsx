import Image from "next/image";

// P01 hero: split 52/48, headline left, editorial photo right with the official mark (not baked into the photo).
export default function Hero() {
  return (
    <section className="vp-hero" id="inicio" aria-labelledby="hero-title">
      <div className="vp-wrap">
        <div>
          <p className="vp-eyebrow">Inteligência em operação</p>
          <h1 className="vp-h1" id="hero-title">
            Mais capacidade. <em>Menos complexidade.</em>
          </h1>
          <p className="vp-lead">
            Ajudamos empresas a reforçar suas operações com colaboradores digitais e a construir sua
            própria capacidade para o futuro.
          </p>
          <div className="vp-actions">
            <a className="vp-btn vp-btn-primary" href="#clara">Fale com a Clara <span aria-hidden="true">→</span></a>
            <a className="vp-btn vp-btn-secondary" href="#solucoes">Conheça as soluções</a>
          </div>
          <div className="vp-hero-chips" aria-label="Princípios">
            <span className="vp-chip">People</span>
            <span className="vp-chip">Technology</span>
            <span className="vp-chip">Results</span>
          </div>
        </div>
        <div className="vp-hero-media">
          <Image src="/assets/hero-office.jpg" alt="Equipe de operações num escritório à noite" fill sizes="(max-width: 900px) 100vw, 46vw" priority />
          <div className="vp-hero-badge">
            <Image src="/assets/atlashub-logo.webp" width={44} height={44} alt="" />
            <p><strong>Pessoas + agentes, com supervisão.</strong>As decisões continuam com a sua equipe.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
