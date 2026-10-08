"use client";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { cases } from "../lib/cases";
import settings from "../public/clara-config.json";
import LiveMark from "./LiveMark";
import OperationLab from "./OperationLab";

type Question = [string, [string, string][]];
const questions: Question[] = [
  ["Onde faria mais diferença começar?", cases.map((c) => [c.id, c.sector])],
  [
    "Por onde chegam hoje estes pedidos ou sinais?",
    [
      ["email", "Email"],
      ["whatsapp", "WhatsApp"],
      ["system", "Sistema / formulário"],
      ["manual", "Registo manual"],
    ],
  ],
  [
    "Como está organizada a informação?",
    [
      ["api", "CRM / ERP com integrações"],
      ["sheets", "Folhas de cálculo"],
      ["docs", "Documentos dispersos"],
      ["unknown", "Ainda precisamos de mapear"],
    ],
  ],
  [
    "Qual é a frequência aproximada?",
    [
      ["low", "Algumas vezes por semana"],
      ["daily", "Todos os dias"],
      ["high", "Muitas vezes por dia"],
    ],
  ],
  [
    "Como prefere começar?",
    [
      ["draft", "Preparar para a equipa aprovar"],
      ["bounded", "Automatizar tarefas com regras claras"],
      ["explore", "Primeiro, compreender a viabilidade"],
    ],
  ],
  [
    // Visual Pack V1 triage: managed service, own capability (Build & Transfer) or Co-Build.
    "A necessidade é temporária ou a empresa quer operar esta capacidade permanentemente?",
    [
      ["managed", "AtlasHub opera por nós (missão ou contínuo)"],
      ["build", "Capacidade própria, construída para nós"],
      ["cobuild", "Construir junto com a nossa equipe"],
      ["unsure", "Ainda não sei"],
    ],
  ],
];
const MODELS = ["managed", "build", "cobuild", "unsure"];

export default function Clara({
  leadsEnabled = false,
}: {
  leadsEnabled?: boolean;
}) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [contact, setContact] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const busyRef = useRef(false),
    requestId = useRef("");
  const history = useRef<HTMLDivElement>(null),
    controls = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const focusNext = useRef(false);
  const c = cases.find((c) => c.id === answers[0]) || cases[0];
  const complete = answers.length === questions.length;
  // Arrival from a solution page (?clara=build|cobuild|managed) suggests, never pre-selects, the model.
  const suggested = useSyncExternalStore(
    () => () => {},
    () => { const m = new URLSearchParams(location.search).get("clara") ?? ""; return MODELS.includes(m) ? m : ""; },
    () => "",
  );
  const label = (i: number) =>
    questions[i][1].find((x) => x[0] === answers[i])?.[1] || "";
  const diagnostic = () => ({
    scenario: c.id,
    title: c.title,
    channel: answers[1],
    systems: answers[2],
    frequency: answers[3],
    approach: answers[4],
    model: answers[5],
  });

  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<unknown>).detail;
      if (busyRef.current || !cases.some((c) => c.id === id)) return;
      setAnswers([id as string]);
      setContact(false);
      setSent(false);
      setStatus("");
      requestId.current = "";
      focusNext.current = true;
    };
    window.addEventListener("clara:scenario", select);
    return () => {
      window.removeEventListener("clara:scenario", select);
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (history.current)
      history.current.scrollTop = history.current.scrollHeight;
    if (focusNext.current) {
      controls.current?.querySelector("button")?.focus({ preventScroll: true });
      focusNext.current = false;
    }
  }, [answers]);
  useEffect(() => {
    if (contact)
      controls.current?.querySelector("input")?.focus({ preventScroll: true });
  }, [contact]);

  function change(next: string[]) {
    if (busyRef.current) return;
    setAnswers(next);
    setContact(false);
    setSent(false);
    setStatus("");
    requestId.current = "";
    focusNext.current = true;
  }
  function download() {
    const text = [
      "ATLASHUB · DIAGNÓSTICO CLARA",
      c.title,
      ...answers.map((_, i) => questions[i][0] + " " + label(i)),
      "Fluxo: " + c.trigger + " → " + c.agent + " → " + c.action,
      "Controlo: " + c.review,
      "Pré-requisitos: " + c.needs,
      "Medir: " + c.metric,
      "Proposta exploratória. Não é orçamento nem confirmação de implementação.",
    ].join("\n\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "AtlasHub-diagnostico.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current || sent) return;
    const form = event.currentTarget,
      data = Object.fromEntries(new FormData(form));
    if (
      data.intent === "meeting" &&
      !String(data.preferredWindow || "").trim()
    ) {
      setStatus(
        "Indique uma janela preferida para podermos pedir confirmação.",
      );
      return;
    }
    if (!String(data.email || "").trim() && !String(data.phone || "").trim()) {
      setStatus("Indique email ou WhatsApp para podermos responder.");
      return;
    }
    requestId.current ||= crypto.randomUUID();
    busyRef.current = true;
    setBusy(true);
    setStatus("A enviar o pedido…");
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 12000);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requestId: requestId.current,
          consent: data.consent === "on",
          diagnostic: diagnostic(),
        }),
        signal: abort.signal,
      });
      const result = await response.json();
      if (
        response.status !== 202 ||
        typeof result.id !== "string" ||
        !result.id.trim() ||
        result.route !== "human"
      )
        throw Error("Unconfirmed");
      setStatus(
        "Pedido recebido para análise. Posso pedir confirmação por WhatsApp/email; a reunião ainda não está marcada.",
      );
      setSent(true);
      form.reset();
    } catch {
      setStatus(
        "Não foi possível confirmar a receção. Guarde o diagnóstico e tente mais tarde.",
      );
    } finally {
      clearTimeout(timeout);
      busyRef.current = false;
      setBusy(false);
      controller.current = null;
    }
  }
  const nodes = [
    answers.length ? "Contexto · " + c.sector : "O seu contexto",
    answers[1] ? label(1) + " → " + c.trigger : "O que inicia o processo",
    answers[2] ? c.agent + " · " + label(2) : "Inteligência e contexto",
    answers[4] ? c.review : "Controlo humano",
    complete ? c.action : "Ação e acompanhamento",
  ];
  return (
    <section className="clara-section" id="clara" aria-labelledby="clara-title">
      <div className="section">
        <p className="eyebrow">CLARA · DESENHAR O PRÓXIMO PASSO</p>
        <h2 id="clara-title">
          E se começássemos
          <br />
          <span>pela sua operação?</span>
        </h2>
        <p className="intro">
          Um diagnóstico guiado, sem registo. Responda a algumas perguntas e
          veja uma proposta de fluxo ganhar forma.
        </p>
        <div className="clara-workspace">
          <div className="clara-chat">
            <header>
              <LiveMark active={busy} />
              <div>
                <strong>Clara</strong>
                <small>Assistente de pré-análise · Simulação guiada</small>
              </div>
              <button
                id="clara-reset"
                type="button"
                disabled={busy}
                onClick={() => change([])}
              >
                Recomeçar
              </button>
            </header>
            <div
              id="clara-history"
              ref={history}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
            >
              <p className="chat-message assistant">
                Olá, sou a Clara. Vamos encontrar um primeiro processo com
                potencial. Não precisa de deixar contactos para explorar.
              </p>
              {answers.map((a, i) => (
                <Fragment key={i + ":" + a}>
                  <p className="chat-message assistant">{questions[i][0]}</p>
                  <p className="chat-message user">{label(i)}</p>
                </Fragment>
              ))}
              <p className="chat-message assistant">
                {complete
                  ? "Já temos uma primeira hipótese. Veja o mapa de automação. Pode guardar o resumo ou pedir uma análise técnica, sem compromisso."
                  : questions[answers.length][0]}
              </p>
            </div>
            <div id="clara-controls" ref={controls}>
              {!complete ? (
                <div className="clara-options">
                  {questions[answers.length][1].map(([id, text]) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => change([...answers, id])}
                    >
                      {text}
                      {answers.length === 5 && id === suggested ? " · sugerido pela página" : ""}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="button primary"
                    onClick={download}
                  >
                    Guardar o meu diagnóstico ↓
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setContact(true)}
                  >
                    Explorar o próximo passo →
                  </button>
                </>
              )}
              {answers.length > 0 && (
                <button
                  type="button"
                  className="clara-back"
                  disabled={busy}
                  onClick={() => change(answers.slice(0, -1))}
                >
                  ← Rever resposta anterior
                </button>
              )}
              {complete && contact && (
                <div className="clara-contact" id="clara-contact">
                  <h4>Como gostaria de continuar?</h4>
                  <a
                    className="button primary"
                    href={
                      "https://wa.me/5562991903462?text=" +
                      encodeURIComponent(
                        `Olá, equipa AtlasHub. Explorei o cenário «${c.title}» com a Clara e gostaria de pedir uma análise técnica. A minha janela preferida para contacto é: `,
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conversar pelo WhatsApp oficial ↗
                  </a>
                  <p>
                    +55 62 99190-3462 · A mensagem abre para revisão. Só é
                    enviada por si no WhatsApp.
                  </p>
                  <p>
                    Posso pedir confirmação de contacto, de uma reunião ou de
                    uma análise para orçamento. O diagnóstico continua
                    disponível sem partilhar dados.
                  </p>
                  {!leadsEnabled || settings.leadEndpoint !== "/api/lead" ? (
                    <p>
                      Partilhe o diagnóstico pelo WhatsApp e indique a sua
                      janela preferida. A equipa confirma consigo o próximo
                      passo.
                    </p>
                  ) : (
                    <form onSubmit={submit} aria-busy={busy}>
                      <fieldset
                        disabled={busy || sent}
                        style={{
                          border: 0,
                          padding: 0,
                          margin: 0,
                          minWidth: 0,
                        }}
                      >
                        <label>
                          Como podemos tratar-lhe?
                          <input
                            name="name"
                            autoComplete="name"
                            maxLength={100}
                            required
                          />
                        </label>
                        <label>
                          Empresa (opcional)
                          <input
                            name="company"
                            autoComplete="organization"
                            maxLength={160}
                          />
                        </label>
                        <label>
                          Email (ou WhatsApp abaixo)
                          <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            maxLength={160}
                          />
                        </label>
                        <label>
                          WhatsApp com indicativo (opcional se indicar email)
                          <input
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            maxLength={30}
                            placeholder="+351 …"
                          />
                        </label>
                        <label>
                          O próximo passo
                          <select name="intent">
                            <option value="contact">
                              Gostaria de ser contactado
                            </option>
                            <option value="meeting">
                              Pedir uma reunião técnica
                            </option>
                            <option value="quote">
                              Análise para orçamento
                            </option>
                          </select>
                        </label>
                        <label>
                          Janela preferida para contacto ou reunião
                          <input
                            name="preferredWindow"
                            maxLength={160}
                            placeholder="Ex.: terça de manhã, hora de Lisboa"
                          />
                        </label>
                        <label className="consent">
                          <input name="consent" type="checkbox" required />{" "}
                          Autorizo a AtlasHub a usar estes dados para responder
                          a este pedido.
                        </label>
                        <p className="privacy-note">
                          Enviamos apenas os contactos e as escolhas deste
                          diagnóstico à equipa AtlasHub. Não subscreve
                          marketing. Uma reunião só fica marcada após
                          confirmação.
                        </p>
                        <label className="honeypot" aria-hidden="true">
                          Website
                          <input
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                        {!sent && (
                          <button type="submit" className="button primary">
                            Enviar pedido →
                          </button>
                        )}
                      </fieldset>
                      <p className="form-status" role="status">
                        {status}
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
            <div className="clara-progress">
              <span id="clara-step">
                {complete
                  ? "Diagnóstico concluído"
                  : `Passo ${answers.length + 1} de ${questions.length}`}
              </span>
              <progress
                id="clara-progress"
                max={5}
                value={answers.length}
                aria-label="Progresso do diagnóstico"
              />
            </div>
          </div>
          <aside className="clara-canvas" aria-label="Proposta de automação">
            <div className="canvas-top">
              <span>O SEU MAPA DE AUTOMAÇÃO</span>
              <span className="canvas-status">
                {complete ? "PROPOSTA INICIAL" : "EM CONSTRUÇÃO"}
              </span>
            </div>
            <h3 id="flow-title">
              {answers.length ? c.title : "Da ideia ao fluxo."}
            </h3>
            <p id="flow-description">
              {answers.length
                ? c.sector + " · proposta inicial"
                : "Cada resposta aproxima o desenho da sua realidade."}
            </p>
            <ol id="flow-nodes" className="flow-nodes">
              {nodes.map((text, i) => (
                <li
                  key={i}
                  className={
                    answers.length >= [1, 2, 3, 5, 5][i] ? "ready" : "pending"
                  }
                >
                  {String(i + 1).padStart(2, "0")} · {text}
                </li>
              ))}
            </ol>
            <div id="flow-result">
              {complete && (
                <>
                  <h4>Primeiro passo recomendado</h4>
                  <p>
                    {answers[2] === "api"
                      ? "Validar acessos e executar um piloto com dados de teste."
                      : "Mapear e organizar as fontes de informação antes de ligar a automação."}
                  </p>
                  <h4>Medir antes e depois</h4>
                  <p>{c.metric}</p>
                  <h4>O que precisamos de confirmar</h4>
                  <p>{c.needs}</p>
                  <p>
                    {answers[3] === "low"
                      ? "Com pouco volume, valide se o benefício compensa o esforço de integração."
                      : "Priorize um processo repetitivo e acompanhe exceções, custo por execução e qualidade."}
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
        <p className="clara-note">
          Esta pré-análise usa cenários e regras orientadoras. A viabilidade, as
          integrações e o orçamento são confirmados pela equipa técnica.
        </p>
        <OperationLab key={c.id} scenario={c.id} />
        <noscript>
          Ative JavaScript para usar o diagnóstico. Os casos de aplicação acima
          continuam disponíveis.
        </noscript>
      </div>
    </section>
  );
}
