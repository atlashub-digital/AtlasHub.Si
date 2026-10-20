"use client";
import { useEffect, useState } from "react";
import { termsVersion } from "../lib/commerce/policy";
import { formatBRL, type Workshop } from "../lib/workshops";

export type Avail = { open: boolean; soldOut: boolean; lot: "antecipado" | "regular"; priceMinor: number };
const errors: Record<string, string> = {
  sold_out: "As inscrições estão esgotadas. Entre na lista de espera pelo WhatsApp.",
  already_registered: "Este e-mail já tem uma inscrição confirmada neste workshop. Veja o e-mail ou o WhatsApp de confirmação.",
  sales_closed: "As inscrições não estão abertas neste momento.",
  rate_limited: "Muitas tentativas seguidas. Aguarde alguns minutos.",
  aro_unavailable: "O sistema de pagamento está indisponível. Tente de novo dentro de minutos.",
  price_mismatch: "Não foi possível confirmar o valor. Nenhuma cobrança foi feita; tente de novo mais tarde.",
};
const fieldLabel: Record<string, string> = { name: "nome", email: "e-mail", phone: "WhatsApp", company: "empresa", document: "CPF/CNPJ", acceptTerms: "aceite das condições" };

/** CTA do topo: "Inscrever-me" só com vendas abertas; senão, "Conheça o programa". */
export function SignupCta({ w, waUrl, initialAvailability }: { w: Workshop; waUrl: string; initialAvailability?: Avail | null }) {
  const a = useAvailability(w, initialAvailability);
  if (a?.open && !a.soldOut)
    return <a className="vp-btn vp-btn-primary" href="#inscricao">GARANTIR INSCRIÇÃO — {formatBRL(a.priceMinor)} <span aria-hidden="true">→</span></a>;
  return (
    <>
      <a className="vp-btn vp-btn-primary" href="#programa">Conheça o programa <span aria-hidden="true">→</span></a>
      <a className="vp-btn vp-btn-secondary" href={waUrl} target="_blank" rel="noopener noreferrer">Dúvidas pelo WhatsApp</a>
    </>
  );
}

function useAvailability(w: Workshop, initialAvailability?: Avail | null) {
  const [a, setA] = useState<Avail | null>(initialAvailability ?? null);
  useEffect(() => {
    let alive = true;
    fetch("/api/workshops/availability", { cache: "no-store" }).then((r) => r.json()).then((d) => alive && setA(d?.[w.code] ?? null)).catch(() => {});
    return () => { alive = false; };
  }, [w.code]);
  return a;
}

export default function WorkshopSignup({ w, waUrl, initialAvailability }: { w: Workshop; waUrl: string; initialAvailability?: Avail | null }) {
  const a = useAvailability(w, initialAvailability);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (!a) return <p role="status">Consultando disponibilidade…</p>;
  if (!a.open || a.soldOut)
    return (
      <div className="vp-card">
        <h3>{a?.soldOut ? "Inscrições esgotadas" : "Inscrições em breve"}</h3>
        <p>{a?.soldOut ? "Entre na lista de espera: avisamos se abrir um lugar." : "Entre na lista de interesse e receba o aviso de abertura das inscrições."}</p>
        <a className="vp-btn vp-btn-primary" href={waUrl} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp <span aria-hidden="true">→</span></a>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setMsg("");
    // Código de origem da campanha (?origem=W01-IG); o servidor volta a validar e usa <CODE>-SITE por defeito.
    const q = new URLSearchParams(window.location.search);
    const campaign = (q.get("origem") || q.get("utm_campaign") || `${w.code}-SITE`).toUpperCase();
    try {
      const res = await fetch("/api/workshops/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          slug: w.slug, termsVersion, campaign,
          name: f.get("name"), email: f.get("email"), phone: f.get("phone"), company: f.get("company") || "",
          role: f.get("role") || "", document: f.get("document") || "", website: f.get("website") || "",
          acceptTerms: f.get("acceptTerms") === "on", marketing: f.get("marketing") === "on", waGroup: f.get("waGroup") === "on",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 201 && body.next) { window.location.assign(body.next); return; }
      setMsg(body.error === "invalid" ? `Verifique o campo: ${fieldLabel[body.field] ?? body.field}.` : errors[body.error] ?? "Não foi possível iniciar a inscrição. Tente de novo.");
    } catch {
      setMsg("Sem conexão. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  const el = w.code === "EL01";
  return (
    <div className="vp-card clara-contact" style={{ borderTop: 0 }}>
      <h3>Inscrição · {formatBRL(a.priceMinor)} <small>({a.lot === "antecipado" ? "lote antecipado" : "valor regular"}, {w.priceUnit})</small></h3>
      <form onSubmit={submit} aria-busy={busy} noValidate={false}>
        <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <label>{el ? "Nome do representante" : "Nome completo"}<input name="name" autoComplete="name" required minLength={2} maxLength={160} /></label>
          <label>E-mail (recebe a confirmação)<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
          <label>WhatsApp com DDD<input name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder="(62) 9…" /></label>
          <label>{el ? "Empresa / loja" : "Empresa (opcional)"}<input name="company" autoComplete="organization" required={el} maxLength={160} /></label>
          <label>Função (opcional)<input name="role" autoComplete="organization-title" maxLength={120} /></label>
          <label>CPF ou CNPJ (opcional, para o recibo)<input name="document" inputMode="numeric" maxLength={18} /></label>
          <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="consent"><input name="acceptTerms" type="checkbox" required /><span>Li e aceito as <a href="#condicoes">condições do evento</a> (local a divulgar, desistência, transferência e reembolso) e o uso destes dados para a inscrição.</span></label>
          <label className="consent"><input name="marketing" type="checkbox" /><span>Quero receber novidades da AtlasHub (opcional).</span></label>
          <label className="consent"><input name="waGroup" type="checkbox" /><span>Quero entrar no grupo de WhatsApp dos participantes (opcional).</span></label>
          <button className="vp-btn vp-btn-primary" type="submit">{busy ? "Preparando o PIX…" : "Inscrever-me e pagar com PIX"}</button>
        </fieldset>
      </form>
      <p className="form-status" role="status" aria-live="polite">{msg}</p>
      <p className="vp-note">Pagamento processado pelo ARO, o sistema de pagamentos da AtlasHub.</p>
    </div>
  );
}
