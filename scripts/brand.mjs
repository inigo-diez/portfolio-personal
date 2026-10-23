// Brand images from the monogram (public/favicon.svg) and the real device: public/og.png (1200 × 630, Open Graph)
// and public/apple-touch-icon.png (180 × 180). Re-run after changing the logo or the device.
// Usage: npm run build && npx vite preview --port 4173, then: node scripts/brand.mjs
import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';

const B = process.env.PREVIEW_URL ?? 'http://localhost:4173/portfolio-personal/';
const favicon = await fs.readFile('public/favicon.svg', 'utf8');
// The monogram alone: the favicon without its tile, cropped to the drawing.
const mark = favicon.replace(/<rect[^>]*\/>/, '').replace('viewBox="0 0 64 64"', 'viewBox="5 16.6 54 30.8"');
const dataUri = (mime, buf) => `data:${mime};base64,${Buffer.from(buf).toString('base64')}`;
// Inlined: a page made with setContent cannot load file:// fonts.
const geist = dataUri('font/woff2', await fs.readFile('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'));

const browser = await chromium.launch({ channel: 'msedge' });

// 1. The device, as on the home page (fixed clock so the image does not depend on when it was made).
const home = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await home.clock.setFixedTime(new Date('2026-10-23T10:00:00'));
await home.goto(B);
await home.evaluate(() => document.fonts.ready);
await home.waitForTimeout(800);
// No floor reflection; the clip leaves room for the body's thickness and shadow, which fall outside the element box.
await home.addStyleTag({ content: '.pocket__tilt { -webkit-box-reflect: none !important; }' });
const box = await home.locator('.pocket').first().boundingBox();
const pad = box.width * 0.08;
const device = await home.screenshot({
  clip: { x: box.x - pad, y: box.y - pad, width: box.width + 2 * pad, height: box.height + 2 * pad },
});
await home.close();

// 2. Open Graph image.
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html><html lang="es"><head><style>
  @font-face { font-family: Geist; src: url(${geist}) format('woff2'); font-weight: 100 900; }
  body { margin: 0; width: 1200px; height: 630px; background: #fff; font-family: Geist, sans-serif; color: #252525;
         display: grid; grid-template-columns: 1fr auto; align-items: center; padding: 0 96px 0 104px; box-sizing: border-box; }
  .mark { height: 58px; display: block; margin-bottom: 40px; }
  h1 { margin: 0; font-size: 60px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.05; }
  p { margin: 18px 0 0; font-size: 26px; color: #6B6B6B; letter-spacing: -0.01em; }
  .device { height: 560px; display: block; }
</style></head><body>
  <div><img class="mark" src="${dataUri('image/svg+xml', mark)}" alt=""><h1>Iñigo Díez Osúa</h1><p>Portfolio</p></div>
  <img class="device" src="${dataUri('image/png', device)}" alt="">
</body></html>`);
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: 'public/og.png' });
await og.close();

// 3. iOS home-screen icon: full square (iOS rounds the corners itself).
const icon = await browser.newPage({ viewport: { width: 180, height: 180 } });
await icon.setContent(
  `<body style="margin:0;background:#fff;display:grid;place-items:center;height:180px">` +
    `<img src="${dataUri('image/svg+xml', mark)}" style="width:136px"></body>`,
);
await icon.screenshot({ path: 'public/apple-touch-icon.png' });
await browser.close();
console.log('✓ public/og.png · public/apple-touch-icon.png');
