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

let count = 0;
for (const route of [...allRoutes, notFound]) {
  const m = metaOf(route);
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:site_name" content="Iñigo Díez Osúa" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    // TODO(E7): og:image (the device) and canonical URLs once the final domain/base is fixed (E8)
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
await fs.rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`✓ ${count} páginas prerenderizadas (base ${base}${noindex ? ', noindex' : ''})`);
