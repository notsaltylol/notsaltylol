// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
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
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
