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

## Current pass: lighting, habitats, and falling water

Comparison baseline: source `3af2e7bea0799514a03b7960ae14c97db76dbd99`, canonical output `404b76094fb71ed9766240abe895e6926953bb27`. Earlier production audits remain in Git history. The five gallery previews are captured from the source accompanying this document.

- Stronger side sunlight reveals the cliff's separate faces while keeping the castle facade readable. Broad, softly moving cloud shadows share one world-space projection across terrain, trees and masonry. Openings leave the summit and travelers in light. Ink applies cloud attenuation after its sharp light bands to avoid hard shadow blobs. This is art-directed shading, not a simulation of volumetric cloud shadows.
- Trees, grass, ferns, clovers, flowers, shrubs and stones now sample one authored habitat layout. Connected woodland shoulders, meadow drifts and open paths replace independent scatter fields. Ferns favor woods; flowers favor their edges and open meadow patches. Stones use the rock material so they no longer read as pale confetti.
- Physical size and population are preserved: 900 main-island grove trees, 400 lookout trees and 100 on each of three satellites; 23,000 grass tufts, 1,200 ferns and 6,000 clovers; 38,000 main-island flowers and 4,600 stones; 3,000 lookout shrubs and 9,000 flowers. Nearby vegetation retains folded leaves, veins and curved blades. Distant detail remains budgeted.
- The walking route samples the actual rendered ground triangles. Four subdivisions across its width keep it above the curved hillside, and its visible strip ends where castle paving begins. Precinct foundations also use the mesh sampler. These changes remove alternating buried path triangles without disabling shadows.
- One joined waterfall lip rolls into a pleated falling sheet with unequal tails, accelerating flow marks, moving openings and sparse physical droplets. The new surface and spray share one material and mesh. The river gains foam before the lip; lake flow stays zero. Steep banks at the outlet now use rock instead of a vertical green patch.

### Visual completion audit

**The AAA quality objective remains open.** The scene has more coherent planting, clearer light direction, a grounded castle approach and more varied falling water. Those improvements justify publishing this pass; passing geometry and browser checks does not establish finished art quality.

Remaining priorities, based on the final overview, close views and quarter orbit renders:

1. The main cliff retains a broad meadow collar and blunt block faces in some angles. Its large geological transitions still need more deliberate design.
2. The tiny castle is readable close up but remains a weak focal cue in the overview. Preserve its requested physical scale while improving surrounding terrain and composition.
3. Waterfall turbulence is more varied, but the upper foam still reads as a stylized wash at close range. The existing depth-outline pass exposes cliff edges through translucent water in outlined styles. Lake reflections remain art-directed sky color rather than scene-object reflections.
4. The lookout clearing and several meadow slopes feel too empty or uniformly smooth. Future planting should strengthen the composition rather than refill every clearing with scatter.
5. Sky and terrain still differ in edge treatment and finish. The five treatments are distinguishable, but especially Cozy's washed-out values and Ink's broad shape grouping need further visual refinement. The sky remains a painted environment dome.
6. Some rear views overlap the lookout and hero island. The entire orbit needs to work, not only the initial camera angle.

### Geometry and behavior checks

- At scales 1 and 10, actual-ground height queries agree with raycast results to within `2.6e-13` world units. Path vertex offset error stays below `0.0000022`, and sampled triangle centers retain at least `0.01146` clearance. The visible path stops at the castle entrance, avoiding nearly coplanar overlap with its paving.
- All 38,000 main-island flowers and 4,600 stones lie inside their legal habitat masks. The full-detail botany budget remains 2,611,816 triangles. Shared coarse/fine tree crowns, finite attributes, path/reservation clearance, repeatable detail selection and exact plant-wind loops pass.
- The waterfall has 71,048 triangles including 181 physical droplets at scale 10. Its river lip matches exactly. A 19-phase vertex sweep against actual rock and meadow triangles found no sampled penetrations; minimum front clearance was 0.049 at scale 1 and 0.074 at scale 10. These are sampled checks, not a proof for every possible interpolated point.
- All five styles and four view presets pass exact loop-endpoint and JavaScript/WebGL checks. Castle, lake and lookout views also pass at 1920 × 1200 after an intervening animated frame. Quarter-orbit renders were visually inspected.
- Orbit, pan, zoom, style/view preservation, reset, reduced motion and 390px phone layout pass. Source and previews are verified again against both published Pages sites after deployment.

### Measured performance

Hardware Chrome on an Apple M2 Pro loaded the scene in 3.69–3.76 seconds. Three warmup frames and twelve moving frames per view were synchronized with GPU completion/readback, including detail-triggered shadow refreshes. These are device-specific samples, not a general frame-rate guarantee. Measurements precede the final Ink-only cloud-band correction; Fantasy's rendering formula is unchanged by that correction.

| View | 960 × 600 median | 1920 × 1200 median | Previous 1920 × 1200 median |
| --- | ---: | ---: | ---: |
| Islands | 14.7ms | 19.4ms | 20.5ms |
| Castle | 11.5ms | 14.8ms | 11.4ms |
| Lake | 15.2ms | 21.1ms | 20.4ms |
| Lookout | 12.4ms | 15.9ms | 16.8ms |

The slowest sampled frame was 51.8ms in the Retina lake view. The castle view now includes denser nearby woodland and reached 6.15 million rendered triangles including shadow work. Retaining physical detail has a cost; close-view detail selection and intermittent shadow refresh stalls remain performance targets.
