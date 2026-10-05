"use client";
import { useEffect } from "react";
export default function SiteInteractions() {
  useEffect(() => {
    const menu = document.querySelector<HTMLDetailsElement>(".mobile-menu");
    const openCase = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (!link) return;
      if (menu?.contains(link)) menu.open = false;
      if (link.hash.startsWith("#caso-")) {
        const target = document.getElementById(link.hash.slice(1));
        if (target instanceof HTMLDetailsElement) target.open = true;
      }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    window.addEventListener("hashchange", openCase);
    openCase();
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", openCase);
    };
  }, []);
  return null;
}
