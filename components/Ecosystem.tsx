export default function Ecosystem() {
  return (
    <section className="band" id="ecossistema">
      <div className="section">
        <p className="eyebrow">ECOSSISTEMA ATLASHUB</p>
        <h2>
          Do conhecimento
          <br />
          <span>à capacidade de agir.</span>
        </h2>
        <div className="ecosystem">
          <a href="https://editions.atlashub.si">
            <span className="eyebrow">01 · CONHECIMENTO</span>
            <h3>Editions ↗</h3>
            <p>
              Edições abertas à comunidade. Livros e materiais para compreender,
              discutir e aplicar.
            </p>
            <strong>Explorar publicações →</strong>
          </a>
          <a
            href={"https://wa.me/5562991903462?text=" + encodeURIComponent("Olá, equipa AtlasHub. Gostaria de saber mais sobre a Academy.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="eyebrow">02 · CAPACIDADE</span>
            <h3>Academy ↗</h3>
            <p>Aprendizagem e desenvolvimento de competências.</p>
            <small>Em preparação · falar no WhatsApp</small>
          </a>
          <a href="https://app.atlashub.si">
            <span className="eyebrow">03 · OPERAÇÃO</span>
            <h3>App ↗</h3>
            <p>Inteligência operacional no contexto da empresa.</p>
            <strong>Abrir a demonstração →</strong>
          </a>
        </div>
      </div>
    </section>
  );
}
