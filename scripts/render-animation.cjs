// Requires Playwright, Chrome, and a local server serving assets/animation.html
// plus three.module.js and three.core.js from three@0.180.0 in the same folder.
// Usage: NODE_PATH=/path/to/node_modules node scripts/render-animation.cjs URL OUTPUT_DIR
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const [url, output] = process.argv.slice(2);
  if (!url || !output) throw new Error('Provide page URL and frame output directory');
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:800,height:280},deviceScaleFactor:1});
    await page.goto(url);
    await page.waitForFunction(() => typeof window.renderFrame === 'function');
    for (let frame=0;frame<90;frame++) {
      await page.evaluate(phase => window.renderFrame(phase),frame/90);
      await page.screenshot({path:path.join(output,`${String(frame).padStart(3,'0')}.png`)});
    }
  } finally { await browser.close(); }
})();
