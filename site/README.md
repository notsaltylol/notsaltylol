# Résumé and portfolio theme playground

The root route (`/`) is a minimal professional résumé with a profile photo.
`src/content/resume.json` holds the achievements from the supplied résumé and
role tags; `src/content/resume.ts` selects the visible bullets. No email address
or phone number is included. The source PDF stays outside the repository.

The résumé focus links select Default, All bullets, Frontend, AI engineer,
Platform, or Infrastructure. Role views have stable `/resume/{focus}/` URLs.
All bullets contains all 22 experience and project achievements. The same
selection drives each view and its downloadable one-page PDF.

PDFs live in `public/resumes/` and work on static hosts. The generator uses
ReportLab, single-column text, standard headings, and normal text links; it omits
the website photo and checks page count, text extraction, selected bullet coverage,
and absence of email/phone numbers. ATS parsing varies by employer; this is a
simple text layout, not a guarantee of a particular screening result.

After editing the JSON or PDF generator, regenerate the downloads:

```sh
python3 -m pip install -r scripts/requirements-resume.txt
python3 scripts/generate-resume-pdfs.py
```

The Astro build checks the content, generator, and PDF hashes and fails if the
exports are stale. Python is needed for regeneration, not normal site builds.
Keep new variants registered in the JSON; routes and the focus selector are
created from that registry. Never put private contact details in the JSON.

`/random/` opens the existing theme playground with a random presentation.
`/projects/` is its searchable demo project gallery. A compact gear menu in the
top right contains themes, a link back to the résumé, and light/dark mode.
Direct theme links use `/random/?theme=glass` (or any registered theme ID).

- **Glass, Gothic, and Minimal:** first-class custom Tailwind styles.
- **daisyUI:** actual daisyUI cards, buttons, badges, and input styling.
- **HyperUI:** adapted Tailwind markup from HyperUI's marketing card patterns.
- **Starwind:** native Starwind Astro Button, Card, Badge, Input, and Switch components.
- **PaperCSS:** native hand-drawn cards, badges, buttons, and inputs, scoped to its presentation.
- **98.css:** native Windows 98 windows, title bars, status bars, buttons, and checkbox.
- **NES.css:** native pixel-art containers, buttons, inputs, and checkbox.

All project content is illustrative demo content, stored in `src/content/site.ts`.
Change it once to update every presentation.

## Development

```sh
cd site # from the repository root
mise install
mise exec -- pnpm install
mise exec -- pnpm dev --background
```

Use the appearance settings menu in the header to choose among all nine presentations.
Each full page load starts with a randomly chosen style different
from the previous saved style. Manual choices last for the current visit;
navigation between the playground Home and Projects keeps the current presentation. Gallery
search, category, and selected project are owned by the shared controller and
survive presentation changes. Search/filter state is in-memory, not saved on reload.

The Light / Dark switch is independent of the visual style and persists across
reloads. Every presentation has both palettes. daisyUI uses its native toggle,
Starwind uses its Switch primitive, and the custom presentations use native
checkbox switches styled with semantic tokens.
The saved mode and random style are applied in an inline head script before paint.
All presentations are rendered by Astro, so the selected style is visible before
the interaction script loads. Astro’s ClientRouter preserves state between pages.

## Where things live

- `src/experience/Website.astro`: shared shell and pre-rendered presentations.
- `src/experience/controller.ts`: browser state, preferences, filtering, and dialogs.
- `src/experience/types.ts`: presentation contract.
- `src/themes/`: independent presentation components.
- `src/styles/global.css`: shared component layout rules.
- `src/styles/tokens.css`: semantic Tailwind API, theme palettes, and library mappings.
- `src/styles/modes.css`: light/dark semantic palette overrides.
- `src/styles/starwind.css`: scoped Starwind tokens.
- `src/components/starwind/`: native Astro wrappers and Starwind variants.
- `src/pages/`: static, directly addressable Astro pages.

Add custom Tailwind styles by overriding `--ui-*` values under
`.theme-NAME` in `src/styles/tokens.css` and provide its mode palette in
`src/styles/modes.css`, then register its ID in `types.ts` and the `themes` list
in `themes.ts`. Components consume the `@theme inline` API:

```astro
<button class="rounded-panel border-frame border-line bg-surface text-content shadow-panel backdrop-blur-surface hover:bg-surface-hover">
  Shared content
</button>
```

Tokens cover canvas/surface/content/action/focus colors, font families and weights,
corner shapes, shadows, and blur. `@utility` handles border width and background
artwork. Structural differences use named variants such as `gothic:`; theme
selectors define values instead of overriding individual component styles.
Project illustration colors are content data, supplied as `--project-color`,
with a themed artwork override where needed. daisyUI and Starwind retain their
native semantic component tokens; shared chrome uses the same `--ui-*` API.

Add a full presentation by implementing `PresentationProps` and registering it
in `themes.ts` and `Website.astro`.

For this small demo, all presentations ship together for immediate switching.
The site uses Astro components, native DOM events, and Starwind’s browser runtime;
no React runtime or hydration is required.

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
cd site # from the repository root
mise install
mise exec -- pnpm install
mise exec -- pnpm dev --background
```

This site uses the official `@astrojs/cloudflare` adapter on Cloudflare Workers.
`wrangler.jsonc` sets the Worker name to `personal`; the adapter generates
the deployment configuration and assets during the build.
Change the Worker name there if needed before your first deployment.

Set `SITE_URL` to your real public Cloudflare or custom-domain URL when building
or deploying so `@astrojs/sitemap` can generate absolute URLs. For example,
prefix the commands below with `SITE_URL=https://your-domain.com`.
The default site URL is `https://leonkwan.com`; override it with `SITE_URL` for another production host.
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

## Code quality

`pnpm install` enables Husky through the `prepare` script. Each commit runs
lint-staged: ESLint auto-fixes staged JavaScript, TypeScript, and Astro
files, then Prettier formats them. Other supported text files are formatted too.
Unfixable lint errors block the commit. The hook uses mise when available.

```sh
mise exec -- pnpm lint
mise exec -- pnpm lint:fix
mise exec -- pnpm format
mise exec -- pnpm format:check
mise exec -- pnpm check
```

Prettier includes Astro syntax and Tailwind class sorting. Build output,
dependency directories, browser artifacts, and the generated lockfile are excluded.

## RSS

`/rss.xml` contains one item per project from `src/content/site.ts`, linking to
the corresponding gallery card. It includes descriptions and categories; no
publication dates are invented for the sample projects. Every page includes an
RSS discovery link. GitHub Pages base paths are included in feed URLs.

Cloudflare builds should set `SITE_URL=https://your-domain.com` when using a domain other than the default. GitHub Pages
supplies its configured URL through the workflow. Development uses the local URL.

## Typography

Fonts use Astro's built-in Fontsource provider and `<Font />` component, with
Latin subsets, local asset delivery, swap rendering, and optimized fallbacks.
Tailwind's `@theme inline` maps them to `font-body`, `font-display`, and
`font-controls`; shared UI and native library components consume the same tokens.
Fonts are loaded as needed rather than preloading all nine presentations.

| Style    | Body / controls         | Headings                |
| -------- | ----------------------- | ----------------------- |
| Glass    | Manrope                 | Manrope                 |
| Gothic   | Source Serif 4          | Cinzel                  |
| Minimal  | Source Serif 4          | Source Serif 4          |
| daisyUI  | Nunito Sans             | Nunito Sans             |
| HyperUI  | Space Grotesk           | Space Grotesk           |
| Starwind | DM Sans                 | DM Sans                 |
| PaperCSS | Neucha                  | Patrick Hand SC         |
| 98.css   | Pixelated MS Sans Serif | Pixelated MS Sans Serif |
| NES.css  | Press Start 2P          | Press Start 2P          |

PaperCSS's upstream stylesheet is isolated with CSS `@scope` in
`src/themes/PaperStyles.astro`. Its remote font import is removed so Astro owns
font delivery. Light/dark colors are bridged to the shared semantic palette.

98.css and NES.css are also isolated with CSS `@scope`. The MS Sans Serif files
bundled with 98.css use Astro’s local font provider (regular and bold). NES.css
uses Fontsource through Astro. Both styles map their light/dark palettes onto
the shared semantic tokens.

### Liquid glass

The Glass presentation uses an Astro SVG filter and the Tailwind `liquid-surface`
utility, inspired by [daftplug’s liquid glass pen](https://codepen.io/daftplug/pen/QwbaYGO).
Refraction is isolated behind card, style-picker, and dialog content. The edge
highlights use semantic light/dark tokens. No JavaScript is needed for the effect;
browsers without backdrop filters and reduced-transparency preferences get solid
surfaces. SVG filter rendering can vary by browser.

## Profile repository

This app lives in `site/` inside `notsaltylol/notsaltylol`. The root README is the
GitHub profile; root assets, docs, and scripts retain the island artwork. Astro
mirrors the root assets into its public directory during startup, preserving
`/assets/` links in development and both deployment targets. The old island
redirect remains available at `/island.html`. Edit the root asset originals,
not the generated copies in `site/public/assets/`.

SEO defaults to https://leonkwan.com/. Set `SITE_URL` to override the canonical origin for another host. The source stays here.
The `notsaltylol/notsaltylol.github.io` repository contains only generated output
and a Pages publishing workflow. Build this app with base `/` and site
`https://notsaltylol.github.io`, then publish `dist/` to that repository's `public/`
directory. Automatic publishing from this source repository is awaiting deploy-key
approval. The existing project Pages workflow keeps the old
https://notsaltylol.github.io/notsaltylol/ links working too.

## Search and sharing

The shared layout emits a canonical URL without query parameters, role-specific
page titles and descriptions, Open Graph and Twitter metadata, and ProfilePage /
Person JSON-LD from the public résumé data. The portrait is used for social
previews; its web copy has EXIF metadata removed without changing image pixels.
There are no email or phone fields in the page or structured profile data.

The sitemap includes the résumé and role pages. `/random/` and `/projects/`
contain demo content and have `noindex, follow` metadata; they are excluded from
the sitemap. `/robots.txt` permits crawling and points at the sitemap index.
Search indexing and domain/DNS setup still depend on deployment; these local
changes do not publish the site or register it with Search Console.
