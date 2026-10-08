"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { nav } from "../lib/site";

// Shared header (Visual Pack V1 · P01–P03). Logo: current official mark until the PNG from the
// visual-pack ZIP is imported (design/visual-pack-v1/assets/brand); never extracted from a mockup.
function Brand() {
  return (
    <Link className="vp-brand" href="/" aria-label="AtlasHub.SI — início">
      <Image src="/assets/atlashub-logo.webp" width={40} height={40} alt="" priority />
      <span>
        Atlas<b>Hub</b>
      </span>
    </Link>
  );
}

export default function Header({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>("a,button") ?? []);
    focusable()[0]?.focus();
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = focusable(); const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", key);
    const opener = trigger.current;
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; opener?.focus(); };
  }, [open]);

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="vp-header">
        <div className="vp-wrap">
          <Brand />
          <nav className="vp-nav" aria-label="Principal">
            {nav.map((item) => "external" in item ? (
              <a key={item.label} href={item.href} rel="noopener">{item.label} ↗</a>
            ) : (
              <Link key={item.label} href={item.href} aria-current={current === item.href ? "page" : undefined}>{item.label}</Link>
            ))}
            <Link className="vp-btn vp-btn-primary vp-nav-cta" href="/#clara">Fale com a Clara</Link>
          </nav>
          <button ref={trigger} className="vp-menu-button" type="button" aria-expanded={open} aria-controls="menu-movel" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>
      <div id="menu-movel" ref={dialog} className="vp-menu" role="dialog" aria-modal="true" aria-label="Navegação" hidden={!open}>
        <div className="vp-menu-top">
          <Brand />
          <button className="vp-menu-button" type="button" onClick={() => setOpen(false)}>Fechar</button>
        </div>
        {nav.map((item) => "external" in item ? (
          <a key={item.label} href={item.href} rel="noopener" onClick={() => setOpen(false)}>{item.label} ↗</a>
        ) : (
          <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
        ))}
        <Link className="vp-btn vp-btn-primary" href="/#clara" onClick={() => setOpen(false)}>Fale com a Clara</Link>
      </div>
    </>
  );
}
