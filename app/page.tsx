import Header from "../components/Header";
import Hero from "../components/Hero";
import Offers from "../components/Offers";
import Areas from "../components/Areas";
import Cases from "../components/Cases";
import Clara from "../components/Clara";
import Method from "../components/Method";
import Ecosystem from "../components/Ecosystem";
import Editions from "../components/Editions";
import Closing from "../components/Closing";
import Footer from "../components/Footer";
import SiteInteractions from "../components/SiteInteractions";
import MockupCanvas, { type MockScreen } from "../components/MockupCanvas";
import home from "../lib/mockups/home.json";

// P01 — Homepage. Desktop (≥ 900 px) renders the approved Visual Pack V1 mockup 1:1
// (components/MockupCanvas); narrow screens keep the responsive sections. Clara, with the
// operations lab and the lead flow, and the footer are shared by both.
export default function Home() {
  return (
    <>
      <div id="conteudo">
        <main className="mk-desktop">
          <h1 className="mk-sr">AtlasHub.SI — Mais capacidade. Menos complexidade.</h1>
          <MockupCanvas screen={home as MockScreen} />
        </main>
        <div className="mk-mobile">
          <Header />
          <main>
            <Hero />
            <Offers />
            <Areas />
            <Method />
            <Cases />
          </main>
        </div>
        <Clara leadsEnabled={Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN)} />
        <div className="mk-mobile">
          <Ecosystem />
          <Editions />
          <Closing />
        </div>
      </div>
      <Footer />
      <SiteInteractions />
    </>
  );
}
