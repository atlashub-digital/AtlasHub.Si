import Image from "next/image";
import { offers, capabilities, verticals } from "../lib/site";
import Icon, { type IconName } from "./Icon";

const offerImage: Record<string, string> = { workforce: "/assets/hero-office.jpg", transformation: "/assets/case-industry.jpg" };

// P01: two offers with equal editorial weight, structural capabilities, illustrative applications by area.
export default function Offers() {
  return (
    <section className="vp-section" id="solucoes" aria-labelledby="solucoes-title">
      <div className="vp-wrap">
        <h2 className="vp-sr" id="solucoes-title">Soluções</h2>
        <div className="vp-grid vp-grid-2">
          {offers.map((o) => (
            <article className="vp-card vp-offer vp-offer-image" key={o.id}>
              <Image src={offerImage[o.id]} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
              <div className="vp-offer-body">
                <p className="vp-eyebrow">{o.title}</p>
                <h3>{o.headline}</h3>
                <p>{o.description}</p>
                <ul>{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <a className="vp-btn vp-btn-secondary" href={o.href}>{o.cta} <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
        <ul className="vp-capabilities">
          {capabilities.map((c) => (
            <li key={c.title}><span className="vp-icon-box"><Icon name={c.icon as IconName} /></span><div><h3>{c.title}</h3><p>{c.text}</p></div></li>
          ))}
        </ul>
        <div className="vp-row-head"><h2 className="vp-h3">Soluções para desafios reais.</h2><a className="vp-card-link" href="#areas">Ver áreas de atuação <span aria-hidden="true">→</span></a></div>
        <ul className="vp-grid vp-grid-4 vp-plain">
          {verticals.map((v) => (
            <li className="vp-card vp-vertical" key={v.title}>
              <div className="vp-vertical-img"><Image src={v.image} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
              <span className="vp-icon-box"><Icon name={v.icon as IconName} /></span>
              <h3>{v.title}</h3><p>{v.text}</p>
            </li>
          ))}
        </ul>
        <p className="vp-note">Cenários ilustrativos de aplicação. Não representam clientes nem resultados.</p>
      </div>
    </section>
  );
}
