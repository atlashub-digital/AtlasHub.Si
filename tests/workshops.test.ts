import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { workshops, waInterestUrl, workshopBySlug } from "../lib/workshops";

// Guardrails dos workshops: datas e preços aprovados (AtlasHub.Si#9), local a divulgar, sem urgência
// artificial, cobrança só via ARO e captação rastreável.
const text = JSON.stringify(workshops);

test("datas e cidade aprovadas (14/11 e 28/11, Anápolis); 21/11 revogado", () => {
  assert.deepEqual(workshops.map((w) => [w.code, w.dateIso, w.city]), [
    ["W01", "2026-11-14", "Anápolis/GO"],
    ["EL01", "2026-11-28", "Anápolis/GO"],
  ]);
  assert.doesNotMatch(text, /21\/11|21 de novembro/);
});

test("preços aprovados = catálogo ARO; local a divulgar; sem urgência nem garantias", () => {
  assert.deepEqual(workshops.map((w) => [w.code, w.pricing.antecipado, w.pricing.regular, w.seats]), [
    ["W01", 29700, 34700, 25],
    ["EL01", 99000, 129000, 12],
  ]);
  const manifest = readFileSync("aro.project.yaml", "utf8");
  for (const w of workshops)
    for (const lot of ["antecipado", "regular"] as const) {
      const block = manifest.split("  - code: ").find((b) => b.startsWith(`${w.aroOffers[lot]}\n`))!;
      assert.match(block, new RegExp(`amount_minor: ${w.pricing[lot]}\n`), `${w.aroOffers[lot]} diverge do manifesto`);
    }
  // Só os quatro valores aprovados aparecem em texto; nada de vagas a esgotar, percentagens ou garantias.
  const prices = [...text.matchAll(/R\$ ?[\d.]+/g)].map((m) => m[0].replace(" ", " "));
  for (const p of prices) assert.ok(["R$ 297", "R$ 347", "R$ 990", "R$ 1.290"].includes(p), p);
  for (const banned of [/\d+\s?%/, /garant(?!a a sua)/i, /vagas? (limitadas|restantes)/i, /últim[ao]s? (lugares|vagas)/i, /\bSLA\b/, /espaço reservado|local reservado/i])
    assert.doesNotMatch(text, banned);
  for (const w of workshops) assert.equal(w.venue, "local a divulgar");
});

test("cobrança só pelo ARO: nenhum provedor direto nem valor vindo do browser", () => {
  assert.deepEqual(workshops.map((w) => w.aroProduct), ["workshop-01-empresa-aumentada", "enterprise-lab-01-ecommerce"]);
  const manifest = readFileSync("aro.project.yaml", "utf8");
  for (const w of workshops) assert.match(manifest, new RegExp(`code: ${w.aroProduct}\\n`));
  for (const f of ["components/WorkshopDetail.tsx", "components/Workshops.tsx", "components/WorkshopSignup.tsx", "components/CheckoutView.tsx", "lib/commerce/checkout.ts", "app/api/workshops/checkout/route.ts"]) {
    const src = readFileSync(f, "utf8");
    assert.doesNotMatch(src, /stripe|pixgo|misticpay|mercadopago/i, f);
  }
  // O formulário nunca envia preço, oferta nem valor.
  const body = readFileSync("components/WorkshopSignup.tsx", "utf8").split("JSON.stringify({")[1].split("}),")[0];
  assert.doesNotMatch(body, /amount|price|offer/i);
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

test("ofertas e direitos ARO de cada workshop = catálogo (aro.project.yaml), todas em draft", () => {
  const manifest = readFileSync("aro.project.yaml", "utf8");
  for (const w of workshops) {
    for (const offer of [w.aroOffers.antecipado, w.aroOffers.regular]) {
      const block = manifest.split("  - code: ").find((b) => b.startsWith(`${offer}\n`));
      assert.ok(block, `oferta ${offer} em falta no manifesto`);
      assert.match(block, new RegExp(`products: \\[${w.aroProduct}\\]`));
      assert.match(block, new RegExp(`entitlements: \\[${w.aroEntitlement}\\]`));
      assert.match(block, /status: draft/);
    }
  }
});
