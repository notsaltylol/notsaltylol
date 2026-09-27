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

## Current pass: a shallow fold in the foreground clearing

Comparison baseline: source `3aa6ba9f51e61723376c6dd19f68b8b606e8854e`, canonical output `b182e54fe3080e8cb43e63cc4ef58d309c93ea0b`. Previous habitat-pigment, lighting and geometry audits remain in Git history.

A localized oblique hollow and one unequal turf shoulder divide the broad Lookout lawn into a quiet traveler perch and a larger right shoulder. They are smooth changes to the existing height field, with no added noise, vertices, incidental objects or shader changes. At the active 10× scale, the maximum sampled vertical change is 0.5064 world units. The immediate traveler ground is protected; both traveler heights and the resulting preset camera position remain exact.

The meadow and rock still share their edge positions. The existing rock weathering is evaluated against the adjusted surface; this causes up to 0.0827 world units of horizontal change in the nearby cliff surface. The worn path and plants continue to sample actual ground triangles. Island width, terrain topology, fine physical dimensions, textures and plant populations are retained.

### Visual judgment

**The AAA quality objective remains open.** The initial deeper, narrower hollow was rejected because it created a sharp notch in the foreground silhouette. The accepted version is wider and shallower. All five matched Lookout pairs and Fantasy quarter-orbit overviews were reviewed, followed by native close views and nearby Lookout orbit angles.

This is a modest improvement to the foreground landform: the lawn now has a gentle saddle between unequal shoulders, while the travelers, path, tiny grass and distant castle island stay readable. Ink produces the strongest shaded strip on one slope; it reads as a coherent toon-shaded plane, and the hollow should not be deepened further. Cozy gains mainly a clearer silhouette. No new visible rim crack, floating surface, high-frequency noise or overview regression was found.

Remaining priorities:

1. The foreground still needs richer painterly grouping inside its open areas; the castle court remains broad and uniform. The shallow fold alone does not resolve either completely.
2. More natural large cliff masses and summit shoulders. Several lower closures resemble similar tapered lobes, and the castle sits on a conspicuously round upper mesa. Previously rejected cliff/summit studies remain unpublished.
3. Close tree crowns retain smooth large shells despite individual fine leaves.
4. Waterfall foam remains graphic; lake reflections borrow the painted sky rather than reflecting scene objects.
5. Sky and land need more consistent edge treatment and finish across the five art directions.
6. High-resolution Overview and Lake rendering remain above a 16.7 ms budget in this device sample. Technical success does not establish visual completion or sustained performance.

### Verification

- At terrain scales 1 and 10: finite ground/cliff attributes, identical indices and UVs, no zero-area triangles, closed angular seams with matching normals, and an exact meadow/cliff rim. The lookout retains 135,168 triangles, two landform draw calls and its original width.
- At active scale 10, both traveler heights are exactly unchanged. The grounded trail stays 0.011997–0.012003 units above the actual ground triangles. All foreground instance matrices are finite.
- Foreground detail populations match baseline: 3,000 shrubs, 9,000 flowers, 1,200 rocks, 73,854 fine leaves and 60 nearby grass tufts. No main-island geometry, lake/river/fall, castle, satellite model, camera control or shader source changed.
- All five styles pass Overview, Castle and Lookout at 960×600; Fantasy also passes Lake and quarter-orbit views. Exact loop-end PNGs match after an intermediate phase, with no JavaScript or WebGL errors.
- All five styles pass Castle, Lake and Lookout at native 1920×1200 with exact loop endpoints. Presets, Shift-arrow/Shift-drag panning, zoom, view-preserving style switching, reset, reduced motion and a 390-pixel Retina phone layout pass.
- Seven preview frames were regenerated from the reviewed Three.js source; identical frames are retained without needless changes. The changed Lookout preview is a direct renderer export. No new external or AI-generated assets were introduced, and the separate illustrated profile GIF is unchanged.

### Hardware Chrome sample

One Chrome session on Apple M2 Pro, three warmup and twelve moving frames per view, using the same synchronized one-pixel readback in warmup and measurement. Draw and triangle counts match baseline in all four sampled views. This short sequential sample does not isolate GPU time or establish a performance improvement. Baseline startup was 4.225/4.292 seconds at normal/Retina resolution; candidate startup was 4.099/4.149 seconds.

| View | Baseline 960×600 median | Candidate 960×600 median / maximum | Baseline 1920×1200 median | Candidate 1920×1200 median / maximum |
| --- | ---: | ---: | ---: | ---: |
| Overview | 13.3 ms | 12.5 / 14.7 ms | 19.7 ms | 19.3 / 21.5 ms |
| Castle | 10.6 ms | 11.9 / 13.4 ms | 14.9 ms | 14.7 / 17.5 ms |
| Lake | 17.7 ms | 17.3 / 18.8 ms | 26.0 ms | 25.1 / 27.4 ms |
| Lookout | 9.6 ms | 9.7 / 12.4 ms | 12.7 ms | 12.8 / 15.2 ms |

The current source and canonical deployments must be checked at their exact revision before reporting delivery.
