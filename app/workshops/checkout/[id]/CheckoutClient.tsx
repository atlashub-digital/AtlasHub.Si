"use client";

import { useEffect, useRef, useState } from "react";

export type CheckoutView = {
  slug: string;
  checkoutId: string;
  orderId: string;
  state: string;
  amountMinor: number;
  currency: string;
  copyPaste: string | null;
  qrDataUrl: string | null;
  expiresAt: string | null;
};

type Ticket = { orderId: string; code: string; email: string };

type StatusPayload = {
  state?: string;
  note?: string;
  amount?: { amount_minor: number; currency: string };
  expiresAt?: string | null;
  ticket?: Ticket;
};

const money = (minor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(minor / 100);

/**
 * Polling por estados normalizados, sempre pelo NOSSO servidor (/api/workshops/checkout/status):
 * o browser nunca fala com o ARO. O bilhete aparece só quando o servidor confirma
 * ARO APPROVED + entitlement ACTIVE.
 */
export default function CheckoutClient({ initial, code }: { initial: CheckoutView; entitlementKey: string; attributionCode: string; code: string }) {
  const [view, setView] = useState(initial);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const attempt = useRef(false);

  useEffect(() => {
    if (attempt.current) return;
    attempt.current = true;
    if (view.state !== "PENDING" && view.state !== "CREATED") return;
    let stopped = false;
    let timer: number | undefined;
    async function check() {
      try {
        const res = await fetch("/api/workshops/checkout/status", { headers: { "cache-control": "no-store" } });
        if (res.ok) {
          const p = (await res.json()) as StatusPayload;
          if (stopped) return;
          if (p.ticket) setTicket(p.ticket);
          else if (p.note) setNote(p.note);
          if (p.amount) setView((v) => ({ ...v, amountMinor: p.amount!.amount_minor, expiresAt: p.expiresAt ?? v.expiresAt }));
          if (p.state && p.state !== "PENDING") {
            setView((v) => ({ ...v, state: p.state! }));
            return; // estado terminal: para de fazer polling
          }
        }
      } catch {
        // rede falhou: o PIX permanece no ecrã; o servidor continua a verificar
      }
      if (!stopped) timer = window.setTimeout(check, 3000);
    }
    timer = window.setTimeout(check, 1500);
    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [view.state]);

  async function copyPix() {
    if (!view.copyPaste) return;
    try {
      await navigator.clipboard.writeText(view.copyPaste);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível: o utilizador pode selecionar o código à mão
    }
  }

  const pending = view.state === "PENDING" || view.state === "CREATED";

  if (ticket) {
    return (
      <div className="vp-card" style={{ padding: 24, marginTop: 24 }} data-testid="ticket">
        <h2 className="vp-h3">Bilhete confirmado</h2>
        <p>
          Pagamento aprovado e inscrição efetiva. Enviamos a confirmação para <strong>{ticket.email}</strong> — guarde este código, é
          o seu comprovativo de entrada ({code}).
        </p>
        <p style={{ fontSize: 28, letterSpacing: "0.06em", fontWeight: 700 }}>{ticket.code}</p>
        <ul>
          <li>Nº do pedido: {ticket.orderId}</li>
          <li>Identificação na entrada: nome informado na inscrição, por ordem de chegada.</li>
          <li>O endereço em Anápolis é comunicado por e-mail com, no mínimo, 5 dias úteis de antecedência.</li>
        </ul>
        <p className="vp-note">Dúvidas ou alteração de dados: fale com a Clara, nossa assistente oficial. Nunca pedimos senhas nem comprovativos por WhatsApp.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      {view.state === "UNAVAILABLE" && (
        <div className="vp-card" style={{ padding: 24 }}>
          <p>Não conseguimos confirmar esta tentativa de checkout agora. Volte à página do workshop e tente novamente — se já gerou um PIX, use sempre a tentativa anterior; não pague duas vezes.</p>
        </div>
      )}

      {(pending || view.state === "APPROVED") && view.amountMinor > 0 && (
        <div className="vp-card" style={{ padding: 24 }} data-testid="pix-payment">
          <p className="vp-eyebrow">Pedido {view.orderId.slice(0, 8).toUpperCase()} · aguardando confirmação</p>
          <p style={{ fontSize: 24, fontWeight: 700 }}>{money(view.amountMinor)}</p>
          {view.qrDataUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={view.qrDataUrl} alt="QR Code PIX para pagamento" width={320} height={320} style={{ borderRadius: 12, background: "#fff", padding: 8 }} />
          )}
          {view.copyPaste && (
            <>
              <label style={{ display: "block", marginTop: 16 }}>
                PIX copia e cola
                <textarea readOnly value={view.copyPaste} rows={4} style={{ width: "100%", marginTop: 6 }} onClick={(e) => (e.target as HTMLTextAreaElement).select()} />
              </label>
              <button type="button" className="vp-btn vp-btn-primary" onClick={copyPix}>
                {copied ? "Código copiado ✓" : "Copiar código PIX"}
              </button>
            </>
          )}
          <p className="vp-note">
            Pague no app do seu banco e mantenha esta página aberta: a confirmação é feita pelo servidor, e o bilhete é emitido
            automaticamente. Nunca enviamos comprovativos por WhatsApp, nem aceitamos prova de pagamento fora do PIX.
          </p>
          {view.expiresAt && (
            <p className="vp-note">Validade desta cobrança: {new Date(view.expiresAt).toLocaleString("pt-BR")}.</p>
          )}
          {note && <p className="vp-note" role="status">{note}</p>}
        </div>
      )}

      {(view.state === "FAILED" || view.state === "EXPIRED") && (
        <div className="vp-card" style={{ padding: 24 }} data-testid="checkout-failed">
          <h2 className="vp-h3">Cobrança encerrada</h2>
          <p>
            {view.state === "EXPIRED"
              ? "Esta cobrança expirou sem pagamento. Você pode iniciar uma nova inscrição na página do workshop."
              : "Esta cobrança não foi concluída. Se houve pagamento, será estornado integralmente. Nenhuma nova cobrança é feita automaticamente."}
          </p>
        </div>
      )}
    </div>
  );
}
