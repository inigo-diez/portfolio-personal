// Turns the README copies of the 13 projects into HTML for the README card of the canvas.
// Source: _reference/readmes/<repo>.md (copies downloaded in E1, 2026-10-19; Iñigo chose them on 2026-10-23).
// Output: src/content/readmes/<slug>.html (tracked; loaded lazily when a project is opened on the canvas) and
// the README images in public/img/readmes/<slug>/ (E8, 2026-10-24).
// The repo of each project comes from its content file (`const REPO = '…'`). Relative links point to the file
// on GitHub. Run again after updating the copies: node scripts/readmes.mjs
// READMEs written in English are shown in a Spanish translation (Iñigo, 2026-10-23), tracked in
// src/content/readmes/es/<slug>.md and used instead of the copy when it exists; the original stays on GitHub.
//
// Images (E8): each one is taken from Iñigo's local copy of the repository (LOCAL below, with how that copy was
// checked against the published README), copied into public/ and shown in its original place, inside a
// <figure>; its original caption («Figura N. …») moves into the <figcaption>, right under the image. Nothing is
// written that the README does not say: an image without a caption keeps none. An image that cannot be found
// stays as a visible «Imagen no disponible» note and is reported. The HTML only references these local copies
// (src = %BASE%img/readmes/<slug>/<file>; the canvas replaces %BASE% with the site base): no external image.
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { marked } from 'marked';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, '_reference/readmes');
const PROJECTS = path.join(ROOT, 'src/content/projects');
const OUT = path.join(ROOT, 'src/content/readmes');
const IMG_OUT = path.join(ROOT, 'public/img/readmes');
fs.mkdirSync(OUT, { recursive: true });

// Local copy of each repository with images, checked on 2026-10-24 against the published copy of its README
// (text compared line by line, BOM and trailing spaces ignored) and, where the old portfolio used the same
// figure, byte for byte against that image.
const D = 'C:/Users/usuario/Documents/PROYECTOS GITHUB';
const K = 'C:/Users/usuario/Desktop/2020-2026';
const LOCAL = {
  figuris: { root: `${D}/scientific-figure-intelligence`, check: 'README idéntico (repositorio git local)' },
  'morosidad-crediticia': {
    root: `${K}/Curso/archive (2)`,
    check: 'README idéntico; 2 imágenes iguales a las de la web antigua',
  },
  'precio-vehiculos': {
    root: `${K}/Curso/archive (3)`,
    check: 'README idéntico; 3 imágenes iguales a las de la web antigua',
  },
  'precio-portatiles': { root: `${K}/Curso/archive (4)`, check: 'README idéntico' },
  'optimizacion-ml-vs-rsm': {
    root: `${D}/Optimización Diseño Experimental`,
    check: 'README_English.md idéntico; las figuras son iguales en sus dos copias',
  },
  'optimizacion-rsm': { root: `${D}/RSM TFG`, check: 'README idéntico; 2 imágenes iguales a las de la web antigua' },
  'contagio-eeuu-iran': {
    root: `${D}/Projecto Geopolitica Parte 3`,
    check: 'README igual salvo el subtítulo y un encabezado (5 líneas, sin imágenes)',
  },
  'estres-petroleo-gdelt': {
    root: `${D}/Geopolitica Crudo Precio Parte 1`,
    check: 'README_Parte1.md igual salvo la nota final (4 líneas); 2 imágenes iguales a las de la web antigua',
  },
  'simulacion-wti-montecarlo': {
    root: `${K}/PROYECTOS GITHUB/Geopolitica Simulación Crudo Parte 2/Part2`,
    check:
      'README local anterior (el publicado añade texto, mismas figuras); tabla de validación idéntica a la publicada y 2 imágenes iguales a las de la web antigua',
  },
  'analisis-metabolomico-gcms': {
    root: `${D}/Proyecto_Picos/results`,
    check: 'sin copia local del README publicado; 2 de las 15 imágenes son iguales a las de la web antigua',
  },
};
// Images referenced by URL (GitHub attachments): their local copy, and a descriptive alt where the README has
// none (only what the image shows, from its own title).
const REMOTE = {
  'https://github.com/user-attachments/assets/013793cc-000f-4ec7-96b8-abfa1d2fdf80': {
    file: path.join(ROOT, '_reference/old-portfolio/assets/img/561104312-013793cc-000f-4ec7-96b8-abfa1d2fdf80.png'),
    alt: 'Gráfico de barras horizontales: los 30 metabolitos más sensibles al cambio experimental, por puntuación combinada',
    check: 'copia de la web antigua con el mismo identificador de GitHub',
  },
};

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unescape = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const IMG_SRC = /^%BASE%img\/readmes\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.(png|jpe?g|gif|webp|svg)$/;

// The HTML is injected into the page (dangerouslySetInnerHTML), so the last step is an allowlist: every tag
// is rebuilt with only the attributes and values below; any other tag is dropped (its text stays). marked
// escapes «<» in text, so every «<» left in its output is a real tag.
const ALLOWED = {
  p: { align: /^(left|center|right)$/ },
  h5: { class: /^readme__h\d$/, align: /^(left|center|right)$/ },
  h6: { class: /^readme__h\d$/, align: /^(left|center|right)$/ },
  span: { class: /^readme__missing$/ },
  a: { href: /^(https:\/\/|http:\/\/|mailto:)/i, target: /^_blank$/, rel: /^noopener$/ },
  pre: { tabindex: /^0$/ },
  code: { class: /^language-[\w-]+$/ },
  th: { align: /^(left|center|right)$/ },
  td: { align: /^(left|center|right)$/ },
  // only the local copies written by this script
  img: {
    src: IMG_SRC,
    alt: /^[^<>]*$/,
    width: /^\d{1,4}$/,
    height: /^\d{1,4}$/,
    loading: /^lazy$/,
    decoding: /^async$/,
    class: /^readme__logo$/,
  },
  ...Object.fromEntries(
    'table thead tbody tr strong em del ul ol li hr br blockquote figure figcaption'.split(' ').map((t) => [t, {}]),
  ),
};
function sanitize(html, slug) {
  const dropped = new Set();
  const out = html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (_m, close, name, rest) => {
    const tag = name.toLowerCase();
    const allowed = ALLOWED[tag];
    if (!allowed) {
      dropped.add(tag);
      return '';
    }
    if (close) return `</${tag}>`;
    const attrs = [...rest.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)]
      .filter(([, k, v]) => allowed[k.toLowerCase()]?.test(v.replace(/&amp;/g, '&')))
      .map(([, k, v]) => ` ${k.toLowerCase()}="${v}"`);
    if (tag === 'img' && !attrs.some((a) => a.startsWith(' src='))) return ''; // no image without a local source
    return `<${tag}${attrs.join('')}>`;
  });
  if (dropped.size) console.log(`  ${slug}: etiquetas quitadas: ${[...dropped].join(', ')}`);
  return out;
}

/** Pixel size of a PNG, JPEG, GIF or SVG (the width/height attributes keep the proportions while it loads). */
function sizeOf(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 3) === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 9;) {
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  const svg = b.toString('utf8');
  if (/<svg\b/i.test(svg)) {
    const vb = /viewBox="[\d.\s-]*?\s([\d.]+)\s+([\d.]+)"/.exec(svg);
    const w = /<svg[^>]*\swidth="([\d.]+)(px)?"/.exec(svg)?.[1] ?? vb?.[1];
    const h = /<svg[^>]*\sheight="([\d.]+)(px)?"/.exec(svg)?.[1] ?? vb?.[2];
    if (w && h) return { w: Math.round(+w), h: Math.round(+h) };
  }
  return null;
}
/**
 * An SVG is copied only if it is plain drawing: once in public/ it can also be opened on its own, as a document
 * of the site, so no scripts, event handlers, embedded HTML or external references (in-file #ids are fine).
 */
const svgUnsafe = (s) =>
  /<script|<foreignObject|<iframe|<embed|<object|\son[a-z]+\s*=|javascript:|@import|(xlink:)?href\s*=\s*["']\s*[^"'#\s]|url\(\s*["']?\s*[^"'#)\s]/i.test(
    s,
  );

const report = [];
fs.rmSync(IMG_OUT, { recursive: true, force: true });

/** One README image → a local copy and its <img>, or the «not available» note. */
function image(tag, slug, used) {
  const attr = (k) => {
    const v = new RegExp(`\\s${k}="([^"]*)"`, 'i').exec(tag)?.[1];
    return v === undefined ? undefined : unescape(v);
  };
  const src = attr('src') ?? '';
  const remote = REMOTE[src];
  let alt = remote?.alt ?? attr('alt') ?? '';
  let file = remote?.file;
  if (!file && !/^[a-z]+:/i.test(src) && LOCAL[slug]) {
    let rel = src.replace(/^\.?\//, '');
    try {
      rel = decodeURIComponent(rel);
    } catch {
      /* keep it as written */
    }
    file = path.join(LOCAL[slug].root, rel);
  }
  const ext = path.extname(file ?? '').toLowerCase();
  let problem = null;
  if (!file || !fs.existsSync(file)) problem = 'no se encuentra en la copia local';
  else if (!/^\.(png|jpe?g|gif|webp|svg)$/.test(ext)) problem = `formato no admitido (${ext})`;
  else if (ext === '.svg' && svgUnsafe(fs.readFileSync(file, 'utf8')))
    problem = 'SVG con scripts o referencias externas';
  if (problem) {
    report.push({ slug, src, problem });
    return `<span class="readme__missing">Imagen no disponible${alt ? ': ' + escape(alt) : ''}</span>`;
  }
  // a flat, safe file name, unique in the project
  let name = path.basename(file).replace(/[^A-Za-z0-9._-]+/g, '-');
  for (let i = 2; used.has(name); i++) name = name.replace(/(-\d+)?(\.\w+)$/, `-${i}$2`);
  used.add(name);
  fs.mkdirSync(path.join(IMG_OUT, slug), { recursive: true });
  fs.copyFileSync(file, path.join(IMG_OUT, slug, name));
  const size = sizeOf(file);
  // a small width set in the README (a logo, 72 px) is kept; otherwise the image adapts to the card's width
  const shown = Number(attr('width'));
  const small = Number.isFinite(shown) && shown > 0 && shown < 200 && !/%/.test(attr('width') ?? '');
  const w = small ? shown : size?.w;
  const h = small && size ? Math.round((size.h * shown) / size.w) : size?.h;
  if (/^image$/i.test(alt)) alt = ''; // GitHub's default alt says nothing
  return (
    `<img src="%BASE%img/readmes/${slug}/${name}" alt="${escape(alt)}"` +
    (w && h ? ` width="${w}" height="${h}"` : '') +
    ` loading="lazy" decoding="async"${small ? ' class="readme__logo"' : ''}>`
  );
}

// Equations (E8, 2026-10-24): the READMEs write LaTeX between $…$ (inline) and $$…$$ (display), which marked does
// not know (it showed the dollars and turned the subscripts into italics). Before marked, each formula becomes a
// placeholder; after the allowlist, the placeholder becomes the MathML KaTeX writes for it (output 'mathml', its
// default trust: no links or HTML), which the browser draws natively. Code is left alone, and so are a dollar
// before a figure («> $150») and an escaped one (\$).
const math = [];
let mathErrors = 0;
function renderMath(tex, displayMode, slug) {
  try {
    return katex.renderToString(tex, { output: 'mathml', displayMode, throwOnError: true, strict: 'ignore' });
  } catch (e) {
    mathErrors++;
    console.log(`  ${slug}: fórmula sin convertir («${tex.slice(0, 60)}»): ${e.message.split('\n')[0]}`);
    return `<code>${escape(tex)}</code>`;
  }
}
/** Index of the next unescaped single $ from i (-1 if none). */
function nextDollar(text, i) {
  for (let k = text.indexOf('$', i); k >= 0; k = text.indexOf('$', k + 1)) if (text[k - 1] !== '\\') return k;
  return -1;
}
/**
 * Inline formula or not: one line, no space at its edges, not followed by a figure, and no plain word of 4+
 * letters once the LaTeX commands (and their {…}) are taken out — so «> $150, Ormuz … < $90» is prose.
 */
const isInlineMath = (tex, after) =>
  tex.length > 0 &&
  tex.length <= 200 &&
  !/\n/.test(tex) &&
  !/^\s|\s$/.test(tex) &&
  !/\d/.test(after ?? '') &&
  !/[A-Za-zÀ-ÿ]{4,}/.test(tex.replace(/\\[A-Za-z]+(\{[^}]*\})?/g, ''));
function protectMath(md, slug) {
  const keep = (html) => `KTXMATH${math.push(html) - 1}KTX`;
  // inline: from each $ to the next one; if that is not a formula, move on by one $ only (it may open the next)
  const inline = (text) => {
    let out = '',
      i = 0;
    for (;;) {
      const a = nextDollar(text, i),
        b = a < 0 ? -1 : nextDollar(text, a + 1);
      if (b < 0) return out + text.slice(i);
      if (isInlineMath(text.slice(a + 1, b), text[b + 1])) {
        out += text.slice(i, a) + keep(renderMath(text.slice(a + 1, b), false, slug));
        i = b + 1;
      } else {
        out += text.slice(i, a + 1);
        i = a + 1;
      }
    }
  };
  return md
    .split(/(```[\s\S]*?```|`[^`\n]*`)/) // odd pieces are code
    .map((part, i) =>
      i % 2
        ? part
        : inline(
            part.replace(/(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$/g, (_m, tex) => keep(renderMath(tex.trim(), true, slug))),
          ),
    )
    .join('');
}
const restoreMath = (html) => html.replace(/KTXMATH(\d+)KTX/g, (_m, i) => math[Number(i)]);

// A paragraph that is an original caption: it starts with «Figura N» / «Figure N» (bold or italic or plain).
const CAPTION = /^\s*(<(strong|em)>\s*)?(Figura|Figure|Fig\.)\s*\d+/i;

let n = 0;
for (const file of fs.readdirSync(PROJECTS).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const slug = file.replace(/\.ts$/, '');
  const repoUrl = /const REPO =\s*'([^']+)'/.exec(fs.readFileSync(path.join(PROJECTS, file), 'utf8'))?.[1];
  if (!repoUrl) throw new Error(`${file}: no REPO`);
  const repo = repoUrl.split('/').pop();
  const translation = path.join(OUT, 'es', `${slug}.md`);
  const translated = fs.existsSync(translation);
  const md = fs.readFileSync(translated ? translation : path.join(SRC, `${repo}.md`), 'utf8').replace(/^\uFEFF/, '');

  let html = marked.parse(protectMath(md, slug), { gfm: true, async: false });
  const used = new Set();
  let images = 0,
    captions = 0;
  html = html
    // no scripts, frames or inline handlers (own content, but it is injected as HTML)
    .replace(/<(script|iframe|object|embed|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    // headings: the README sits under the «README» card heading (h4), so its h1 → h5 and the rest → h6
    // (a second h1 on the canvas page otherwise); the class keeps the look of the original level
    .replace(/<(\/?)h([1-6])\b([^>]*)>/gi, (_m, close, lv, rest) =>
      close ? `</h${lv === '1' ? 5 : 6}>` : `<h${lv === '1' ? 5 : 6} class="readme__h${lv}"${rest}>`,
    )
    // code blocks scroll sideways: reachable with the keyboard (WCAG 2.1.1)
    .replace(/<pre>/gi, '<pre tabindex="0">')
    // an empty header cell (corner of a two-way table) is a data cell, not a header without a name
    .replace(/<th>\s*<\/th>/gi, '<td></td>')
    // images: the local copy (or the «not available» note)
    .replace(/<img\b[^>]*>/gi, (tag) => (images++, image(tag, slug, used)));
  const ITEM = /(<img\b[^>]*>|<span class="readme__missing">[^<]*<\/span>)/.source;
  html = html
    // image and caption in one paragraph (no blank line between them in the Markdown)
    .replace(
      new RegExp(
        `<p[^>]*>\\s*${ITEM}\\s*(?:<br>)?\\s*((?:<(?:em|strong)>)?\\s*(?:Figura|Figure)\\s*\\d+(?:(?!<\\/p>)[\\s\\S])*)<\\/p>`,
        'gi',
      ),
      (_m, img, caption) => (captions++, `<figure>${img}<figcaption>${caption.trim()}</figcaption></figure>`),
    )
    // an image written as an HTML block of its own (outside any paragraph)
    .replace(new RegExp(`^${ITEM}$`, 'gim'), '<figure>$1</figure>');
  // a paragraph holding only images → one <figure> each; a lone image takes the caption paragraph that follows
  // it or, failing that, a bold «Figura N.» title paragraph right before it (moved under the image). The
  // following paragraph is only looked at if it holds no image (it may be the next figure).
  html = html.replace(
    /(<p>\s*<strong>(?:Figura|Figure)\s*\d+[^<]*<\/strong>\s*<\/p>\s*)?<p[^>]*>((?:\s*(?:<img\b[^>]*>|<span class="readme__missing">[^<]*<\/span>)\s*)+)<\/p>(\s*<p>((?:(?!<\/p>|<img\b)[\s\S])*)<\/p>)?/gi,
    (all, before, imgs, after, afterInner) => {
      const items = imgs.match(/<img\b[^>]*>|<span class="readme__missing">[^<]*<\/span>/gi);
      if (items.length > 1)
        return (before ?? '') + items.map((i) => `<figure>${i}</figure>`).join('\n') + (after ?? '');
      if (after && CAPTION.test(afterInner)) {
        captions++;
        return `${before ?? ''}<figure>${items[0]}<figcaption>${afterInner}</figcaption></figure>`;
      }
      if (before) {
        captions++;
        const inner = /<p>([\s\S]*)<\/p>/.exec(before)[1];
        return `<figure>${items[0]}<figcaption>${inner.trim()}</figcaption></figure>${after ?? ''}`;
      }
      return `<figure>${items[0]}</figure>${after ?? ''}`;
    },
  );
  // a heading that is the figure's own title («Figura 1: Snapshot de mercados financieros», right above a
  // figure without caption) becomes its caption, under the image
  html = html.replace(
    /<h([56]) class="readme__h\d">((?:Figura|Figure)\s*\d+\s*[:.][^<]*)<\/h\1>\s*<figure>((?:(?!<figcaption|<\/figure>)[\s\S])*)<\/figure>/gi,
    (_m, _lv, title, img) => (captions++, `<figure>${img}<figcaption>${title.trim()}</figcaption></figure>`),
  );
  // links: relative ones to the file on GitHub; in-page anchors become plain text; external ones open apart
  html = html.replace(/<a href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi, (_m, href, rest, text) => {
    if (href.startsWith('#')) return `<span>${text}</span>`;
    const abs = /^(https?:|mailto:)/i.test(href) ? href : `${repoUrl}/blob/HEAD/${href.replace(/^\.?\//, '')}`;
    return `<a href="${escape(abs)}"${rest} target="_blank" rel="noopener">${text}</a>`;
  });

  html = sanitize(html, slug);
  html = restoreMath(html);
  if (images) {
    const where =
      LOCAL[slug]?.check ?? (Object.keys(REMOTE).some((u) => md.includes(u)) ? 'imagen de la web antigua' : '—');
    console.log(`  ${slug}: ${images} imágenes (${used.size} copiadas, ${captions} con pie) · ${where}`);
  }

  fs.writeFileSync(
    path.join(OUT, `${slug}.html`),
    `<!-- README of ${repoUrl} — ${translated ? 'Spanish translation (src/content/readmes/es) of the ' : ''}copy of 2026-10-19 (_reference/readmes), generated by scripts/readmes.mjs -->\n${html}`,
  );
  n++;
}
console.log(`✓ ${n} README → src/content/readmes/ · imágenes en public/img/readmes/ · ${math.length} fórmulas (${mathErrors} sin convertir)`);
if (report.length) {
  console.log(`✗ ${report.length} imágenes no disponibles:`);
  for (const r of report) console.log(`  ${r.slug}: ${r.src} (${r.problem})`);
}
