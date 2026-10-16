import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { workshops, waInterestUrl, workshopBySlug } from "../lib/workshops";
import { workshopCommerce, workshopPolicies } from "../lib/workshop-commerce";

// Guardrails do checkout real (issue #9): preços sempre do catálogo ARO, local a divulgar,
// políticas visíveis antes de pagar, cobrança só pelo BFF com o cliente ARO fail-closed.
const text = JSON.stringify(workshops);

test("datas e cidade aprovadas (14/11 e 28/11, Anápolis); 21/11 revogado", () => {
  assert.deepEqual(workshops.map((w) => [w.code, w.dateIso, w.city]), [
    ["W01", "2026-11-14", "Anápolis/GO"],
    ["EL01", "2026-11-28", "Anápolis/GO"],
  ]);
  assert.doesNotMatch(text, /21\/11|21 de novembro/);
});

test("inscrições abertas: preços do catálogo ARO, sem prometer vagas nem espaço reservado", () => {
  for (const banned of [/\d+\s?%/, /garant/i, /vagas? (abertas|limitadas|restantes)/i, /últim[ao]s? (lugares|vagas)/i, /\bSLA\b/, /espaç[oa]s? reservad/i, /reserva confirmada/i])
    assert.doesNotMatch(text, banned);
  const manifest = readFileSync("aro.project.yaml", "utf8");
  for (const w of workshops) {
    assert.equal(w.pricing, "open");
    assert.match(w.venue, /local a divulgar/);
    const c = workshopCommerce[w.slug];
    // Os valores exibidos batem com o catálogo ARO (aro.project.yaml), ofertas ativas.
    for (const lot of ["antecipado", "regular"] as const) {
      const block = manifest.split("  - code: ").find((b) => b.startsWith(`${c.offers[lot].aroOffer}\n`))!;
      assert.ok(block, `oferta ${c.offers[lot].aroOffer} em falta no manifesto`);
      assert.match(block, new RegExp(`amount_minor: ${c.offers[lot].catalogAmountMinor}\\n`));
      assert.match(block, /status: active/);
      assert.match(block, new RegExp(`entitlements: \\[${c.aroEntitlement.replace(/:/g, "\\:")}\\]`));
    }
  }
});

test("cobrança identificada para o ARO, checkout só pelo BFF com o cliente ARO", () => {
  assert.deepEqual(workshops.map((w) => w.aroProduct), ["workshop-01-empresa-aumentada", "enterprise-lab-01-ecommerce"]);
  const manifest = readFileSync("aro.project.yaml", "utf8");
  for (const w of workshops) assert.match(manifest, new RegExp(`code: ${w.aroProduct}\\n`));
  for (const f of ["components/WorkshopDetail.tsx", "components/Workshops.tsx"]) {
    assert.doesNotMatch(readFileSync(f, "utf8"), /stripe|mercadopago|checkout_secret/i);
  }
});

test("CTA Inscrever-me para o formulário com políticas visíveis antes de pagar", () => {
  for (const w of workshops) {
    assert.equal(w.inscricaoHref, `/workshops/inscricao/${w.slug}`);
    const detail = readFileSync("components/WorkshopDetail.tsx", "utf8");
    assert.match(detail, /Inscrever-me/);
    const page = readFileSync("app/workshops/inscricao/[slug]/page.tsx", "utf8");
    assert.match(page, /workshopPolicies/);
    const p = workshopPolicies(w);
    for (const clause of [p.local, p.prazoLocal, p.adiamento, p.cancelamento, p.dados]) {
      assert.ok(clause.length > 80, "cláusula comercial ausente");
      assert.doesNotMatch(clause, /garant/i);
    }
    assert.match(p.local, /local a divulgar/);
  }
  // Formulário LGPD: termos do evento obrigatórios, marketing e WhatsApp opcionais e separados.
  const form = readFileSync("app/workshops/inscricao/[slug]/InscricaoForm.tsx", "utf8");
  assert.match(form, /consentEvent/);
  assert.match(form, /consentMarketing/);
  assert.match(form, /consentWhatsapp/);
  assert.doesNotMatch(form, /cartão|card number|cvc/i);
});

test("fallback: lista de interesse pelo WhatsApp oficial com código de campanha", () => {
  for (const w of workshops) {
    const url = waInterestUrl(w);
    assert.match(url, /^https:\/\/wa\.me\/5562991903462\?text=/);
    assert.ok(decodeURIComponent(url.split("text=")[1]).includes(`Código: ${w.code}-SITE`));
    assert.equal(workshopBySlug(w.slug), w);
  }
});

test("páginas comerciais fora do índice e do sitemap", () => {
  for (const p of ["app/workshops/page.tsx", "app/workshops/empresa-aumentada-2027-2030/page.tsx", "app/workshops/enterprise-lab-ecommerce/page.tsx"])
    assert.match(readFileSync(p, "utf8"), /robots: \{ index: false/);
  for (const p of ["app/workshops/checkout/[id]/page.tsx", "app/workshops/inscricao/[slug]/page.tsx"])
    assert.match(readFileSync(p, "utf8"), /robots: \{ index: false/);
  assert.doesNotMatch(readFileSync("public/sitemap.xml", "utf8"), /workshops/);
});
