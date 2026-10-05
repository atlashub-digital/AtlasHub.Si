import Header from "../components/Header";
import Hero from "../components/Hero";
import Approach from "../components/Approach";
import Areas from "../components/Areas";
import Cases from "../components/Cases";
import Clara from "../components/Clara";
import Method from "../components/Method";
import Ecosystem from "../components/Ecosystem";
import Editions from "../components/Editions";
import Closing from "../components/Closing";
import Footer from "../components/Footer";
import SiteInteractions from "../components/SiteInteractions";
export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Approach />
        <Areas />
        <Cases />
        <Clara />
        <Method />
        <Ecosystem />
        <Editions />
        <Closing />
      </main>
      <Footer />
      <SiteInteractions />
    </>
  );
}
