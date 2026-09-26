# Profile inspiration & upkeep

- [rxyhn](https://github.com/rxyhn/rxyhn): restrained introduction, decorative framing, and expandable details. Borrow the consistent visual mood and breathing room.
- [DenverCoder1](https://github.com/DenverCoder1/DenverCoder1): activity, stats, and content cards. Useful if you want a richer profile later.
- [Awesome GitHub Profile README](https://github.com/abhisheknaiidu/awesome-github-profile-readme): a large gallery for exploring other directions.

The current design uses a full-width floating-castle landscape animation, three project links, and two matching dark ink/mint stats cards. Name and LinkedIn come from the public GitHub profile; project links and languages come from public repositories.

## Stats

The old project now recommends [GitHub Stats Extended](https://github.com/stats-organization/github-stats-extended). Both cards use its documented domain. The main card adds reviews, merged PRs, and merge percentage; the compact language card shows up to eight languages.

The public provider refreshes the cards and may cache or rate limit requests. No scheduled job or token is required. Private repository coverage is not promised. Language shares measure repository code, not skill or time spent.

Edit URL parameters in README.md to customize the cards, or use the [card wizard](https://github-stats-extended.vercel.app/frontend).

## Profile setup

The repository already has the special name notsaltylol/notsaltylol. Its default-branch README appears on the profile. The castle GIF is the full-width profile hero.

## Three.js animations

The castle is a 24-second, 960 × 600 loop at 12 fps. Its fantasy default uses deep earthy cliffs, green gardens, a hilltop castle, and a painted blue sky; five alternate styles remain available in the live viewer. Three illustrated depth layers move in slow parallax, with animated water and a small cliff inscription. The profile GIF uses this illustrated version. A separate [real 3D version](threejs-3d.md) provides a 60-second full orbit, interactive camera controls, and all six shader styles.

All six castle styles, the original orbital scene, the frame renderer, and the pinned Three.js runtime are published. See [the complete running and rendering guide](threejs.md). GitHub displays the rendered GIF; open the source through a local web server to see live WebGL playback.
