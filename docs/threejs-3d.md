# Castle in the sky: four styles in real 3D

[Open the 3D scene](https://notsaltylol.github.io/notsaltylol/assets/animation-3d.html) · [Open the illustrated scene](https://notsaltylol.github.io/notsaltylol/assets/animation.html)

The 3D version rebuilds the floating island as authored procedural geometry: eroded cliffs, rolling meadow, a lake and waterfall, open castle arcades, domed towers, trees, satellite islands, and stone lettering. The camera can travel around the whole scene. It is a new interpretation of the painted composition, rather than a one-to-one reconstruction of that image.

The illustrated version remains available separately, with its painted layers and restrained parallax. The link above the controls switches between the two versions while keeping the selected style.

## Controls

- **Drag** to orbit horizontally and change the viewing angle. Dragging pauses automatic motion.
- **Scroll** over the scene to zoom. Keyboard arrows orbit the focused canvas; plus/minus zoom.
- **Pause motion / Play motion** stops or resumes the slow automatic orbit.
- **Reset view** restores the starting angle and zoom.
- The initial automatic motion is paused when the browser prefers reduced motion.

Each automatic orbit lasts 60 seconds. The four style buttons reuse the same geometry, camera, and interactions. They update palette, material shading, lighting, outlines, and grain in place. A selected style is reflected in the URL and remembered locally; switching styles keeps the current view.

## Four art directions

| # | Style | URL value | Rendering treatment |
| --- | --- | --- | --- |
| 1 | Golden ruins | `original` | Golden limestone, olive foliage, warm light, matte pigment variation. |
| 2 | Luminous fantasy | `fantasy` | Lush greens, soft toon shading, blue shadows, and luminous water. |
| 3 | Clear-line reverie | `ink` | Cream and olive colors, crisp light bands, paper grain, and fine depth outlines. |
| 4 | Cozy storybook | `cozy` | Gentle colors, nearly flat illumination, and soft contours. |

For example, [the clear-line version](https://notsaltylol.github.io/notsaltylol/assets/animation-3d.html?style=ink) opens directly with `?style=ink`.

[Compare all four 3D previews](style-gallery-3d.md)

## How it is built

The scene uses Three.js with custom material shading, real directional shadows, and atmospheric fog. Surface shaders control diffuse light bands, colored shadows, pigment noise, and the contrast between light and shade. Separate water shaders animate ripples, falling streams, and foam. A final screen pass applies the selected outlines and paper grain.

All four styles share the detailed castle masonry, staggered roof tiles, arched wooden doors, balcony railings, terrace paving, and sparse climbing ivy. The same shared landscape includes a real arched bridge, shoreline stones, gardens, trailing ivy, and a foreground viewing ledge with a path, flowers, and shrubs. These are geometry additions, so improvements carry through every style.

Trees have finer branching and individual folded leaves: broadleaf crowns use overlapping leaf sprigs, while cypress trees use upward sprays. Their shared `leafDetail` material adds subtle midribs, branching veins, and tip color variation using each leaf's UV coordinates. The foreground also includes ferns, fallen leaves, and leaves on the shrubs. Fine details are easiest to see when zoomed in.

Instanced meadow plants add **230 grass tufts containing 1,090 blades, 12 ferns, 60 clovers, and 12 reeds**. These plants share geometry and live style materials. Grass and reeds sway in slow wind while their roots stay fixed; the wind uses the same normalized loop phase as the scene and returns exactly to its starting pose.

Procedural rock shading adds broken strata, mineral color flecks, and fine pits. Screen-space derivatives filter the smallest marks as they recede, limiting distant visual noise. Broad, shallow bump shading supplies surface relief; the thin cracks affect color only, keeping them from turning into sharp ridges.

The sky is a procedural shader on a surrounding dome, with soft cloud fields. It is an illustrated atmosphere, not a volumetric weather simulation. The overall rendering aims for stylized illustration rather than photorealism.

The source is split into shared modules:

- [Scene and interaction](../assets/sky-castle-scene.js): camera, lighting, sky, controls, style switching, and screen effects.
- [Terrain](../assets/sky-castle-terrain.js): island geometry, terrain height, lake, waterfall, paths, and small vegetation.
- [Materials](../assets/sky-castle-materials.js): four palettes, surface/water shaders, rock detail, and UV-based leaf veins.
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
