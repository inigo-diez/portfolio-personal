// E3: measure and check the screen ↔ canvas transition in headless Edge (real GPU).
// Usage: npm run build && npx vite preview --port 4173, then:
//   node scripts/dev/measure-transition.mjs <out-dir> [runs=5]
// Writes <out-dir>/results.json, a video of the sequence (.webm) and a filmstrip of the forward transition.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const OUT = path.resolve(process.argv[2] ?? '_reference/e3');
const RUNS = Number(process.argv[3] ?? 5);
const B = process.env.PREVIEW_URL ?? 'http://localhost:4173/portfolio-personal/'; // e.g. another build to compare
const VIEW = { width: 1440, height: 900 };
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: 'msedge',
  args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11'],
});

const transitions = (page) => page.evaluate(() => window.__e3?.transitions ?? []);
async function waitCount(page, n) {
  await page.waitForFunction((k) => (window.__e3?.transitions.length ?? 0) >= k, n, { timeout: 5000 });
  await page.waitForTimeout(80); // React commit + cleanup
}
/** Final state must be clean: one page, no leftover inline transforms, dock/hero visible, URL coherent. */
async function check(page, expect) {
  return page.evaluate((exp) => {
    const pages = [...document.querySelectorAll('.stage > [data-page]')].map((e) => e.dataset.page);
    const hero = document.querySelector('[data-device="hero"]');
    const dock = document.querySelector('[data-device="dock"]');
    const layer = document.querySelector('[data-canvas-layer]');
    const problems = [];
    if (pages.length !== 1 || pages[0] !== exp) problems.push('pages=' + pages.join(','));
    if (document.querySelector('[data-transitioning]')) problems.push('still transitioning');
    // only script-driven animations (the transition); CSS transitions such as key presses are normal UI
    const running = document
      .getAnimations()
      .filter((a) => a.playState !== 'finished' && !(a instanceof CSSAnimation) && !(a instanceof CSSTransition));
    if (running.length) problems.push(running.length + ' WAAPI animations left');
    if (hero && (getComputedStyle(hero).transform !== 'none' || hero.style.zIndex)) problems.push('hero transformed');
    if (dock && getComputedStyle(dock).visibility !== 'visible') problems.push('dock hidden');
    if (layer && getComputedStyle(layer).transform !== 'none') problems.push('layer transformed');
    const isCanvas = location.pathname.endsWith('/proyectos/');
    if ((exp === 'canvas') !== isCanvas) problems.push('url=' + location.pathname);
    return problems;
  }, expect);
}

const results = { gpu: '', runs: RUNS, viewport: VIEW, scenarios: {} };
const add = (name, stats, problems) => {
  (results.scenarios[name] ??= { stats: [], problems: [] }).stats.push(...stats);
  if (problems.length) results.scenarios[name].problems.push(problems);
};

async function session({ technique = 'flip', reduced = false, video = false } = {}) {
  const ctx = await browser.newContext({
    viewport: VIEW,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    ...(video ? { recordVideo: { dir: OUT, size: { width: 1280, height: 800 } } } : {}),
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${B}?tecnica=${technique}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return { ctx, page, errors };
}

// 1 · Forward with the device (Proyectos is selected on open → →) and back with the browser's Back button.
for (const technique of ['flip', 'vt']) {
  for (const reduced of [false, true]) {
    if (technique === 'vt' && reduced) continue;
    const { ctx, page, errors } = await session({ technique, reduced });
    if (!results.gpu)
      results.gpu = await page.evaluate(() => {
        const gl = document.createElement('canvas').getContext('webgl');
        return gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
      });
    const key = `${technique}${reduced ? ' · reducido' : ''}`;
    for (let i = 0; i < RUNS; i++) {
      const n = (await transitions(page)).length;
      await page.keyboard.press('ArrowRight'); // device: select → Proyectos
      await waitCount(page, n + 1);
      const p1 = await check(page, 'canvas');
      await page.waitForTimeout(500);
      await page.goBack(); // browser Back runs the same transition in reverse
      await waitCount(page, n + 2);
      const p2 = await check(page, 'home');
      const s = (await transitions(page)).slice(n);
      add(`${key} · ida (dispositivo)`, [s[0]], p1);
      add(`${key} · vuelta (atrás del navegador)`, [s[1]], p2);
      await page.waitForTimeout(400);
    }
    // Back with the device's ATRÁS key (Esc) and forward with the browser's Forward button
    if (!reduced) {
      const n = (await transitions(page)).length;
      await page.click('a.pill'); // "Ver proyectos" link: same transition
      await waitCount(page, n + 1);
      add(`${key} · ida (enlace)`, (await transitions(page)).slice(n, n + 1), await check(page, 'canvas'));
      await page.waitForTimeout(400);
      await page.keyboard.press('Escape'); // device ATRÁS
      await waitCount(page, n + 2);
      add(`${key} · vuelta (tecla ATRÁS)`, (await transitions(page)).slice(n + 1, n + 2), await check(page, 'home'));
    }
    if (errors.length) results.scenarios[`${key} · errores`] = errors;
    await ctx.close();
  }
}

// 2 · Interruption: Back pressed mid-flight must reverse from where it is, and leave a clean state.
{
  const { ctx, page, errors } = await session();
  for (const at of [120, 300, 500]) {
    const n = (await transitions(page)).length;
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(at);
    await page.goBack();
    await waitCount(page, n + 2); // "interrumpida" + the reverse
    const s = (await transitions(page)).slice(n);
    add(`flip · interrumpida a ${at} ms con Atrás`, s, await check(page, 'home'));
    await page.waitForTimeout(400);
  }
  // double reversal: forward, back, forward again
  const n = (await transitions(page)).length;
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  await page.goBack();
  await page.waitForTimeout(150);
  await page.goForward();
  await waitCount(page, n + 3);
  add('flip · ida, atrás y adelante seguidos', (await transitions(page)).slice(n), await check(page, 'canvas'));
  if (errors.length) results.scenarios['interrupción · errores'] = errors;
  await ctx.close();
}

// 3 · Filmstrip of the forward transition (animations slowed 20× through the DevTools protocol).
{
  const { ctx, page } = await session();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.05 });
  await page.keyboard.press('ArrowRight');
  const t0 = Date.now();
  for (const ms of [0, 60, 110, 200, 300, 420, 560, 730]) {
    await page.waitForTimeout(Math.max(0, ms * 20 - (Date.now() - t0)));
    await page.screenshot({ path: path.join(OUT, `strip-${String(ms).padStart(3, '0')}.png`) });
  }
  // one image with the 8 frames (2 × 4)
  const frames = [0, 60, 110, 200, 300, 420, 560, 730];
  const imgs = [];
  for (const ms of frames) imgs.push((await fs.readFile(path.join(OUT, `strip-${String(ms).padStart(3, '0')}.png`))).toString('base64'));
  const sheet = await ctx.newPage();
  await sheet.setViewportSize({ width: 1460, height: 520 });
  const cells = imgs
    .map((b, i) => `<figure style="margin:0"><img style="width:100%;display:block;box-shadow:0 0 0 1px #0002" src="data:image/png;base64,${b}"><figcaption style="margin-top:4px">${frames[i]} ms</figcaption></figure>`)
    .join('');
  await sheet.setContent(`<body style="margin:0;padding:10px;background:#fff;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;font:12px system-ui;color:#6b6b6b">${cells}</body>`);
  await sheet.screenshot({ path: path.join(OUT, 'tira-ida.png'), fullPage: true });
  await ctx.close();
}

// 4 · Real-time video of the whole sequence (FLIP).
{
  const { ctx, page } = await session({ video: true });
  await page.waitForTimeout(600);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(350);
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight'); // into the canvas
  await page.waitForTimeout(1300);
  await page.keyboard.press('ArrowDown'); // dock device moves the camera
  await page.waitForTimeout(250);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1100);
  await page.goBack(); // browser Back
  await page.waitForTimeout(1300);
  await page.click('a.pill'); // link, then interrupted by Back at 300 ms
  await page.waitForTimeout(300);
  await page.goBack();
  await page.waitForTimeout(1400);
  const v = page.video();
  await ctx.close();
  await fs.rename(await v.path(), path.join(OUT, 'transicion-flip.webm'));
}
{
  const { ctx, page } = await session({ technique: 'vt', video: true });
  await page.waitForTimeout(600);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1400);
  await page.goBack();
  await page.waitForTimeout(1400);
  const v = page.video();
  await ctx.close();
  await fs.rename(await v.path(), path.join(OUT, 'transicion-vt.webm'));
}

await browser.close();

// Summary
const summary = {};
for (const [name, sc] of Object.entries(results.scenarios)) {
  if (!sc.stats) continue;
  const st = sc.stats.filter((s) => s && !['interrumpida'].includes(s.label));
  const avg = (k) => +(st.reduce((a, s) => a + s[k], 0) / st.length).toFixed(1);
  const max = (k) => Math.max(...st.map((s) => s[k]));
  summary[name] = {
    n: st.length,
    fps: avg('fps'),
    ms: avg('measuredMs'),
    peorMs: max('worstMs'),
    p95Ms: avg('p95Ms'),
    largos: max('longFrames'),
    estadoFinal: sc.problems.length ? sc.problems : 'limpio',
  };
}
results.summary = summary;
await fs.writeFile(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
console.log('GPU:', results.gpu);
console.table(Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, { ...v, estadoFinal: JSON.stringify(v.estadoFinal) }])));
for (const k of Object.keys(results.scenarios).filter((k) => k.includes('errores'))) console.log(k, results.scenarios[k]);
