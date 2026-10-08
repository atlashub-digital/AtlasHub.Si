"use client";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { transformationOffers } from "../lib/site";

// P02 "Duas modalidades": accessible tabs (arrow keys, Home/End), both offers always reachable.
export default function OfferTabs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => { const n = (i + transformationOffers.length) % transformationOffers.length; setActive(n); tabs.current[n]?.focus(); };
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") move(active + 1); else if (e.key === "ArrowLeft") move(active - 1);
    else if (e.key === "Home") move(0); else if (e.key === "End") move(transformationOffers.length - 1); else return;
    e.preventDefault();
  };
  return (
    <div className="vp-tabs">
      <div role="tablist" aria-label="Modalidades" onKeyDown={key}>
        {transformationOffers.map((o, i) => (
          <button key={o.id} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`tab-${o.id}`} aria-controls={`panel-${o.id}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}>
            {o.title}
          </button>
        ))}
      </div>
      {transformationOffers.map((o, i) => (
        <div key={o.id} role="tabpanel" id={`panel-${o.id}`} aria-labelledby={`tab-${o.id}`} hidden={active !== i}>
          <article className="vp-card vp-offer">
            <h3>{o.title}</h3>
            <p>{o.description}</p>
            <h4 className="vp-eyebrow" style={{ margin: "12px 0 0" }}>Entregáveis</h4>
            <ul>{o.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
            <Link className="vp-card-link" href={`/?clara=${o.id}#clara`}>Agendar diagnóstico para {o.title} <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      ))}
    </div>
  );
}
