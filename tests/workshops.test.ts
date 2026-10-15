import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { workshops, waInterestUrl, workshopBySlug } from "../lib/workshops";

// Guardrails dos workshops em pré-lançamento: datas aprovadas, nenhum preço nem promessa
// publicados antes da aprovação, cobrança só via ARO e captação rastreável.
const text = JSON.stringify(workshops);

test("datas e cidade aprovadas (14/11 e 28/11, Anápolis); 21/11 revogado", () => {
  assert.deepEqual(workshops.map((w) => [w.code, w.dateIso, w.city]), [
    ["W01", "2026-11-14", "Anápolis/GO"],
    ["EL01", "2026-11-28", "Anápolis/GO"],
  ]);
  assert.doesNotMatch(text, /21\/11|21 de novembro/);
});

test("pré-lançamento: sem preço, vagas, garantias nem inscrições abertas", () => {
  for (const banned of [/R\$\s?\d/, /\d+\s?%/, /garant/i, /vagas? (abertas|limitadas|restantes)/i, /inscrições abertas/i, /últim[ao]s? (lugares|vagas)/i, /\bSLA\b/])
    assert.doesNotMatch(text, banned);
  for (const w of workshops) {
    assert.equal(w.pricing, "pending");
    assert.match(w.venue, /a confirmar/);
  }
});

test("cobrança futura identificada para o ARO, sem checkout neste site", () => {
  assert.deepEqual(workshops.map((w) => w.aroOfferId), ["workshop-01-empresa-aumentada", "enterprise-lab-01-ecommerce"]);
  for (const f of ["components/WorkshopDetail.tsx", "components/Workshops.tsx"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /checkout|stripe|pix|mercadopago|<form/i);
  }
});

test("lista de interesse pelo WhatsApp oficial com código de campanha", () => {
  for (const w of workshops) {
    const url = waInterestUrl(w);
    assert.match(url, /^https:\/\/wa\.me\/5562991903462\?text=/);
    assert.ok(decodeURIComponent(url.split("text=")[1]).includes(`Código: ${w.code}-SITE`));
    assert.equal(workshopBySlug(w.slug), w);
  }
});

test("páginas fora do índice e do sitemap durante o pré-lançamento", () => {
  for (const p of ["app/workshops/page.tsx", "app/workshops/empresa-aumentada-2027-2030/page.tsx", "app/workshops/enterprise-lab-ecommerce/page.tsx"])
    assert.match(readFileSync(p, "utf8"), /robots: \{ index: false/);
  assert.doesNotMatch(readFileSync("public/sitemap.xml", "utf8"), /workshops/);
});
