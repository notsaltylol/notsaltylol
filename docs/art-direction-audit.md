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

## Current pass: warm and cool pigment in the foreground clearing

Comparison baseline: source `bd0f3bdfca879c9a1836e928e5e5c8d57f397710`, canonical output `4e1df197c6f4a42798c26b5e7b2b773241f0468c`. Baseline source Pages run `36288730119` and canonical Pages run `36288771576` succeeded; their public source assets, previews, five styles and loop frames matched the reviewed version. Previous satellite, foreground, habitat, lighting and geometry audits remain in Git history.

Two broad pigment masses now follow the foreground's existing oblique fold: cooler, deeper grass in the hollow and a shorter warm wash over the right shoulder. Their shapes use the same local coordinate frame as the terrain relief, with broad feathered edges and weaker pigment near the travelers. They remain anchored to the ground throughout the orbit.

A two-channel normalized byte attribute is baked only on the lookout meadow: 61,602 bytes. A dedicated ground material interpolates the weights and reuses existing painted brushwork. The five styles retain their own habitat-pigment strength. There are no new noise octaves, texture samples, terrain vertices, plant instances or render passes. Every existing position, normal, UV, habitat attribute, triangle index and viewing anchor remains exact.

### Visual judgment

**The AAA quality objective remains open.** The first narrow, weaker study had insufficient visible effect. The accepted broader treatment was reviewed in matched 960×600 images across all five styles, native close views, nearby Lookout orbit angles and Fantasy quarter-orbit overviews. Root and an independent reviewer agree it is a small improvement, not a transformation.

Fantasy and Ghibli gain the clearest cool hollow/warm shoulder separation. Original gains quieter pigment variation. Ink and Cozy remain restrained; the Ink hollow's existing hard light band is not a newly introduced pigment boundary. Travelers, their footing, small grass and painted strokes remain readable. No distracting stripe, circular footprint ring, new hard pigment boundary, rim crack or floating surface was found. Quarter-orbit overviews stay visually quiet. Do not increase the pigment strength further to compensate for broader art-direction weaknesses.

Remaining priorities:

1. Stronger inhabited-landscape composition and painterly treatment across the broad castle court. The foreground's large color grouping improves, but its open lawn and overall brushwork still need further art direction.
2. More natural main-island cliff masses and summit shoulders. The castle still sits on a conspicuously round upper mesa. The secondary islands retain smooth stacked shelves and comparatively uniform meadow; the largest foot remains slightly bulbous at two angles.
3. Close tree crowns retain smooth large shells despite individual fine leaves.
4. Waterfall foam remains graphic; lake reflections borrow the painted sky rather than reflecting scene objects.
5. Sky and land need more consistent edge treatment and finish across the five art directions.
6. Several views remain above a 16.7 ms budget in this device sample. Technical success does not establish visual completion or sustained performance.

### Verification

- At scales 1 and 10: all pre-existing lookout geometry attributes and indices match baseline byte-for-byte. The meadow/cliff rim remains exact, all 135,168 triangles and two landform draw calls remain, and the width is unchanged (180.1049 units at scale 10).
- The new normalized color channels are finite and bounded, with exact angular seams; their sampled maxima are 1.0 and 0.8. The viewing anchor is exact. No ground sampler, plant placement, physical detail dimensions, castle, main island, satellite, lake, river or waterfall source changed.
- All five styles pass Overview, Castle and Lookout at 960×600; Fantasy also passes Lake and quarter-orbit views. Initial Overview and Castle frames are byte-identical to baseline in all five styles.
- All five styles pass Castle, Lake and Lookout at 1920×1200 with exact loop-end PNGs after an intermediate phase. Nearby Lookout orbit angles were inspected at 1824×1140. No JavaScript or WebGL errors were reported.
- Presets, Shift-arrow/Shift-drag panning, zoom, view-preserving style switching, reset, reduced motion and a 390-pixel Retina phone layout pass. Culling, fine-detail budgets and shadow updates retain their existing implementation.
- Seven previews were regenerated directly from the reviewed source; only Lookout changes. All new source is published with that renderer-export preview. No external or AI-generated assets were introduced, and the separate illustrated profile GIF is unchanged.

### Hardware Chrome sample

Apple M2 Pro hardware Chrome. Three warmup and twelve moving frames per view, with the same synchronized one-pixel readback during warmup and measurement. Draw and triangle counts match baseline in all four views. The new shader adds a two-component varying and a few color operations only to the lookout ground. Baseline startup was 4.720/4.660 seconds at normal/Retina resolution; candidate startup was 4.891/5.047 seconds.

| View | Baseline 960×600 median | Candidate 960×600 median / maximum | Baseline 1920×1200 median | Candidate 1920×1200 median / maximum |
| --- | ---: | ---: | ---: | ---: |
| Overview | 20.5 ms | 20.7 / 23.6 ms | 28.5 ms | 25.6 / 30.1 ms |
| Castle | 15.9 ms | 17.4 / 19.2 ms | 22.4 ms | 22.4 / 25.2 ms |
| Lake | 25.6 ms | 26.8 / 30.8 ms | 34.2 ms | 34.2 / 47.5 ms |
| Lookout | 15.4 ms | 19.7 / 22.1 ms | 19.6 ms | 18.6 / 23.7 ms |

The inconsistent Lookout result prompted an additional interleaved baseline/candidate comparison: four alternating rounds, eight warmup and thirty frames each, staying near the visible clearing. At the responsive 912×570 buffer, round medians ranged 13.8–14.6 ms baseline and 14.5–15.7 ms candidate. At 1824×1140 they ranged 17.8–18.3 ms baseline and 16.6–17.8 ms candidate. These short samples show timing variability; they do not isolate GPU cost, establish a performance gain or prove a consistent regression.

The current source and canonical deployments must be checked at their exact revision before reporting delivery.
