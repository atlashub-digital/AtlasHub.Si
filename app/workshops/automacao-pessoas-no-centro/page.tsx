import type { Metadata } from "next";
import SalesLanding from "../../../components/SalesLanding";
import { ll01, salesWhatsAppUrl } from "../../../lib/sales/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Automação com Pessoas no Centro — Live Lab 01 | AtlasHub.SI",
  description: "Crie o seu próprio agente de IA. 100% ONLINE, ao vivo, 27 e 29 de outubro de 2026. Automação com Pessoas no Centro — A Nova Era da IA 2027–2030.",
  openGraph: { type: "website", url: "/workshops/automacao-pessoas-no-centro", title: "Automação com Pessoas no Centro — Live Lab 01", description: "100% ONLINE · 27 e 29 de outubro de 2026 · 2 encontros ao vivo", images: ["/assets/cro-v2/ll01.webp"] },
  twitter: { card: "summary_large_image", title: "Automação com Pessoas no Centro — Live Lab 01", description: "100% ONLINE · 27 e 29 de outubro de 2026 · 2 encontros ao vivo", images: ["/assets/cro-v2/ll01.webp"] },
  robots: { index: false, follow: true }, // noindex mantido até revisão editorial CRO V2
};

type Props = { searchParams: Promise<{ origem?: string }> };
export default async function LiveLab01Page({ searchParams }: Props) {
  const { origem } = await searchParams;
  return <SalesLanding offer={ll01} whatsapp={salesWhatsAppUrl(ll01, origem ?? "")} />;
}
