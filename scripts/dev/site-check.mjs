// E8 check of the built site: every prerendered page loaded directly (as a refresh or a shared link would),
// its head (title, description, canonical, OG, robots), one h1, console errors, images with alt and every
// internal link or asset resolving. External links are only listed (never requested).
// Usage: npm run build && npx vite preview --port 4173, then: node scripts/dev/site-check.mjs [base-url]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const B = process.argv[2] ?? 'http://localhost:4173/portfolio-personal/';
const BASE_PATH = new URL(B).pathname;
const DIST = path.resolve('dist');
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory()) walk(path.join(dir, f.name));
    else if (f.name === 'index.html') pages.push(path.relative(DIST, dir).replace(/\\/g, '/'));
  }
})(DIST);
pages.sort();

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => sessionStorage.setItem('ido-welcome', '1')); // no welcome screen (app/Welcome.tsx)
const internal = new Set();
const external = new Map(); // url → pages
let fails = 0;
const fail = (msg) => {
  fails++;
  console.log(`  FALLO ${msg}`);
};

for (const p of pages) {
  const url = B + (p ? p + '/' : '');
  const errs = [];
  const onC = (m) => m.type() === 'error' && errs.push(m.text().slice(0, 140));
  const onE = (e) => errs.push(e.message.slice(0, 140));
  page.on('console', onC);
  page.on('pageerror', onE);
  const res = await page.goto(url);
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => {
    const attr = (sel, a) => document.querySelector(sel)?.getAttribute(a) ?? null;
    return {
      title: document.title,
      description: attr('meta[name="description"]', 'content'),
      canonical: attr('link[rel="canonical"]', 'href'),
      ogUrl: attr('meta[property="og:url"]', 'content'),
      ogImage: attr('meta[property="og:image"]', 'content'),
      robots: attr('meta[name="robots"]', 'content'),
      // rendered ones only: /proyectos/ holds the canvas and the phone list, and CSS shows one of them
      h1: [...document.querySelectorAll('h1')].filter((h) => h.checkVisibility()).length,
      noAlt: [...document.querySelectorAll('img:not([alt])')].map((i) => i.src),
      refs: [
        ...[...document.querySelectorAll('a[href]')].map((a) => a.href),
        ...[...document.querySelectorAll('link[href]:not([rel="canonical"])')].map((l) => l.href),
        ...[...document.querySelectorAll('img[src], source[srcset], img[srcset]')].flatMap((i) =>
          (i.getAttribute('srcset') ?? i.src)
            .split(',')
            .map((s) => new URL(s.trim().split(' ')[0], location.href).href),
        ),
      ],
    };
  });
  page.off('console', onC);
  page.off('pageerror', onE);
  const label = '/' + (p ? p + '/' : '');
  console.log(`${label.padEnd(44)} ${res.status()} · h1 ${info.h1} · ${info.title}`);
  if (res.status() !== 200) fail(`${label}: HTTP ${res.status()}`);
  if (!info.title) fail(`${label}: sin <title>`);
  if (!info.description) fail(`${label}: sin description`);
  if (info.h1 !== 1) fail(`${label}: ${info.h1} h1 (debe haber 1)`);
  const expected = 'https://inigo-diez.github.io' + BASE_PATH + (p ? p + '/' : '');
  if (info.canonical !== expected) fail(`${label}: canonical ${info.canonical} ≠ ${expected}`);
  if (info.ogUrl !== expected) fail(`${label}: og:url ${info.ogUrl}`);
  if (!info.ogImage) fail(`${label}: sin og:image`);
  if ((BASE_PATH !== '/') !== (info.robots === 'noindex'))
    fail(`${label}: robots «${info.robots}» con base ${BASE_PATH}`);
  for (const s of info.noAlt) fail(`${label}: imagen sin alt ${s}`);
  for (const e of errs) fail(`${label}: consola: ${e}`);
  for (const r of info.refs) {
    const u = new URL(r);
    if (u.origin === new URL(B).origin) internal.add(u.origin + u.pathname);
    else if (u.protocol.startsWith('http')) external.set(u.href, (external.get(u.href) ?? new Set()).add(label));
    else if (u.protocol === 'mailto:') external.set(u.href, (external.get(u.href) ?? new Set()).add(label));
  }
}

console.log(`\nEnlaces y recursos internos: ${internal.size}`);
for (const u of [...internal].sort()) {
  const r = await page.request.get(u);
  if (r.status() !== 200) fail(`interno ${u}: HTTP ${r.status()}`);
}
// 404: GitHub Pages serves 404.html for unknown paths (vite preview does not, so it is checked directly)
await page.goto(B + '404.html');
if ((await page.locator('h1').count()) !== 1) fail('404.html: sin h1');
if (await page.locator('link[rel="canonical"]').count()) fail('404.html: no debe llevar canonical');
for (const f of ['sitemap.xml', 'robots.txt']) {
  const r = await page.request.get(B + f);
  if (r.status() !== 200) fail(`${f}: HTTP ${r.status()}`);
}

console.log(`\nEnlaces externos (sin comprobar: revisar a mano), ${external.size}:`);
for (const [u, from] of [...external].sort()) console.log(`  ${u}  ← ${[...from].length} página(s)`);

await browser.close();
console.log(fails ? `\n${fails} fallo(s)` : '\ntodo ok');
process.exitCode = fails ? 1 : 0;
