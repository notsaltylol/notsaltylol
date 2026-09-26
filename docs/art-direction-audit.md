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

## Current pass: summit geology and water coverage

Comparison baseline: source `7b12516023b6aea7616d629e3a176a822da3f943`, canonical output `b43c25818d8e453b69d1dccf4b46ff1833364b73`. Earlier production audits remain in Git history. The gallery previews are captured from the source accompanying this document.

- Unequal rock shoulders and an opposing drainage hollow replace the continuous grassy summit mound. A small central bench preserves the castle anchor and foundations; the keep stays above the surrounding ribs. Local mesh refinement resolves the steeper faces.
- Thirteen unequal oblique wedges meet a broader offset cliff core. Continuous joins and unequal lower terminations replace repeated box shoulders and hanging blades. The bright turf skirt and ladder-like join artifacts are removed while the exact meadow rim, waterfall opening and fine physical-scale weathering remain.
- A vertex exposure field blends rock and turf on that same mesh. Its boundary follows the actual slope, with broken painted edges. Trees, flowers, grass, ferns and clovers avoid the bare faces; physical plant sizes and requested populations remain intact. Root positions and scattered stones now use actual rendered ground triangles. Two landmark trees move a few meters onto nearby grass.
- Cozy retains soft cream light and gentle contours, with stronger sage greens and cool shaded values so terrain cuts and architectural openings remain legible.
- A waterfall-only coverage pass attenuates cliff contours beneath animated water. It uses the same foam/transparency shader and tests against opaque scene depth, so foreground objects retain their outlines and clear gaps still reveal the cliff. Falling density is more continuous and less lace-like. Fantasy skips the extra pass because it has no outlines.

### Visual completion audit

**The AAA quality objective remains open.** The summit's broad shape, rock-to-grass transition, plant grounding, Cozy value separation and transparent-water contours improve the image. These are production improvements, not proof that the complete reference-quality environment is finished.

Remaining priorities:

1. Principal cliff faces still need more deliberate secondary geological structure and edge variety. Further surface noise alone will not improve the large design.
2. The tiny castle remains a weak focal cue in overview; repeating ruin blocks are visible close up. Preserve the requested physical scale while strengthening architectural and terrain composition.
3. Close waterfall foam remains stylized and graphic, despite better contour coverage. Lake reflections remain art-directed sky color rather than scene-object reflections.
4. Lookout travelers are too small to carry the narrative in the current preset. Camera-only trials either hid the castle or let foreground land obscure the hanging island; a coherent foreground layout needs further design.
5. Sky and terrain still differ in edge treatment and finish. The five styles need continued visual review as complete images, particularly clean-line shape grouping and Cozy depth. The sky remains a painted environment dome.
6. Some rear views overlap the lookout and hero island. The entire orbit must work, not only the initial angle.

### Summit and vegetation verification

At scales 1 and 10, the castle anchor remains `(-3.1 × scale, 2.78 × scale, -1.7 × scale)`. The rendered ground sampler agrees with raycast heights within `2.8e-13` world units. The walking path remains above the ground, with at least `0.01309` sampled triangle-center clearance at scale 10 and vertex-offset error below `0.0000025`.

The scale-10 meadow has 379,644 triangles, up from 227,681, with extra density concentrated on the summit and water banks. All exposure attributes are finite. Main-island botany retains 23,000 tufts containing 109,000 blades, 1,200 ferns and 6,000 clovers; there are 99 shoreline reeds in this deterministic layout. Full-detail botany uses 2,610,898 triangles. All 900 grove trees remain, and tested roots avoid bare-rock exposure. Plants follow rendered ground with their intended offsets; stored tree transforms differ from ground by less than `0.000002` after accounting for their root overlap.

### Water verification and cost

Five styles pass shader/page-error and exact loop checks in both overview and close fixed-camera views, after an intervening animated frame. An opaque occluder test reduced visible waterfall-mask pixels from 185,049 to zero; removing it restored the mask exactly. Mobile and desktop resizes keep color, depth and coverage targets aligned.

Outlined styles add one waterfall draw and 71,048 triangles. The RGBA8 target uses about 9.2 MB at 1920 × 1200, or 2.3 MB at 960 × 600. Alternating hardware-Chrome close-view samples measured roughly 0.1–0.2ms for that extra pass. This isolates the mask cost; it is not an overall frame-rate guarantee. Waterfall geometry and its joined river lip are unchanged by this pass.

### Cliff and final combined verification

The cliff retains 46,400 triangles at scale 1 and 184,960 at scale 10. Both meshes have finite attributes, no degenerate triangles or internal nonmanifold edges, and zero measured seam or meadow-rim error. The only open boundaries are the expected attachment rings. The username still has viable fitted fracture faces.

A final 19-phase waterfall sweep at scales 1 and 10 found no sampled rock or meadow penetrations, with 89,847 and 573,700 covered vertex checks respectively. Minimum front clearance was 0.0489 and 0.0740 world units. River lip joins and phase 0/1 positions match exactly. Source hashes stayed unchanged throughout verification.

All five styles passed exact endpoint image comparisons after an intervening frame, at 960 × 600 and 1920 × 1200. Final visual review covered overview, quarter-orbit angles, castle, lake and lookout; no page or WebGL errors occurred. Phone controls, pan, zoom, style changes preserving focus, reset, reduced motion and resize passed. These checks establish functional stability, not completion of the visual objective.

### Measured frame cost

Hardware Chrome on an Apple M2 Pro, Fantasy style, with three warmup frames followed by twelve moving frames per view. Each sample includes GPU synchronization and a one-pixel readback. Values below are median / maximum milliseconds, not a sustained FPS benchmark.

| View | 960 × 600 | 1920 × 1200 |
| --- | --- | --- |
| Overview | 18.4 / 22.5 | 23.5 / 46.8 |
| Castle | 14.3 / 35.3 | 17.5 / 47.8 |
| Lake | 21.3 / 42.6 | 25.3 / 67.9 |
| Lookout | 13.6 / 22.9 | 16.8 / 37.3 |

Local startup measured 5.15 and 4.30 seconds for the two resolutions. Compared with the previous pass, median times rose roughly 1–6ms, including the extra summit triangles and meadow material work. Close-view detail remains available, but the scene does not consistently meet a 16.7ms frame budget. Optimizing this cost remains part of the production work.
