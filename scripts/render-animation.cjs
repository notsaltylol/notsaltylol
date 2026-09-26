// Requires Playwright, Chrome, and a local server serving assets/animation.html
// The pinned Three.js runtime is included in assets/vendor/three/.
// Usage: node scripts/render-animation.cjs URL OUTPUT_DIR [--style=cozy] [--preview] [--gif]
// --gif requires ffmpeg and saves OUTPUT_DIR/animation.gif.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync}=require('node:child_process');
(async () => {
  const [url, output] = process.argv.slice(2);
  if (!url || !output) throw new Error('Provide page URL and frame output directory');
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:800,height:500},deviceScaleFactor:1});
    const captureURL = new URL(url);
    captureURL.searchParams.set('capture', '1');
    const style=process.argv.find(arg=>arg.startsWith('--style='))?.slice(8);
    if(style)captureURL.searchParams.set('style',style);
    await page.goto(captureURL.href);
    await page.waitForFunction(() => typeof window.renderFrame === 'function');
    const size = await page.locator('canvas').evaluate(canvas => ({width:Math.round(canvas.getBoundingClientRect().width),height:Math.round(canvas.getBoundingClientRect().height)}));
    await page.setViewportSize(size);
    if(style && await page.evaluate(()=>window.castleState?.style)!==style)throw new Error('Unknown style: '+style);
    const config = await page.evaluate(() => window.animationConfig || {duration:6,fps:15});
    const frameCount = process.argv.includes('--preview') ? 4 : Math.round(config.duration * config.fps);
    for (let frame=0;frame<frameCount;frame++) {
      await page.evaluate(phase => window.renderFrame(phase),frame/frameCount);
      await page.screenshot({path:path.join(output,`${String(frame).padStart(3,'0')}.png`)});
    }
    if(process.argv.includes('--gif')){
      const fps=process.argv.includes('--preview')?frameCount/config.duration:config.fps;
      execFileSync('ffmpeg',['-v','error','-y','-framerate',String(fps),'-i',path.join(output,'%03d.png'),'-frames:v',String(frameCount),'-filter_complex','[0:v]split[a][b];[a]palettegen=max_colors=256[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',path.join(output,'animation.gif')],{stdio:'inherit'});
    }
  } finally { await browser.close(); }
})();
