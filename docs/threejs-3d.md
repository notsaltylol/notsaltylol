# Castle in the sky: five styles in real 3D

[Open the 3D scene](https://notsaltylol.github.io/assets/animation-3d.html) · [Open the illustrated scene](https://notsaltylol.github.io/assets/animation.html)

The 3D version rebuilds the floating island as authored procedural geometry: eroded cliffs, rolling meadow, a lake and waterfall, open castle arcades, domed towers, trees, satellite islands, and stone lettering. The camera can travel around the whole scene. It is a new interpretation of the painted composition, rather than a one-to-one reconstruction of that image.

The islands now span **10× their original width and 100× their original land area**. Buildings, trees, leaves, grass blades, and masonry retain their small physical size; the terrain contains more of them. The cliffs and hills grow with the island, preserving its deep rock silhouette. Use the close-up views to inspect the detail.

The illustrated version remains available separately, with its painted layers and restrained parallax. The link above the controls switches between the two versions while keeping the selected style.

## Controls

- **Drag** to orbit horizontally and change the viewing angle. Dragging pauses automatic motion.
- **Islands / Castle / Lake & bridge / Lookout** jump between the overview and focused close-ups. Close-ups pause motion.
- **Scroll** or use the **− / +** buttons to zoom, up to 16×. Keyboard arrows orbit the focused canvas; plus/minus zoom.
- **Shift-drag** or **right-drag** to pan. Shift plus an arrow key also pans.
- **Pause motion / Play motion** stops or resumes the slow automatic orbit.
- **Reset view** restores the starting angle and zoom.
- The initial automatic motion is paused when the browser prefers reduced motion.

Each automatic orbit lasts 60 seconds. The five style buttons reuse the same geometry, camera, and interactions. They update palette, material shading, lighting, outlines, and grain in place. A selected style is reflected in the URL and remembered locally; switching styles keeps the current view.

## Five art directions

| # | Style | URL value | Rendering treatment |
| --- | --- | --- | --- |
| 1 | Golden ruins | `original` | Golden limestone, olive foliage, warm light, matte pigment variation. |
| 2 | Luminous fantasy | `fantasy` | Lush greens, soft toon shading, blue shadows, and luminous water. |
| 3 | Clear-line reverie | `ink` | Cream and olive colors, crisp light bands, paper grain, and fine depth outlines. |
| 4 | Cozy storybook | `cozy` | Gentle colors, nearly flat illumination, and soft contours. |
| 5 | Ghibli-inspired | `ghibli` | Warm sunlight, natural greens, soft painted shadows, and cream clouds. |

The fifth direction draws on the warmth of painted animation backgrounds; it uses this project's own materials and lighting, not a proprietary studio or game shader.

For example, [the clear-line version](https://notsaltylol.github.io/assets/animation-3d.html?style=ink) opens directly with `?style=ink`.

[Compare all five 3D previews](style-gallery-3d.md)

## How it is built

The scene uses Three.js with custom material shading, real directional shadows, and atmospheric fog. Surface shaders control diffuse light bands, colored shadows, pigment noise, and the contrast between light and shade. Separate water shaders animate ripples, falling streams, and foam. A final screen pass applies the selected outlines and paper grain.

All five styles share the detailed castle masonry, staggered roof tiles, arched wooden doors, balcony railings, terrace paving, and sparse climbing ivy. The same shared landscape includes a real arched bridge, shoreline stones, gardens, trailing ivy, and a foreground viewing ledge with a path, flowers, and shrubs. These are geometry additions, so improvements carry through every style.

Trees have finer branching and individual folded leaves: broadleaf crowns use overlapping leaf sprigs, while cypress trees use upward sprays. Their shared `leafDetail` material adds subtle midribs, branching veins, and tip color variation using each leaf's UV coordinates. The foreground also includes ferns, fallen leaves, and leaves on the shrubs. Fine details are easiest to see when zoomed in.

Instanced meadow plants add **23,000 grass tufts containing 109,000 blades, 1,200 ferns, 6,000 clovers, and 111 reeds**. These plants share geometry and live style materials. Grass and reeds sway in slow wind while their roots stay fixed; the wind uses the same normalized loop phase as the scene and returns exactly to its starting pose.

The expanded landscape has **900 grove trees on the main island, 100 on each of three satellite islands, and 400 on the lookout**, alongside the original landmark trees. Spatial chunks let the renderer omit offscreen vegetation. The overview uses lightweight tree crowns and grass silhouettes; close views restore folded leaves, veins, curved grass, and small garden geometry within a fixed rendering budget. The main terrain also retains 4,600 stones and 38,000 flowers, which appear as their size becomes visible on screen. Rock texture and water ribbons use physical-scale frequencies rather than stretching with the land.

The [shared geology helper](../assets/sky-castle-geology.js) deforms the rock geometry at several scales: large crags establish the silhouette, secondary ridges break up the faces, and finer weathering adds smaller variations. Fractal Brownian motion (fBm) combines noise at increasing frequencies and decreasing strengths, so the formation has structure beyond a smooth base mesh.

Procedural rock shading adds broken strata, mineral color flecks, and fine pits. Screen-space derivatives filter the smallest marks as they recede, limiting distant visual noise. Broad, shallow bump shading supplies surface relief; the thin cracks affect color only, keeping them from turning into sharp ridges.

The sky is a procedural shader on a surrounding dome, with soft cloud fields. It is an illustrated atmosphere, not a volumetric weather simulation. The overall rendering aims for stylized illustration rather than photorealism.

The source is split into shared modules:

- [Scene and interaction](../assets/sky-castle-scene.js): camera, lighting, sky, controls, style switching, and screen effects.
- [Terrain](../assets/sky-castle-terrain.js): island geometry, terrain height, lake, waterfall, paths, and small vegetation.
- [Groves](../assets/sky-castle-groves.js): clustered woodland, shared tree variants, spatial culling, and budgeted close-up leaves.
- [Geology](../assets/sky-castle-geology.js): shared fractal rock deformation, from large crags and secondary ridges to finer weathering.
- [Materials](../assets/sky-castle-materials.js): five palettes, surface/water shaders, rock detail, and UV-based leaf veins.
- [Models](../assets/sky-castle-models.js): castle, pavilion, and detailed leafy tree geometry, batched by material.
- [Landscape details](../assets/sky-castle-details.js): bridge, shoreline, gardens, and cliff ivy.
- [Foreground](../assets/sky-castle-foreground.js): grounded viewing-ledge path, flowers, shrubs, ferns, and fallen leaves.
- [Botany](../assets/sky-castle-botany.js): shared instanced grass, ferns, clovers, reeds, and looping wind.

The [viewer HTML](../assets/animation-3d.html) loads the locally vendored Three.js runtime. No public backend, API key, remote textures, or externally hosted runtime assets are needed.

## Run locally

From the repository root:

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `http://127.0.0.1:8768/assets/animation-3d.html?style=fantasy` in a browser with WebGL support. Serve it over HTTP instead of opening the HTML as a local file, because the viewer uses JavaScript modules.

## Export frames or a GIF

The [render script](../scripts/render-animation.cjs) requires Node.js, Playwright, installed Chrome, and—for GIF export—`ffmpeg` on the command path. Keep the local server running, then use another terminal:

```sh
# Four frames, spaced around the full orbit, for visual review.
node scripts/render-animation.cjs \
  http://127.0.0.1:8768/assets/animation-3d.html \
  /tmp/castle-3d-preview --style=ink --preview

# Full 60-second loop: 720 frames at 12 fps, plus animation.gif.
node scripts/render-animation.cjs \
  http://127.0.0.1:8768/assets/animation-3d.html \
  /tmp/castle-3d-export --style=fantasy --gif
```

Replace the style value with any ID in the table. Omit `--gif` to save only PNG frames. The capture API samples a normalized loop phase, so water, plant wind, and camera motion return to their starting state together. A 960 × 600 GIF covering the entire 60-second orbit can be large; the interactive viewer is the more practical way to explore every angle and style.
