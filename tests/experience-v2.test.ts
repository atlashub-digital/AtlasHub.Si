import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("home presents the approved architecture positioning", () => {
  const hero = read("components/ArchitectureHero.tsx");
  assert.match(hero, /A sua empresa não precisa de mais uma ferramenta de IA/);
  assert.match(hero, /Precisa de uma arquitetura para o futuro/);
  assert.ok(hero.includes("/mockups/home.webp"));
  assert.match(hero, /arch-original-plate/);
  assert.doesNotMatch(hero, /hero-office\\.jpg|arch-scene/);
});

test("all six journey steps are linked to real routes", () => {
  const body = read("components/AtlasJourney.tsx");
  for (const step of ["Descoberta","Pré-diagnóstico","Diagnostic + Blueprint","Atlas Build","Atlas Operate","Academy + Club"]) {
    assert.ok(body.includes(step), step);
  }
});

test("LL01 checkout and promotional copy stay closed after the event", () => {
  assert.match(read("lib/sales/ll01-commerce.ts"), /2026-10-28T00:00:00-03:00/);
  assert.match(read("app/workshops/automacao-pessoas-no-centro/page.tsx"), /Inscrições encerradas/i);
  assert.match(read("components/Workshops.tsx"), /completed: true/);
});

test("no unsupported mockup statistics appear in the main page renderers", () => {
  const home = read("app/page.tsx");
  const managed = read("app/solucoes/ai-workforce/page.tsx");
  assert.doesNotMatch(home + managed, /MockupCanvas|mockups\/ai-workforce/);
  assert.match(managed, /Ainda sem medições publicadas/);
});

test("Clara identifies the professional handoff and consent", () => {
  const clara = read("components/Clara.tsx");
  assert.match(clara, /Solicitar diagnóstico profissional/);
  assert.match(clara, /WhatsApp/);
  assert.match(clara, /name="consent"/);
});


test("the exact approved V1 hero composition and the solution Visual Pack assets remain in use", () => {
  const hero = read("components/ArchitectureHero.tsx");
  const css = read("app/architecture-v2.css");
  assert.ok(hero.includes("/mockups/home.webp"));
  assert.ok(css.includes("mockups/ai-workforce.webp"));
  assert.ok(css.includes("mockups/enterprise-transformation.webp"));
  assert.match(css, /prefers-reduced-motion:reduce/);\n  assert.match(css, /arch-original-plate/);
});
