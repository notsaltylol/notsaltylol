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

## Current pass: a distinct lower mass for the largest satellite

Comparison baseline: source `bdf9567f7af33d643a5ec4fcafdc2b33edb85e77`, canonical output `7d80a1b891dee4c8941f99d1ebdea0a7d6e27e31`. Both baseline Pages workflows succeeded and their public output matched the preceding reviewed pass. Previous foreground, habitat-pigment, lighting and geometry audits remain in Git history.

The largest secondary island now has a broader, oblique rock foot. Its lower hanging tips join into one unequal mass while the smaller two islands retain their separate pointed buttresses. An explicit `baseProfile` option selects this shape; it is not coupled to a random seed. The blend begins below 56% of the rock shell and changes only vertex height. At scale 10, the maximum local vertical change is 3.5141 units, and the lowest point remains 17.1253 units below the local origin before the satellite's existing 0.92 group scale.

All meadow attributes, horizontal rock coordinates, upper cliff positions, UVs, topology, random sequences and ground sampling remain exact. The tiny pavilion and grove therefore keep their footing and physical scale. There are no added textures, noise octaves, vertices, plant instances, shaders or rendering passes.

### Visual judgment

**The AAA quality objective remains open.** Matched close views of all five styles and Fantasy quarter-orbit details were reviewed independently by two agents, alongside normal-size overviews and the existing close presets.

The change is a modest improvement in landform variety. The largest satellite no longer repeats the long paired teeth of its neighbors. The underside keeps a short broken edge at the initial angle, unequal corners at quarter and three-quarter turns, and a narrower keel at the half turn. It does not introduce a broad horizontal cut. The improvement is easiest to read in the quarter- and half-orbit overviews; the castle island remains the focal point.

The lower corners are still somewhat bulbous in two close angles, and Ink reduces the lower mass to a broad dark shape. Do not soften this profile further or apply it to every satellite. No new visible cracks, floating surfaces, high-frequency noise or loss of the tiny pavilion/grove was found. This is one bounded shape adjustment, not a completed geological or painterly treatment.

Remaining priorities:

1. Richer painterly grouping in the open foreground and broad castle court, with more deliberate inhabited-landscape composition.
2. More natural main-island cliff masses and summit shoulders. The castle still sits on a conspicuously round upper mesa. The secondary islands retain smooth stacked shelves and comparatively uniform meadow. Previously rejected cliff/summit studies remain unpublished.
3. Close tree crowns retain smooth large shells despite individual fine leaves.
4. Waterfall foam remains graphic; lake reflections borrow the painted sky rather than reflecting scene objects.
5. Sky and land need more consistent edge treatment and finish across the five art directions.
6. High-resolution Overview and Lake rendering remain above a 16.7 ms budget in this device sample. Technical success does not establish visual completion or sustained performance.

### Verification

- At scales 1 and 10 and all three satellite seeds: finite attributes, unchanged indices and UVs, no zero-area triangles, exact angular position/normal seams and a zero-error meadow/cliff rim. Each landform retains 25,600 triangles, 13,031 vertices and two landform draw calls.
- All meadow attributes and every rock x/z coordinate match baseline byte-for-byte. Upper rock positions through ring 35 are exact. A thousand height, radius and containment samples per island/scale match. Center seats remain exact. The two smaller islands' full geometry attributes are unchanged.
- All five styles pass Overview, Castle and Lookout at 960×600; Fantasy also passes Lake and quarter-orbit views. Castle and Lookout frames remain byte-identical to baseline in every style.
- All five styles pass native 1920×1200 satellite detail views and Castle, Lake and Lookout. Fantasy satellite detail also passes all quarter-orbit views. Exact loop-end PNGs match after an intermediate phase, with no JavaScript or WebGL errors.
- Presets, Shift-arrow/Shift-drag panning, zoom, view-preserving style switching, reset, reduced motion and a 390-pixel Retina phone layout pass. Scene controls, culling, close-detail budgets and shadow updates retain their existing implementation.
- Seven previews were regenerated directly from the reviewed Three.js source; the five Overview images change, while the identical Castle and Lookout previews are retained. No external or AI-generated assets were introduced. The separate illustrated profile GIF is unchanged.

### Hardware Chrome sample

One Chrome session on Apple M2 Pro, three warmup and twelve moving frames per view, with the same synchronized one-pixel readback in warmup and measurement. Draw and triangle counts match baseline in all four views. The static deformation adds no ongoing shader or geometry cost. This short sequential sample does not isolate GPU time or prove a performance improvement. Baseline startup was 4.431/4.616 seconds at normal/Retina resolution; candidate startup was 4.473/4.434 seconds.

| View | Baseline 960×600 median | Candidate 960×600 median / maximum | Baseline 1920×1200 median | Candidate 1920×1200 median / maximum |
| --- | ---: | ---: | ---: | ---: |
| Overview | 16.0 ms | 16.4 / 18.7 ms | 20.4 ms | 22.2 / 24.1 ms |
| Castle | 14.8 ms | 14.2 / 15.3 ms | 18.3 ms | 16.4 / 20.3 ms |
| Lake | 23.0 ms | 23.8 / 26.8 ms | 31.7 ms | 27.4 / 29.9 ms |
| Lookout | 12.5 ms | 12.4 / 15.2 ms | 15.7 ms | 13.9 / 16.9 ms |

The current source and canonical deployments must be checked at their exact revision before reporting delivery.
