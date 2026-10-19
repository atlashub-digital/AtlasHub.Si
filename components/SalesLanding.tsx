import { ll01Offer } from "../lib/sales/ll01-offer";
import Image from "next/image";
import Header from "./Header";
import Footer from "./Footer";
import type { SalesPageConfig } from "../lib/sales/pages";
import SalesQuickReserve from "./SalesQuickReserve";
import layout from "./SalesLandingLayout.module.css";

/** Landing comercial replicável, mobile-first, sem dependência de CMS ou provider de pagamento. */
export default function SalesLanding({ offer, whatsapp }: { offer: SalesPageConfig; whatsapp: string }) {
  const campaign = ll01Offer();
  const cta = `RESERVAR AGORA — R$${campaign.approved ? campaign.amount / 100 : 249}`;
  return (
    <>
      <Header current="/workshops" />
      <main id="conteudo">
        <section className="vp-hero" aria-labelledby="sales-title" style={{ backgroundImage: "linear-gradient(105deg, rgba(2, 13, 30, .96), rgba(2, 13, 30, .87) 54%, rgba(2, 13, 30, .42)), url('/assets/workshops/ll01/retrato-executivo-sentado.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className={"vp-wrap " + layout.heroGrid}>
            <div className={layout.heroCopy}>
              <p className="vp-eyebrow">{offer.eyebrow}</p>
              <h1 className="vp-h1" id="sales-title">{offer.titleStart}<br /><em>{offer.titleAccent}</em></h1>
              <p className="vp-lead" style={{ fontWeight: 600 }}>{offer.subtitle}</p>
              <p style={{ maxWidth: 730, fontSize: "1.1rem", lineHeight: 1.6, color: "#e3f0ff" }}>{offer.promise}</p>
              <div className="vp-hero-chips">
                <span className="vp-chip">2 encontros ao vivo</span>
                <span className="vp-chip">100% ONLINE</span>
                <span className="vp-chip">{offer.dateLabel}</span>
              </div>
              <div className={layout.fact}><span aria-hidden="true" /> 100% ONLINE · 27 E 29 DE OUTUBRO DE 2026</div>
              <div className="vp-actions" style={{ marginTop: 20 }}>
                <a className="vp-btn vp-btn-primary" href="#inscricao">{cta} <span aria-hidden="true">→</span></a>
                <a className="vp-btn vp-btn-secondary" href="#programa">Conhecer o programa</a>
              </div>
              <div className={layout.presenter}><Image src="/assets/workshops/ll01/retrato-executivo-em-pe.webp" width={90} height={104} alt="Sérgio Monteiro, formador do Live Lab Automação com Pessoas no Centro" /><p>Com Sérgio Monteiro<br /><span>AtlasHub Editions</span></p></div>
              <div className={layout.miniFlow}><strong>01. Reserve</strong><span>→</span><strong>02. Pague pelo ARO</strong><span>→</span><strong>03. Receba confirmação</strong></div>
            </div>
            <div className={layout.formCol}><SalesQuickReserve waUrl={whatsapp} /></div>
          </div>
        </section>

        <section className="vp-section" aria-labelledby="porque">
          <div className="vp-wrap">
            <div className="vp-intro">
              <p className="vp-eyebrow">A mudança de mentalidade</p>
              <h2 className="vp-h2" id="porque">A sua operação precisa de mais uma ferramenta — ou de trabalhar de outra forma?</h2>
              <p>Em vez de passar o dia entre aplicações separadas, aprenda a combinar processos, pessoas, dados e inteligência artificial num mesmo ecossistema de trabalho.</p>
            </div>
            <div className="vp-grid vp-grid-4">
              {offer.benefits.map(b => <article key={b.title} className="vp-card"><h3>{b.title}</h3><p>{b.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="vp-section vp-band" id="programa" aria-labelledby="programa-ll01">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">2 encontros · 100% ONLINE</p><h2 className="vp-h2" id="programa-ll01">Da visão à construção do seu agente.</h2><p>Conteúdo transversal, com exemplos em diferentes atividades e aplicação à realidade de cada participante.</p></div>
            <div className="vp-grid vp-grid-4">
              {offer.schedule.map(s => <article className="vp-card" key={s.when}><p className="vp-eyebrow">{s.when}</p><h3>{s.title}</h3><p>{s.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="vp-section" aria-labelledby="paraquem">
          <div className="vp-wrap">
            <div className="vp-intro"><p className="vp-eyebrow">Para quem</p><h2 className="vp-h2" id="paraquem">Inteligência aplicada a operações reais.</h2><p>O princípio é o mesmo para quem vende, atende, produz, gere ou aprende — o ponto de partida é um processo e um objetivo.</p></div>
            <div className="vp-grid vp-grid-3">
              <article className="vp-card"><h3>Áreas e públicos</h3><ul>{offer.audiences.map(a => <li key={a}>{a}</li>)}</ul></article>
              <article className="vp-card"><h3>O que leva consigo</h3><ul>{offer.deliverables.map(a => <li key={a}>{a}</li>)}</ul></article>
              <article className="vp-card"><h3>Sem promessas artificiais</h3><p>Não é uma certificação técnica nem uma implementação de software personalizada. É um laboratório para construir capacidade de avaliação, desenho e execução responsável.</p></article>
            </div>
          </div>
        </section>

        <section className="vp-section vp-band" aria-labelledby="livro"><div className={"vp-wrap " + layout.book}>
          <Image src="/assets/workshops/ll01/empresa-aumentada-capa-usuario.webp" width={747} height={756} alt="Empresa Aumentada — Da Inteligência Artificial à Organização Inteligente, de Sérgio Monteiro, AtlasHub Editions" />
          <div><p className="vp-eyebrow">AtlasHub Editions · Sérgio Monteiro</p><h2 className="vp-h2" id="livro">Empresa Aumentada</h2><p>Da Inteligência Artificial à Organização Inteligente. Uma leitura complementar sobre pessoas, processos, dados e agentes.</p><p>A leitura digital já é gratuita na AtlasHub Editions.</p><div className="vp-actions"><a className="vp-btn vp-btn-secondary" href="https://editions.atlashub.si/livros/empresa-aumentada">Ler na AtlasHub Editions</a><a className="vp-btn vp-btn-primary" href="#inscricao">{cta}</a></div></div>
        </div></section>
        <section className="vp-section" id="condicoes" aria-labelledby="termos-ll01"><div className="vp-wrap"><div className="vp-intro"><p className="vp-eyebrow">Condições comerciais</p><h2 className="vp-h2" id="termos-ll01">Informação antes da inscrição.</h2><p>R$249 promocional · R$497 regular. O preço vigente e as condições são apresentados antes de emitir o Pix. Horários e plataforma serão comunicados antes da abertura das compras.</p></div><div className="vp-grid vp-grid-3">
          <article className="vp-card"><h3>Pagamento</h3><p>PIX pelo sistema de pagamentos da AtlasHub (ARO). A inscrição só fica confirmada, com bilhete, depois de o pagamento ser aprovado. Não aceitamos comprovantes por WhatsApp como confirmação.</p></article>
          <article className="vp-card"><h3>Desistência</h3><p>Reembolso integral se pedir em até 7 dias depois do pagamento (direito de arrependimento, CDC art. 49).</p></article>
          <article className="vp-card"><h3>Transferência</h3><p>Depois desse prazo, a inscrição pode ser transferida para outra pessoa da sua empresa, sem custo, até 48 horas antes do primeiro encontro.</p></article>
          <article className="vp-card"><h3>Adiamento ou cancelamento pela AtlasHub</h3><p>Você escolhe entre a nova data e o reembolso integral, sem custos.</p></article>
          <article className="vp-card"><h3>Reserva promocional</h3><p>A oferta depende do prazo oficial da campanha. Um Pix emitido mantém o seu valor até à própria expiração; novas tentativas usam a condição vigente. Não existe desconto renovável ao recarregar.</p></article>
          <article className="vp-card"><h3>Privacidade</h3><p>Dados usados só para a inscrição, bilhete e comunicação do evento. Documento armazenado apenas como código de verificação, nunca em texto legível.</p></article>
        </div></div></section>

        <section className="vp-section vp-band" aria-labelledby="faq-ll01">
          <div className="vp-wrap"><div className="vp-intro"><p className="vp-eyebrow">Dúvidas frequentes</p><h2 className="vp-h2" id="faq-ll01">Antes de participar.</h2></div>
            <div className="vp-faq">{offer.faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
          </div>
        </section>

        <section className="vp-section" id="reserva" aria-labelledby="reserva-ll01">
          <div className="vp-wrap">
            <div className="vp-cta">
              <p className="vp-eyebrow">100% ONLINE · DOIS ENCONTROS</p>
              <h2 className="vp-h2" id="reserva-ll01">Quer colocar a IA a trabalhar na sua operação?</h2>
              <p>{offer.dateLabel}. Manifeste já o seu interesse e receba as informações quando as inscrições abrirem.</p>
              <div className="vp-actions">
                <a className="vp-btn vp-btn-primary" href="#inscricao">{cta} <span aria-hidden="true">→</span></a>
              </div>
              <p className="vp-note">WhatsApp: +55 62 99190-3462. O envio da mensagem depende da sua confirmação no WhatsApp. Não se trata de um pagamento nem da garantia de lugar.</p>
            </div>
          </div>
        </section>
      </main>
      <a className={layout.sticky} href="#inscricao">100% ONLINE · {cta}</a>
      <Footer />
    </>
  );
}
