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

// P01 — Homepage (Visual Pack V1). Existing sections are preserved: application areas, cases,
// Clara with the operations lab and lead flow, ecosystem and Editions.
export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Offers />
        <Areas />
        <Method />
        <Cases />
        <Clara leadsEnabled={Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN)} />
        <Ecosystem />
        <Editions />
        <Closing />
      </main>
      <Footer />
      <SiteInteractions />
    </>
  );
}
