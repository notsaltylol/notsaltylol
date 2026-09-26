# Profile inspiration & upkeep

- [rxyhn](https://github.com/rxyhn/rxyhn): restrained introduction, decorative framing, and expandable details. Borrow the consistent visual mood and breathing room.
- [DenverCoder1](https://github.com/DenverCoder1/DenverCoder1): activity, stats, and content cards. Useful if you want a richer profile later.
- [Awesome GitHub Profile README](https://github.com/abhisheknaiidu/awesome-github-profile-readme): a large gallery for exploring other directions.

The current design uses an original local SVG banner, a dark ink/mint palette, three project links, and two matching stats cards. Name and LinkedIn come from the public GitHub profile; project links and languages come from public repositories.

## Stats

The old project now recommends [GitHub Stats Extended](https://github.com/stats-organization/github-stats-extended). Both cards use its documented domain. The main card adds reviews, merged PRs, and merge percentage; the compact language card shows up to eight languages.

The public provider refreshes the cards and may cache or rate limit requests. No scheduled job or token is required. Private repository coverage is not promised. Language shares measure repository code, not skill or time spent.

Edit URL parameters in README.md to customize the cards, or use the [card wizard](https://github-stats-extended.vercel.app/frontend).

## Profile setup

The repository already has the special name notsaltylol/notsaltylol. Its default-branch README appears on the profile. Keep the banner at assets/header.svg when publishing.

## Three.js animation

`assets/castle-in-the-sky.gif` is a six-second seamless loop rendered from a real Three.js scene at 800 × 500, 15 fps. GitHub displays the GIF; it does not execute JavaScript. The scene has three depth layers: a floating rocky garden, a sandstone castle with an oxidized dome, and golden cumulus clouds. A closed camera path produces gentle parallax. The palette follows the supplied reference, interpreted as faceted 3D geometry. The source is `assets/animation.html`, with deterministic frame capture in `scripts/render-animation.cjs`.

To regenerate, install Playwright and Chrome, and have ffmpeg available. Download `three.module.js` and `three.core.js` from `https://cdn.jsdelivr.net/npm/three@0.180.0/build/` into a temporary directory alongside a copy of `assets/animation.html`. Serve that directory locally, then run:

```sh
node scripts/render-animation.cjs http://127.0.0.1:8767/animation.html /tmp/profile-animation/frames
ffmpeg -y -framerate 15 -i /tmp/profile-animation/frames/%03d.png -filter_complex '[0:v]split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3' -loop 0 assets/castle-in-the-sky.gif
```

If Playwright is installed outside this repository, set `NODE_PATH` to its parent `node_modules` directory. The third-party runtime and intermediate PNG frames are not committed.
