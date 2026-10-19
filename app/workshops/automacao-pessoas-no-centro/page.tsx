import type { Metadata } from "next";
import SalesLanding from "../../../components/SalesLanding";
import { ll01, salesWhatsAppUrl } from "../../../lib/sales/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Automação com Pessoas no Centro — Live Lab 01 | AtlasHub.SI",
  description: "Crie o seu próprio agente de IA. 100% ONLINE, ao vivo, 27 e 29 de outubro de 2026. Automação com Pessoas no Centro — A Nova Era da IA 2027–2030.",
  openGraph: { title: "Crie o seu próprio agente de IA | AtlasHub.SI", description: "100% ONLINE · 27 e 29 de outubro de 2026 · 2 encontros ao vivo", images: ["/assets/workshops/ll01/retrato-executivo-sentado.webp"] },
  robots: { index: false, follow: false }, // levantar após homologação comercial e editorial
};

type Props = { searchParams: Promise<{ origem?: string }> };
export default async function LiveLab01Page({ searchParams }: Props) {
  const { origem } = await searchParams;
  return <SalesLanding offer={ll01} whatsapp={salesWhatsAppUrl(ll01, origem ?? "")} />;
}
