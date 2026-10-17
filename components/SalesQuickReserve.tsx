
"use client";
import { useEffect, useState, type FormEvent } from "react";
import styles from "./SalesQuickReserve.module.css";

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
  const [status, setStatus] = useState("");
  useEffect(() => {
    let live = true;
    fetch("/api/sales/ll01/availability", { cache: "no-store" })
      .then(r => r.json()).then((d: Availability) => { if (live) setAvailability(d); })
      .catch(() => { if (live) setStatus("Atendimento disponível pelo WhatsApp."); });
    return () => { live = false; };
  }, []);
  useEffect(() => {
    if (!availability?.promo?.expiresAt) return;
    // O relógio reflete uma reserva existente no servidor. Não cria nem renova promoções.
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [availability?.promo?.expiresAt]);

  const expiresAt = availability?.promo?.expiresAt;
  const seconds = expiresAt ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000)) : null;
  const open = availability?.open === true;
  const price = availability?.pricing ?? first;
  const promoActive = open && seconds !== null && seconds > 0 && availability?.promo?.quoteId;
  const effectivePrice = promoActive ? price.promoMinor : price.earlyMinor;
  const remaining = seconds ?? 0;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!open) { setStatus("A abertura dos pagamentos ainda não foi confirmada. Reserve interesse pelo WhatsApp."); return; }
    const data = new FormData(event.currentTarget);
    setPending(true); setStatus("");
    try {
      const query = new URLSearchParams(window.location.search);
      const r = await fetch("/api/sales/ll01/checkout", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), phone: data.get("phone"),
          document: data.get("document"), email: data.get("email"),
          company: data.get("company"), acceptTerms: data.get("acceptTerms") === "on",
          marketing: data.get("marketing") === "on",
          quoteId: promoActive ? availability?.promo?.quoteId : null,
          campaign: (query.get("origem") ?? "LL01-SITE").toUpperCase(),
          website: data.get("website"),
        }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.status === 201 && typeof body.next === "string" && body.next.startsWith("/")) {
        window.location.assign(body.next); return;
      }
      setStatus(body.error === "email_required_by_provider"
        ? "Informe um e-mail válido para receber a confirmação da inscrição."
        : "Não foi possível iniciar o PIX. Nenhum pagamento foi efetuado. Pode falar com a equipa pelo WhatsApp.");
    } catch { setStatus("Falha de ligação. Nenhum pagamento foi efetuado."); }
    finally { setPending(false); }
  }
  return (
    <aside className={styles.card} id="inscricao" aria-label="Reserva do Live Lab">
      <div className={styles.eyebrow}>Inscrição · 4 lives online · 8 horas</div>
      <div className={styles.offer}>
        <strong className={styles.price}>{BRL(effectivePrice)}</strong>
        <span className={styles.strike}>{BRL(price.regularMinor)}</span>
      </div>
      <p className={styles.terms}>Valor antecipado {BRL(price.earlyMinor)} · regular {BRL(price.regularMinor)}. O valor final é confirmado no checkout ARO.</p>
      <div className={styles.promo} role="status">
        {promoActive ? <>Reserva promocional de 10% válida por <strong className={styles.timer}>{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</strong>. O valor emitido no PIX mantém-se durante a validade desse pagamento.</> :
          <>{open ? "Caso elegível, o desconto extra de 10% é ativado por uma reserva real de 5 minutos no servidor." : "Oferta antecipada aprovada. O checkout e o desconto temporário serão disponibilizados quando a integração financeira do LL01 for homologada."}</>}
      </div>
      {open ? (
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
          <button type="submit" className={styles.cta} disabled={pending}>{pending ? "Preparando seu PIX…" : "Reservar e pagar com PIX →"}</button>
        </form>
      ) : (
        <a className={styles.cta} href={waUrl} target="_blank" rel="noopener noreferrer">Reservar interesse pelo WhatsApp →</a>
      )}
      <div className={styles.flow} aria-label="Fluxo da inscrição"><span><i className={styles.dot}/> Reserva</span><span>→</span><span><i className={styles.dot}/> PIX ARO</span><span>→</span><span><i className={styles.dot}/> Confirmação</span></div>
      <p className={styles.note}>Dados complementares depois do pagamento. Confirmação por e-mail e WhatsApp quando o envio estiver configurado e autorizado.</p>
      <p className={styles.status} aria-live="polite">{status}</p>
      <a className={styles.secondary} href={waUrl} target="_blank" rel="noopener noreferrer">Dúvidas? Fale com a AtlasHub · +55 62 99190-3462</a>
    </aside>
  );
}
