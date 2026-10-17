import type { Metadata } from "next";
import SalesLanding from "../../../components/SalesLanding";
import { ll01, salesWhatsAppUrl } from "../../../lib/sales/pages";

export const metadata: Metadata = {
  title: "Automação com Pessoas no Centro — Live Lab 01 | AtlasHub.SI",
  description: "Quatro encontros LIVE ONLINE: estratégias, processos e casos reais para operações mais capazes. 22 e 29/11, 05 e 12/12, 18h–20h Brasília.",
  robots: { index: false, follow: false }, // levantar após homologação comercial e editorial
};

type Props = { searchParams: Promise<{ origem?: string }> };
export default async function LiveLab01Page({ searchParams }: Props) {
  const { origem } = await searchParams;
  return <SalesLanding offer={ll01} whatsapp={salesWhatsAppUrl(ll01, origem ?? "")} />;
}
