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

## Current production pass

- Rebuild cliff macro forms and coherent scatter habitats.
- Compare procedural cloud banks with a painted panorama and choose the stronger visual result. The painted panorama is selected; the islands remain fully three-dimensional.
- Improve meadow, foliage, rock, and water shading as distinct surfaces.
- Improve close-view woodland detail and mix species across habitat boundaries.
- Align cloud and scene lighting, retain the loading state until the first frame, and render appropriately for high-density displays.

Changes in this pass must be assessed from fresh renders against the reference. Technical checks remain necessary, but cannot establish AAA visual quality by themselves.

## Review of this pass

The painted panorama provides more cloud structure than the tested procedural cloud banks. The cliff has clearer unequal faces and hanging masses, scatter is clustered into habitats, close tree crowns retain folded leaves, and short water marks replace the old continuous contours. Local tessellation smooths the lake and outlet banks while preserving the existing shoreline and cliff boundary. Responsive rendering retains high-density desktop sharpness without allocating a desktop-sized canvas on phones.

The 10× width, 100× area, small buildings, physical-size vegetation, five styles, and orbit remain intact. The meadow increased from 71,680 to 227,681 triangles through local bank refinement; the cliff and other geometry did not change in that refinement. Sampled bank interpolation error fell by about 91%, with finite attributes and a continuous outer rim.

**The overall AAA objective remains open.** The meadow still reads as clean procedural color rather than richly painted ground. The castle's focal presence is weak in the overview at the user's requested scale, although its close-up masonry and arches are readable. The main island, satellite silhouettes, and foreground ledge need more deliberate art direction to match the reference's sense of a vast inhabited landscape. Subsequent work should address these visible issues before adding more incidental detail.

## Verification

- All five styles and the four camera presets rendered without JavaScript or WebGL errors. Phase 0 and phase 1 produced identical PNGs after intervening orbit movement.
- Preset selection, orbit, keyboard/drag panning, zoom, reset, style persistence, reduced motion, and a 390px-wide layout passed browser checks. Resizing also updates the render buffer.
- Hardware Chrome on an Apple M2 Pro loaded the scene in about 3.6 seconds. Synchronized samples used a GPU readback after each frame; they are measurements on this device, not an FPS guarantee.

| View | 960 × 600 median | 1920 × 1200 median |
| --- | ---: | ---: |
| Islands | 11.1ms | 15.2ms |
| Castle | 15.6ms | 19.4ms |
| Lake | 9.5ms | 13.8ms |
| Lookout | 9.9ms | 14.4ms |

The largest measured frame was 53.8ms in the Retina castle view. Intermittent stalls remain a performance refinement target, especially as detailed vegetation changes during navigation.
