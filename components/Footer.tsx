import Link from "next/link";
import Brand from "./Brand";
import { APP_URL, EDITIONS_URL } from "../lib/site";

export default function Footer() {
  return (
    <footer className="vp-footer">
      <div className="vp-wrap">
        <div>
          <Brand size={36} />
          <p>People | Technology | Results</p>
          <p>Colaboradores digitais geridos e transformação empresarial, com pessoas no controle.</p>
        </div>
        <nav aria-label="Soluções">
          <h2>Soluções</h2>
          <ul>
            <li><Link href="/solucoes/ai-workforce">AI Workforce</Link></li>
            <li><Link href="/solucoes/enterprise-transformation">Enterprise Transformation</Link></li>
            <li><a href={APP_URL}>Plataforma ↗</a></li>
            <li><a href={EDITIONS_URL}>Editions ↗</a></li>
          </ul>
        </nav>
        <nav aria-label="Contato">
          <h2>Contato</h2>
          <ul>
            <li><Link href="/#clara">Fale com a Clara</Link></li>
            <li><a href="https://wa.me/5562991903462" target="_blank" rel="noopener noreferrer">WhatsApp · +55 62 99190-3462 ↗</a></li>
          </ul>
        </nav>
        <div className="vp-footer-legal">
          <span>© AtlasHub.SI · ATLAS GLOBAL TECH LTD (UK) · AtlasHub - ME (Brasil)</span>
          <span>Privacidade e termos: em revisão jurídica</span>
        </div>
      </div>
    </footer>
  );
}
