"use client";
import { useState } from "react";
import { roles, roleAreas, APP_URL, areaIcon } from "../lib/site";
import Icon, { type IconName } from "./Icon";

// P03 "Perfis por função": filter by area over the real role list and real states only.
export default function RoleLibrary() {
  const [area, setArea] = useState<string>("Todos");
  const shown = roles.filter((r) => area === "Todos" || r.area === area);
  return (
    <>
      <div className="vp-filter" role="group" aria-label="Filtrar por área">
        {roleAreas.map((a) => (
          <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)}>{a}</button>
        ))}
      </div>
      <p className="vp-note" role="status" aria-live="polite" style={{ marginTop: 0 }}>{shown.length} perfis{area === "Todos" ? "" : ` em ${area}`}</p>
      <ul className="vp-grid vp-grid-4 vp-plain">
        {shown.map((r) => (
          <li key={r.id} className="vp-card">
            <div className="vp-role-head"><span className="vp-icon-box"><Icon name={areaIcon[r.area] as IconName} /></span><span className={`vp-status vp-status-${r.status}`}>Demonstração</span></div>
            <h3>{r.name}</h3>
            <p>{r.summary}</p>
            <a className="vp-card-link" href={`${APP_URL}/simulador/${r.slug}`}>Ver demonstração ↗</a>
          </li>
        ))}
      </ul>
    </>
  );
}
