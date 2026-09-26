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

## Baseline at f0d7934

The 10× expansion and physical detail distribution work, and browser interaction/loop checks pass. The image does not meet the objective yet. Main visible defects are the block-shaped five-lobed cliff mass, flat cloud field, uniform bright stone/flower scattering, repetitive water highlights, blotchy turf, and low-detail smooth crowns remaining visible in close views. The render still reads as a procedural scale model rather than a finished illustrated environment.

## Published baseline at 0fb90ab

The painted panorama replaced the procedural cloud field, and the main cliff gained unequal faces and hanging masses. Scatter follows habitats, close tree crowns retain folded leaves, and short water marks replace continuous contours. Local bank refinement increased the meadow from 71,680 to 227,681 triangles and reduced sampled bank interpolation error by about 91%. Responsive rendering retains high-density desktop sharpness without allocating a desktop-sized buffer on phones.

That pass was published and verified on both the source repository's Pages site and the canonical root site. It established technical progress, not completion of the visual objective.

## Published baselines at 22f7d45 and 41486b0

Painted meadow and rock surfaces, asymmetric secondary islands, a small castle precinct, and cloaked travelers were followed by a perspective camera, fractured cliff, broken enclosure walls, layered water, and natural lookout planting. Perspective-aware detail selection retained nearby leaves while reducing distant work. Both passes were published and verified on both Pages sites; the most recent baseline is source revision `41486b02df965f074596a68209182a7e25c2d6ee` and canonical output revision `d485db90e4e2e092c2252986bf41b1b30805b189`.

That baseline still exposed an oval-looking lake, a mostly parallel waterfall sheet, a smooth castle mound, disconnected paving, pale submerged bridge supports, and a busy sky. At 1920 × 1200, its measured median frames were 18.7ms overview, 12.0ms castle, 23.1ms lake, and 16.2ms lookout. These establish a comparison, not visual completion.

## Published baseline at 6f8bf30: water, approach, and open sky

- Two substantial peninsulas and unequal bays replace the weakly perturbed oval lake. One radial boundary drives excavation, water mesh, depth and plant habitats. Shore stones find the new banks using a bounded search and remain above the water.
- The castle's smaller buildable bench blends into unequal ridge shoulders and an approach saddle. The anchor and small keep footprint remain fixed; the vast island scale is unchanged.
- Three uneven waterfall lobes share a continuous river lip, then curl, narrow and separate. Local edge attributes feather each stream. Unequal spray veils occupy the lower fall rather than collecting into one opaque ball. A small exposed bank beside the lip uses rock instead of grass, with identical underlying geometry.
- Opaque depth-colored lake/river surfaces remove pale submerged masonry showing through under the bridge. The lake retains a quiet sky reflection; the river has restrained directional flow. Their material inputs match through the shared mouth so overlapping triangles do not form a visible patch. Water depth remains stylized color, without scene-object reflections.
- Hipped roofs, dormers, overhanging eaves, rafters, diagonal caps and a roofed cloister improve construction. Ground-following flagstones connect the gate, court, wings and keep steps. Foundations adapt to the final hill; the keep remains tallest and its height is unchanged.
- A new locally stored painted sky has fewer, larger cloud banks and more open blue space. Angular longitude mapping avoids a false projection pole at steep camera elevations; a broader latitude range prevents stretched edge rows. Near/far landscape separation is stronger through aerial perspective. The sky stays fixed in apparent size when zooming or panning.
- Rock material emphasizes broad mineral families and real fracture orientation, reducing repeated horizontal bed contrast while retaining the fine weathering and painted texture.

All five styles still share real 3D geometry and preserve the 10× width, tiny architecture and trees, physical-size fine detail, slow exact loop, responsive controls, and published source. The separate illustrated scene and profile GIF are unchanged. The [new sky and full generation prompt](sky-environment.md) are published with the source.

## Visual critique after the water pass

**The AAA objective remains open.** Lake silhouette, connected construction, cleaner water and calmer sky are concrete improvements, but the scene still falls short of the requested finished painterly environment.

1. The main cliff still reads as two large procedural slabs with a few shelves. Its broad topology and the foreground ledge's elongated silhouette need a more deliberate geological design before more tiny rock noise is useful.
2. The tiny castle is now better built in close-up, but its overview silhouette and approach remain weak focal cues. Improve terrain/lighting hierarchy without enlarging all the buildings or abandoning the requested vast scale.
3. The split waterfall reads as long parallel ribbons in the overview. More convincing lip acceleration, spray and turbulence should preserve water continuity and exact-loop motion.
4. Plant crowns remain too uniform and rounded at middle distances, and some meadow detail still reads as even scatter. Cluster scale, gaps, silhouette variety and ground-color grouping need another art-direction pass.
5. The five palettes/shading treatments are distinguishable but do not yet produce five fully resolved illustrations. Clouds and terrain need more unified value/edge treatment; the new sky removes clutter but is still a painted dome rather than volumetric weather.

Continue from fresh renders. Object counts, performance results and passing shader checks do not establish visual completion.

## Verification of the water pass

- Geometry checks at scales 1 and 10 found no invalid attributes or degenerate triangles. Castle anchor remains exactly `(-31, 27.8, -17)` at scale 10; its central 1.3-unit footprint stays flat.
- The river and waterfall meet within 0.0000011 world units. At scale 10, 1,440 actual waterfall samples had no rock intersections; minimum clearance was 2.845 units. The lip-bank material split preserves every position, normal and oriented triangle (1,209 rock-bank triangles at scale 10; 24 at scale 1).
- The keep and precinct have 148,074 triangles (+8,350, or 5.98%) across the same 19 material batches. Maximum precinct radius is 7.964, inside its 9.85-unit reservation. The keep height, tree geometry and pavilion geometry are unchanged. The connected court and approach have 194 solid flagstones, with sampled grounding checks.
- All five water styles pass shared depth/flow/edge contract checks. Surface water writes depth; the falling streams and mist retain transparency. Material changes add no draw calls; the exposed bank adds one material batch.
- All five styles, four view presets and quarter-orbit views pass JavaScript/WebGL and exact loop-endpoint checks. Castle/lake views also pass at 1920 × 1200. Orbit, pan, zoom, reset, style persistence, reduced motion and phone layout were exercised.
- Sky-only pixels remain identical across zoom 1→16 and panning; a 100px by 50px pointer movement maps exactly to the focus plane. Both elevation limits were inspected to find and correct the sky starburst and stretched-edge defects.

Hardware Chrome on an Apple M2 Pro loaded the frozen scene in about 3.7–3.8 seconds. Twelve synchronized moving frames per view used GPU readback and included detail-triggered shadow refreshes. Device-specific results are not an FPS guarantee.

| View | 960 × 600 median | 1920 × 1200 median |
| --- | ---: | ---: |
| Islands | 14.9ms | 18.5ms |
| Castle | 10.2ms | 12.4ms |
| Lake | 15.0ms | 21.3ms |
| Lookout | 11.8ms | 16.5ms |

The slowest sampled frame was 49.2ms in the Retina lake view. Intermittent stalls and high-detail shadow work remain performance targets. The new sky is one local 1.6MB texture, replacing the selected 2.1MB v1 texture; there is still one sky draw call and no additional reflection render pass.


## Current production pass: crags, canopies, and lookout ridge

The expanded scale remains 10× width and 100× area, with physical-size vegetation and architecture. This pass addresses large shapes before adding more surface noise.

- The main cliff is a continuous radial envelope of 17 unequal sheared rock volumes over an offset narrowing core. Authored oblique cuts replace the earlier pair of broad hanging slabs. The meadow, lake, river, waterfall opening and castle anchor stay fixed. The name follows a natural fracture face. Rim grass is a material partition on actual upward-facing cliff triangles; removing its old overlay fixed green strips crossing the new folds in low-angle views.
- A broken lookout ridge replaces the elongated hemisphere. Unequal promontories, coves, rolling shoulders and a saddle sit above discontinuous tilted rock beds. Meadow and rock share the exact rim. The lookout preset now faces the hero island with a wider lens; Castle and Lake retain their close inspection views.
- Spreading, upright and wind-shaped trees have connected asymmetric crown sprays and exposed branch forks. Coarse and fine versions share their actual crown shells and main branches. Smaller leaves attach to those surfaces; close broadleaf variants carry 860 leaves and cypress variants carry 364, with the existing UV veins.
- Crown tops receive warm pigment, undersides receive cooler depth, and subtle per-tree color stays stable through detail transitions. Larger connected meadow washes and quieter painted rock contrast let geometry carry more of the image. Water materials and their flow/depth contracts are unchanged.

### Completion audit

**The visual quality objective is still open.** The cliff now has more varied large fractures, tree silhouettes are less uniform, and the lookout gives a clearer view of the scene's scale. Those are visible improvements, not evidence of AAA completion.

Remaining issues include the broad collar imposed by the meadow rim, some blunt block faces in side views, a weak tiny-castle silhouette at overview scale, parallel-looking waterfall ribbons, and planting that still appears evenly distributed in places. At the rear orbit the lookout can overlap the hero island in projection. The five art directions retain separate shading treatments but need more coherent value and edge design to match the reference's painted finish. The sky remains a painted environment, not volumetric weather.

### Verification of the crag and canopy pass

- The new lookout has 135,168 triangles across two meshes. At scales 1 and 10, all attributes are finite, all triangles have positive area, every welded edge has two incident faces, and the grass/rock rim error is exactly zero. Its 2,425 path vertices stay within 0.000003 world units of the intended ground offset. Fixed traveler/tree locations remain inside the meadow.
- Lookout planting retains 600 patches, 2,995 shrubs, 8,995 flowers and 73,710 fine leaves at scale 10. Details sample actual triangles after the reshaping.
- Main grove placement tests preserve all 900 transforms exactly. Coarse/fine crown arrays are identical; finite attributes, bounds and repeatable detail selection pass. Fine broadleaf variants cost 7,818 triangles and cypress variants cost 3,674. At the tested views, tree triangles change by +9.6% overview, −6.4% lake and −18.3% castle with unchanged draw calls and detailed-tree counts. Castle and pavilion source is unchanged.

- Main-cliff checks at scales 1 and 10 found zero rim/normal-seam error, invalid attributes, degenerate triangles or nonmanifold edges. Meadow and all water geometry remain byte-identical to the baseline. Waterfall checks sampled 371 / 1,440 positions with zero intersections; minimum clearance is 0.1763 / 2.5054. The inscription passes 126 stroke samples per scale without clipping; its scale-10 centerline clearance is at least 0.1897 against a 0.11 stroke radius.
- All five styles and four view presets pass exact loop-endpoint checks with no JavaScript/WebGL errors. Castle, lake and the new lookout vista also pass at 1920 × 1200. Orbit, pan, zoom, style/view preservation, reset, reduced motion and the 390px phone layout pass. Source hashes remained unchanged through the final captures.

Hardware Chrome on the Apple M2 Pro loaded the final scene in 3.45–3.61 seconds. As before, the sample uses three warmup frames and twelve moving frames per view, synchronized with GPU completion/readback and including detail-triggered shadow updates.

| View | 960 × 600 median | 1920 × 1200 median |
| --- | ---: | ---: |
| Islands | 14.8ms | 20.5ms |
| Castle | 9.6ms | 11.4ms |
| Lake | 16.4ms | 20.4ms |
| Lookout vista | 13.4ms | 16.8ms |

The slowest frame was 53.0ms in the Retina lake view; the lookout reached 51.7ms. These intermittent stalls remain a performance target. The wider lookout is a different composition from the prior close view, so its timings are not a like-for-like comparison. These device-specific measurements do not establish a general frame-rate guarantee.
