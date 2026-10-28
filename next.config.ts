import type { NextConfig } from "next";
const config: NextConfig = {
  reactStrictMode: true,
  images: { qualities: [75, 90, 95] }, // approved premium hero: allow high-fidelity optimization
  typescript: { ignoreBuildErrors: false },
};
export default config;
