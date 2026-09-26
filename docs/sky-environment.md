# Painted sky environment

The orbiting 3D viewer uses [sky-panorama-v1.png](../assets/sky-panorama-v1.png), a 1774 × 887 painted environment texture, on a distant sky dome. The islands, buildings, vegetation, water, and travelers remain real geometry. The five styles grade this same sky along with the shared scene materials.

The image was generated with the built-in image generation tool in **edit mode**, using this repository's [painted-sky.png](../assets/painted-sky.png) as the reference. No external texture service is required at runtime.

## Generation prompt

> Edit and extend this painted sky into a seamless 360-degree equirectangular environment panorama, aspect ratio 2:1, at the highest practical resolution. This will be the sky surrounding a real 3D floating-island scene. Preserve the reference's rich painterly fantasy animation background quality: saturated cobalt and cyan blue sky, magnificent structured cumulonimbus banks, many intricate nested billows, warm ivory sunlit edges and subtly cool blue-violet undersides, delicate brushwork and gouache washes, luminous atmosphere. Arrange impressive but varied cloud banks across the full width, with generous blue openings, high delicate wisps, large billowing clouds near the horizon and a soft cloud sea below. Match the left and right edges seamlessly in both color and cloud shapes, for horizontal repeat. Avoid obvious forms pinching at the top and bottom poles. Lighting should have one broad consistent source, without a visible sun disk or lens flare. Preserve nuanced handmade painting, never plastic smooth 3D blobs. Sky and clouds only: no terrain, islands, buildings, people, birds, lettering, watermark, frame or border. Composition must work as a panoramic texture, rather than a framed illustration.

The [atmosphere module](../assets/sky-castle-atmosphere.js) handles directional mapping, palette grading, filtered texture sampling, and slight periodic drift. The viewer waits for the texture before exposing its frame-capture API. The sky is a painted backdrop, not a volumetric weather simulation.
