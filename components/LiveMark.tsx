"use client";
import Image from "next/image";
import { useState } from "react";

export default function LiveMark({ active = false }: { active?: boolean }) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={`live-mark ${paused ? "is-paused" : ""} ${active ? "is-active" : ""}`}
    >
      <div className="live-mark-art" aria-hidden="true">
        <svg viewBox="0 0 100 100" focusable="false">
          <polygon className="pulse-orbit orbit-one" points="50,5 96,84 4,84" />
          <polygon className="pulse-orbit orbit-two" points="50,5 96,84 4,84" />
          <circle className="pulse-ring" cx="50" cy="50" r="42" />
        </svg>
        <Image
          src="/assets/atlashub-logo.webp"
          alt=""
          width={42}
          height={42}
          className="live-mark-core"
        />
      </div>
      <button
        type="button"
        className="motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={
          paused ? "Retomar animação do símbolo" : "Pausar animação do símbolo"
        }
      >
        {paused ? "▷" : "Ⅱ"}
      </button>
    </div>
  );
}
