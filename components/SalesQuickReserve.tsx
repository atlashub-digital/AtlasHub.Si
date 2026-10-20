
"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import styles from "./SalesQuickReserve.module.css";
import AroCheckoutSheet from "./AroCheckoutSheet";

type Availability = {
  open: boolean;
  pricing: { earlyMinor: number; regularMinor: number; promoMinor: number; currentMinor: number };
  promo?: { serverNow: string; expiresAt: string | null } | null;
};
const BRL = (minor: number) => (minor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const first = { earlyMinor: 24900, regularMinor: 49700, promoMinor: 24900, currentMinor: 24900 };

export default function SalesQuickReserve({ waUrl, initialAvailability }: { waUrl: string; initialAvailability?: Availability | null }) {
  const [availability, setAvailability] = useState<Availability | null>(initialAvailability ?? null);
  const [clockOffset, setClockOffset] = useState(0);
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
      .then(r => r.json()).then((d: Availability) => { if (live) { try { const saved = sessionStorage.getItem("ll01-checkout"); if (saved && /^[0-9a-f-]{36}$/i.test(saved)) setCheckoutId(saved); } catch {} setAvailability(d); if (d.promo?.serverNow) setClockOffset(new Date(d.promo.serverNow).getTime() - Date.now()); } })
      .catch(() => { if (live) setStatus("Atendimento disponível pelo WhatsApp."); });
    return () => { live = false; };
  }, []);
  useEffect(() => {
    if (!availability?.promo?.expiresAt) return;
    // O relógio reflete uma reserva existente no servidor. Não cria nem renova promoções.
    const timer = setInterval(() => setNow(Date.now() + clockOffset), 1000);
    return () => clearInterval(timer);
  }, [availability?.promo?.expiresAt, clockOffset]);

  const expiresAt = availability?.promo?.expiresAt ?? null;
  const seconds = expiresAt ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000)) : null;
  const open = availability?.open === true;
  const price = availability?.pricing ?? first;
  const promoActive = open && seconds !== null && seconds > 0;
  const effectivePrice = open ? (promoActive ? price.promoMinor : price.regularMinor) : price.promoMinor;
  const remaining = seconds ?? 0;
  async function generatePix(reservationId: string, buyerDocument: string) {
    const response = await fetch("/api/sales/ll01/checkout", {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reservationId, document: buyerDocument }),
    });
    const result = await response.json().catch(() => ({}));
    if (response.status === 201 && typeof result.id === "string") {
      try { sessionStorage.setItem("ll01-checkout", result.id); } catch {}
      setCheckoutId(result.id);
      setSheetOpen(true);
      return;
    }
    if (response.status === 409 && result.error === "already_pending" && typeof result.next === "string") {
      setCheckoutId(reservationId);
      setSheetOpen(true);
      return;
    }
    throw Error("pix_unavailable");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!open) { setStatus("Inscrições ainda não abertas. Contacte a equipa pelo WhatsApp."); return; }
    const data = new FormData(event.currentTarget);
    setPending(true); setStatus("");
    const doc = String(data.get("document") || "");
    setDocument(doc);
    try {
      const query = new URLSearchParams(window.location.search);
      const res = await fetch("/api/sales/ll01/reserve", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), phone: data.get("phone"), document: doc, email: data.get("email"),
          acceptTerms: data.get("acceptTerms") === "on", termsVersion: "ll01-2026-10-v1",
          marketing: data.get("marketing") === "on",
          campaign: (query.get("origem") || "LL01-SITE").toUpperCase(), website: data.get("website"),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status !== 201 || typeof body.id !== "string") {
        setStatus(body.error === "already_registered"
          ? "Já existe uma inscrição confirmada para este documento ou e-mail."
          : "Não foi possível concluir a reserva. Pode falar com a equipa pelo WhatsApp.");
        return;
      }
      setQuote({
        id: body.id, expiresAt: body.expiresAt,
        promoEligible: body.promoEligible === true, currentPrice: body.currentPrice || 49700,
      });
      // O comprador clica UMA vez. A reserva promocional existe no servidor antes da sessão ARO.
      try {
        await generatePix(body.id, doc);
      } catch {
        setStatus("A reserva foi criada, mas não foi possível abrir o PIX agora. Pode tentar novamente sem preencher os dados.");
      }
    } catch {
      setStatus("Falha de ligação. Nenhum pagamento foi confirmado.");
    } finally {
      setPending(false);
    }
  }
  async function pay() {
    if (!quote) return;
    setPending(true); setStatus("");
    try { await generatePix(quote.id, document); }
    catch { setStatus("Não foi possível abrir o PIX. A reserva permanece registada; pode tentar novamente."); }
    finally { setPending(false); }
  }
  const onConfirmed=useCallback(() => { setPaid(true); }, []);
  return (
    <>
      {checkoutId && <AroCheckoutSheet checkoutId={checkoutId} open={sheetOpen} productName="Automação com Pessoas no Centro · 100% ONLINE · AO VIVO · 27 e 29/10/2026 · 2 encontros" onClose={() => setSheetOpen(false)} onConfirmed={onConfirmed}/>}
      <aside className={styles.card} id="inscricao" aria-label="Reserva do Live Lab">
      <div className={styles.eyebrow}>100% ONLINE · AO VIVO · 27 e 29/10 · 2 encontros</div>
      {!checkoutId ? <><div className={styles.offer}>
        <strong className={styles.price}>{BRL(effectivePrice)}</strong>
        <span className={styles.strike}>{BRL(price.regularMinor)}</span>
      </div>
      <p className={styles.terms}>Promocional {BRL(price.promoMinor)} · regular {BRL(price.regularMinor)}. O valor final é confirmado no checkout ARO.</p>
      <div className={styles.promo} role="status">
        {promoActive ? <>Oferta termina em <strong className={styles.timer}>{Math.floor(remaining / 86400)}d {String(Math.floor(remaining % 86400 / 3600)).padStart(2, "0")}h {String(Math.floor(remaining % 3600 / 60)).padStart(2, "0")}m {String(remaining % 60).padStart(2, "0")}s</strong>. Prazo: {new Date(expiresAt!).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} (Brasília).</> : <>{open ? "Inscrição disponível pelo valor regular. O valor do Pix é validado antes da emissão." : "Compras temporariamente indisponíveis. Registe o seu interesse com a equipa; não há cobrança nem garantia de vaga."}</>}

      </div>
      </> : <p className={styles.promo}>PIX emitido. Pode fechar e reabrir a janela a qualquer momento enquanto conclui o pagamento.</p>}
      {checkoutId ? (
        <div className={styles.form}><button className={styles.cta} type="button" onClick={() => setSheetOpen(true)}>{paid ? "Consultar o meu bilhete →" : "Retomar meu Pix →"}</button></div>
      ) : open && quote ? (
        <div className={styles.form}>
          <p className={styles.note}>Dados guardados na reserva. O PIX será emitido pelo ARO e a inscrição só é confirmada depois de aprovado.</p>
          <button className={styles.cta} type="button" onClick={pay} disabled={pending}>{pending ? "Preparando Pix…" : "Abrir pagamento Pix novamente →"}</button>
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
          <button type="submit" className={styles.cta} disabled={pending}>{pending ? "Preparando seu Pix…" : `RESERVAR AGORA — ${BRL(effectivePrice)}`}</button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const url = new URL(waUrl);
          url.searchParams.set("text", (url.searchParams.get("text") || "") + "\nNome: " + data.get("name") + "\nE-mail: " + data.get("email"));
          window.location.assign(url.toString());
        }}>
          <label className={styles.label}>Nome<input className={styles.input} name="name" autoComplete="name" required minLength={2} maxLength={160} placeholder="Como devemos chamar você?" /></label>
          <label className={styles.label}>E-mail<input className={styles.input} name="email" type="email" autoComplete="email" required maxLength={160} placeholder="voce@empresa.com.br" /></label>
          <label className={styles.check}><input type="checkbox" required /><span>Autorizo partilhar estes dados com a equipa para receber informações deste evento.</span></label>
          <button className={styles.cta} type="submit">Registar interesse pelo WhatsApp →</button>
          <p className={styles.note}>Abre uma mensagem para você rever e enviar. Os dados só chegam à equipa após o envio no WhatsApp.</p>
        </form>
      )}
      <div className={styles.flow} aria-label="Fluxo da inscrição"><span><i className={styles.dot}/> Reserva</span><span>→</span><span><i className={styles.dot}/> PIX ARO</span><span>→</span><span><i className={styles.dot}/> Confirmação</span></div>
      <p className={styles.note}>A inscrição só fica confirmada após pagamento aprovado. Guarde o bilhete apresentado nesta página. Contacte a equipa para instruções de acesso.</p>
      <p className={styles.status} aria-live="polite">{status}</p>
      <a className={styles.secondary} href={waUrl} target="_blank" rel="noopener noreferrer">Dúvidas? Fale com a AtlasHub · +55 62 99190-3462</a>
      </aside>
    </>
  );
}
