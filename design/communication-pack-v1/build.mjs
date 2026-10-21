// Gera as fontes HTML editáveis (sources/) e os PNG finais (OUT, por defeito ./exports) do Communication Pack V1.
// Uso: PLAYWRIGHT=<caminho do pacote playwright> OUT=<pasta> node build.mjs
// Identidade: tokens de design/visual-pack-v1/tokens.json; logótipo oficial (assets/Logo_Oficial_AtlasHub.png).
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { packs, variants } from "./content.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(join(here, "../visual-pack-v1/tokens.json"), "utf8")).foundations.palette;
const T = { bg: tokens.background, surface: tokens.surface, border: tokens.border, cyan: tokens.cyan, cyanSoft: tokens.cyanSoft, blue: tokens.electricBlue, white: tokens.white, muted: tokens.muted };
const OUT = resolve(process.env.OUT || join(here, "exports"));
// LOT=regular: variante comercial com o valor regular (W01 depois de 06/11, EL01 depois de 20/11).
const LOT = process.env.LOT === "regular" ? "regular" : "antecipado";
if (LOT === "regular") for (const p of Object.values(packs)) p.price = p.priceRegular;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>");

const css = (w, h) => `
@font-face{font-family:Inter;src:url(../../../assets/inter.woff2) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${T.bg};color:${T.white};font-family:Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.art{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:linear-gradient(135deg,${T.bg} 0%,#061C34 100%)}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
.shade-l{position:absolute;inset:0;background:linear-gradient(90deg,rgba(2,10,22,.97) 0%,rgba(2,10,22,.78) 45%,rgba(2,10,22,.25) 100%)}
.shade-b{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,10,22,.15) 0%,rgba(2,10,22,.75) 45%,rgba(2,10,22,.98) 70%)}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.45}
.brand{display:flex;align-items:center;gap:.5em;font-weight:800;letter-spacing:.02em}
.brand img{width:1.9em;height:1.9em;border-radius:50%}
.brand b{color:${T.cyan};font-weight:800}
.brand small{display:block;font-size:.42em;letter-spacing:.32em;color:${T.muted};font-weight:600;margin-top:.2em}
.eyebrow{color:${T.cyanSoft};font-weight:600;letter-spacing:.22em;text-transform:uppercase}
.h{font-weight:800;letter-spacing:-.045em;line-height:1.02}
.h em{font-style:normal;background:linear-gradient(110deg,#3BE9EF 0%,#008BFF 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{color:${T.muted};line-height:1.45;font-weight:400}
.chips{display:flex;flex-wrap:wrap;gap:.5em}
.chip{border:2px solid ${T.border};background:rgba(7,20,34,.7);color:#CFE0EE;border-radius:999px;padding:.45em .95em;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.cta{display:inline-flex;align-items:center;gap:.6em;border-radius:999px;padding:.7em 1.4em;font-weight:700;background:linear-gradient(110deg,#3BE9EF 0%,#008BFF 100%);color:#03101F;box-shadow:0 0 40px rgba(22,216,237,.4)}
.url{color:${T.cyanSoft};font-weight:600;letter-spacing:.01em}
.price{color:${T.white};font-weight:700}
.badge{position:absolute;border:2px solid ${T.cyan};color:${T.cyan};border-radius:999px;padding:.35em .9em;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
.card{border:2px solid ${T.border};background:rgba(9,25,45,.82);border-radius:28px}
.dots{display:flex;gap:12px}.dots i{width:14px;height:14px;border-radius:50%;background:${T.border}}.dots i.on{background:${T.cyan};box-shadow:0 0 14px ${T.cyan}}
`;

/** Diagrama de nós (pessoas, processos, dados… em volta de um centro). Sem rostos, sem dados inventados. */
function network(nodes, hub, size, accent = T.cyan) {
  const r = size * 0.36, c = size / 2;
  const pts = nodes.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length; return [c + r * Math.cos(a), c + r * Math.sin(a)]; });
  const fs = Math.round(size * 0.042);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
  <defs><radialGradient id="g"><stop offset="0" stop-color="${T.blue}" stop-opacity=".55"/><stop offset="1" stop-color="${T.blue}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${c}" cy="${c}" r="${r * 1.25}" fill="url(#g)"/>
  <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${T.border}" stroke-width="2" stroke-dasharray="6 10"/>
  ${pts.map(([x, y], i) => pts.slice(i + 1).map(([x2, y2]) => `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${T.border}" stroke-width="1.5" opacity=".55"/>`).join("")).join("")}
  ${pts.map(([x, y]) => `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="${accent}" stroke-width="2.5" opacity=".9"/>`).join("")}
  <circle cx="${c}" cy="${c}" r="${size * 0.13}" fill="${T.surface}" stroke="${accent}" stroke-width="4"/>
  <text x="${c}" y="${c}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="${fs * 1.05}" fill="${T.white}">${hub.split("\n").map((l, i, a) => `<tspan x="${c}" dy="${i === 0 ? -(a.length - 1) * 0.55 + 0.35 : 1.1}em">${esc(l)}</tspan>`).join("")}</text>
  ${pts.map(([x, y], i) => { const w = nodes[i].length * fs * 0.62 + fs * 2.4; return `<g><rect x="${x - w / 2}" y="${y - fs * 1.15}" width="${w}" height="${fs * 2.3}" rx="${fs * 1.15}" fill="${T.bg}" stroke="${accent}" stroke-width="2.5"/><circle cx="${x - w / 2 + fs * 0.85}" cy="${y}" r="${fs * 0.28}" fill="${accent}"/><text x="${x + fs * 0.5}" y="${y + fs * 0.36}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${fs}" fill="${T.white}">${esc(nodes[i])}</text></g>`; }).join("")}
</svg>`;
}

const brand = (px) => `<div class="brand" style="font-size:${px}px"><img src="../../../assets/Logo_Oficial_AtlasHub.png" alt=""><div>ATLASHUB<b>.SI</b><small>ENTERPRISE TRANSFORMATION</small></div></div>`;
const ctaBlock = (p, v, px, opts = {}) => `<div style="display:flex;flex-direction:${opts.row ? "row" : "column"};gap:${px * 0.6}px;align-items:${opts.row ? "center" : "flex-start"}">
  ${v === "comercial" ? `<div class="price" style="font-size:${px * 0.95}px">${esc(p.price)}</div>` : ""}
  <div style="display:flex;align-items:center;gap:${px * 0.8}px;flex-wrap:wrap"><span class="cta" style="font-size:${px}px">${variants[v].label} <span>→</span></span><span class="url" style="font-size:${px * 0.8}px">${esc(p.url)}</span></div></div>`;
const chips = (p, px) => `<div class="chips" style="font-size:${px}px"><span class="chip">${esc(p.when)}</span><span class="chip">${esc(p.where)}</span></div>`;

// Peças. Cada uma devolve {w,h,body}. Zonas seguras: stories/reels com 250 px livres em cima e em baixo.
const pieces = {
  "01_KEY_VISUAL_16X9": (p, v) => ({ w: 1920, h: 1080, body: `
    <div class="photo" style="background-image:url(../../../${p.photo});left:38%"></div><div class="shade-l"></div>
    <div class="glow" style="width:700px;height:700px;left:-200px;top:-260px;background:${T.blue}"></div>
    <div style="position:absolute;left:110px;top:90px">${brand(34)}</div>
    <div style="position:absolute;right:120px;top:140px;opacity:.95">${network(p.nodes, p.hub, 640)}</div>
    <div style="position:absolute;left:110px;top:300px;width:930px">
      <p class="eyebrow" style="font-size:22px;margin-bottom:28px">${esc(p.eyebrow)}</p>
      <h1 class="h" style="font-size:92px;margin-bottom:30px"><em>${esc(p.concept)}</em></h1>
      <p class="lead" style="font-size:30px;margin-bottom:40px;width:820px">${esc(p.sub)}</p>
      ${chips(p, 22)}
      <div style="margin-top:44px">${ctaBlock(p, v, 30)}</div>
    </div>` }),
  "02_FEED_POST_A_4X5": (p, v) => ({ w: 1080, h: 1350, body: `
    <div class="photo" style="background-image:url(../../../${p.photo});height:820px;bottom:auto"></div><div class="shade-b"></div>
    <div style="position:absolute;left:80px;top:80px">${brand(28)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:90px">
      <p class="eyebrow" style="font-size:20px;margin-bottom:22px">${esc(p.title)}</p>
      <h1 class="h" style="font-size:78px;margin-bottom:28px"><em>${esc(p.concept)}</em></h1>
      ${chips(p, 20)}
      <div style="margin-top:36px">${ctaBlock(p, v, 28)}</div>
    </div>` }),
  "03_FEED_POST_B_4X5": (p, v) => ({ w: 1080, h: 1350, body: `
    <div class="glow" style="width:620px;height:620px;right:-180px;top:200px;background:${T.blue}"></div>
    <div style="position:absolute;left:80px;top:80px">${brand(28)}</div>
    <div style="position:absolute;left:80px;right:80px;top:200px">
      <p class="eyebrow" style="font-size:20px;margin-bottom:22px">${esc(p.feed2.kicker)}</p>
      <h1 class="h" style="font-size:64px;margin-bottom:26px">${esc(p.feed2.title)}</h1>
      <p class="lead" style="font-size:28px">${esc(p.feed2.body)}</p>
    </div>
    <div style="position:absolute;left:50%;top:640px;transform:translateX(-50%)">${network(p.nodes, p.hub, 520)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:80px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px">
      <div style="font-size:22px;color:${T.muted};font-weight:600">${esc(p.when)}<br>${esc(p.where)}</div>
      ${v === "comercial" ? `<span class="cta" style="font-size:24px">${variants[v].label} →</span>` : `<span class="cta" style="font-size:24px">${variants[v].label} →</span>`}
    </div>` }),
  ...Object.fromEntries([0, 1, 2, 3, 4, 5].map((i) => [`04_CARROSSEL_${String(i + 1).padStart(2, "0")}_4X5`, (p, v) => {
    const c = p.carousel[i];
    if (!c) return null;
    const total = p.carousel.length;
    return { w: 1080, h: 1350, body: `
    ${i === 0 ? `<div class="photo" style="background-image:url(../../../${p.photo});opacity:.35"></div><div class="shade-b" style="background:linear-gradient(180deg,rgba(2,10,22,.6),rgba(2,10,22,.95))"></div>` : ""}
    <div class="glow" style="width:520px;height:520px;left:${i % 2 ? "-160px" : "auto"};right:${i % 2 ? "auto" : "-160px"};bottom:120px;background:${T.blue}"></div>
    <div style="position:absolute;left:80px;top:80px">${brand(26)}</div>
    <div style="position:absolute;right:80px;top:92px;font-size:22px;font-weight:700;color:${T.muted};letter-spacing:.12em">${c.n} / ${String(total).padStart(2, "0")}</div>
    <div style="position:absolute;left:80px;right:80px;top:300px">
      <div style="font-size:160px;font-weight:800;color:${T.cyan};opacity:.25;line-height:1;margin-bottom:10px">${c.n}</div>
      <h1 class="h" style="font-size:${c.title.length > 40 ? 70 : 84}px;margin-bottom:34px">${i === 0 ? `<em>${esc(c.title)}</em>` : esc(c.title)}</h1>
      <p class="lead" style="font-size:32px">${esc(c.body)}</p>
      ${c.cta ? `<div style="margin-top:50px">${ctaBlock(p, v, 28)}</div>` : ""}
    </div>
    ${!c.cta && i > 0 ? `<div style="position:absolute;right:60px;bottom:150px;opacity:.55">${network(p.nodes, p.hub, 440)}</div>` : ""}
    <div style="position:absolute;left:80px;right:80px;bottom:80px;display:flex;justify-content:space-between;align-items:center">
      <div class="dots">${p.carousel.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
      <div style="font-size:20px;color:${T.muted};font-weight:600">${c.cta ? "" : "Deslize →"}</div>
    </div>` };
  }])),
  ...Object.fromEntries([0, 1, 2].map((i) => [`05_STORY_${String(i + 1).padStart(2, "0")}_9X16`, (p, v) => {
    const s = p.stories[i];
    return { w: 1080, h: 1920, body: `
    ${i === 0 ? `<div class="photo" style="background-image:url(../../../${p.photo})"></div><div class="shade-b" style="background:linear-gradient(180deg,rgba(2,10,22,.35),rgba(2,10,22,.97) 60%)"></div>` : ""}
    <div class="glow" style="width:760px;height:760px;left:160px;top:${i === 1 ? 300 : 900}px;background:${T.blue}"></div>
    <div style="position:absolute;left:90px;top:260px">${brand(30)}</div>
    ${i === 1 ? `<div style="position:absolute;left:50%;top:380px;transform:translateX(-50%);opacity:.9">${network(p.nodes, p.hub, 640)}</div>` : ""}
    <div style="position:absolute;left:90px;right:90px;top:${i === 0 ? 900 : i === 1 ? 1080 : 760}px">
      <h1 class="h" style="font-size:${i === 2 ? 190 : 104}px;margin-bottom:36px">${i === 2 ? `<em>${esc(s.big)}</em>` : esc(s.big)}</h1>
      <p class="lead" style="font-size:38px">${esc(s.small)}</p>
      ${s.cta ? `<div style="margin-top:46px">${chips(p, 26)}<p class="lead" style="font-size:28px;margin-top:22px">${esc(p.extra)}</p><div style="margin-top:46px">${ctaBlock(p, v, 34)}</div></div>` : ""}
    </div>` };
  }])),
  "06_BANNER_HORIZONTAL_1920X600": (p, v) => ({ w: 1920, h: 600, body: `
    <div class="photo" style="background-image:url(../../../${p.photo});left:45%"></div><div class="shade-l"></div>
    <div style="position:absolute;left:90px;top:60px">${brand(26)}</div>
    <div style="position:absolute;left:90px;top:150px;width:1150px">
      <p class="eyebrow" style="font-size:18px;margin-bottom:18px">${esc(p.eyebrow)}</p>
      <h1 class="h" style="font-size:60px;margin-bottom:26px"><em>${esc(p.concept)}</em></h1>
      ${chips(p, 18)}
    </div>
    <div style="position:absolute;right:90px;bottom:70px">${ctaBlock(p, v, 24)}</div>` }),
  "07_BANNER_LINKEDIN_1584X396": (p, v) => ({ w: 1584, h: 396, body: `
    <div class="photo" style="background-image:url(../../../${p.photo});left:35%"></div><div class="shade-l"></div>
    <div style="position:absolute;left:470px;top:56px;width:1050px">
      <p class="eyebrow" style="font-size:15px;margin-bottom:14px">${esc(p.eyebrow)}</p>
      <h1 class="h" style="font-size:44px;margin-bottom:18px"><em>${esc(p.concept)}</em></h1>
      ${chips(p, 15)}
      <div style="margin-top:20px">${ctaBlock(p, v, 18, { row: true })}</div>
    </div>
    <div style="position:absolute;left:60px;top:40px">${brand(22)}</div>` }),
  "08_CAPA_VIDEO_REELS_9X16": (p, v) => ({ w: 1080, h: 1920, body: `
    <div class="photo" style="background-image:url(../../../${p.photo})"></div><div class="shade-b" style="background:linear-gradient(180deg,rgba(2,10,22,.4),rgba(2,10,22,.92) 55%)"></div>
    <div class="badge" style="left:90px;top:300px;font-size:24px">Vídeo · ${p.video.seconds}s</div>
    <div style="position:absolute;left:90px;right:90px;top:520px">${brand(28)}
      <h1 class="h" style="font-size:110px;margin:60px 0 36px"><em>${esc(p.concept)}</em></h1>
      ${chips(p, 26)}
      ${v === "comercial" ? `<p class="price" style="font-size:32px;margin-top:30px">${esc(p.price)}</p>` : ""}
    </div>` }),
};

const chromiumPath = process.env.PLAYWRIGHT || "playwright";
const mod = await import(chromiumPath.startsWith("/") ? pathToFileURL(join(chromiumPath, "index.js")).href : chromiumPath);
const chromium = mod.chromium ?? mod.default?.chromium;
const browser = await chromium.launch();
const manifest = [];
for (const [code, p] of Object.entries(packs)) {
  for (const v of Object.keys(variants)) {
    for (const [id, make] of Object.entries(pieces)) {
      const piece = make(p, v);
      if (!piece) continue;
      const rel = join(LOT === "regular" ? "sources-regular" : "sources", p.name, v, `${code}_${id}.html`);
      const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${code} ${id}</title><style>${css(piece.w, piece.h)}</style></head><body><div class="art">${piece.body}</div></body></html>`;
      mkdirSync(dirname(join(here, rel)), { recursive: true });
      writeFileSync(join(here, rel), html);
      const png = join(OUT, p.name, v === "pre" ? "01_PRE_LANCAMENTO" : LOT === "regular" ? "03_COMERCIAL_REGULAR" : "02_COMERCIAL", `ATLASHUB_SI_${code}_${id}_${v.toUpperCase()}${v !== "pre" && LOT === "regular" ? "_REGULAR" : ""}_V1.png`);
      mkdirSync(dirname(png), { recursive: true });
      const page = await browser.newPage({ viewport: { width: piece.w, height: piece.h } });
      await page.goto(pathToFileURL(join(here, rel)).href);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: png });
      await page.close();
      manifest.push({ code, variant: v, piece: id, size: `${piece.w}x${piece.h}`, source: rel, png: png.replace(OUT + "/", "") });
    }
  }
}
await browser.close();
writeFileSync(join(OUT, "MANIFEST.json"), JSON.stringify(manifest, null, 2));
console.log(`${manifest.length} PNG em ${OUT}`);
