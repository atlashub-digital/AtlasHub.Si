import type { Metadata } from "next";
import WorkshopDetail from "../../../components/WorkshopDetail";
import { workshopBySlug } from "../../../lib/workshops";

export const dynamic = "force-dynamic";

const w = workshopBySlug("enterprise-lab-ecommerce")!;

// Pré-lançamento: fora do índice e do sitemap até à aprovação de local, preço e inscrições (docs/WORKSHOPS.md).
export const metadata: Metadata = {
  title: `${w.title} · Workshop`,
  description: `${w.headline} ${w.date}, ${w.time}, ${w.city}.`,
  alternates: { canonical: "/workshops/enterprise-lab-ecommerce" },
  openGraph: { type: "website", url: "/workshops/enterprise-lab-ecommerce", title: "E-commerce e Operações Vivas", description: "Matriz de gargalos, blueprint e indicadores. 28 de novembro, Anápolis. Por empresa, um representante.", images: ["/assets/cro-v2/el01.webp"] },
  twitter: { card: "summary_large_image", title: "E-commerce e Operações Vivas", description: "Matriz de gargalos, blueprint e indicadores. 28 de novembro, Anápolis. Por empresa, um representante.", images: ["/assets/cro-v2/el01.webp"] },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WorkshopDetail w={w} />;
}
