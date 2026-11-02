import Link from "next/link";

const packages = [
  {
    step: "01 · DESCUBRIR",
    name: "Diagnóstico IA",
    promise: "Saiba onde a inteligência artificial pode gerar valor antes de investir numa implementação.",
    price: "R$ 1.490",
    timing: "3–5 dias úteis após o início acordado",
    details: ["Análise de um processo real", "Até três oportunidades priorizadas", "Mapa operacional e missão do agente", "Relatório executivo e plano de ação"],
    href: "/diagnostico",
    cta: "Conhecer o Diagnóstico",
  },
  {
    step: "02 · IMPLEMENTAR",
    name: "Setup Agêntico",
    promise: "Configure e teste o primeiro agente digital para um processo e um canal bem definidos.",
    price: "R$ 4.900",
    timing: "10–15 dias úteis estimados, após acessos e escopo",
    details: ["Um agente especializado", "Base inicial de conhecimento", "Um canal e uma integração padrão", "Testes, documentação e revisão humana"],
    href: "/servicos/setup-agentico",
    cta: "Conhecer o Setup",
  },
] as const;

export default function CommercialPackages() {
  return (
    <section className="vp-section commercial-packages" id="pacotes" aria-labelledby="commercial-title">
      <div className="vp-wrap">
        <div className="vp-intro">
          <p className="vp-eyebrow">COMECE COM UM PROCESSO REAL</p>
          <h2 className="vp-h2" id="commercial-title">Da oportunidade à <span>primeira missão de IA.</span></h2>
          <p>Dois serviços de entrada, com entregáveis claros. Pode começar pelo diagnóstico ou trazer um processo já documentado para avaliação de setup.</p>
        </div>
        <div className="vp-grid vp-grid-2">
          {packages.map((pack) => (
            <article className="vp-card commercial-card" key={pack.name}>
              <p className="commercial-step">{pack.step}</p>
              <h3>{pack.name}</h3>
              <p className="commercial-description">{pack.promise}</p>
              <div className="commercial-price"><strong>{pack.price}</strong><span>valor de referência · pagamento único</span></div>
              <p className="commercial-timing">{pack.timing}</p>
              <ul>{pack.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              <Link className="vp-btn vp-btn-primary commercial-action" href={pack.href}>{pack.cta} →</Link>
            </article>
          ))}
        </div>
        <p className="commercial-disclaimer">Oferta-piloto sujeita à validação do escopo e disponibilidade. Preços, impostos, integrações e condições finais confirmados por proposta escrita. Custos recorrentes de IA, software e operação não estão incluídos no setup. Nenhuma contratação é concluída nesta página.</p>
      </div>
    </section>
  );
}
