// Dev check: load every prerendered route in headless Edge, report console errors, save screenshots.
// Usage: npm run build && npx vite preview --port 4173, then: node scripts/dev/smoke.mjs <out-dir>
import { chromium } from 'playwright-core';
const OUT = process.argv[2] ?? '_reference/shots';
const B = 'http://localhost:4173/portfolio-personal/';
const browser = await chromium.launch({
  channel: 'msedge',
  args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11'],
});
const routes = [
  ['', 'home'],
  ['proyectos/', 'canvas'],
  ['proyectos/figuris/', 'figuris'],
  ['sobre-mi/', 'sobre-mi'],
  ['trayectoria/', 'trayectoria'],
  ['habilidades/', 'habilidades'],
  ['formacion/', 'formacion'],
  ['contacto/', 'contacto'],
  ['404.html', 'x404'],
];
for (const [w, h, suffix] of [
  [1440, 900, ''],
  [390, 844, '-movil'],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.addInitScript(() => sessionStorage.setItem('ido-welcome', '1')); // no welcome screen (app/Welcome.tsx)
  for (const [p, f] of routes) {
    const errs = [];
    const onC = (m) => {
      if (m.type() === 'error') errs.push(m.text());
    };
    const onE = (e) => errs.push(e.message.slice(0, 120));
    page.on('console', onC);
    page.on('pageerror', onE);
    await page.goto(B + p);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${f}${suffix}.png` });
    page.off('console', onC);
    page.off('pageerror', onE);
    console.log(`${(f + suffix).padEnd(18)} ${errs.length ? errs.join(' | ') : 'ok'}`);
  }
  await page.close();
}
await browser.close();
