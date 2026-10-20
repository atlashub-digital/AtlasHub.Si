"use client";
import { useEffect, useState } from "react";
import { formatBRL } from "../lib/workshops";

type Snapshot = { open: boolean; pricing: { currentMinor: number; regularMinor: number }; promo?: { serverNow: string; expiresAt: string | null } | null };
/** Presentation only: follows the same server snapshot and campaign clock as the signup. */
export default function LiveLabCta({ initialAvailability }: { initialAvailability: Snapshot }) {
  const [snapshot, setSnapshot] = useState(initialAvailability);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/sales/ll01/availability", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => {
      if (alive && d && typeof d.open === "boolean" && Number.isFinite(d.pricing?.currentMinor)) setSnapshot(d);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!snapshot.promo?.expiresAt) return;
    const duration = new Date(snapshot.promo.expiresAt).getTime() - new Date(snapshot.promo.serverNow).getTime();
    const timer = setTimeout(() => setExpired(true), Math.min(Math.max(0, duration), 2147483647));
    return () => clearTimeout(timer);
  }, [snapshot]);
  const price = expired ? snapshot.pricing.regularMinor : snapshot.pricing.currentMinor;
  return <a className="vp-btn vp-btn-primary" href="#inscricao">{snapshot.open ? `GARANTIR INSCRIÇÃO — ${formatBRL(price)}` : "CONSULTAR INSCRIÇÃO"}</a>;
}
