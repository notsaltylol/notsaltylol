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

## Current pass: ground pigment follows woodland habitats

Comparison baseline: source `dc88f4f8e02455468d33cc665f37404de5926ae0`, canonical output `1d55a4548fb7fb7645652ad90bb3ec5ab2a1c1eb`. Previous lighting, shader-preparation and geometry audits remain in Git history.

The main island and lookout now bake woodland, woodland-edge and flower-drift weights from the same habitat map that places their plants. Ground beneath groves receives cooler, deeper green pigment; meadow edges and flower drifts receive a restrained warmer wash. Open ground stays lighter. Existing wash noise softens transitions, and each style has an independent habitat strength. The main summit's rock exposure still overlays this ground pigment. Plant materials, fine texture frequencies, light direction and painted sky are unchanged.

This is ground color, not a new light or shadow. Three normalized bytes per terrain vertex add 662,403 bytes across the two expanded ground meshes. No triangles, drawing passes, texture fetches or fragment noise octaves were added. The weights are baked once in local island coordinates, before lookout translation. No route-wear color was added from the habitat map because its approximate route differs from the actual castle trail.

### Visual judgment

**The AAA quality objective remains open.** Nineteen matched before/after pairs were reviewed: all five styles in Overview, Castle and Lookout; Fantasy Lake; and three Fantasy quarter-orbit views. This is a modest, accepted improvement in woodland-ground grouping. It is clearest beside the lake and in rear/side views, where connected deeper green grove bases separate woodland from the open meadow. The result retains the small trees and fine plants, shoreline, routes and the five distinct palettes. No new pigment seam or distracting patch edge stood out.

The visible Lookout clearing mostly gains a small brightening; this does not solve its broad uniform lawn. The castle court also remains too uniform. Increasing habitat strength would darken the already readable groves without solving those open areas, so the reviewed values are retained.

Remaining priorities:

1. Stronger authored variation in the foreground clearing and castle court, while retaining quiet space around the travelers and small buildings.
2. More natural large cliff masses and summit shoulders. Several lower closures still resemble similar tapered lobes, and the castle sits on a conspicuously round upper mesa. Temporary alternative cliff and summit studies were rejected; none were published.
3. Close tree crowns still use smooth large shells despite individual fine leaves. A temporary crown study was not integrated into this focused pass.
4. Waterfall foam remains graphic; lake reflections borrow the painted sky rather than reflecting scene objects.
5. Sky and land need more consistent edge treatment and finish across all five art directions. The painted sky remains an environment backdrop.
6. High-resolution Overview and Lake costs remain above a 16.7 ms frame budget in this device sample. Passing rendering tests is not visual completion or a sustained performance guarantee.

### Verification

- At scales 1 and 10, the baseline and candidate have byte-identical existing geometry attributes and indices, identical mesh placements and instanced transforms. The only new ground attribute is normalized habitat pigment. The actual landform, lake/river/fall connection, building support and small physical details are therefore retained.
- The 960×600 comparison set passes all five styles, all four view presets and quarter-orbit views with no JavaScript or WebGL errors. Initial/end PNGs are exactly equal after an intermediate phase.
- All five styles pass Castle, Lake and Lookout at native 1920×1200, again with exact loop endpoints. Native Fantasy/Cozy Lake and the phone layout were visually reviewed for retained fine detail and readable transitions.
- Preset buttons, Shift-arrow and Shift-drag panning, zoom, view-preserving style switching, reset, reduced motion and a 390-pixel Retina phone layout pass.
- Seven gallery previews were regenerated from the reviewed Three.js source: five 960×600 overviews, one 960×600 Lookout and one native 1920×1200 Castle. These are direct renderer exports; no new external or AI-generated image assets were introduced. The separate illustrated profile GIF is unchanged.

### Hardware Chrome sample

One Chrome session on Apple M2 Pro, with three warmup and twelve moving frames per view. Both warmup and measured frames use the same synchronized one-pixel readback. This short sequential comparison does not isolate GPU time or establish a performance improvement. Draw counts and triangle counts match the baseline in every sampled view. Baseline startup was 4.477/4.020 seconds at normal/Retina resolution; the candidate was 4.158/4.182 seconds.

| View | Baseline 960×600 median | Candidate 960×600 median / maximum | Baseline 1920×1200 median | Candidate 1920×1200 median / maximum |
| --- | ---: | ---: | ---: | ---: |
| Overview | 14.6 ms | 14.2 / 16.5 ms | 18.9 ms | 20.7 / 22.9 ms |
| Castle | 12.5 ms | 11.6 / 13.3 ms | 14.9 ms | 15.3 / 17.6 ms |
| Lake | 17.6 ms | 18.0 / 21.3 ms | 24.8 ms | 25.7 / 28.2 ms |
| Lookout | 9.8 ms | 10.5 / 12.9 ms | 13.8 ms | 13.0 / 15.1 ms |

The current source and canonical deployments must be checked at their exact revision before reporting delivery.
