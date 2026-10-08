import Image from "next/image";
import { Symbol } from "./Brand";
import Icon from "./Icon";

// P01 hero: headline left; right, the official luminous symbol (never baked into the photo) over the
// midnight-office background, with three floating capability cards.
export default function Hero() {
  return (
    <section className="vp-hero vp-hero-photo" id="inicio" aria-labelledby="hero-title">
      <Image className="vp-hero-bg" src="/assets/hero-office.jpg" alt="" fill sizes="100vw" priority />
      <div className="vp-wrap">
        <div>
          <p className="vp-eyebrow">Inteligência em operação</p>
          <h1 className="vp-h1" id="hero-title">Mais capacidade. <em>Menos complexidade.</em></h1>
          <p className="vp-lead">Ajudamos empresas a reforçar suas operações com colaboradores digitais e a construir sua própria capacidade para o futuro.</p>
          <div className="vp-actions">
            <a className="vp-btn vp-btn-primary" href="#clara"><Icon name="chat" size={18} /> Fale com a Clara <span aria-hidden="true">→</span></a>
            <a className="vp-btn vp-btn-secondary" href="#solucoes">Conheça as soluções <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="vp-hero-visual" aria-hidden="true">
          <ul className="vp-float">
            <li><Icon name="users" /> Pessoas + agentes</li>
            <li><Icon name="gear" /> Processos inteligentes</li>
            <li><Icon name="chart" /> Resultados medidos</li>
          </ul>
          <div className="vp-orbit"><span /><span /><Symbol size={300} priority /></div>
        </div>
      </div>
    </section>
  );
}
