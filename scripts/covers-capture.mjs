// Captures the source of the biomarcadores cover (E8, 2026-10-24): a close view of the project's real dashboard
// (report_mhb.html of Iñigo's local copy, the version with the «Confianza origen» and «Motivo origen» filters that
// the README describes, 38,952 entries): the bottom of the filters and the first rows with their condition tags.
// Output: materials/covers/biomarcadores-dashboard.png (not tracked); scripts/covers.py fits it into the cover.
// Run: node scripts/covers-capture.mjs (the dashboard loads jQuery and DataTables from their CDNs).
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC =
  'C:/Users/usuario/Documents/PROYECTOS GITHUB/Base de Datos/Base de Datos metabolitos - copia/outputs Base de Datos/report_mhb.html';
const OUT = path.join(ROOT, 'materials/covers/biomarcadores-dashboard.png');

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(SRC).href, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => document.querySelector('.dataTables_info')?.textContent);
if (!/38,952/.test(info ?? '')) throw new Error(`the dashboard does not show the 38,952 entries: ${info}`);
// the table header in the middle of the view
const head = await page.evaluate(() => {
  const th = document.querySelector('table thead');
  window.scrollTo(0, th.getBoundingClientRect().top + scrollY - 560);
  return th.getBoundingClientRect().top;
});
await page.waitForTimeout(400);
const top = await page.evaluate(() => document.querySelector('table thead').getBoundingClientRect().top);
// the slot's shape (260 × 120): 745 × 344 CSS px, the export buttons, the header and four rows
await page.screenshot({ path: OUT, clip: { x: 18, y: top - 70, width: 745, height: 344 } });
console.log(`${info} · captura en ${path.relative(ROOT, OUT)} (cabecera de la tabla en ${Math.round(head)} px)`);
await browser.close();
