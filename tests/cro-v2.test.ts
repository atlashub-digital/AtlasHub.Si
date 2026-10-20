import test from "node:test";
import assert from "node:assert/strict";
import { Children, createElement, isValidElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Signup, { SignupCta, type Avail } from "../components/WorkshopSignup";
import LiveLabCta from "../components/LiveLabCta";
import Footer from "../components/Footer";
import { workshops, waInterestUrl } from "../lib/workshops";

for (const w of workshops) {
  const props = { w, waUrl: waInterestUrl(w) };
  test(`${w.code}: HTML inicial aberto usa preço servidor e formulário homologado`, () => {
    const initialAvailability: Avail = { open: true, soldOut: false, lot: "regular", priceMinor: 123456 };
    const html = renderToStaticMarkup(createElement(Signup, { ...props, initialAvailability }));
    const cta = renderToStaticMarkup(createElement(SignupCta, { ...props, initialAvailability }));
    assert.match(html, /R\$ 1\.234,56/);
    assert.match(html, /name="acceptTerms"/);
    const company = html.match(/<input\b[^>]*\bname="company"[^>]*>/)?.[0];
    assert.ok(company, "campo empresa presente");
    assert.match(company, /autoComplete="organization"/);
    if (w.code === "EL01") assert.match(company, /\brequired=""/);
    else assert.doesNotMatch(company, /\brequired=/);
    assert.doesNotMatch(html + cta, /Inscrições em breve|lista de interesse|aviso de abertura/i);
    assert.match(cta, /href="#inscricao"/);
    assert.match(cta, /R\$ 1\.234,56/);
  });
  test(`${w.code}: estados fechado, esgotado e sem snapshot são distintos`, () => {
    const base: Avail = { open: false, soldOut: false, lot: "antecipado", priceMinor: 29700 };
    assert.match(renderToStaticMarkup(createElement(Signup, { ...props, initialAvailability: base })), /Inscrições em breve/);
    assert.match(renderToStaticMarkup(createElement(Signup, { ...props, initialAvailability: { ...base, open: true, soldOut: true } })), /Inscrições esgotadas/);
    const unknown = renderToStaticMarkup(createElement(Signup, props));
    assert.match(unknown, /Consultando disponibilidade/);
    assert.doesNotMatch(unknown, /Inscrições em breve/);
    assert.doesNotMatch(decodeURIComponent(props.waUrl), /receber a abertura/);
  });
}
test("LL01 CTA respeita preço e gate do snapshot", () => {
  const snapshot = { open: true, pricing: { currentMinor: 49700, regularMinor: 49700 } };
  assert.match(renderToStaticMarkup(createElement(LiveLabCta, { initialAvailability: snapshot })), /R\$ 497/);
  assert.doesNotMatch(renderToStaticMarkup(createElement(LiveLabCta, { initialAvailability: { ...snapshot, open: false } })), /GARANTIR/);
});
test("rodapé oferece condições publicadas sem alegar política jurídica", () => {
  // Inspect the component tree without rendering Next Link/Image outside Next's runtime.
  const links: string[] = [];
  const labels: string[] = [];
  function visit(node: ReactNode) {
    Children.forEach(node, child => {
      if (typeof child === "string") labels.push(child);
      if (isValidElement<{ href?: string; children?: ReactNode }>(child)) {
        if (child.props.href) links.push(child.props.href);
        visit(child.props.children);
      }
    });
  }
  visit(Footer({ conditionsHref: "#condicoes" }));
  assert.ok(links.includes("#condicoes"));
  assert.match(labels.join(" "), /Condições de inscrição e uso dos dados/);
  assert.doesNotMatch(labels.join(" "), /em revisão jurídica/);
});
