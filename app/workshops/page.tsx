import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Workshops from "../../components/Workshops";

export const metadata: Metadata = {
  title: "Workshops empresariais",
  description: "Workshops presenciais da AtlasHub Enterprise Transformation em Anápolis.",
  alternates: { canonical: "/workshops" },
  robots: { index: false, follow: true },
};

export default function WorkshopsIndex() {
  return (
    <>
      <div id="conteudo">
        <Header current="/workshops" />
        <main><Workshops headingLevel={1} /></main>
      </div>
      <Footer />
    </>
  );
}
