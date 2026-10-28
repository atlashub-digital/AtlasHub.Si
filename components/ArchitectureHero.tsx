"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
type Layer = "operacao" | "dados" | "agentes";
const layers: Record<Layer, { title: string; description: string }> = {
  operacao: { title: "Operação real", description: "Processos, equipas, clientes, compromissos e exceções." },
  dados: { title: "Fontes e sistemas", description: "O contexto chega de fontes identificadas, com permissões e rastreabilidade." },
  agentes: { title: "Inteligência coordenada", description: "Agentes executam missões delimitadas; pessoas validam decisões críticas." },
};
export default function ArchitectureHero() {
  const [layer, setLayer] = useState<Layer>("operacao");
  return (
    <section className="arch-hero" id="inicio" aria-labelledby="arch-title">
      <div className="arch-glow" aria-hidden="true" />
      <div className="arch-inner">
        <div className="arch-copy">
          <p className="arch-eyebrow">ATLASHUB.SI · INTELLIGENCE FOR THE AUGMENTED ENTERPRISE</p>
          <h1 id="arch-title">A sua empresa não precisa de mais uma ferramenta de IA. <em>Precisa de uma arquitetura para o futuro.</em></h1>
          <p className="arch-lead">Desenhamos, construímos e acompanhamos infraestruturas agênticas que integram pessoas, processos, sistemas e funcionários digitais — para transformar trabalho em capacidade empresarial.</p>
          <div className="arch-actions">
            <Link className="arch-button arch-button-primary" href="/diagnostico">Diagnosticar a minha operação <span aria-hidden="true">↗</span></Link>
            <Link className="arch-button arch-button-outline" href="/metodo">Conhecer a metodologia <span aria-hidden="true">→</span></Link>
          </div>
          <p className="arch-signature">A inteligência também se constrói.</p>
        </div>
        <div className="arch-visual" aria-label="Diagrama ilustrativo das camadas da empresa aumentada">
          {/* Restore the original approved photographic hero asset; no synthetic CSS blocks. */}
          <div className="arch-restored-photo">
            <Image
              src="/assets/hero-office.jpg"
              alt="Equipa de operações a trabalhar num ambiente empresarial contemporâneo"
              fill
              priority
              quality={95}
              sizes="(max-width: 1050px) 100vw, 48vw"
              className="arch-restored-photo-image"
            />
            <div className="arch-restored-photo-signature">
              <Image src="/assets/atlashub-logo.webp" alt="" width={39} height={39} />
              <span><strong>Pessoas + agentes.</strong><small>Inteligência com supervisão humana.</small></span>
            </div>
          </div>
          <div className="arch-visual-caption">
            <p>EXPLORE AS CAMADAS</p>
            <div className="arch-tabs" role="group" aria-label="Camadas da infraestrutura">
              {(["operacao","dados","agentes"] as const).map((key) => (
                <button key={key} type="button" aria-pressed={layer===key} onClick={() => setLayer(key)}>{layers[key].title}</button>
              ))}
            </div>
            <div className="arch-caption-detail" aria-live="polite"><strong>{layers[layer].title}</strong><span>{layers[layer].description}</span></div>
          </div>
        </div>
      </div>
      <div className="arch-bottom"><span>01 · DESENHAR</span><span>02 · CONSTRUIR</span><span>03 · OPERAR</span><span>04 · EVOLUIR</span></div>
    </section>
  );
}