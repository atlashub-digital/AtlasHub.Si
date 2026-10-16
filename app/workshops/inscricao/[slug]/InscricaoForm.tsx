"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type LotOption = { lot: string; label: string; price: string };

const errors: Record<string, string> = {
  invalid_origin: "Origem inválida. Recarregue a página.",
  rate_limited: "Muitas tentativas. Aguarde um minuto e tente novamente.",
  invalid_offer: "Oferta indisponível.",
  consent_required: "É preciso aceitar os termos do evento para continuar.",
  invalid_payer: "Revise o nome, o e-mail e o CPF/CNPJ do pagador.",
  lot_not_open: "Este lote ainda não está aberto. Escolha o lote disponível.",
  capacity_reached: "A capacidade desta turma já está preenchida. Entre na lista de interesse pelo WhatsApp para ser avisado de novas turmas.",
  sales_not_open: "As inscrições ainda não estão abertas. Volte em breve.",
  checkout_unavailable: "O checkout não está disponível agora. Tente novamente em instantes.",
};

/**
 * Formulário mínimo (pessoa/empresa, LGPD): termos do evento obrigatórios;
 * divulgação por e-mail e grupo de WhatsApp opcionais e separados.
 * Nenhum dado de pagamento nesta página: o PIX é gerado pelo ARO na página seguinte.
 */
export default function InscricaoForm({ slug, lots }: { slug: string; lots: LotOption[] }) {
  const router = useRouter();
  const [lot, setLot] = useState(lots[0]?.lot ?? "");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [consentEvent, setConsentEvent] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentWhatsapp, setConsentWhatsapp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const idem = useRef<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !/^\d{11}(\d{3})?$/.test(document.replace(/\D/g, ""))) {
      setError(errors.invalid_payer);
      return;
    }
    if (!consentEvent) {
      setError(errors.consent_required);
      return;
    }
    setLoading(true);
    // A mesma submissão (mesmos dados) reutiliza a mesma chave de idempotência:
    // tentar de novo não cria uma segunda cobrança.
    if (!idem.current) idem.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/workshops/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", "Idempotency-Key": idem.current },
        body: JSON.stringify({ slug, lot, name: name.trim(), company: company.trim(), email: email.trim().toLowerCase(), document: document.replace(/\D/g, ""), consentEvent, consentMarketing, consentWhatsapp }),
      });
      const p = (await res.json().catch(() => ({}))) as { redirect?: string; error?: string };
      if (res.ok && p.redirect) {
        router.push(p.redirect);
        return;
      }
      setError(errors[p.error ?? ""] ?? errors.checkout_unavailable);
    } catch {
      setError(errors.checkout_unavailable);
    } finally {
      setLoading(false);
    }
  }

  const input = { style: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border-strong)", background: "rgba(4,12,24,.45)", color: "var(--white)" } as const };

  return (
    <form className="vp-card" style={{ padding: 24, marginTop: 24, display: "grid", gap: 14 }} onSubmit={submit} data-testid="inscricao-form">
      <fieldset style={{ border: 0, display: "grid", gap: 8 }}>
        <legend style={{ padding: 0 }}>Lote</legend>
        {lots.map((o) => (
          <label key={o.lot} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="radio" name="lot" value={o.lot} checked={lot === o.lot} onChange={() => setLot(o.lot)} required />
            <span>
              {o.label} — <strong>{o.price}</strong> por pessoa
            </span>
          </label>
        ))}
        <p className="vp-note">O valor é cobrado em PIX, exatamente como registrado no catálogo. Se o lote mudar antes do pagamento, o valor exibido na confirmação do PIX é o que vale.</p>
      </fieldset>

      <label style={{ display: "grid", gap: 6 }}>
        Nome completo
        <input {...input} name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required placeholder="Como estará no bilhete" />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        Empresa ou atividade (opcional)
        <input {...input} name="company" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={160} placeholder="Ex.: Padaria Central" />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        E-mail
        <input {...input} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} required placeholder="voce@exemplo.com" />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        CPF ou CNPJ do pagador
        <input {...input} name="document" inputMode="numeric" autoComplete="off" value={document} onChange={(e) => setDocument(e.target.value)} maxLength={18} required placeholder="Somente números — necessário para o PIX" />
      </label>

      <fieldset style={{ border: 0, display: "grid", gap: 10 }}>
        <legend style={{ padding: 0 }}>Consentimentos (LGPD)</legend>
        <label style={{ display: "flex", gap: 10 }}>
          <input type="checkbox" checked={consentEvent} onChange={(e) => setConsentEvent(e.target.checked)} required />
          <span>
            Aceito os <strong>termos do evento</strong>: condições de local, adiamento, cancelamento e reembolso exibidas nesta página. (obrigatório)
          </span>
        </label>
        <label style={{ display: "flex", gap: 10 }}>
          <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} />
          <span>Quero receber comunicações de divulgação da AtlasHub por e-mail. (opcional)</span>
        </label>
        <label style={{ display: "flex", gap: 10 }}>
          <input type="checkbox" checked={consentWhatsapp} onChange={(e) => setConsentWhatsapp(e.target.checked)} />
          <span>Quero ser adicionada(o) ao grupo de WhatsApp da turma, com adesão voluntária. (opcional)</span>
        </label>
      </fieldset>

      {error && (
        <p role="alert" style={{ color: "#ff9d9d" }}>
          {error}
        </p>
      )}
      <button className="vp-btn vp-btn-primary" type="submit" disabled={loading}>
        {loading ? "Gerando PIX seguro…" : "Gerar PIX de inscrição"}
      </button>
      <p className="vp-note">Você paga na página seguinte via PIX. A inscrição só se efetiva após a confirmação automática do pagamento — o bilhete aparece na mesma página.</p>
    </form>
  );
}
