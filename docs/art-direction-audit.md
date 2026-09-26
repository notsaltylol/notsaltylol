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

## Current pass: painted rock lighting and shader preparation

Comparison baseline: source `c848806252b8222156d3ce1b3bbc2edbf5a56056`, canonical output `a8c68afb2c0ac6ddb5367174a8ebe0158d007e3c`. Earlier production audits, including the preceding geometry and grounding checks, remain in Git history. Gallery previews are captured from the source accompanying this document.

- Warm light and palette-relative cool shade now multiply surface pigment. The previous fixed shadow-color blend muted mineral colors; the revised response retains the painted albedo in shaded areas. Rock sky fill is weaker and more directional, preserving darker recesses between lit planes.
- The sun direction changes to `(-28, 25, 16)` in landscape coordinates after matched front, close and quarter-orbit comparisons. Its shadow camera depth follows the sun offset. The shared projected cloud field follows the same direction.
- Cozy separates cream/tan rock from sage turf, with a cooler sage shadow tint and slightly more contrast. It retains smooth, unbanded lighting, cream masonry and mint roofs.
- Existing material variants are prepared against the actual scene lights and color render target before the first displayed frame. A single instanced triangle prepares the double-sided depth variant used by distant leaves; this proxy is never rendered. Fine tree geometry stays lazy. Startup evidence is recorded below.
- No land geometry, plant populations, building dimensions, texture frequencies or camera presets change in this pass. The 10× width and 100× area remain intact, including the small physical detail and supported castle approach.

### Visual completion audit

**The AAA quality objective remains open.** Review of all five Overview, Castle and Lookout sets and Fantasy's three quarter orbits found improved separation of the existing cliff planes, with readable rear faces and retained mineral color. Cozy's warm rock reads more clearly against green meadow while Ink retains its stepped light bands. Original remains olive/gold, Fantasy vivid and Ghibli-inspired softer and more natural. A separate foreground cloud-bank experiment was rejected because it did not yield a useful visual improvement.

Remaining priorities:

1. The upper cliff still presents a broad face from Lookout, and several lower closures remain strongly tapered. Larger planes need more natural shape and depth separation.
2. The summit retains broad smooth surfaces, especially behind the castle. Its silhouette, shoulders and vegetation transitions need more authored variation at the retained small building scale.
3. The foreground lawn and castle court remain visually uniform. They need more deliberate value grouping without filling the travelers' open clearing or hiding the small architecture.
4. Close waterfall foam remains graphic; lake reflections use art-directed sky color rather than scene-object reflections.
5. The sky and land differ in edge treatment and finish. Ink needs better shape grouping and retains a thin ground-shadow streak below and left of the castle gate; Cozy remains intentionally soft but needs review as a complete image. The sky is still a painted environment dome.
6. Fine vegetation, LOD transitions and high-resolution rendering cost need further work. Startup preparation alone does not establish sustained smoothness.

### Verification

The final material and sunlight combination passes all five styles in Overview, Castle and Lookout at 960×600, all four camera presets, and quarter-orbit captures. Starting and ending PNGs match exactly after an intermediate phase, with no page or WebGL errors. The final source also passes all five styles in Castle, Lake and Lookout at 1920×1200 with exact loop endpoints. Camera presets, keyboard and pointer panning, zoom, view-preserving style switching, reset, reduced motion and the 390-pixel phone layout pass without browser errors.

Native-resolution visual review of the highest-risk Ink, Cozy and Fantasy views found no new clipping, broken water coverage or lost masonry/plant detail that blocks this lighting revision. The remaining minor Ink ground-shadow artifact is recorded above.

### Startup preparation evidence

An isolated frozen-baseline experiment compared the existing scene with the color-material warmup alone. Eleven image pairs were byte-identical. Four program additions observed across sixty first-orbit samples were absent in the candidate; the same initial geometry count was retained. Its timing comparison overlapped another browser run, so it supports program and image evidence, not a startup speedup claim.

A denser 720-frame trace of the combined light-and-material source identified one additional instanced, double-sided depth program at phase `0.5875`, used by the lookout's coarse leaf batch. A public `MeshDepthMaterial` proxy now prepares the exact program before display. Its synchronous compile setup temporarily omits fog, matching the depth pass, and restores fog before awaiting shader completion. The render target is restored before rendering. The proxy geometry is disposed after compilation, while its material keeps the program cached.

With this correction, no new programs appear across all 720 first-orbit samples. Twelve saved-baseline/candidate image pairs are byte-identical, including initial view, loop end, and all five Overview/Lookout combinations. The registered geometry count and initial drawn triangle count are unchanged. No browser or WebGL errors were observed. This establishes the sampled shader-preparation behavior; it does not prove every possible zoom or camera path is free of compilation, nor establish a startup-time improvement.

Style selection remains available while loading. A readiness guard defers drawing until preparation completes, and fog is never absent between event-loop tasks. A targeted browser check held each compile promise and clicked the visible style buttons: the former code rendered prematurely during the first wait and threw during the second. The correction preserves both selections, retains the color target during preparation, and displays the final selected style without errors.

### Final source timing sample

One hardware Chrome session on Apple M2 Pro with other test browsers closed; three warmup and twelve moving frames per view. Warmup and measured frames both finish with the same synchronized one-pixel readback. Startup measured 4.125 seconds at normal resolution and 4.018 seconds on the later Retina load.

| View | 960×600 median / maximum | 1920×1200 median / maximum |
| --- | ---: | ---: |
| Overview | 14.7 / 18.3 ms | 19.9 / 28.5 ms |
| Castle | 10.7 / 13.0 ms | 15.2 / 17.5 ms |
| Lake | 17.2 / 18.3 ms | 26.0 / 28.3 ms |
| Lookout | 10.2 / 12.6 ms | 12.8 / 14.9 ms |

These short device-specific samples are not isolated GPU timestamps or a sustained frame-rate guarantee. The higher-resolution Overview and Lake samples still exceed a 16.7 ms frame budget. This pass makes no controlled performance-improvement claim.
