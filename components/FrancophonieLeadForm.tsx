"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "../app/fr/francophonie.module.css";

const interests = [
  ["qualification", "Un appel de qualification gratuit"],
  ["atelier", "Un atelier d'initiation en français"],
  ["diagnostic", "Un diagnostic opérationnel"],
  ["integration", "Un projet d'intégration d'agents IA"],
] as const;
const countries = [
  ["FR", "France"], ["BE", "Belgique"], ["CH", "Suisse"], ["CA", "Canada / Québec"],
  ["LU", "Luxembourg"], ["AUTRE", "Autre pays francophone"],
] as const;
type Interest = (typeof interests)[number][0];

export default function FrancophonieLeadForm() {
  const [interest, setInterest] = useState<Interest>("qualification");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState(false);
  const requestId = useRef("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const offered = params.get("offre");
    if (interests.some(([value]) => value === offered)) setInterest(offered as Interest);
  }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || sent) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    requestId.current ||= crypto.randomUUID();
    setBusy(true);
    setStatus("Envoi de votre demande…");
    setFallback(false);
    try {
      const response = await fetch("/api/fr/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...fields, requestId: requestId.current, interest,
          consentContact: fields.consentContact === "on",
          consentMarketing: fields.consentMarketing === "on",
        }),
      });
      const outcome = await response.json().catch(() => ({}));
      if (response.status !== 202 || !outcome.id || outcome.route !== "human") throw Error("Not confirmed");
      setSent(true);
      setStatus("Demande reçue pour examen. Nous reviendrons vers vous ; aucun rendez-vous n'est confirmé à ce stade.");
      form.reset();
    } catch {
      setStatus("L'envoi automatique n'a pas été confirmé. Vous pouvez contacter notre équipe via WhatsApp ci-dessous. Aucune demande n'est considérée comme reçue.");
      setFallback(true);
    } finally { setBusy(false); }
  }
  const wa = "https://wa.me/5562991903462?text=" + encodeURIComponent(
    "Bonjour AtlasHub, je souhaite être contacté(e) en français pour " +
    (interests.find(([val]) => val === interest)?.[1].toLowerCase() ?? "votre offre") + "."
  );
  return (
    <form className={styles.form} onSubmit={send} aria-busy={busy}>
      <div className={styles.formHeading}><span>DEMANDE PRIVÉE</span><strong>Parlons de votre projet</strong></div>
      <label>Votre objectif
        <select name="interest" value={interest} onChange={e => { setInterest(e.target.value as Interest); setSent(false); setStatus(""); }} disabled={busy || sent}>
          {interests.map(([value,label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className={styles.formRow}>
        <label>Nom et prénom <span>*</span><input name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={busy || sent} /></label>
        <label>E-mail <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={160} disabled={busy || sent} /></label>
      </div>
      <div className={styles.formRow}>
        <label>Entreprise / activité<input name="company" maxLength={160} autoComplete="organization" disabled={busy || sent} /></label>
        <label>Pays<select name="country" defaultValue="FR" disabled={busy || sent}>{countries.map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      </div>
      <label>Votre principale difficulté ou votre projet
        <textarea name="message" maxLength={1000} rows={3} placeholder="Ex. : organiser le suivi des demandes clients et réduire les saisies manuelles…" disabled={busy || sent} />
      </label>
      {interest === "qualification" && <label>Créneau préférable (facultatif)<input name="preferredWindow" maxLength={160} placeholder="Ex. : mardi ou jeudi matin, heure de Paris" disabled={busy || sent} /></label>}
      <input name="website" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className={styles.checkbox}><input name="consentContact" type="checkbox" required disabled={busy || sent}/><span>J'accepte d'être recontacté(e) au sujet de ma demande et j'ai lu les <a href="#confidentialite">informations de confidentialité</a>. *</span></label>
      <label className={styles.checkbox}><input name="consentMarketing" type="checkbox" disabled={busy || sent}/><span>Je souhaite aussi recevoir les actualités et offres AtlasHub par e-mail (facultatif).</span></label>
      <button type="submit" className={styles.submit} disabled={busy || sent}>{sent ? "Demande transmise" : busy ? "Envoi…" : "Envoyer ma demande"} <span aria-hidden="true">↗</span></button>
      <p role="status" aria-live="polite" className={styles.formStatus}>{status}</p>
      {fallback && <a className={styles.fallback} href={wa} target="_blank" rel="noopener noreferrer">Écrire à l'équipe sur WhatsApp ↗</a>}
      <p className={styles.formNote}>Sans paiement et sans réservation automatique. Aucun fichier sensible ou mot de passe, s'il vous plaît.</p>
    </form>
  );
}
