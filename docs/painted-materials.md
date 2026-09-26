# Painted surface textures

The real 3D viewer uses two locally stored color textures to add authored brushwork to the shared terrain. These are albedo treatments; mesh normals, directional lighting, shadows, and each style's color palette still establish the form. Slope-aware world projections keep paint from stretching down steep banks. Distance filtering suppresses subpixel detail, and overlapping projections conceal imperfect image borders.

Both 1254 × 1254 images were created with the built-in image generation tool in **generate mode**, from the prompts below. There are no external texture requests at runtime. All five styles reuse these assets, with quieter texture strength for Ink and Cozy.

## Meadow

Asset: [meadow-paint-v1.png](../assets/meadow-paint-v1.png)

> Create a seamless square tileable ground color texture for a premium hand-painted fantasy animation environment rendered in a real 3D game. Top-down orthographic texture only, completely flat illumination with no baked directional light, shadow, horizon, perspective or objects. A richly nuanced but restrained grassy meadow: connected washes of fresh leaf green, forest green, mossy olive, soft blue-green and sun-warmed yellow-green. Fine deliberate gouache brush marks and subtle tiny stylized grass strokes merge into broad flowing patches; several scales of painterly detail, calm overall mid-value contrast, no bright spots. The result should feel like a carefully painted animation background, not photographic lawn, not a noise filter, not green camouflage. All four borders must match seamlessly for tiling in any direction. Even density, no focal center, no border and no isolated recognizable objects. No rocks, flowers, bushes, trees, buildings, water, text, grid, symbols or watermark. Prefer 1536x1536 or the highest available square resolution. Detail must survive being used as a repeating albedo texture while staying quiet at a distance.

## Rock

Asset: [rock-paint-v1.png](../assets/rock-paint-v1.png)

> Create a seamless square tileable hand-painted rock albedo texture for a high-quality fantasy animation background rendered on a real 3D floating island. A straight-on orthographic material study filling the entire square, not a scene. Weathered ancient sandstone and ochre bedrock: large coherent planes in muted russet, warm ochre, dusty terracotta, golden tan, and a little desaturated mauve-grey mineral variation. Uneven interrupted horizontal sedimentary bedding, oblique faults, broad painterly chipped faces, occasional darker fine crevices, and nuanced handmade gouache brushwork at several scales. It should feel geologically organized and lovingly painted, with broad quiet areas supporting smaller fractures, never photographic noise or a repeat of evenly spaced stripes. Completely flat diffuse albedo illumination: no directional cast shadows, sunlit highlights, ambient occlusion, metallic shine or baked3Ddepth. Moderate value range so the game's normals and shaders can supply all lighting. Match all four edges seamlessly. No grass, moss, plants, buildings, water, clouds, sky, loose stones, foreground objects, horizon, perspective, letters, symbols, border or watermark. Highest available square resolution.

The generated files are preserved as delivered. The [material shaders](../assets/sky-castle-materials.js) calibrate their average color, grade them relative to the active palette, and handle mapping and filtering in the renderer.

The limestone material also borrows restrained, palette-relative brush variation from the existing rock image. World-space mapping joins across neighboring masonry, and fine pore marks fade before becoming subpixel noise. Broad mineral washes and vertical rain traces are color variation only; geometry and scene lighting still supply the forms and shadows.
