import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://atlashub.si"),
  title: "AtlasHub — People · Technology · Results",
  description:
    "Pessoas, inteligência artificial e operações ligadas para transformar tecnologia em resultados. Conheça a abordagem AtlasHub e as edições abertas à comunidade.",
  alternates: { canonical: "/" },
  icons: { icon: "/assets/atlashub-logo.webp" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "/",
    title: "AtlasHub — Pessoas, tecnologia e resultados",
    description: "Da inteligência artificial à organização inteligente.",
    images: ["/assets/hero-office.jpg"],
  },
};
export const viewport: Viewport = { themeColor: "#031020" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
