"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Layer = "operacao" | "dados" | "agentes";
const layers: Record<Layer, { title: string; description: string }> = {
  operacao: { title: "Operação real", description: "Processos, equipas, clientes, compromissos e exceções." },
  dados: { title: "Fontes e sistemas", description: "Contexto vindo de fontes identificadas, com permissões e rastreabilidade." },
  agentes: { title: "Inteligência coordenada", description: "Agentes executam missões delimitadas; pessoas validam decisões críticas." },
};

/**
 * Visual Pack V1 approved visual — exactly the original /mockups/home.webp plate
 * (the woman, holographic organization panels, and luminous Atlas brand mark).
 * Keep ALL copy and CTA as accessible live HTML; never replace this with
 * /assets/hero-office.jpg, which is a separate photo and was not the approved hero.
 */
export default function ArchitectureHero() {
  const [layer, setLayer] = useState<Layer>("operacao");
  return (
    <section className="arch-hero arch-hero-restored" id="inicio" aria-labelledby="arch-title">
      <div className="arch-original-art" aria-hidden="true">
        <Image
          src="/mockups/home.webp"
          alt=""
          width={1672}
          height={941}
          priority
          quality={95}
          sizes="100vw"
          className="arch-original-plate"
        />
      </div>
      <div className="arch-original-shade" aria-hidden="true" />
      <div className="arch-inner arch-original-inner">
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
        <div className="arch-visual">
          <div className="arch-visual-caption">
            <p>EXPLORE AS CAMADAS</p>
            <div className="arch-tabs" role="group" aria-label="Camadas da infraestrutura">
              {(["operacao", "dados", "agentes"] as const).map((key) => (
                <button key={key} type="button" aria-pressed={layer === key} onClick={() => setLayer(key)}>
                  {layers[key].title}
                </button>
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
