import Link from "next/link";
import Image from "next/image";
import { APP_URL, EDITIONS_URL } from "../lib/site";

export default function Footer() {
  return (
    <footer className="vp-footer">
      <div className="vp-wrap">
        <div>
          <Link className="vp-brand" href="/" aria-label="AtlasHub.SI — início">
            <Image src="/assets/atlashub-logo.webp" width={36} height={36} alt="" />
            <span className="vp-wordmark"><strong>ATLASHUB<b>.SI</b></strong><small>AI WORKFORCE</small></span>
          </Link>
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
