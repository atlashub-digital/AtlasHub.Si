import type { Metadata } from "next";
import WorkshopDetail from "../../../components/WorkshopDetail";
import { workshopBySlug } from "../../../lib/workshops";

const w = workshopBySlug("empresa-aumentada-2027-2030")!;

// Pré-lançamento: fora do índice e do sitemap até à aprovação de local, preço e inscrições (docs/WORKSHOPS.md).
export const metadata: Metadata = {
  title: `${w.title} · Workshop`,
  description: `${w.headline} ${w.date}, ${w.time}, ${w.city}.`,
  alternates: { canonical: "/workshops/empresa-aumentada-2027-2030" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WorkshopDetail w={w} />;
}
