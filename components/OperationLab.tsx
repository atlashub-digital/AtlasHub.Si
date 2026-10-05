"use client";
import { useEffect, useState } from "react";
import { cases } from "../lib/cases";
import { simulateCapacity, type Assumptions } from "../lib/simulation";

const defaults: Assumptions = {
  volume: 600,
  minutes: 12,
  coverage: 60,
  exceptions: 20,
  reviewMinutes: 2,
};
const controls: {
  key: keyof Assumptions;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}[] = [
  {
    key: "volume",
    label: "Pedidos por mês",
    unit: "pedidos",
    min: 0,
    max: 3000,
    step: 50,
  },
  {
    key: "minutes",
    label: "Tempo manual por pedido",
    unit: "min",
    min: 1,
    max: 60,
    step: 1,
  },
  {
    key: "coverage",
    label: "Pedidos elegíveis para automação",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
  },
  {
    key: "exceptions",
    label: "Exceções entre os elegíveis",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
  },
  {
    key: "reviewMinutes",
    label: "Revisão de cada pedido sem exceção",
    unit: "min",
    min: 0,
    max: 30,
    step: 1,
  },
];
const nf = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 });
const steps = [
  "Receber",
  "Interpretar",
  "Validar regras",
  "Revisão humana",
  "Concluir",
];

export default function OperationLab({ scenario }: { scenario: string }) {
  const [a, setA] = useState(defaults),
    [step, setStep] = useState(0),
    [running, setRunning] = useState(false),
    [exception, setException] = useState(false),
    [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const c = cases.find((c) => c.id === scenario) || cases[0],
    r = simulateCapacity(a);
  useEffect(() => {
    if (!running || step >= 3) return;
    const timer = setTimeout(() => {
      setStep(step + 1);
      if (step === 2) setRunning(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [running, step]);
  const reset = () => {
    setRunning(false);
    setStep(0);
    setDecision(null);
  };
  const events = [
    `Pedido fictício LAB-001 recebido. ${c.trigger}.`,
    `Contexto preparado: ${c.agent}.`,
    exception
      ? "Exceção injetada: falta informação suficiente. A execução aguarda revisão."
      : "Regras do cenário verificadas. Aguarda autorização humana.",
    decision === "rejected"
      ? "Proposta rejeitada nesta simulação. Nenhuma ação executada."
      : `Aprovação simulada. Próxima ação proposta: ${c.action}.`,
  ];
  const summary = () =>
    [
      "ATLASHUB · LABORATÓRIO DE OPERAÇÕES",
      c.title,
      ...controls.map((x) => `${x.label}: ${a[x.key]} ${x.unit}`),
      `Tempo manual: ${nf.format(r.baselineHours)} h/mês`,
      `Tempo com o cenário: ${nf.format(r.futureHours)} h/mês`,
      `Capacidade potencial libertada: ${nf.format(r.savedHours)} h/mês`,
      "Estimativa exploratória, não resultado medido. Exclui integração, manutenção, custos de ferramentas e aprendizagem. Exceções mantêm todo o tempo manual. Nenhum sistema externo foi executado.",
    ].join("\n");
  function download() {
    const url = URL.createObjectURL(
      new Blob([summary()], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "AtlasHub-cenario-operacional.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      className="operation-lab"
      id="simulador"
      aria-labelledby="lab-title"
    >
      <div className="lab-heading">
        <div>
          <p className="eyebrow">LABORATÓRIO DE OPERAÇÕES / 01</p>
          <h3 id="lab-title">
            Antes de automatizar.
            <br />
            <span>Experimente o que muda.</span>
          </h3>
        </div>
        <span className="lab-badge">
          SIMULAÇÃO LOCAL · SEM EXECUÇÃO EXTERNA
        </span>
      </div>
      <p className="lab-intro">
        Altere as hipóteses, compare a carga de trabalho e acompanhe um pedido
        de teste. O cenário acompanha a área escolhida com a Clara.
      </p>
      <div className="lab-grid">
        <div className="lab-inputs">
          <h4>01 / As suas hipóteses</h4>
          {controls.map((x) => (
            <label key={x.key} className="lab-slider">
              <span>
                {x.label}
                <output htmlFor={"lab-" + x.key}>
                  {a[x.key]} <small>{x.unit}</small>
                </output>
              </span>
              <input
                id={"lab-" + x.key}
                type="range"
                min={x.min}
                max={x.max}
                step={x.step}
                value={a[x.key]}
                onChange={(e) =>
                  setA({ ...a, [x.key]: Number(e.target.value) })
                }
              />
            </label>
          ))}
          <button
            type="button"
            className="lab-text-button"
            onClick={() => setA(defaults)}
          >
            Repor hipóteses de exemplo ↺
          </button>
        </div>
        <div className="lab-results">
          <h4>02 / Capacidade, não promessas</h4>
          <div className="lab-big-number">
            <strong>{nf.format(r.savedHours)}</strong>
            <span>
              horas / mês
              <br />
              potencialmente libertadas
            </span>
          </div>
          <div className="lab-comparison">
            <div>
              <span>Processo manual</span>
              <b>{nf.format(r.baselineHours)} h</b>
              <i
                style={{
                  width: `${Math.max(1, (r.baselineHours / Math.max(r.baselineHours, r.futureHours, 1)) * 100)}%`,
                }}
              />
            </div>
            <div>
              <span>Com estas hipóteses</span>
              <b>{nf.format(r.futureHours)} h</b>
              <i
                style={{
                  width: `${Math.max(1, (r.futureHours / Math.max(r.baselineHours, r.futureHours, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <p>
            {nf.format(r.eligible)} pedidos elegíveis ·{" "}
            {nf.format(r.exceptions)} exceções estimadas por mês.
          </p>
          {r.savedHours <= 0 && (
            <p className="lab-caution">
              Com estas hipóteses, a revisão não reduz a carga de trabalho.
              Reveja o processo antes de investir.
            </p>
          )}
          <details className="lab-method">
            <summary>Como calculamos?</summary>
            <p>
              Tempo manual = volume × minutos. No cenário, pedidos não elegíveis
              e exceções mantêm o tempo manual completo. Os restantes usam o
              tempo de revisão indicado.
            </p>
            <p>
              Não inclui implementação, manutenção, custo das ferramentas ou
              aprendizagem. Valores negativos representam trabalho adicional.
              Não é uma previsão, orçamento ou redução de postos de trabalho.
            </p>
          </details>
        </div>
      </div>
      <div className="lab-playground">
        <div className="lab-run-heading">
          <div>
            <p className="eyebrow">03 / TESTE O PERCURSO</p>
            <h4>{c.title}</h4>
          </div>
          <label className="lab-switch">
            <input
              type="checkbox"
              checked={exception}
              disabled={step > 0 || running}
              onChange={(e) => setException(e.target.checked)}
            />{" "}
            Injetar uma exceção
          </label>
        </div>
        <ol className="lab-track">
          {steps.map((s, i) => (
            <li
              key={s}
              className={step > i ? "done" : step === i ? "current" : ""}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s}
              {step === i && running && (
                <b className="lab-signal" aria-label="Simulação em curso" />
              )}
            </li>
          ))}
        </ol>
        <div className="lab-console" role="log" aria-live="polite">
          <p>
            <span>LAB-001</span>{" "}
            {step === 0
              ? "Pronto. Este teste usa um pedido fictício."
              : events[Math.min(step - 1, 3)]}
          </p>
          {step === 3 && (
            <p className="lab-await">
              {exception
                ? "Informação em falta. Pode simular uma validação humana ou rejeitar o pedido."
                : "Ponto de controlo: autorize ou rejeite a proposta para continuar."}
            </p>
          )}
          {step === 4 && (
            <p>Teste terminado. CRM, agenda e WhatsApp não foram acionados.</p>
          )}
        </div>
        <div className="lab-actions">
          {step === 0 && (
            <button
              type="button"
              className="button primary"
              disabled={running}
              onClick={() => setRunning(true)}
            >
              Executar pedido de teste <span>▶</span>
            </button>
          )}
          {running && (
            <button
              type="button"
              className="button secondary"
              onClick={() => setRunning(false)}
            >
              Pausar execução
            </button>
          )}
          {step > 0 && step < 3 && !running && (
            <button
              type="button"
              className="button primary"
              onClick={() => setRunning(true)}
            >
              Continuar teste
            </button>
          )}
          {step === 3 && (
            <>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  setDecision("approved");
                  setStep(4);
                }}
              >
                Simular aprovação humana
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setDecision("rejected");
                  setStep(4);
                }}
              >
                Rejeitar proposta
              </button>
            </>
          )}
          {(step > 0 || running) && (
            <button type="button" className="lab-text-button" onClick={reset}>
              Recomeçar teste ↺
            </button>
          )}
        </div>
      </div>
      <div className="lab-bottom">
        <button type="button" className="button secondary" onClick={download}>
          Descarregar cenário e hipóteses ↓
        </button>
        <a
          className="button primary"
          href={
            "https://wa.me/5562991903462?text=" +
            encodeURIComponent(
              `Olá, equipa AtlasHub. Gostaria de analisar o cenário «${c.title}». Simulei ${a.volume} pedidos/mês, ${a.minutes} min/pedido, ${a.coverage}% elegíveis e ${a.exceptions}% de exceções. Podemos conversar?`,
            )
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Analisar com a equipa ↗
        </a>
        <p>
          Abre o WhatsApp com uma mensagem para rever e enviar. Não envia dados
          automaticamente.
        </p>
      </div>
    </section>
  );
}
