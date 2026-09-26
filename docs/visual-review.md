# Visual review — illustrated castle

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

Render, inspect, identify the largest visible defects, revise, and render again. Review all six themes at the same phase, then the animation at quarter-cycle intervals. Check the exported GIF too: browser rendering alone does not establish GIF quality.

Functional checks cover theme changes, URL persistence, pause, reduced-motion behavior, responsive layout, render errors, and the animation's loop boundary. These checks are separate from the visual judgment.

## Remaining artistic limits

The motion is deliberately subtle parallax; it cannot reveal new views of the painted castle. The first and fifth themes share the inked island but differ in color treatment. The pixel version filters an illustration rather than replacing it with hand-drawn pixel sprites. GIF's limited palette loses some of the original paintings' color detail; the live viewer retains it.

## Real 3D follow-up

The scene now also has a separate real 3D interpretation in all six styles. Its geometry includes a continuous terrain height field, an excavated lake, a river and waterfall, architectural arcades, foliage, and a foreground ledge. Four orbit angles were reviewed through three iterations.

The first integrated render still looked like a smooth brown bowl, with noisy upright grass and an oversized narrow castle. Revisions introduced broad unequal cliff buttresses, a smaller and more spread-out castle, fewer shorter grass tufts, stronger normal-based form shading, colored shadows, and a foreground viewing ledge. The waterfall channel was carved back after a new cliff rib interrupted the stream. Cliff lettering was moved onto a coherent facet after individual letters disappeared into folds.

All six styles pass exact loop-endpoint image comparisons. Interaction checks cover pointer and keyboard orbiting, zoom, reset, style changes while paused, URL persistence, reduced motion, mobile width, and mode links that preserve the selected style. No browser or shader errors were reported.

The illustrated scene is still the closer match to the painted reference. The 3D version offers genuine camera freedom and model-based shading, with an intentionally stylized model appearance and procedural cloud fields. Neither geometry tests nor shader compilation should be described as proof that the two artistic results are identical.
