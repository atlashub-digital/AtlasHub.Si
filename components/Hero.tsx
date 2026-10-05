export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-content">
        <p className="eyebrow">PEOPLE · TECHNOLOGY · RESULTS</p>
        <h1>
          INTELIGÊNCIA PARA
          <br />
          <span>EMPRESAS REAIS.</span>
        </h1>
        <p className="lead">
          Pessoas, agentes inteligentes e operações a trabalhar como um só
          sistema. Da tecnologia à capacidade de fazer melhor.
        </p>
        <div className="actions">
          <a className="button primary" href="#clara">
            Desenhar com a Clara <span>→</span>
          </a>
          <a
            className="button secondary"
            href="https://editions.atlashub.si/livros/empresa-aumentada"
          >
            Explorar Empresa Aumentada <span>↗</span>
          </a>
        </div>
        <a className="text-link hero-lab-link" href="#simulador">Experimentar o laboratório de operações <span aria-hidden="true">↗</span></a>
      </div>
      <div className="hero-note">
        <span>01 / A NOSSA VISÃO</span>
        <p>
          Da Inteligência Artificial
          <br />à Organização Inteligente.
        </p>
      </div>
      <div className="strip">
        <span>IDEIAS</span>
        <i>•</i>
        <span>OPERAÇÕES</span>
        <i>•</i>
        <span>TECNOLOGIA</span>
        <i>•</i>
        <span>AUTOMAÇÃO</span>
        <i>•</i>
        <span>RESULTADOS</span>
      </div>
    </section>
  );
}
