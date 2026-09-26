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

## Current pass: sky framing, cliff structure and a closer lookout

Comparison baseline: source `b24448e31888b57edcec02bcfb490995798b5c56`, canonical output `3b3ff708019c06d2f6ce2ad2a137d19cdb188a7b`. Earlier production audits remain in Git history. Gallery previews are captured from the source accompanying this document.

- Wider angular sky mapping puts a large painted cloud bank beside the island and a cloud sea below it, while leaving blue around the summit. Fantasy has a restrained blue grade that preserves cream highlights. Soft polar haze prevents edge-row streaks at steep elevations. The existing locally stored painting is reused.
- Five connected buttress-and-cleft systems and three partial dipping recesses add secondary structure to the accepted cliff envelope. Their ends remain attached to the supporting body. A narrower lettering protection band restores existing erosion below the name; it does not add another fine noise layer.
- The lookout ridge moves laterally and has a real cove beside its viewing point. A camera near the unchanged-size travelers frames them against the sky, with the summit visible and an air gap below the distant island. This replaces the former distant, nearly unreadable foreground figures. The default overview keeps the main island unobscured.
- The path, landmark trees, grove exclusions and travelers follow the new ridge and its rendered ground. Two small patches of short grass and clover frame the nearby clearing. Existing landscape populations and physical detail sizes remain intact.
- Lookout retains its wider lens and near-horizontal camera limits while orbiting or panning. Style changes preserve the view; other presets and Reset restore the usual landscape lens and elevation limits.

### Visual completion audit

**The AAA quality objective remains open.** The sky now provides more depth, local cliff cuts break broad faces, and the Lookout view has a readable relationship between people and the floating island. These changes improve the composition, but do not establish reference-quality finish across the whole environment.

Remaining priorities:

1. The cliff still reads as a broad slab from some low views. Further work needs deliberate large and secondary forms, not equal detail everywhere.
2. The castle remains a weak focal cue in overview, and repeated ruin blocks are visible close up. Keep the requested small physical scale while improving architectural and terrain composition.
3. The new foreground composition needs more deliberate light and shadow. The clearing should remain spacious; adding props or filling the lawn is not a substitute for that design.
4. Close waterfall foam remains stylized and graphic. Lake reflections use art-directed sky color rather than scene-object reflections.
5. Sky and terrain still differ in edge treatment and finish. Review the five styles as complete images, particularly clean-line shape grouping and Cozy depth. The sky remains a painted environment dome.
6. Fine vegetation and the dense terrain remain substantial rendering work. Performance must be measured on the final scene, rather than inferred from counts or a shader-only benchmark.

### Geometry and motion evidence

At scales 1 and 10, the cliff retains 46,400 and 184,960 triangles respectively. Both have finite attributes, no degenerate triangles or internal nonmanifold edges, and zero measured seam or meadow-rim error. The only open cliff boundaries are the expected attachment rings. The best fitted username location and score are exactly unchanged.

The castle anchor and waterfall lip remain fixed. A 19-phase waterfall sweep at scales 1 and 10 found no sampled rock or meadow penetrations across 89,847 and 573,700 covered vertex checks. Minimum front clearance remains 0.0489 and 0.0740 world units. River joins and phase 0/1 positions match exactly.

The reshaped lookout passes finite-attribute, closed-topology, nondegenerate-triangle and exact-rim checks at both scales. Its path samples actual mesh triangles, and both travelers have valid support footprints. A 1,441-position camera sweep checks the full Lookout orbit against the ridge; the camera stays at least 3.0 world units above the land wherever its orbit crosses it.

The sky passed five-style image-loop checks in overview, Castle and Lookout. Its pixels stay identical under camera translation and dolly zoom at a fixed orientation, and extreme elevation captures show no former edge-row streaks or pole starburst.

The combined scene passed three fresh-browser repetitions of the full five-style overview/Lookout sequence, four camera presets and quarter-orbit captures. Each loop endpoint matched its starting PNG exactly. Five-style Castle, Lake and Lookout checks also passed at a 1920×1200 rendering resolution. Controls, view-preserving style changes, reset, reduced motion and a 390-pixel phone layout passed without page or WebGL errors.

One earlier Ink Lookout endpoint comparison failed. Its saved start differs from the three subsequent matching starts at only two waterfall pixels, by one channel level each. The original endpoint was not retained, so the precise cause of that failure is unproven. The three bounded repetitions used the same sequence without extra warming renders or relaxed comparisons; no source change was made for this observation.

### Performance on the final source

Hardware Chrome on Apple M2 Pro, with synchronized GPU completion/readback, three warmup frames and twelve moving frames per view. These short measurements are device-specific samples, not a sustained frame-rate guarantee. Startup was approximately 4.7 seconds at both rendering resolutions.

| View | 960×600 median / maximum | 1920×1200 median / maximum |
| --- | ---: | ---: |
| Overview | 18.3 / 42.7 ms | 24.1 / 49.4 ms |
| Castle | 15.9 / 39.3 ms | 18.8 / 45.8 ms |
| Lake | 21.3 / 36.9 ms | 26.0 / 79.1 ms |
| Lookout | 12.2 / 17.1 ms | 16.8 / 27.0 ms |

Rendering cost is broadly similar to the baseline. The 16.7 ms budget for 60 fps is not consistently met, particularly at higher resolution. A separately tested terrain shader shortcut gave mixed timings and was reverted; it is not part of this release.
