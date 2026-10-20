import type { Metadata } from "next";
import WorkshopDetail from "../../../components/WorkshopDetail";
import { workshopBySlug } from "../../../lib/workshops";

export const dynamic = "force-dynamic";

const w = workshopBySlug("empresa-aumentada-2027-2030")!;

// Pré-lançamento: fora do índice e do sitemap até à aprovação de local, preço e inscrições (docs/WORKSHOPS.md).
export const metadata: Metadata = {
  title: `${w.title} · Workshop`,
  description: `${w.headline} ${w.date}, ${w.time}, ${w.city}.`,
  alternates: { canonical: "/workshops/empresa-aumentada-2027-2030" },
  openGraph: { type: "website", url: "/workshops/empresa-aumentada-2027-2030", title: "Empresa Aumentada 2027–2030", description: "Visão executiva, Mapa Inicial de Oportunidades e Clínica de Ideias. 14 de novembro, Anápolis.", images: ["/assets/cro-v2/w01.webp"] },
  twitter: { card: "summary_large_image", title: "Empresa Aumentada 2027–2030", description: "Visão executiva, Mapa Inicial de Oportunidades e Clínica de Ideias. 14 de novembro, Anápolis.", images: ["/assets/cro-v2/w01.webp"] },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WorkshopDetail w={w} />;
}
