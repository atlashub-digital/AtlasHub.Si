import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diagnóstico IA — Oportunidade, processo e plano de ação",
  description: "Diagnóstico AtlasHub AI Workforce: mapa de um processo, oportunidades de IA, missão do agente, estimativa preliminar de benefícios e roteiro de implementação.",
  alternates: { canonical: "/diagnostico" },
};

const deliverables = [
  { title: "Entrevista de descoberta", detail: "Até 90 minutos com o responsável pelo processo. Identificamos tarefa, pessoas, sistemas e obstáculos." },
  { title: "Mapa do processo atual", detail: "Desenho dos passos, fontes de informação, decisões e pontos de passagem para pessoas." },
  { title: "Oportunidades priorizadas", detail: "Até três hipóteses, com comparação de valor potencial, viabilidade, riscos e pré-requisitos." },
  { title: "Missão do primeiro agente", detail: "Objetivos, limites, fontes permitidas e ações sujeitas a aprovação humana." },
  { title: "Estimativa e roteiro", detail: "Hipóteses transparentes de benefício, fases e requisitos de um eventual projeto de implementação." },
  { title: "Relatório e devolutiva", detail: "PDF executivo com plano de ação e sessão de apresentação de até 45 minutos." },
] as const;

const requestUrl = "https://wa.me/5562991903462?text=" + encodeURIComponent("Olá, AtlasHub. Gostaria de contratar o Diagnóstico IA de um processo da minha empresa. Por favor, confirmem o escopo, o investimento e a disponibilidade.");

export default function DiagnosticPage() {
  return <><Header /><main id="conteudo">
    <section className="atlas-generic-hero"><div className="atlas-container">
      <p className="arch-eyebrow">PACOTE 01 · DIAGNÓSTICO IA</p>
      <h1>Antes de automatizar, <em>entenda a sua operação.</em></h1>
      <p>Um diagnóstico profissional, centrado num processo real da sua empresa. Saiba onde a IA pode ajudar, o que precisa de ser preparado e qual deve ser a primeira missão.</p>
      <div className="arch-actions">
        <a className="arch-button arch-button-primary" href={requestUrl} target="_blank" rel="noopener noreferrer">Solicitar Diagnóstico IA ↗</a>
        <Link className="arch-button arch-button-outline" href="/#clara">Experimentar pré-análise gratuita →</Link>
      </div>
    </div></section>
    <section className="vp-section" id="profissional"><div className="atlas-container">
      <div className="atlas-section-head">
        <p className="arch-eyebrow">UM PROCESSO · ENTREGÁVEIS CLAROS</p>
        <h2>Da primeira conversa ao <em>AtlasHub AI Opportunity Report.</em></h2>
        <p>Referência comercial: <strong>R$ 1.490, pagamento único</strong>. Prazo de 3–5 dias úteis estimados após início acordado e acesso às informações necessárias. As condições finais são confirmadas por proposta escrita.</p>
      </div>
      <div className="commercial-detail-list">
        {deliverables.map(item => <article className="vp-card" key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}
      </div>
      <p className="commercial-detail-note">O Diagnóstico não constitui auditoria integral, garantia de redução de custos, programação, integração de sistemas ou entrada em produção. A análise depende de informações disponibilizadas pelo cliente; benefícios são estimativas, não resultados comprovados.</p>
      <div className="atlas-diagnostic-cta">
        <h2>Pronto para identificar a primeira oportunidade?</h2>
        <p>Comece por uma conversa. Confirmamos o âmbito e enviamos as condições antes de qualquer pagamento. Se já tem o processo documentado, também pode solicitar avaliação direta para o Setup Agêntico.</p>
        <div className="arch-actions">
          <a className="arch-button arch-button-primary" href={requestUrl} target="_blank" rel="noopener noreferrer">Pedir proposta de Diagnóstico ↗</a>
          <Link className="arch-button arch-button-outline" href="/servicos/setup-agentico">Conhecer Setup Agêntico →</Link>
        </div>
      </div>
    </div></section>
  </main><Footer /></>;
}
