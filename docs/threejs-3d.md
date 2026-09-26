# Castle in the sky: five styles in real 3D

[Open the 3D scene](https://notsaltylol.github.io/assets/animation-3d.html) · [Open the illustrated scene](https://notsaltylol.github.io/assets/animation.html)

The 3D version rebuilds the floating island as authored procedural geometry: eroded cliffs, rolling meadow, a lake and waterfall, open castle arcades, domed towers, trees, satellite islands, and stone lettering. The camera can travel around the whole scene. It is a new interpretation of the painted composition, rather than a one-to-one reconstruction of that image.

The islands now span **10× their original width and 100× their original land area**. Buildings, trees, leaves, grass blades, and masonry retain their small physical size; the terrain contains more of them. The cliffs and hills grow with the island, preserving its deep rock silhouette. Use Castle and Lake & bridge for close details, or Lookout to stand beside the travelers and see the floating island across the sky.

The illustrated version remains available separately, with its painted layers and restrained parallax. The link above the controls switches between the two versions while keeping the selected style.

## Controls

- **Drag** to orbit horizontally and change the viewing angle. Dragging pauses automatic motion.
- **Islands / Castle / Lake & bridge / Lookout** jump between the overview, close details, and a wider lookout vista toward the main island. Focused views pause motion.
- **Scroll** or use the **− / +** buttons to zoom, up to 16×. Keyboard arrows orbit the focused canvas; plus/minus zoom.
- **Shift-drag** or **right-drag** to pan. Shift plus an arrow key also pans.
- **Pause motion / Play motion** stops or resumes the slow automatic orbit.
- **Reset view** restores the starting angle and zoom.
- The initial automatic motion is paused when the browser prefers reduced motion.

The perspective camera gives near and distant islands different apparent sizes. Lookout uses a wider lens near the travelers; other presets use the standard landscape lens. Zoom moves the camera toward the current focus while keeping that field of view fixed, so the sky painting stays clear in close views. Each automatic orbit lasts 60 seconds. The five style buttons reuse the same geometry, camera, and interactions. They update palette, material shading, lighting, outlines, and grain in place. A selected style is reflected in the URL and remembered locally; switching styles keeps the current view.

## Five art directions

| # | Style | URL value | Rendering treatment |
| --- | --- | --- | --- |
| 1 | Golden ruins | `original` | Golden limestone, olive foliage, warm light, matte pigment variation. |
| 2 | Luminous fantasy | `fantasy` | Lush greens, soft toon shading, blue shadows, and luminous water. |
| 3 | Clear-line reverie | `ink` | Cream and olive colors, crisp light bands, paper grain, and fine depth outlines. |
| 4 | Cozy storybook | `cozy` | Cream lights, sage greens, soft cool shade, and gentle contours. |
| 5 | Ghibli-inspired | `ghibli` | Warm sunlight, natural greens, soft painted shadows, and cream clouds. |

The fifth direction draws on the warmth of painted animation backgrounds; it uses this project's own materials and lighting, not a proprietary studio or game shader.

For example, [the clear-line version](https://notsaltylol.github.io/assets/animation-3d.html?style=ink) opens directly with `?style=ink`.

[Compare all five 3D previews](style-gallery-3d.md)

## How it is built

The scene uses Three.js with custom material shading, side sunlight, real directional shadows, and atmospheric fog. Surface shaders shape light bands, colored shade, and pigment variation. An art-directed cloud-shadow field moves slowly across world coordinates, joining across terrain, foliage, and masonry while leaving brighter openings around the castle approach and travelers. It follows the sun direction and loops with the scene; it is separate from the painted sky backdrop. Water shaders animate ripples, falling flow, and foam. A final screen pass adds outlines and paper grain using perspective-correct depth. In styles with outlines, a waterfall-only coverage pass attenuates rock contours beneath the visible water. It follows the same animated foam coverage and respects foreground occlusion; clear gaps still reveal the rock.

All five styles share the detailed castle masonry, staggered roof tiles, arched wooden doors, balcony railings, terrace paving, and sparse climbing ivy. The same shared landscape includes a real arched bridge, shoreline stones, gardens, trailing ivy, and a foreground viewing ledge with a path, flowers, and shrubs. These are geometry additions, so improvements carry through every style.

Four low attached wings, an incomplete cloister, planted corners, and unequal wall remnants form a small hilltop precinct around the keep. Hipped roofs include dormers, projecting eaves, rafters and capped ridges. A roofed cloister and ground-following flagstones connect the gate, court, wings and keep steps. The road and paving sample the actual rendered ground triangles; the approach road ends where the castle paving begins, keeping the surfaces joined without overlapping strips. Unequal exposed rock ribs and a drainage hollow break up the summit slopes while keeping the castle highest. Rock blends into grass on the same terrain mesh; finer local tessellation preserves the steep faces. Trees and meadow plants avoid exposed rock and sample the rendered ground. The broken gateway and eroded tower shells use beveled masonry and restrained mineral and rain weathering. The keep remains tallest, and all buildings remain small relative to the expanded island. Vegetation placement reserves this footprint so trees and meadow plants do not grow through the masonry. Travelers have boots, arms, staffs, hair, and folded capes with slight looping movement.

Trees share one deterministic branch plan at every detail level. Spreading, upright and wind-shaped broadleaf trees use three connected asymmetric crown sprays with open forks; cypress trees have interrupted upward sprays. The core branches and crown shells remain identical through detail transitions. Nearby trees add smaller individual folded leaves—860 per broadleaf variant and 364 per cypress variant—attached to the actual crown surface. Their shared `leafDetail` material adds subtle midribs, branching veins, and tip color variation using each leaf's UV coordinates. The foreground includes ferns, fallen leaves, and a worn earth trail with embedded stones. Its 3,000 shrubs gather into woodland understory, while 9,000 flowers form separate sunny drifts. Nearby shrubs use branch sprays and folded leaves in place of distant crown meshes. Fine details are easiest to see when zoomed in.

Instanced meadow plants add **23,000 grass tufts containing 109,000 blades, 1,200 ferns, 6,000 clovers, and roughly 100 shoreline reeds**. These plants share geometry and live style materials. Grass and reeds sway in slow wind while their roots stay fixed; the wind uses the same normalized loop phase as the scene and returns exactly to its starting pose.

The expanded landscape has **900 grove trees on the main island, 100 on each of three satellite islands, and 400 on the lookout**, alongside the original landmark trees. A shared habitat map places trees, grass, ferns, clovers, flowers, and stones in connected woodland stands, meadow drifts, and shoulder outcrops. Open routes link the landmarks, and the lookout retains a quiet viewing clearing. These distribution changes retain the plant populations, small physical sizes, and fine models, with separate water, rim, path, and building clearances.

Spatial chunks let the renderer omit offscreen vegetation. Detail selection uses each chunk's perspective depth and each tree's projected crown coverage; it preserves full nearby geometry while keeping distant plants inexpensive. Shadow caches refresh when visible casting geometry changes. The overview uses lightweight tree crowns and grass silhouettes; close views restore folded leaves, veins, curved grass, and small garden geometry within a fixed rendering budget. The main terrain also retains 4,600 stones and 38,000 flowers, grouped into habitat patches and revealed as their size becomes visible on screen. Rock texture and water ribbons use physical-scale frequencies rather than stretching with the land.

The [shared geology helper](../assets/sky-castle-geology.js) deforms the rock geometry at several scales: large crags establish the silhouette, secondary ridges break up the faces, and finer weathering adds smaller variations. Fractal Brownian motion (fBm) combines noise at increasing frequencies and decreasing strengths, so the formation has structure beyond a smooth base mesh.

Thirteen unequal oblique rock wedges meet a broader offset core to establish the main cliff silhouette. A continuous outer skin blends their joins, with different lower terminations and no horizontal end caps; the meadow rim and waterfall opening stay fixed. Five connected buttress-and-cleft systems and three partial dipping recesses give the broad faces secondary structure. The turf edge stays physically thin as the island grows. The username follows an actual fracture face without a rectangular sign, with a narrow quiet band behind its strokes. Procedural rock shading adds broken strata, mineral color flecks, and fine pits. Screen-space derivatives filter the smallest marks as they recede, limiting distant visual noise. Broad, shallow bump shading supplies surface relief; the thin cracks affect color only, keeping them from turning into sharp ridges.

Locally stored [painted meadow and rock textures](painted-materials.md) add brushwork to these surfaces. Slope-aware world projections keep marks at physical scale and avoid stretching down steep banks; palette grading preserves the five styles. The secondary islands use unequal shoulders, interrupted shelves, clefts, and hanging buttresses. Buildings and trees sample their actual triangulated ground. The lookout has an authored ridge outline with unequal promontories, shallow coves, two rolling shoulders and a sheltered saddle. Its viewing point sits beside a real cove, with the nearby travelers silhouetted against the sky and a gap below the distant island. Short grass and clover gather near the edges of this open clearing. Discontinuous tilted beds descend to an offset rock keel instead of an elongated hemispherical base. Its grass and rock share an exact rim; plants and the worn footpath sample the actual meadow triangles, so reshaping the land does not leave details floating. Fine rock erosion stays in physical world units.

The lake has two substantial peninsulas and unequal bays, using the same boundary for excavation, water geometry, depth and plant habitats. Its shallow banks carry stones found against the actual new shoreline. Water meshes carry actual depth values for the material's shore-to-deep color transition and broken shore foam. Broad, blurred reflected light borrows the already-loaded sky texture, without a second asset load or an extra render pass. It is an art-directed sky reflection, not a reflection of scene objects. Lake and river surfaces use opaque depth-based color, preventing submerged bridge supports from showing through as pale streaks. River flow starts beyond the overlapping lake mouth. The waterfall joins the river across one continuous lip. Its ballistic profile rolls outward before dropping into an uneven, pleated veil; accelerating shader flow opens the lower sheet into broken tongues and spray. Small three-dimensional droplets share the fall geometry and material, while separate soft mist veils drift near its foot. All motion returns to the same loop endpoint.

The sky uses a locally stored painted panorama on a surrounding dome, with style-specific color grading and subtle looping drift. A wider angular view places a large cloud bank beside the main island, a distant cloud sea below it, and open blue behind the summit. Fantasy adds a restrained blue grade while preserving cream cloud highlights. Angular mapping and soft polar haze prevent the image's edge rows from stretching at steep viewing angles, while the translation-free sky stays fixed during dolly zoom and pan. The land and architecture remain real 3D; the sky is an environment backdrop, not a volumetric weather simulation. [Sky asset and generation prompt](sky-environment.md).

The interactive canvas renders at up to twice its CSS resolution on high-density screens. Frame exports remain 960 × 600. Higher-resolution shadows refocus around close-up views with an adjusted bias, and the initial loading message stays visible until the sky, surface textures, and first frame are ready.

The source is split into shared modules:

- [Scene and interaction](../assets/sky-castle-scene.js): camera, lighting, sky, controls, style switching, and screen effects.
- [Atmosphere](../assets/sky-castle-atmosphere.js): painted sky mapping, color grading, and periodic drift, plus an optional procedural cloud construction mode.
- [Terrain](../assets/sky-castle-terrain.js): island geometry, terrain height, lake, paths, and small vegetation.
- [Ground sampler](../assets/sky-castle-ground.js): indexed triangle sampling for roads and castle paving.
- [Habitat layout](../assets/sky-castle-habitat.js): shared woodland stands, meadow drifts, outcrops, and connected clearings.
- [Waterfall](../assets/sky-castle-waterfall.js): joined ballistic lip, pleated falling surface, and three-dimensional spray.
- [Secondary islands](../assets/sky-castle-satellites.js): asymmetric landforms, fractured cliffs, and mesh-accurate ground sampling.
- [Castle precinct](../assets/sky-castle-acropolis.js): grounded walls, gate, towers, pavilions, paving, and planting.
- [Travelers](../assets/sky-castle-travelers.js): small human silhouettes, folded cloth, and periodic cape movement.
- [Groves](../assets/sky-castle-groves.js): clustered woodland, shared tree variants, spatial culling, and budgeted close-up leaves.
- [Detail selection](../assets/sky-castle-lod.js): shared camera-space measurements for perspective-aware vegetation and scatter detail.
- [Geology](../assets/sky-castle-geology.js): shared fractal rock deformation, from large crags and secondary ridges to finer weathering.
- [Materials](../assets/sky-castle-materials.js): five palettes, surface/water shaders, moving cloud shadows, rock detail, and leaf veins.
- [Models](../assets/sky-castle-models.js): castle, pavilion, and detailed leafy tree geometry, batched by material.
- [Landscape details](../assets/sky-castle-details.js): bridge, shoreline, gardens, and cliff ivy.
- [Lookout landform](../assets/sky-castle-lookout.js): authored meadow ridge, fractured rock base, and shared watertight rim.
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
