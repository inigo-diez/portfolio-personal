// Prerender: one real index.html per route (own title, description, Open Graph) + 404.html,
// so direct links and refresh work on GitHub Pages. Runs after `vite build` and the SSR build.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const { render, allRoutes, metaOf, pathOf, base, notFound } = ssr;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Not indexed while hosted at the development path (/portfolio-personal/); indexed once base = '/'.
const noindex = base !== '/';
// GitHub Pages domain of the account (same as the old portfolio). Open Graph needs absolute image URLs.
const ORIGIN = 'https://inigo-diez.github.io';

let count = 0;
const urlOf = (route) => ORIGIN + base + pathOf(route);

for (const route of [...allRoutes, notFound]) {
  const m = metaOf(route);
  const real = route.kind !== 'notfound';
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:site_name" content="Iñigo Díez Osúa" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    // Canonical URL with the current base: the development path until E8 switches it to '/'.
    real ? `<link rel="canonical" href="${urlOf(route)}" />` : '',
    real ? `<meta property="og:url" content="${urlOf(route)}" />` : '',
    // Made by scripts/brand.mjs.
    `<meta property="og:image" content="${ORIGIN}${base}og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Monograma iDO, Iñigo Díez Osúa y el dispositivo iDO Pocket" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    noindex ? `<meta name="robots" content="noindex" />` : '',
  ]
    .filter(Boolean)
    .join('\n    ');
  let html = template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, head)
    .replace('<!--app-html-->', render(route));
  if (route.kind === 'canvas') html = html.replace('<html lang="es">', '<html lang="es" class="is-canvas">');
  const file = route.kind === 'notfound' ? path.join(DIST, '404.html') : path.join(DIST, pathOf(route), 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  count++;
  console.log(`  prerender  ${path.relative(DIST, file).replace(/\\/g, '/')}`);
}

// Sitemap of every prerendered route (no 404) and robots.txt pointing to it. Crawlers only read robots.txt at
// the root of the domain, so at the development path it has no effect and the noindex meta above rules.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allRoutes.map((r) => `  <url><loc>${urlOf(r)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}${base}sitemap.xml\n`);
console.log(`  sitemap    sitemap.xml (${allRoutes.length} URL) + robots.txt`);

await fs.rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`✓ ${count} páginas prerenderizadas (base ${base}${noindex ? ', noindex' : ''})`);
