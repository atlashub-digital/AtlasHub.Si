// node shoot.cjs <url> <out.png> [width=1672] [measure.json]
const { chromium } = require("playwright");
(async () => {
  const [url, out, w = "1672", measure] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: Math.round(+w * 941 / 1672) }, deviceScaleFactor: 1 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const stage = await p.$(".mk-stage");
  await stage.screenshot({ path: out });
  if (measure) {
    const data = await p.evaluate(() => {
      const st = document.querySelector(".mk-stage").getBoundingClientRect();
      const k = 1672 / st.width;
      return [...document.querySelectorAll(".mk-stage .mk-t")].map((el) => {
        const r = document.createRange(); r.selectNodeContents(el); const bb = r.getBoundingClientRect();
        return { w: bb.width * k, x: (bb.left - st.left) * k, fs: parseFloat(getComputedStyle(el).fontSize) * k, ff: getComputedStyle(el).fontFamily };
      });
    });
    require("fs").writeFileSync(measure, JSON.stringify(data));
  }
  const fonts = await p.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family + " " + f.weight));
  console.log(JSON.stringify({ errs, fonts }));
  await b.close();
})();
