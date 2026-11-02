import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Setup Agêntico — Primeiro agente digital",
  description: "Implementação de entrada AtlasHub AI Workforce: um agente, um processo, um canal e uma integração padrão, com testes e supervisão humana.",
  alternates: { canonical: "/servicos/setup-agentico" },
};

const includes = [
  ["Missão e governança", "Definição da função, limites, permissões e pontos de aprovação humana."],
  ["Agente e conhecimento", "Configuração de um agente e base inicial de até 20 documentos/páginas, após revisão de adequação."],
  ["Canal e integração", "Um canal compatível e uma integração padrão previamente acordados; contas e acessos disponibilizados pelo cliente."],
  ["Validação", "Cenários de teste, encaminhamento humano, registo dos resultados e correção dos defeitos dentro do âmbito aprovado."],
  ["Entrega", "Documentação, uma sessão operacional de 60 minutos e sete dias de estabilização conforme a proposta."],
] as const;

const requestUrl = "https://wa.me/5562991903462?text=" + encodeURIComponent("Olá, AtlasHub. Quero avaliar o Setup Agêntico para um processo da minha empresa. Peço confirmação do escopo, preço e condições.");

export default function SetupAgenticoPage() {
  return <><Header /><main id="conteudo">
    <section className="atlas-generic-hero"><div className="atlas-container">
      <p className="arch-eyebrow">ATLASHUB AI WORKFORCE · SERVIÇO DE IMPLEMENTAÇÃO</p>
      <h1>Um processo. Um agente. <em>Uma missão bem definida.</em></h1>
      <p>Transformamos um processo previamente documentado numa primeira implementação supervisionada, com regras claras, testes, formação e entrega validada.</p>
      <div className="arch-actions"><a className="arch-button arch-button-primary" href={requestUrl} target="_blank" rel="noopener noreferrer">Solicitar avaliação do Setup ↗</a><Link href="/diagnostico" className="arch-button arch-button-outline">Ainda precisa de diagnóstico? →</Link></div>
    </div></section>
    <section className="vp-section"><div className="atlas-container">
      <div className="atlas-section-head"><p className="arch-eyebrow">PACOTE 02 · SETUP AGÊNTICO</p><h2>Implementação delimitada. <em>Com critérios de aceitação.</em></h2><p>Referência comercial: <strong>R$ 4.900, pagamento único</strong>. Prazo estimado: 10–15 dias úteis após aprovação do escopo e disponibilidade dos acessos. A proposta escrita define as condições finais.</p></div>
      <div className="commercial-detail-list">{includes.map(([title,detail])=><article className="vp-card" key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div>
      <p className="commercial-detail-note">O pacote base cobre um agente, um processo, um canal e uma integração padrão. Não inclui plataformas de terceiros, consumo de APIs, campanhas, múltiplos agentes, sistemas sob medida, operações contínuas nem manutenção evolutiva. A entrada em produção depende da viabilidade técnica, das permissões e da aprovação dos testes.</p>
      <div className="atlas-diagnostic-cta"><h2>O seu processo já está mapeado?</h2><p>Envie os requisitos para avaliação. Caso ainda não existam, comece pelo Diagnóstico IA. Não há pagamento automático nesta página.</p><div className="arch-actions"><a className="arch-button arch-button-primary" href={requestUrl} target="_blank" rel="noopener noreferrer">Pedir proposta de Setup ↗</a><Link className="arch-button arch-button-outline" href="/diagnostico">Explorar Diagnóstico →</Link></div></div>
    </div></section>
  </main><Footer /></>;
}
