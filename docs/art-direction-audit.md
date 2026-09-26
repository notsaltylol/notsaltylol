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

## Current production pass: painted land and inhabited scale

- Two locally stored color textures add painted meadow brushwork and mineral variation to rock. Slope-aware world mapping avoids stretched banks; distance filtering and overlapping projections limit noise and visible image joins. Both assets and their exact generation prompts are published in [painted-materials.md](painted-materials.md).
- Lower sunlight and clearer air reveal the ochre cliff faces. The five styles keep their own palette and surface treatment.
- A small castle precinct adds a gate, coursed walls, two watchtowers, pavilions, clipped courtyard paving, interrupted terraces, and restrained planting. The original keep remains its tallest building. Scatter generators reserve the footprint so vegetation does not grow through the new masonry.
- Secondary islands have unequal shoulders, clefts, interrupted shelves, and three uneven hanging buttresses. Their meadow and rock share the exact rim, and tree/building placement uses triangle-accurate ground heights.
- The lookout has a less regular outline and rolling knolls. Its surface sampler grounds the vegetation against the actual mesh.
- Travelers now have boots, articulated arms, staffs, hair, and folded capes. Small cape motion loops exactly; static shadow proxies preserve the cached shadow-map strategy.

The 10× width, 100× area, small buildings and trees, physical-size surface detail, five styles, and orbit remain intact. Architecture, landforms, travelers, and materials share the same composition across all five modes.

## Visual critique and next priorities

**The overall AAA objective remains open.** Actual overview, close-view, and quarter-orbit screenshots show better ground brushwork, clearer rock planes, and more readable inhabitation. They still read as a procedural miniature environment, below the painterly reference's finish.

1. The main island's rear cliff remains a broad, relatively uniform tapered mass. Its silhouette needs more deliberate structural breaks and larger geological variation; finer texture alone will not resolve it.
2. The castle precinct is readable but too clean and formal: pale enclosure walls and regular paving dominate the tiny keep. Improve the architecture's massing, material wear, and landscape integration while retaining the requested small scale.
3. The water remains an even colored sheet at overview scale, and the long waterfall has too little structure. Shoreline shape, reflected light, broken flow, and spray should be developed together.
4. The close lookout reveals dense rounded shrub patches and repetitive stepping stones. Habitat transitions and grounded planting need a more intentional arrangement.
5. The five directions remain distinguishable, especially Ink and Cozy, but distinct palette/shading alone does not establish a finished illustration style. The panorama also competes with the land at some orbit angles.

Address these visible issues before adding unrelated tiny props. Passing rendering tests is necessary but does not prove visual completion.

## Verification for this pass

- All five styles and the four camera presets rendered without JavaScript or WebGL errors. Phase 0 and phase 1 produced identical PNGs after intervening orbit movement.
- Preset selection, orbit, keyboard/drag panning, zoom, reset, style persistence, reduced motion, and a 390px-wide layout passed browser checks. Resizing updates the render buffer.
- Independent code review found no actionable correctness or scale regressions in the changed modules.
- Secondary island checks covered finite attributes, deterministic seeds, matched top/cliff rims, watertight welded boundaries, and triangle-accurate ground queries. Traveler geometry and loop endpoint positions/normals were also checked.
- Hardware Chrome on an Apple M2 Pro loaded the scene in about 3.8 seconds. Synchronized samples used a GPU readback after each frame; these are measurements on this device, not an FPS guarantee.

| View | 960 × 600 median | 1920 × 1200 median |
| --- | ---: | ---: |
| Islands | 14.8ms | 17.8ms |
| Castle | 10.1ms | 12.6ms |
| Lake | 13.6ms | 19.0ms |
| Lookout | 10.6ms | 13.8ms |

The largest measured frame was 53.0ms in the normal-resolution overview; the largest Retina sample was 42.8ms in the lake view. Intermittent stalls remain a refinement target. The two surface textures add about 5MB of transferred PNG assets and an estimated 17MB of GPU texture storage including mipmaps.
