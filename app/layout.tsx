import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./tokens.css";
import "./theme.css";
import "./mockup.css";
import "./cro-v2.css";
import "./architecture-v2.css";

// Self-hosted (OFL, public/fonts/LICENSE-Inter-OFL.txt): the build does not depend on fonts.googleapis.com.
const inter = localFont({ src: "./inter-latin-wght-normal.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://atlashub.si"),
  title: { default: "AtlasHub.SI — A inteligência também se constrói.", template: "%s · AtlasHub.SI" },
  description:
    "Arquitetura empresarial agêntica: desenhamos, construímos e acompanhamos a integração entre pessoas, processos, sistemas e funcionários digitais.",
  alternates: { canonical: "/" },
  icons: { icon: "/assets/atlashub-logo.webp" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AtlasHub.SI",
    title: "AtlasHub.SI — A inteligência também se constrói.",
    description: "Arquitetura empresarial agêntica: diagnóstico, blueprint, engenharia, operação e capacitação.",
    images: ["/assets/hero-office.jpg"],
  },
};
export const viewport: Viewport = { themeColor: "#040C18" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
