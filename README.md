# Portfolio theme playground

Two routes (`/` and `/projects/`) share content and a React controller. The theme
selector changes the presentation without reloading the page.

- **Tailwind:** custom Glass, Brutalist, and Minimal styles.
- **daisyUI:** actual daisyUI cards, buttons, badges, and input styling.
- **HyperUI:** adapted Tailwind markup from HyperUI's marketing card patterns.
- **Starwind:** generated Starwind React Button, Card, Badge, and Input components.

All project content is illustrative demo content, stored in `src/content/site.ts`.
Change it once to update every presentation.

## Development

```sh
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

Use the presentation buttons in the header. The Tailwind group has a second
selector for its custom styles. Preferences persist in localStorage. Gallery
search, category, and selected project are owned by the shared controller and
survive presentation changes. Search/filter state is in-memory, not saved on reload.

## Where things live

- `src/experience/Website.tsx`: shared routing, state, preferences, and dialog.
- `src/experience/types.ts`: presentation contract.
- `src/themes/`: independent presentation components.
- `src/styles/global.css`: shared CSS, daisyUI configuration, and Tailwind styles.
- `src/styles/starwind.css`: scoped Starwind tokens.
- `src/components/starwind-react/`: generated Starwind source.
- `src/pages/`: static, directly addressable Astro pages.

Add custom Tailwind styles under `.theme-tailwind.style-NAME`, then add the option
and persistence validation in `Website.tsx`. Add a new full presentation by
implementing `PresentationProps` and registering it in the controller.

For this small demo, all presentations ship together for immediate switching.
The controller uses React; daisyUI, HyperUI, and custom Tailwind CSS do not
inherently require React. Starwind also supports native Astro components.

Component references: [HyperUI](https://hyperui.dev/components/marketing/cards/),
[daisyUI](https://daisyui.com/), [Starwind](https://starwind.dev/).

## GitHub Pages deployment

In your GitHub repository, set **Settings → Pages → Build and deployment →
Source** to **GitHub Actions**. Push to `main` or manually run the
**Deploy to GitHub Pages** workflow.

The workflow installs Node.js and pnpm using `mise.toml`, builds the static
site, and deploys it with the built-in GitHub token. It reads the site URL
and base path from GitHub Pages, including project repository paths and
custom domains. Cloudflare builds continue to use the root path.

For links to files in `public/`, use `import.meta.env.BASE_URL` in Astro
templates so links work on both hosts.

## Cloudflare Workers deployment

Node.js and pnpm versions are pinned in `mise.toml`.

```sh
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

This site uses the official `@astrojs/cloudflare` adapter on Cloudflare Workers.
`wrangler.jsonc` sets the Worker name to `personal`; the adapter generates
the deployment configuration and assets during the build.
Change the Worker name there if needed before your first deployment.

Set `SITE_URL` to your real public Cloudflare or custom-domain URL when building
or deploying so `@astrojs/sitemap` can generate absolute URLs. For example,
prefix the commands below with `SITE_URL=https://your-domain.com`.
Without a site URL, sitemap generation is skipped with a warning.
GitHub Pages supplies its URL automatically and sets `DEPLOY_TARGET=github-pages`
to build without the Cloudflare adapter.

```sh
# Build and validate deployment without publishing
mise exec -- pnpm deploy:check

# Build and preview with the local Cloudflare runtime
mise exec -- pnpm preview

# Authenticate once, then build and publish
mise exec -- pnpm exec wrangler login
mise exec -- pnpm deploy
```

For CI, provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as
CI secrets and run `mise exec -- pnpm deploy` after installing dependencies.
Routes are prerendered by default. Cloudflare supports on-demand routes, but
any routes shared with GitHub Pages must remain prerendered.

## Styling

Tailwind CSS 4 is configured through `@tailwindcss/vite` in `astro.config.mjs`.
Import `src/styles/global.css` in your pages or shared layout to use utilities.
The old `@astrojs/tailwind` integration is deprecated.

See the [Astro Cloudflare deployment guide](https://docs.astro.build/en/guides/deploy/cloudflare/).

