import Link from "next/link";
const phases = [
  { title: "Descoberta", detail: "Conhecimento, demonstrações e primeiras perguntas.", destination: "/casos" },
  { title: "Pré-diagnóstico", detail: "A Clara ajuda a identificar um processo e desenhar um mapa inicial.", destination: "/diagnostico" },
  { title: "Diagnostic + Blueprint", detail: "Um profissional valida o contexto e propõe uma arquitetura priorizada.", destination: "/diagnostico#profissional" },
  { title: "Atlas Build", detail: "Piloto, integrações, testes, aprovação humana e aceitação.", destination: "/solucoes/enterprise-transformation" },
  { title: "Atlas Operate", detail: "Operação acompanhada, indicadores, incidentes e melhoria contínua.", destination: "/solucoes/ai-workforce" },
  { title: "Academy + Club", detail: "Capacitação das equipas e evolução da capacidade própria.", destination: "/academy" },
];
export default function AtlasJourney() {
  return <section className="atlas-journey" id="jornada" aria-labelledby="jornada-title"><div className="atlas-container">
    <div className="atlas-section-head"><p className="arch-eyebrow">DA PRIMEIRA PERGUNTA À CAPACIDADE PERMANENTE</p><h2 id="jornada-title">Uma jornada de transformação. <em>Não uma coleção de ferramentas.</em></h2><p>O diagnóstico é o ponto de partida. A construção e o acompanhamento são o compromisso.</p></div>
    <ol className="atlas-journey-grid">{phases.map((step,i)=><li key={step.title}><Link href={step.destination} className="atlas-journey-card"><span className="atlas-step-index">{String(i+1).padStart(2,"0")}</span><h3>{step.title}</h3><p>{step.detail}</p><span className="atlas-step-next" aria-hidden="true">↗</span></Link></li>)}</ol>
    <div className="atlas-journey-end"><p>Uma empresa evolui por etapas. Começamos com um processo real, medimos o impacto e expandimos apenas depois da validação.</p><Link href="/metodo" className="arch-button arch-button-outline">Ver o método de arquitetura →</Link></div>
  </div></section>;
}