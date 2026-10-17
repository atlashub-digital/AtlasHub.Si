"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import CheckoutView from "./CheckoutView";
import styles from "./AroCheckoutSheet.module.css";

/**
 * Camada de apresentação do PIX na própria página comercial.
 * ARO, estado e autorização mantêm-se no BFF do projeto.
 * Fechar este diálogo NUNCA cancela a sessão financeira.
 */
export default function AroCheckoutSheet({
  checkoutId, open, onClose, onConfirmed,
}: {
  checkoutId: string;
  open: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus();
    };
  }, [open]);
  if (!open) return null;

  function keys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first=focusable[0], last=focusable[focusable.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function backdrop(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div className={styles.backdrop} onMouseDown={backdrop} role="presentation">
      <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="aro-checkout-sheet-title" onKeyDown={keys}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Pagamento protegido · ARO</p>
            <h2 id="aro-checkout-sheet-title" className={styles.title}>Conclua a sua inscrição</h2>
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Fechar janela de pagamento">×</button>
        </div>
        <p className={styles.hint}>Pode fechar e voltar a esta janela sem cancelar o PIX. Não envie comprovantes por WhatsApp.</p>
        <div className={styles.content}><CheckoutView id={checkoutId} onConfirmed={onConfirmed}/></div>
      </div>
    </div>
  );
}
