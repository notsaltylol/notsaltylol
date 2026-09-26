import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { projects, site as portfolio } from "../content/site";

export const prerender = true;

export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? (import.meta.env.DEV ? url : undefined);
  if (!origin) {
    throw new Error(
      "RSS requires a public site URL. Set SITE_URL or pass astro build --site.",
    );
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return rss({
    title: `${portfolio.name} — projects`,
    description: portfolio.intro,
    site: new URL(`${base}/`, origin),
    trailingSlash: false,
    items: projects.map((project) => ({
      title: project.name,
      description: `${project.description} ${project.detail}`,
      link: new URL(`${base}/projects/#${project.id}`, origin).href,
      categories: [project.category],
    })),
    customData: "<language>en-us</language>",
  });
};
