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

## Current pass: larger cliff masses and a raised summit

Comparison baseline: source `3402b6af16a5b6e11964151d74fbaaafd7fcfd15`, canonical output `a93f1afe60f621135ff394cad2148c7033a73ff0`. Earlier production audits remain in Git history. Gallery previews are captured from the source accompanying this document.

- Nine unequal hanging rock masses replace the broad supporting core with a narrower connected spine. Deeper oblique clefts, inward-leaning roots and unequal fracture planes give the underside more separate silhouettes around the orbit. The meadow rim, fitted inscription face and waterfall recession envelope remain fixed.
- The summit rises from 27.8 to 33.5 world units at the retained 10× landscape scale. The keep keeps its physical dimensions and position in plan. A longer southwest shoulder and an oblique approach join a short graded ledge into the gate. Grounding is checked against the actual rendered triangles.
- Grass and exposed hill rock now use the same exposure function for rendered terrain and plant placement, with their respective surface normals. A grassy rib separates the larger bare faces.
- The moving cloud opening uses the actual summit anchor instead of its former hardcoded elevation. Fine rock erosion, leaves, grass, masonry dimensions and the five live style treatments remain at physical scale.

### Visual completion audit

**The AAA quality objective remains open.** Matched baseline comparisons isolate the cliff revision from the summit revision. The higher summit gives the small castle a stronger vertical destination, and the lower cliff has more unequal projected masses. The final path no longer descends into a U-shaped trough before reaching the gate. Native Castle views show continuous, supported paving and grounded construction.

Remaining priorities:

1. The upper cliff still reads as a broad face from Lookout, and several lower closures remain strongly tapered. Further refinement should improve large rock planes and depth separation.
2. The summit has broad smooth surfaces, especially behind the castle. Its shape and vegetation transitions need more authored variation while keeping the physical building scale.
3. The foreground needs more deliberate light and shadow; its clearing should remain spacious.
4. Close waterfall foam remains graphic, and lake reflections use art-directed sky color rather than scene-object reflections.
5. Sky and terrain differ in edge treatment and finish. The five directions need review as complete images, particularly Ink shape grouping and Cozy depth. The sky remains a painted environment dome.
6. Fine vegetation and dense terrain remain substantial rendering work. First-use shader compilation and high-resolution cost need further work.

### Geometry and motion evidence

At terrain scales 1 and 10, rim heights and sampled distant land remain exactly unchanged, as do water level and the river lip. Castle anchor X/Z and the small keep geometry remain unchanged. Cliff geometry retains 46,400 / 184,960 triangles, with finite attributes, exact rim and angular seams, no zero-area faces and no nonmanifold edges in the tested cliff skin. Its upper boundary is intentionally open where it joins the meadow. The best fitted username raycast score is unchanged.

A nineteen-phase waterfall sweep finds no cliff penetrations, with minimum sampled clearances of 0.0489 / 0.0740 world units at scales 1 / 10. The lip seam and loop endpoints remain exact.

At scale 10, road vertices agree with the ground sampler within 0.0000024 units of their intended offset; triangle centers remain at least 0.0119 units above ground. The final road edge meets the entrance flagstones within 0.0004 units horizontally, with a 0.0123 vertical difference. All 194 paving stones remain above sampled ground and embedded below it. Twelve continuous footings, sampled at 4,176 points, are buried at least 0.0940 units. House bases, gate feet and tower feet also remain grounded. The precinct retains 79,772 triangles and nine material draws; its 7.885-unit occupied radius stays inside the 9.85-unit reservation.

The actual summit anchor projects to its cloud opening under two sun directions; the periodic drift has equal endpoints. Final combined browser checks passed for all five styles in Overview, Castle and Lookout at 960×600, with four view presets and quarter-orbit images. Castle, Lake and Lookout also passed for all five styles at 1920×1200. Starting and ending PNGs match exactly after an intermediate animation phase, with no page or WebGL errors. Presets, panning, zoom, view-preserving style changes, reset, reduced motion and the 390-pixel phone layout also pass.

### Baseline performance diagnosis

The previous release recorded a single 190.1 ms Lookout sample. Two bounded fresh-Chrome repetitions on Apple M2 Pro did not reproduce it: normal-resolution Lookout maxima were 15.0 / 15.8 ms and Retina maxima 28.5 / 28.8 ms. Timed Lookout frames had stable program and geometry counts. No Lookout-specific production optimization was justified.

A separate frozen-baseline trace identified four first-use programs during the first Overview orbit: three shadow-depth variants for a grove, satellite meadow and traveler anatomy, followed by an uncolored instanced rock material on a foreground batch. Each compiled once. Preparing those variants before display is a candidate for a separate measured change; it has not been implemented here.

The timing harness uses synchronized readback. Some first measured frames include queued initial work, so its total is not an isolated GPU timestamp or sustained frame-rate guarantee. This pass makes no performance-improvement claim.

### Final source timing sample

One fresh hardware Chrome session on Apple M2 Pro, with other test browsers closed. Three warmup frames and twelve moving frames per view; both warmup and measured frames finish with the same synchronized one-pixel readback. This corrects the earlier harness inconsistency, so the table should not be used as a direct speed comparison with earlier releases. Startup measured 4.35 seconds at normal resolution and 4.44 seconds for the later Retina load.

| View | 960×600 median / maximum | 1920×1200 median / maximum |
| --- | ---: | ---: |
| Overview | 13.3 / 29.9 ms | 19.5 / 33.5 ms |
| Castle | 11.8 / 13.6 ms | 16.9 / 19.0 ms |
| Lake | 18.5 / 19.6 ms | 27.4 / 30.4 ms |
| Lookout | 10.0 / 12.6 ms | 13.9 / 15.4 ms |

These are short device-specific samples. Several views exceed the 16.7 ms frame budget, and the first Overview orbit still includes the previously identified first-use compilation. Sustained smoothness and the broader visual quality objective remain open.
