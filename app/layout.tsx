import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./tokens.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://atlashub.si"),
  title: { default: "AtlasHub.SI — Mais capacidade. Menos complexidade.", template: "%s · AtlasHub.SI" },
  description:
    "Colaboradores digitais geridos e transformação empresarial: reforce a sua operação hoje e construa a sua própria capacidade, com pessoas no controle.",
  alternates: { canonical: "/" },
  icons: { icon: "/brand/atlashub-symbol-64.png", apple: "/brand/apple-touch-icon.png" },
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
