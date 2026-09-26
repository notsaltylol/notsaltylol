import { cpSync } from "node:fs";

// Mirror the profile artwork into Astro's public directory for both hosts and dev.
// Keep the originals at the root so GitHub profile README links remain valid.
export default function profileAssets() {
  return {
    name: "profile-assets",
    hooks: {
      "astro:config:setup": () => {
        cpSync(
          new URL("../../assets/", import.meta.url),
          new URL("../public/assets/", import.meta.url),
          { recursive: true },
        );
        cpSync(
          new URL("../../index.html", import.meta.url),
          new URL("../public/island.html", import.meta.url),
        );
      },
    },
  };
}
