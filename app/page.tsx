import Header from "../components/Header";
import ArchitectureHero from "../components/ArchitectureHero";
import Offers from "../components/Offers";
import AtlasJourney from "../components/AtlasJourney";
import Areas from "../components/Areas";
import Cases from "../components/Cases";
import Clara from "../components/Clara";
import Workshops from "../components/Workshops";
import Ecosystem from "../components/Ecosystem";
import Editions from "../components/Editions";
import Closing from "../components/Closing";
import Footer from "../components/Footer";
import SiteInteractions from "../components/SiteInteractions";
export default function Home() {
  return <>
    <Header />
    <main id="conteudo">
      <ArchitectureHero />
      <Offers />
      <AtlasJourney />
      <Areas />
      <Cases />
      <Workshops />
      <Clara leadsEnabled={Boolean(process.env.LEAD_WEBHOOK_URL && process.env.LEAD_WEBHOOK_TOKEN)} />
      <Ecosystem />
      <Editions />
      <Closing />
    </main>
    <Footer />
    <SiteInteractions />
  </>;
}
