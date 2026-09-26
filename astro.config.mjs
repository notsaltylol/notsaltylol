// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  output: "static",
  adapter:
    process.env.DEPLOY_TARGET === "github-pages"
      ? undefined
      : cloudflare({ imageService: "compile" }),
  session: false,
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Press Start 2P",
      cssVariable: "--font-press-start",
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
      fallbacks: ["monospace"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Neucha",
      cssVariable: "--font-neucha",
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Patrick Hand SC",
      cssVariable: "--font-patrick-hand",
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      weights: ["200 800"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Cinzel",
      cssVariable: "--font-cinzel",
      weights: ["400 900"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
      fallbacks: ["serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Source Serif 4",
      cssVariable: "--font-source-serif",
      weights: ["200 900"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
      fallbacks: ["serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Nunito Sans",
      cssVariable: "--font-nunito-sans",
      weights: ["200 900"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      weights: ["300 700"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.fontsource(),
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      weights: ["100 1000"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "swap",
    },
    {
      provider: fontProviders.local(),
      name: "Pixelated MS Sans Serif",
      cssVariable: "--font-ms-sans",
      display: "swap",
      options: {
        variants: [
          {
            src: ["./node_modules/98.css/dist/ms_sans_serif.woff2"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["./node_modules/98.css/dist/ms_sans_serif_bold.woff2"],
            weight: 700,
            style: "normal",
          },
        ],
      },
    },
  ],
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
