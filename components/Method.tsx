import { journey } from "../lib/site";
import Icon, { type IconName } from "./Icon";

// P01 journey "Da necessidade à autonomia".
export default function Method() {
  return (
    <section className="vp-section vp-band" id="metodo" aria-labelledby="metodo-title">
      <div className="vp-wrap vp-journey">
        <div>
          <h2 className="vp-h2" id="metodo-title">Da necessidade à <em className="vp-accent">autonomia.</em></h2>
          <p className="vp-muted">Um caminho claro para reforçar hoje e construir amanhã.</p>
        </div>
        <ol className="vp-steps">
          {journey.map((s, i) => (
            <li key={s.title}>
              <span className="vp-step-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="vp-icon-box"><Icon name={s.icon as IconName} /></span>
              <div><h3>{s.title}</h3><p>{s.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
