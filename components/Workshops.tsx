import Link from "next/link";
import { formatBRL, workshops } from "../lib/workshops";
import { availability } from "../lib/commerce/checkout";
import { runtimeDeps } from "../lib/commerce/runtime";
import { statusAvailability } from "../lib/sales/ll01-commerce";

export default async function Workshops({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  const physical = await availability(runtimeDeps());
  const events = [
    { code: "LL01", slug: "automacao-pessoas-no-centro", title: "Automação com Pessoas no Centro", date: "27 e 29 de outubro · 2 encontros", format: "100% ONLINE · AO VIVO", summary: "Crie um agente de IA do zero no segundo encontro.", unit: "por participante", price: 24900, open: false, completed: true, image: "ll01" },
    ...workshops.map(w => ({ ...w, price: physical[w.code].priceMinor, open: physical[w.code].open && !physical[w.code].soldOut, unit: w.priceUnit, completed: false, image: w.code.toLowerCase() })),
  ];
  return <>
    {headingLevel === 1 && <section className="vp-hero cro-hero cro-index-hero"><div className="vp-wrap"><p className="vp-eyebrow">ATLASHUB · EXPERIÊNCIAS 2026</p><H className="vp-h1">O futuro não se espera.<br /><em>Constrói-se.</em></H><p className="vp-lead">Workshops com aplicação prática, visão executiva e acompanhamento. Escolha a experiência certa para você ou para a sua empresa.</p><a className="vp-btn vp-btn-primary" href="#workshops">EXPLORAR OS 3 WORKSHOPS →</a><p>Com Sérgio Monteiro e a equipe AtlasHub</p></div></section>}
    <section className="vp-section vp-band" id="workshops" aria-labelledby="workshops-title"><div className="vp-wrap">
      <div className="vp-intro"><p className="vp-eyebrow">ESCOLHA O SEU PRÓXIMO PASSO</p><h2 className="vp-h2" id="workshops-title">Três experiências. Uma nova forma de trabalhar.</h2><p>Online e em Anápolis · pessoas, IA e operações.</p></div>
      <div className="cro-events">{events.map(w => <article className="cro-event" key={w.code} style={{ backgroundImage: `linear-gradient(0deg,#05142b 25%,#05142b55),url('/assets/cro-v2/${w.image}.webp')` }}><p className="vp-eyebrow">{w.code}</p><h3>{w.title}</h3><span className="vp-chip">{w.format}</span><p>{w.date}</p>{w.completed && <p className="cro-event-completed" role="status">Concluído · Inscrições encerradas</p>}<p>{w.summary}</p>{!w.completed && <p className="cro-price">{formatBRL(w.price)} <small>{w.unit}</small></p>}<Link className="vp-btn vp-btn-primary" href={`/workshops/${w.slug}${w.open ? "#inscricao" : "#programa"}`}>{w.completed ? "CONSULTAR O EVENTO CONCLUÍDO" : w.open ? "VER OFERTA E INSCREVER-ME" : "CONHECER O PROGRAMA"} →</Link></article>)}</div>
      <p className="cro-banner">O LL01 está concluído e com inscrições encerradas. Os demais eventos possuem agendas e condições específicas.</p>
    </div></section>
  </>;
}
