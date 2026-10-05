import Image from "next/image";
export default function Header() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Saltar para o conteúdo
      </a>
      <header className="header">
        <a className="brand" href="#inicio" aria-label="AtlasHub — início">
          <Image
            src="/assets/atlashub-logo.webp"
            width={44}
            height={44}
            alt=""
          />
          <span>
            Atlas<b>Hub</b>
          </span>
        </a>
        <nav aria-label="Principal">
          <a href="#abordagem">Abordagem</a>
          <a href="#areas">Áreas de atuação</a>
          <a href="#clara">Clara</a>
          <a href="#ecossistema">Ecossistema</a>
          <a href="https://editions.atlashub.si">Editions ↗</a>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Abrir navegação">Menu ☰</summary>
          <nav aria-label="Navegação móvel">
            <a href="#abordagem">Abordagem</a>
            <a href="#areas">Áreas de atuação</a>
            <a href="#clara">Clara</a>
            <a href="#ecossistema">Ecossistema</a>
            <a href="https://editions.atlashub.si">Editions ↗</a>
          </nav>
        </details>
      </header>
    </>
  );
}
