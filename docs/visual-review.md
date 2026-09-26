# Visual review — castle evolution

## Direction

The user chose illustration quality with layered 2.5D motion. The reference's important qualities are a large natural floating landmass, a small hilltop castle, blue sky, rich green meadows, waterfalls, and a foreground ledge with tiny travelers. The composition should establish scale and depth before decorative effects.

## What the procedural study got wrong

The old terrain looked like a disc on spikes; modular castle blocks and capsule trees felt like toys. The painted sky and primitive geometry used incompatible visual languages. The username sign competed with the scene. Recoloring those shapes did not solve the underlying art direction.

## Changes after reviewing actual renders

1. Replaced the active composition with painted layers. The island now has a continuous cliff mass, the castle is subordinate to the landscape, and the foreground provides a clear scale cue.
2. Replaced repeated miniature castles with separate pavilion islands, and corrected their stretched aspect ratio.
3. Reduced the username to a small cliff inscription. It remains a texture overlay rather than genuinely carved 3D geometry.
4. Softened the detailed sky so its edges compete less with the island.
5. Added matching watercolor sky, foreground, and pavilion assets to the illustrated themes; changing only the central island made the cozy version inconsistent.
6. Reworked the pastel filter to preserve contrast. Its first version looked like a white haze.
7. Quantized pixel-mode colors in display space so the cliff shadows retain detail. Bypassed texture mipmaps in pixel mode to avoid sampling artifacts at pixel boundaries, while retaining smoother sampling in the painted themes.

## Review process

Render, inspect, identify the largest visible defects, revise, and render again. Review every active theme at the same phase, then the animation at quarter-cycle intervals. Check the exported GIF too: browser rendering alone does not establish GIF quality.

Functional checks cover theme changes, URL persistence, pause, reduced-motion behavior, responsive layout, render errors, and the animation's loop boundary. These checks are separate from the visual judgment.

## Remaining artistic limits

The motion is deliberately subtle parallax; it cannot reveal new views of the painted castle. Golden ruins and Clear-line reverie share the inked island but differ in color treatment. GIF's limited palette loses some of the original paintings' color detail; the live viewer retains it.

## Real 3D follow-up

The initial real 3D follow-up shipped six styles. Its geometry includes a continuous terrain height field, an excavated lake, a river and waterfall, architectural arcades, foliage, and a foreground ledge. Four orbit angles were reviewed through three iterations.

The first integrated render still looked like a smooth brown bowl, with noisy upright grass and an oversized narrow castle. Revisions introduced broad unequal cliff buttresses, a smaller and more spread-out castle, fewer shorter grass tufts, stronger normal-based form shading, colored shadows, and a foreground viewing ledge. The waterfall channel was carved back after a new cliff rib interrupted the stream. Cliff lettering was moved onto a coherent facet after individual letters disappeared into folds.

All six initial styles passed exact loop-endpoint image comparisons. Interaction checks cover pointer and keyboard orbiting, zoom, reset, style changes while paused, URL persistence, reduced motion, mobile width, and mode links that preserve the selected style. No browser or shader errors were reported.

The illustrated scene is still the closer match to the painted reference. The 3D version offers genuine camera freedom and model-based shading, with an intentionally stylized model appearance and procedural cloud fields. Neither geometry tests nor shader compilation should be described as proof that the two artistic results are identical.

## Four-style detail pass

Pixel garden and Pastel dream were retired from both viewers, profile links, and current galleries. Golden ruins, Luminous fantasy, Clear-line reverie, and Cozy storybook remain, numbered 1–4. Old links using a retired style fall back to Fantasy.

This pass adds shared model detail: fine masonry joints, overlapping roof courses, arched wooden doors, balcony railings, terrace paving, an open masonry bridge, lily leaves, separated shoreline rocks, garden beds, and ivy that follows the cliff surface. The foreground lookout has grounded flowers, shrubs, a stepping-stone trail, and corrected tree/traveler contact with the ground. Styles reuse all this geometry, changing palettes, surface shading, lighting, contours, and grain.

Four front views and four orbit angles were inspected. The first pass made the foreground stones overlap into a cream ribbon and the lake stones too evenly spaced; the revisions separate the steps and leave longer open shore stretches. A short bridge approach connects it toward the castle path. No floating architecture, blocked water channel, or major framing issue was found. Fine castle details are easiest to read while zoomed in; Cozy deliberately reduces their contrast.

The four remaining 3D styles pass exact loop-endpoint comparisons without browser or WebGL errors. Orbit/zoom/reset controls, paused theme changes, URL persistence, reduced motion, mobile width, and both viewer links pass. The illustrated viewer also passes its four-theme rendering and loop checks. The profile GIF retains the illustrated scene; the new details are in the interactive 3D viewer.

## Botanical and rock texture pass

Tree crowns now have overlapping pointed leaves, gently folded surfaces, finer branch forks, and small cypress sprays. A separate leaf material uses leaf-aligned UVs for restrained vein and tip-color detail. The foreground adds small fern fronds, fallen leaves, and leaf sprays on shrubs. The island's old triangle grass is replaced by clustered curved blades, paired-leaflet ferns, clover, and shoreline reeds. Clear areas remain around the lake, bridge, and castle path.

The first rock bump render was too grainy at profile size. Its relief was reduced and the smallest pores filtered by the screen footprint. A close-up review then caught dotted marks where narrow bumps crossed the toon lighting bands. Fine cracks and pores now affect color only; the normal relief comes from broader shallow flakes. This preserves the broad cliff form and distinct Ink/Cozy lighting while adding broken strata and mineral variation.

The first grass pass looked wiry at close range. Tall blades were shortened and widened, and short clumps were moved to the lighter grass material. Plant counts stayed constant. Default and zoomed views are reviewed separately: fine leaves and veins should reward zooming without turning the profile-size scene into a field of dark scratches.

All four styles passed the final default/1.8×-zoom render checks, exact phase-0/phase-1 image comparisons, and quarter-orbit motion checks, with no browser or WebGL errors. The added botanical module uses six draw calls and 27,232 triangles; individual tree leaves remain batched by material. Four orbit views were inspected after the grass revision.
