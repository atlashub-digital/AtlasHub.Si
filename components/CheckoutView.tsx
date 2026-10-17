"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatBRL } from "../lib/workshops";

type View =
  | { state: "PENDING"; workshop: string; offer: string | null; amountMinor: number | null; payment: { copyPaste: string; qrSvg: string; expiresAt: string } | null }
  | { state: "PROCESSING"; workshop: string }
  | { state: "CONFIRMED"; workshop: string; ticket: string | null }
  | { state: "FAILED" | "EXPIRED" | "CANCELED" | "RELEASED" | "REVOKED"; workshop: string };

const back: Record<string, string> = { W01: "/workshops/empresa-aumentada-2027-2030", EL01: "/workshops/enterprise-lab-ecommerce", LL01: "/workshops/automacao-pessoas-no-centro" };

export default function CheckoutView({ id }: { id: string }) {
  const [v, setV] = useState<View | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch(`/api/workshops/checkout/${id}`, { credentials: "same-origin", cache: "no-store" });
        if (r.status === 404) { setErr("Inscrição não encontrada."); return; }
        const d = (await r.json()) as View;
        if (!alive) return;
        setV(d); setErr("");
        if (d.state === "PENDING" || d.state === "PROCESSING") timer.current = setTimeout(poll, 4000);
      } catch {
        if (alive) { setErr("Sem conexão; tentando de novo…"); timer.current = setTimeout(poll, 8000); }
      }
    };
    poll();
    return () => { alive = false; if (timer.current) clearTimeout(timer.current); };
  }, [id]);

  if (err && !v) return <p className="form-status" role="status">{err}</p>;
  if (!v) return <p role="status">Carregando o pagamento…</p>;
  const link = back[v.workshop] ?? "/workshops";

  if (v.state === "CONFIRMED")
    return (
      <div className="vp-card" role="status">
        <p className="vp-eyebrow">Pagamento aprovado</p>
        <h2 className="vp-h2">Inscrição confirmada.</h2>
        {v.ticket ? <p>Bilhete: <strong style={{ fontSize: 28, letterSpacing: ".08em" }}>{v.ticket}</strong></p> : <p>O bilhete foi enviado para o seu e-mail e WhatsApp.</p>}
        <p>Guarde este código. {v.workshop === "LL01" ? "Os detalhes de acesso às quatro lives online serão comunicados pela AtlasHub pelos canais autorizados." : "O local em Anápolis é comunicado por e-mail e WhatsApp até 7 dias antes do evento."}</p>
        <Link className="vp-btn vp-btn-secondary" href={link}>Voltar ao programa</Link>
      </div>
    );
  if (v.state === "PROCESSING")
    return <div className="vp-card" role="status"><h2 className="vp-h2">Pagamento recebido.</h2><p>Confirmando a inscrição… Esta página atualiza sozinha.</p></div>;
  if (v.state !== "PENDING")
    return (
      <div className="vp-card" role="status">
        <h2 className="vp-h2">{v.state === "REVOKED" ? "Inscrição cancelada." : "O pagamento não foi concluído."}</h2>
        <p>{v.state === "REVOKED" ? "O pagamento foi reembolsado ou estornado e o bilhete deixou de valer." : "Nenhum valor foi cobrado por esta tentativa. Pode iniciar uma nova inscrição."}</p>
        <Link className="vp-btn vp-btn-primary" href={`${link}#inscricao`}>Tentar de novo</Link>
      </div>
    );

  return (
    <div className="vp-grid vp-grid-2">
      <div className="vp-card">
        <p className="vp-eyebrow">Pagamento PIX</p>
        <h2 className="vp-h2">{v.amountMinor ? formatBRL(v.amountMinor) : "PIX"}</h2>
        {v.payment ? (
          <>
            <div aria-label="QR Code PIX" role="img" style={{ background: "#fff", borderRadius: 12, padding: 12, maxWidth: 280 }} dangerouslySetInnerHTML={{ __html: v.payment.qrSvg }} />
            <p>Válido até {new Date(v.payment.expiresAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}.</p>
          </>
        ) : (
          <p>Abra esta página no mesmo navegador em que iniciou a inscrição para ver o QR Code. O estado é atualizado quando o pagamento for aprovado.</p>
        )}
      </div>
      <div className="vp-card clara-contact" style={{ borderTop: 0 }}>
        <h3>PIX Copia e Cola</h3>
        {v.payment && (
          <>
            <label>Código<input readOnly value={v.payment.copyPaste} onFocus={(e) => e.currentTarget.select()} /></label>
            <button className="vp-btn vp-btn-primary" type="button" onClick={() => navigator.clipboard.writeText(v.payment!.copyPaste).then(() => setCopied(true))}>{copied ? "Copiado" : "Copiar código"}</button>
          </>
        )}
        <p role="status" aria-live="polite" className="form-status">Aguardando a confirmação do pagamento… {err}</p>
        <p className="vp-note">A inscrição só fica confirmada quando o pagamento for aprovado. Não envie comprovantes pelo WhatsApp.</p>
      </div>
    </div>
  );
}
