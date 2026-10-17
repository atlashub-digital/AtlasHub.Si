
"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import styles from "./SalesQuickReserve.module.css";
import AroCheckoutSheet from "./AroCheckoutSheet";

type Availability = {
  open: boolean;
  pricing: { earlyMinor: number; regularMinor: number; promoMinor: number };
  promo?: { quoteId: string; expiresAt: string } | null;
};
const BRL = (minor: number) => (minor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const first = { earlyMinor: 39700, regularMinor: 49700, promoMinor: 35730 };

export default function SalesQuickReserve({ waUrl }: { waUrl: string }) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pending, setPending] = useState(false);
  const [quote, setQuote] = useState<{ id: string; expiresAt: string | null; promoEligible: boolean; currentPrice: number } | null>(null);
  const [document, setDocument] = useState("");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    let live = true;
    fetch("/api/sales/ll01/availability", { cache: "no-store" })
      .then(r => r.json()).then((d: Availability) => { if (live) setAvailability(d); })
      .catch(() => { if (live) setStatus("Atendimento disponível pelo WhatsApp."); });
    return () => { live = false; };
  }, []);
  useEffect(() => {
    if (!quote?.expiresAt) return;
    // O relógio reflete uma reserva existente no servidor. Não cria nem renova promoções.
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [quote?.expiresAt]);

  const expiresAt = quote?.expiresAt ?? null;
  const seconds = expiresAt ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000)) : null;
  const open = availability?.open === true;
  const price = availability?.pricing ?? first;
  const promoActive = open && quote?.promoEligible === true && seconds !== null && seconds > 0;
  const effectivePrice = promoActive ? price.promoMinor : quote?.currentPrice ?? price.earlyMinor;
  const remaining = seconds ?? 0;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!open) { setStatus("Reservas pagas ainda não estão abertas. Contacte a AtlasHub pelo WhatsApp."); return; }
    const data = new FormData(event.currentTarget);
    setPending(true); setStatus("");
    const doc=String(data.get("document")||""); setDocument(doc);
    try {
      const query = new URLSearchParams(window.location.search);
      const res=await fetch("/api/sales/ll01/reserve", {
        method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:data.get("name"),phone:data.get("phone"),document:doc,email:data.get("email"),
          acceptTerms:data.get("acceptTerms")==="on", termsVersion:"ll01-2026-10-v1",
          marketing:data.get("marketing")==="on",
          campaign:(query.get("origem")||"LL01-SITE").toUpperCase(),website:data.get("website")
        })
      });
      const b=await res.json().catch(()=>({}));
      if(res.status===201 && typeof b.id==="string") {
        setQuote({id:b.id,expiresAt:b.expiresAt,promoEligible:b.promoEligible===true,currentPrice:b.currentPrice||39700});
        setStatus("Reserva recebida. Confira o valor e gere o PIX para concluir a inscrição.");
      } else {setStatus(b.error==="already_registered"?"Já existe uma inscrição confirmada para este documento/e-mail.":"Não foi possível reservar neste momento. Contacte a AtlasHub.");}
    }catch{setStatus("Erro de ligação. Nenhum pagamento foi efetuado.");}
    finally{setPending(false);}
  }
  async function pay() {
    if(!quote)return;
    setPending(true);setStatus("");
    try {
      const res=await fetch("/api/sales/ll01/checkout",{
        method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:quote.id,document})
      });
      const b=await res.json().catch(()=>({}));
      if(res.status===201 && typeof b.id==="string"){ setCheckoutId(b.id); setSheetOpen(true); }
      else if(res.status===409 && b.error==="already_pending" && typeof b.next==="string"){ setCheckoutId(quote.id); setSheetOpen(true); }
      else setStatus("O PIX ainda não pôde ser emitido. Nenhum pagamento foi efetuado. Pode falar com a equipa pelo WhatsApp.");
    }catch{setStatus("Falha de ligação ao pagamento. Tente novamente.");}
    finally{setPending(false);}
  }
  const onConfirmed=useCallback(() => { setPaid(true); setSheetOpen(false); }, []);
  if(paid) return <div className={styles.card} id="inscricao" role="status" aria-live="polite">
    <p className={styles.eyebrow}>LL01 · Inscrição confirmada</p>
    <h2>Pagamento confirmado!</h2>
    <p>Obrigado pela inscrição. As informações das quatro sessões LIVE ONLINE serão encaminhadas pelos canais informados, conforme a configuração de notificações da AtlasHub.</p>
    <a className={styles.secondary} href={waUrl} target="_blank" rel="noopener noreferrer">Precisa de ajuda? Fale com a nossa equipa</a>
  </div>;
  return (
    <>
      {checkoutId && <AroCheckoutSheet checkoutId={checkoutId} open={sheetOpen} productName="Live Lab 01 — Automação com Pessoas no Centro" onClose={() => setSheetOpen(false)} onConfirmed={onConfirmed}/>}
      <aside className={styles.card} id="inscricao" aria-label="Reserva do Live Lab">
      <div className={styles.eyebrow}>Inscrição · 4 lives online · 8 horas</div>
      {!checkoutId ? <><div className={styles.offer}>
        <strong className={styles.price}>{BRL(effectivePrice)}</strong>
        <span className={styles.strike}>{BRL(price.regularMinor)}</span>
      </div>
      <p className={styles.terms}>Valor antecipado {BRL(price.earlyMinor)} · regular {BRL(price.regularMinor)}. O valor final é confirmado no checkout ARO.</p>
      <div className={styles.promo} role="status">
        {promoActive ? <>Reserva promocional de 10% válida por <strong className={styles.timer}>{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</strong>. O valor emitido no PIX mantém-se durante a validade desse pagamento.</> :
          <>{open ? (quote ? "A janela do desconto de 10% terminou. Será aplicado o preço vigente antes de emitir o PIX." : "Reserve primeiro para iniciar uma janela promocional real de 5 minutos, quando disponível.") : "Oferta antecipada aprovada. O checkout e o desconto temporário serão disponibilizados quando a integração financeira do LL01 for homologada."}</>}
      </div>
      </> : <p className={styles.promo}>PIX emitido. Pode fechar e reabrir a janela a qualquer momento enquanto conclui o pagamento.</p>}
      {checkoutId ? (
        <div className={styles.form}><button className={styles.cta} type="button" onClick={() => setSheetOpen(true)}>Abrir meu PIX →</button></div>
      ) : open && quote ? (
        <div className={styles.form}>
          <p className={styles.note}>Dados guardados na reserva. O PIX será emitido pelo ARO e a inscrição só é confirmada depois de aprovado.</p>
          <button className={styles.cta} type="button" onClick={pay} disabled={pending}>{pending ? "Preparando PIX…" : "Confirmar valor e gerar PIX →"}</button>
          <button className={styles.secondary} type="button" onClick={()=>setQuote(null)}>Alterar dados da reserva</button>
        </div>
      ) : open ? (
        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label}>Nome completo<input className={styles.input} name="name" autoComplete="name" required minLength={2} maxLength={160} placeholder="Como devemos chamar você?" /></label>
          <div className={styles.two}>
            <label className={styles.label}>WhatsApp com DDD<input className={styles.input} name="phone" type="tel" autoComplete="tel" required placeholder="(62) 99999-9999" maxLength={22} /></label>
            <label className={styles.label}>CPF ou CNPJ<input className={styles.input} name="document" inputMode="numeric" required placeholder="Somente números" maxLength={18} /></label>
          </div>
          <div className={styles.two}>
            <label className={styles.label}>E-mail para confirmação<input className={styles.input} type="email" name="email" autoComplete="email" required placeholder="voce@empresa.com.br" maxLength={160}/></label>
            <label className={styles.label}>Empresa (opcional)<input className={styles.input} name="company" autoComplete="organization" placeholder="Nome do negócio" maxLength={160} /></label>
          </div>
          <input name="website" type="text" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} tabIndex={-1} autoComplete="off" aria-hidden="true"/>
          <label className={styles.check}><input type="checkbox" name="acceptTerms" required/><span>Li e aceito os termos comerciais e o tratamento de dados necessário para inscrição e pagamento. <a href="#condicoes" style={{ color: "#6ee6fb" }}>Ver condições</a>.</span></label>
          <label className={styles.check}><input type="checkbox" name="marketing"/><span>Quero receber outros conteúdos da AtlasHub (opcional).</span></label>
          <button type="submit" className={styles.cta} disabled={pending}>{pending ? "Criando reserva…" : "Reservar agora · confirmar PIX depois →"}</button>
        </form>
      ) : (
        <a className={styles.cta} href={waUrl} target="_blank" rel="noopener noreferrer">Reservar interesse pelo WhatsApp →</a>
      )}
      <div className={styles.flow} aria-label="Fluxo da inscrição"><span><i className={styles.dot}/> Reserva</span><span>→</span><span><i className={styles.dot}/> PIX ARO</span><span>→</span><span><i className={styles.dot}/> Confirmação</span></div>
      <p className={styles.note}>Dados complementares depois do pagamento. Confirmação por e-mail e WhatsApp quando o envio estiver configurado e autorizado.</p>
      <p className={styles.status} aria-live="polite">{status}</p>
      <a className={styles.secondary} href={waUrl} target="_blank" rel="noopener noreferrer">Dúvidas? Fale com a AtlasHub · +55 62 99190-3462</a>
      </aside>
    </>
  );
}
