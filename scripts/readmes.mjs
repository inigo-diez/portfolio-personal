// Turns the README copies of the 13 projects into HTML for the README card of the canvas.
// Source: _reference/readmes/<repo>.md (copies downloaded in E1, 2026-10-19; Iñigo chose them on 2026-10-23).
// Output: src/content/readmes/<slug>.html (tracked; loaded lazily when a project is opened on the canvas).
// The repo of each project comes from its content file (`const REPO = '…'`).
// Images are removed for now (the images of the site come at the end, E6) and replaced by a note; relative
// links point to the file on GitHub. Run again after updating the copies: node scripts/readmes.mjs
// READMEs written in English are shown in a Spanish translation (Iñigo, 2026-10-23), tracked in
// src/content/readmes/es/<slug>.md and used instead of the copy when it exists; the original stays on GitHub.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, '_reference/readmes');
const PROJECTS = path.join(ROOT, 'src/content/projects');
const OUT = path.join(ROOT, 'src/content/readmes');
fs.mkdirSync(OUT, { recursive: true });

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The HTML is injected into the page (dangerouslySetInnerHTML), so the last step is an allowlist: every tag
// is rebuilt with only the attributes and values below; any other tag is dropped (its text stays). marked
// escapes «<» in text, so every «<» left in its output is a real tag.
const ALLOWED = {
  p: { align: /^(left|center|right)$/ },
  h5: { class: /^readme__h\d$/, align: /^(left|center|right)$/ },
  h6: { class: /^readme__h\d$/, align: /^(left|center|right)$/ },
  span: { class: /^readme__img$/ },
  a: { href: /^(https:\/\/|http:\/\/|mailto:)/i, target: /^_blank$/, rel: /^noopener$/ },
  pre: { tabindex: /^0$/ },
  code: { class: /^language-[\w-]+$/ },
  th: { align: /^(left|center|right)$/ },
  td: { align: /^(left|center|right)$/ },
  ...Object.fromEntries(
    'table thead tbody tr strong em del ul ol li hr br blockquote'.split(' ').map((t) => [t, {}]),
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
    return `<${tag}${attrs.join('')}>`;
  });
  if (dropped.size) console.log(`  ${slug}: etiquetas quitadas: ${[...dropped].join(', ')}`);
  return out;
}

let n = 0;
for (const file of fs.readdirSync(PROJECTS).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
  const slug = file.replace(/\.ts$/, '');
  const repoUrl = /const REPO =\s*'([^']+)'/.exec(fs.readFileSync(path.join(PROJECTS, file), 'utf8'))?.[1];
  if (!repoUrl) throw new Error(`${file}: no REPO`);
  const repo = repoUrl.split('/').pop();
  const translation = path.join(OUT, 'es', `${slug}.md`);
  const translated = fs.existsSync(translation);
  const md = fs.readFileSync(translated ? translation : path.join(SRC, `${repo}.md`), 'utf8').replace(/^\uFEFF/, '');

  let html = marked.parse(md, { gfm: true, async: false });
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
    // images: a note for now (E6)
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const alt = /\salt="([^"]*)"/i.exec(tag)?.[1];
      return `<span class="readme__img">[Figura${alt ? ': ' + alt : ''}]</span>`;
    })
    // links: relative ones to the file on GitHub; in-page anchors become plain text; external ones open apart
    .replace(/<a href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi, (_m, href, rest, text) => {
      if (href.startsWith('#')) return `<span>${text}</span>`;
      const abs = /^(https?:|mailto:)/i.test(href) ? href : `${repoUrl}/blob/HEAD/${href.replace(/^\.?\//, '')}`;
      return `<a href="${escape(abs)}"${rest} target="_blank" rel="noopener">${text}</a>`;
    });

  html = sanitize(html, slug);

  fs.writeFileSync(
    path.join(OUT, `${slug}.html`),
    `<!-- README of ${repoUrl} — ${translated ? 'Spanish translation (src/content/readmes/es) of the ' : ''}copy of 2026-10-19 (_reference/readmes), generated by scripts/readmes.mjs -->\n${html}`,
  );
  n++;
}
console.log(`✓ ${n} README → src/content/readmes/`);
