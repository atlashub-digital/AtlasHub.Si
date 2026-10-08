import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./tokens.css";
import "./mockup.css";

// Self-hosted (OFL, public/fonts/LICENSE-Inter-OFL.txt): the build does not depend on fonts.googleapis.com.
const inter = localFont({ src: "./inter-latin-wght-normal.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://atlashub.si"),
  title: { default: "AtlasHub.SI — Mais capacidade. Menos complexidade.", template: "%s · AtlasHub.SI" },
  description:
    "Colaboradores digitais geridos e transformação empresarial: reforce a sua operação hoje e construa a sua própria capacidade, com pessoas no controle.",
  alternates: { canonical: "/" },
  icons: { icon: "/assets/atlashub-logo.webp" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AtlasHub.SI",
    title: "AtlasHub.SI — Mais capacidade. Menos complexidade.",
    description: "AI Workforce e Enterprise Transformation: capacidade gerida ou capacidade própria.",
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
