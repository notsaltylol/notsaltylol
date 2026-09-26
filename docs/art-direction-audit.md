# Real 3D art-direction audit

Objective: achieve AAA quality in the five requested styles. This is a visual production goal, not a synonym for passing WebGL tests. Completion is not yet established.

## Scope that must survive refinement

- Real orbitable 3D with the same shared composition and live style switching.
- Islands ten times their original width, with small buildings and trees, and fine physical-size detail.
- Hilltop castle, lake and connected waterfall, secondary islands, foreground lookout, travelers, and the username built into the rock.
- Golden ruins, luminous fantasy, clear-line comic, cozy storybook, and Ghibli-inspired directions. Pixel and Pastel remain retired.
- Slow seamless motion, inspectable close views, responsive controls, and published scene source.
- The profile's separate illustrated GIF stays separate unless the user requests a new export.

## Visual completion evidence required

1. **Composition and depth:** a deliberate focal hierarchy, readable silhouettes, useful negative space, and separation of foreground, hero island, and distant atmosphere. Review the normal overview and all quarter-orbit views; a single flattering screenshot is insufficient.
2. **Terrain:** an organic geological silhouette with coherent large rock masses, secondary ledges and fissures, and filtered fine texture. No obvious sinusoidal lobes, smooth bowl, floating rims, repetitive spikes, or blocked waterfalls.
3. **Architecture:** convincing scale, grounded construction, coherent masonry and openings, and a recognizable castle silhouette in close views. Added detail must support the larger design.
4. **Vegetation:** readable groves and clearings, habitat-based ground cover, varied tree silhouettes, grounded roots, and consistent detail levels. Avoid smooth balloon crowns beside high-detail leaves at the same screen size, uniform confetti scatter, and crawling subpixel noise.
5. **Water and atmosphere:** believable continuous lake/river/fall, natural shoreline/depth cues, broad reflected color, sparse filtered highlights, and structured clouds with warm lit faces and cool undersides. No repeated water grid, flat white cloud blobs, or visible billboard intersections.
6. **Five art directions:** each style must stand on its own. Golden ruins: warm limestone and olive pigment. Fantasy: rich greens, blue atmosphere, luminous flowing water. Ink: confident clean contours and limited warm colors. Cozy: soft watercolor colors and restrained flat lighting. Ghibli-inspired: natural painted greens, warm sun, cooler shadows, and cream clouds. A palette swap alone does not prove the style is successful.
7. **Presentation and motion:** inspect at full display resolution, a phone viewport, and detailed camera views. No shader errors, obvious clipping, stale shadows, flashing LOD, abrupt loop seams, or unusable startup/interaction. Capture actual frame timings on the test device; do not infer performance from triangle counts.
8. **Delivered state:** published source and previews must match the tested scene. Verify the public deployment and record the exact revision.

## Baseline at f0d7934

The 10× expansion and physical detail distribution work, and browser interaction/loop checks pass. The image does not meet the objective yet. Main visible defects are the block-shaped five-lobed cliff mass, flat cloud field, uniform bright stone/flower scattering, repetitive water highlights, blotchy turf, and low-detail smooth crowns remaining visible in close views. The render still reads as a procedural scale model rather than a finished illustrated environment.

## Published baseline at 0fb90ab

The painted panorama replaced the procedural cloud field, and the main cliff gained unequal faces and hanging masses. Scatter follows habitats, close tree crowns retain folded leaves, and short water marks replace continuous contours. Local bank refinement increased the meadow from 71,680 to 227,681 triangles and reduced sampled bank interpolation error by about 91%. Responsive rendering retains high-density desktop sharpness without allocating a desktop-sized buffer on phones.

That pass was published and verified on both the source repository's Pages site and the canonical root site. It established technical progress, not completion of the visual objective.

## Published baseline at 22f7d45

Painted meadow and rock surfaces, clearer light, asymmetric secondary islands, a small castle precinct, and cloaked travelers were published and verified on both Pages sites. The images still exposed a broad tapered cliff, a sterile courtyard, smooth sheet-like water, and dense rounded shrub beds. The 10× width and fine physical-size detail remained intact.

## Current production pass: form, water, and perspective

- Main cliff massing now has unequal projecting blocks, a broad blunt western foot, a shorter offset taper, deep structural breaks, and interrupted bedding shelves. The turf boundary trails irregularly over its upper beds. The inscription occupies a continuous fracture face rather than a separate plaque.
- Four attached low wings and an incomplete planted cloister replace the bare rectangular fortress court. The enclosure breaks into unequal remnants and eroded tower shells; beveled masonry and subtle mineral/rain washes reduce its pristine appearance. The keep remains tallest and its physical height is unchanged.
- The water borrows the already-loaded sky texture for blurred reflected color. Depth, shoreline foam, layered falling lanes, and irregular fading edges provide more structure. The sky reflection does not include buildings or plants; the waterfall is still based on the existing connected mesh.
- The lookout's 600 loosely spaced habitat patches replace six dense circular shrub beds. Close shrubs use branch sprays and folded leaves; a worn path with occasional embedded stones replaces the repetitive stepping-stone chain. Nearly 3,000 shrubs and 9,000 flowers remain, at their existing physical size.
- A 30-degree perspective camera separates foreground and distant islands. Zoom moves the camera toward its focus rather than magnifying the lens. Panning uses the actual projected width at the focus plane. Ink contours linearize perspective depth before finding edges. The sky uses a translation-free view so dolly motion and panning do not change cloud size.
- Detail selection measures actual perspective depth for each spatial chunk and projected coverage for each tree. Far-away plants no longer receive close-up geometry simply because the camera focuses on a nearby object. Existing populations, physical geometry, detail thresholds, and near-detail budgets remain intact; fine/coarse shrub representations share bounds at transitions. Shadow caches refresh when caster visibility changes.

All five styles still share one geometry composition. Islands remain 10× wide with 100× the land area, small buildings and trees, slow exact-loop motion, responsive controls, and public source. The separate illustrated scene and profile GIF are unchanged.

## Visual critique and next priorities

**The AAA objective remains open.** The perspective camera, fractured cliff, inhabited architecture, and layered water make the scene more spatially coherent. The worn lookout trail and leafy planting remove obvious repeated garden blobs. The result still does not match the reference's finished painterly environment.

1. The castle remains very small in the overview, as required by the expanded scale. Its silhouette and approach need a stronger focal hierarchy through landform, lighting, and connected architecture, without simply enlarging every building.
2. The cliff's broad breaks are stronger, but some faces and shelves still read as procedural slabs. The meadow silhouette and hill transitions need more deliberate geological structure.
3. The lake is still a broad oval-looking surface and the waterfall retains a sheet-like outline in close views. More natural bank shapes, breakup at the lip, and integrated spray would improve the connected water system.
4. Architecture is more coherent, but roof/plaster surfaces and large wall fragments remain visually simple beside the painted land. Material variation should follow construction and exposure rather than adding uniform noise.
5. The cloud painting competes with the land in rear views. The five directions are distinguishable, but their combined lighting, shapes, and surface marks still need a more unified illustration finish.

Continue from fresh renders rather than counting added objects as progress. Rendering correctness and performance do not establish visual completion.

## Verification for this pass

- Final geometry was checked at scales 1 and 10: exact meadow/cliff rim error is zero; no nonfinite attributes, degenerate triangles, or unexpected nonmanifold boundaries. Meadow, lake, river, and the shared fine `fractalRock` function are unchanged by the cliff revision.
- Six hundred actual waterfall-sheet samples per scale found no rock intersections; minimum clearance at scale 10 is 0.86 world units. The 184,960-triangle cliff count is unchanged.
- The revised keep and precinct total 139,724 triangles (+2.7%) across 19 material batches (previously 20). Precinct radius 7.917 stays inside the reserved footprint, with grounded foundations and the keep still tallest.
- All 2,425 lookout path vertices lie on the actual ground mesh within 0.000004 units of their intended offset. Plant and traveler transforms are finite and grounded.
- Direct browser checks prove identical sky pixels at zoom 1 and 16 and after panning. A 100px by 50px pointer pan moves a marker on the focus plane by exactly those screen distances.
- All five styles and the four view presets passed JavaScript/WebGL and exact loop-endpoint checks. Side/rear close views were also inspected. Presets, orbit, pan, zoom, reset, style persistence, reduced motion, and phone layout passed with the perspective camera.

- A CPU comparison found identical initial populations across the detail-selection correction (276,277 instanced placements in its test scene), finite bounds, and deterministic selections after revisiting views. Lake grove geometry fell from 1.952M to 0.658M triangles; nearby castle botany remains exactly 644,052 triangles.

Hardware Chrome on an Apple M2 Pro loaded the frozen scene in about 3.8 seconds. Synchronized 12-frame samples used GPU readback after each frame, including any detail-triggered shadow refreshes. These measurements are device-specific, not an FPS guarantee.

| View | 960 × 600 median | 1920 × 1200 median |
| --- | ---: | ---: |
| Islands | 14.4ms | 18.7ms |
| Castle | 10.3ms | 12.0ms |
| Lake | 15.6ms | 23.1ms |
| Lookout | 12.0ms | 16.2ms |

The perspective correction reduced the measured lake frame from 11.34M to 5.05M submitted triangles including shadow work; the Retina median improved from 27.4ms to 23.1ms. The slowest final sample was 52.8ms in the Retina lake view. Intermittent stalls and the demanding lake view remain performance targets. No additional texture asset or sky render pass was introduced by the water reflection.
