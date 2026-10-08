import { journey } from "../lib/site";

// P01 journey "Da necessidade à autonomia" (replaces the previous four-step method with the approved path).
export default function Method() {
  return (
    <section className="vp-section vp-band" id="metodo" aria-labelledby="metodo-title">
      <div className="vp-wrap">
        <div className="vp-intro">
          <p className="vp-eyebrow">Da necessidade à autonomia</p>
          <h2 className="vp-h2" id="metodo-title">Começar com segurança. Evoluir com autonomia.</h2>
        </div>
        <ol className="vp-grid vp-grid-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {journey.map((s, i) => (
            <li className="vp-step" key={s.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.text}</p></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
