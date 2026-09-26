# Castle in the sky — five illustrated themes

**Also available:** [Real 3D version in all five styles](threejs-3d.md), with terrain, architectural geometry, custom materials, and a full orbit. Its styles reuse the same geometry, cameras, and interactions, switching palette, material shading, lighting, outlines, and grain. Shared details include castle stonework and roof tiles, doors, balcony railings, a bridge, shoreline gardens, ivy, and the foreground path.

A painted landscape with a hilltop castle, broad floating island, central lake, waterfalls, small pavilion islands, and two travelers. The profile uses a 24-second parallax loop rendered in Three.js. The sky, island group, and foreground move at different speeds; a small shader animation adds movement to the water.

This version prioritizes illustration quality. It is **2.5D**, made from transparent illustrated planes, rather than a full 360° model. The same layout and motion are shared by all five themes.

[Open the illustrated style picker](https://notsaltylol.github.io/assets/animation.html) · [Compare the five previews](style-gallery.md)

| # | Style ID | Direction | How it changes |
| --- | --- | --- | --- |
| 1 | `original` | Golden ruins | Inked island, warm ochre/olive grading, watercolor sky |
| 2 | `fantasy` | Luminous fantasy | Detailed painted layers, saturated greens and blues, softly focused sky |
| 3 | `ink` | Clear-line reverie | Inked island, outlined foreground and pavilions, warm paper colors |
| 4 | `cozy` | Cozy storybook | Simplified watercolor illustrations throughout, rounded foliage and soft contours |
| 5 | `ghibli` | Ghibli-inspired | Existing painted layers with warm sunlight, natural greens, soft shadows, and cream-cloud color grading |

These are interpretations of the requested directions, not proprietary studio or game shaders. The Ghibli-inspired theme reuses existing painted layers with a warm, natural color grade; it introduces no new AI artwork. Some illustrated themes share drawings and change their color treatment; others also swap the illustrated layers. The separate 3D viewer keeps one shared set of models across every style.

## Published source and artwork

- [Viewer and controls](../assets/animation.html)
- [Active Three.js scene, layer materials, water animation, color grading, and parallax](../assets/castle-illustration.js)
- [Style labels and presets](../assets/castle-styles.js); the lighting fields remain available to the earlier 3D study
- [Transparent illustration layers](../assets/illustration/) and [detailed painted sky](../assets/painted-sky.png)
- [Earlier procedural 3D study](../assets/study-3d.html) and its [geometry/shader source](../assets/castle-scene.js)
- [Original orbital scene](../assets/orbital.html)
- [Frame and GIF exporter](../scripts/render-animation.cjs)
- [Vendored Three.js 0.180.0](../assets/vendor/three/), with its [MIT license](../assets/vendor/three/LICENSE)

The raster layers are AI-generated artwork made for this scene, with style variants derived from the same composition. The supplied reference image itself is not redistributed. All runtime textures, JavaScript, and fonts needed by the scene are local; it runs offline once cloned and served. There are no API keys, external asset requests, or backend services.

## Run locally

From the repository root:

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `http://127.0.0.1:8768/assets/animation.html`. Choose a theme with the five buttons. The choice is saved in the URL and local storage. The pause button stops the animation; a reduced-motion browser preference starts it paused.

Open a theme directly with `?style=cozy`, or call `window.setStyle('cozy')` from the browser console. An unknown URL style falls back to `fantasy`; the JavaScript API rejects an invalid ID.

## Export a theme as a GIF

Requires Node.js, Google Chrome, Playwright, and ffmpeg. Install the rendering dependency outside the repository:

```sh
npm install --prefix /tmp/notsaltylol-render-tools playwright@1.62.1
```

With the local server running:

```sh
NODE_PATH=/tmp/notsaltylol-render-tools/node_modules node scripts/render-animation.cjs \
  http://127.0.0.1:8768/assets/animation.html /tmp/castle-cozy \
  --style=cozy --gif
```

The output directory contains `animation.gif` and the PNG frames. The scene exports 288 frames at 12 fps, 960 × 600 pixels, using a 256-color GIF palette. The 24-second loop samples phases without repeating the endpoint. Live WebGL playback runs at the browser's frame rate and retains full color. For smaller GIF files, captured layer positions are snapped to whole output pixels; live motion retains subpixel precision.

The exporter adds `?capture=1` to hide the controls. `--preview` produces four equally spaced review frames; use a separate directory for preview and full exports.

To render all five:

```sh
for style in original fantasy ink cozy ghibli; do
  NODE_PATH=/tmp/notsaltylol-render-tools/node_modules node scripts/render-animation.cjs \
    http://127.0.0.1:8768/assets/animation.html "/tmp/castle-$style" --style="$style" --gif
done
```

The earlier `assets/study-3d.html` and `assets/orbital.html` also work with the exporter. Omit `--style` for the orbital scene, which uses a six-second, 15 fps loop.

## GitHub profile

GitHub READMEs display the rendered GIF but do not run Three.js or an interactive theme picker. The profile image fills the available README content width. Its numbered links open the interactive GitHub Pages viewer.

Changing the viewer's theme does not change the profile image for other people. To choose a different public profile theme, export it, replace `assets/castle-in-the-sky.gif`, and commit it. The default is `fantasy`.
