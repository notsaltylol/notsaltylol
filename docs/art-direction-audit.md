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

## Current pass: castle hierarchy and weathered masonry

Comparison baseline: source `e42242418ae758f68df74641d4f95d009d1d135e`, canonical output `bc4bddb831dd1acd4d3e2c8ae1dfd5548a17735b`. Earlier production audits remain in Git history. Gallery previews are captured from the source accompanying this document.

- One dominant copper dome sits above a real open octagonal belfry. Lower secondary turrets give the keep a clearer stepped silhouette without increasing its footprint, group scale or highest point. The front loggia remains open.
- Ruined walls use staggered, unequal masonry courses and foundations that follow the actual ground. Their broken upper stones vary in depth and fracture shape instead of forming repeated cubic steps.
- Connected limestone washes, restrained vertical weathering and filtered brushwork break up large clean stone faces. The existing painted rock asset supplies subtle palette-relative color variation; no new image or material asset is loaded. Bright trim remains cleaner, with lower pigment strength in Ink and Cozy.

- The cloud-shadow opening now uses the actual lookout station. Its former hardcoded anchor did not follow the ridge relocation; the periodic drift remains unchanged.

### Visual completion audit

**The AAA quality objective remains open.** Matched close views in Fantasy, Ink and Cozy show a clearer dominant tower, including from the side and rear. The full-island overview changes little at the retained small building scale. This pass improves construction and material finish; it does not establish reference-quality finish across the environment.

Remaining priorities:

1. The castle is still a weak focal cue in overview. Improve its relationship with terrain, color and light while preserving the requested tiny building scale.
2. The cliff still reads as a broad slab in some low views. Further work needs deliberate large and secondary forms, not equal detail everywhere.
3. The foreground needs more deliberate light and shadow. Its clearing should remain spacious.
4. Close waterfall foam remains graphic, and lake reflections use art-directed sky color rather than scene-object reflections.
5. Sky and terrain differ in edge treatment and finish. The five directions need review as complete images, particularly Ink shape grouping and Cozy depth. The sky remains a painted environment dome.
6. Fine vegetation and dense terrain remain substantial rendering work. High-resolution performance needs further work.

### Geometry and motion evidence

The keep retains exactly the same measured bounds, including its highest point at 4.6799998 local units, and the same ten material draw calls. Its triangle count falls from 60,994 to 59,190. Both versions have finite attributes. Existing degenerate triangles at primitive poles remain unchanged; this is not a claim that all legacy geometry is watertight or free of degenerate faces.

Matched before/after renders freeze the rest of the scene at the baseline revision, isolating the keep hierarchy, ruin construction and material changes. The island dimensions, terrain, paths, water, vegetation and camera controls are unchanged in source.

The precinct contains 307 newly bonded wall stones and twelve continuous footings. The new stone shapes have no degenerate triangles or inverted volumes. Sampled footing bottoms are at least 0.092 world units below the rendered ground. Gate position, paving count, maximum precinct height and the occupied radius are unchanged. The precinct increases from 75,804 to 79,772 triangles and remains nine material draws.

Final combined checks passed at 960×600 for all five styles in Overview, Castle and Lookout, plus the four presets and quarter-orbit images. Five-style Castle, Lake and Lookout checks also passed at 1920×1200. Starting and ending PNGs match exactly after an intermediate animation phase, with no page or WebGL errors. Presets, pan, zoom, view-preserving style changes, reset, reduced motion and the 390-pixel phone layout also pass. The lookout cloud-opening projection matches the actual station under two sun directions, and its periodic drift has equal endpoints.

### Performance on the final source

Hardware Chrome on Apple M2 Pro, with synchronized GPU completion/readback, three warmup frames and twelve moving frames per view. Other test browsers were closed. These short measurements are device-specific samples, not sustained frame-rate guarantees. Startup measured 7.3 seconds for the first normal-resolution load and 4.4 seconds for the later Retina load.

| View | 960×600 median / maximum | 1920×1200 median / maximum |
| --- | ---: | ---: |
| Overview | 18.4 / 34.3 ms | 21.2 / 44.3 ms |
| Castle | 12.9 / 28.0 ms | 17.3 / 49.1 ms |
| Lake | 18.3 / 35.8 ms | 25.0 / 65.2 ms |
| Lookout | 10.7 / 190.1 ms | 13.2 / 26.4 ms |

The normal-resolution Lookout sample includes a substantial timing spike whose cause was not isolated. Median timings alone cannot establish consistently smooth interaction. This pass makes no performance-improvement claim; the 16.7 ms frame budget is still exceeded in several views.
