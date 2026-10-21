# Pocket OS × Infinite Canvas — Iñigo Díez Osúa portfolio

New personal portfolio, built from scratch. Full creative brief (v2): [docs/BRIEF.md](docs/BRIEF.md). Progress and open decisions: [docs/PLAN.md](docs/PLAN.md) — read it at the start of every session and update it at the end. Each stage (E0–E8) has its own file in [docs/stages/](docs/stages/); read it before starting that stage. Visual references and conclusions: [docs/references/MOODBOARD.md](docs/references/MOODBOARD.md).

## Repository layout

```
CLAUDE.md                 rules (this file)
docs/
  BRIEF.md                creative brief v2 (BRIEF-original.md = v1)
  PLAN.md                 status, decisions, missing content
  stages/E0…E8-*.md       one file per stage: tasks, deliverables, approval gate
  references/MOODBOARD.md visual references + takeaways
  audit/                  E1 content inventory
  design/                 design system, device spec, transition (E3)
prototypes/               standalone HTML prototypes, no build (E2/, musica/)
materials/                raw inputs from Iñigo (git-ignored except README)
_reference/               old portfolio clone, reference images, screenshots, E3 videos (git-ignored)
public/                   static files copied as-is (cv.pdf, favicon.svg)
src/
  main.tsx                client entry
  entry-server.tsx        SSR entry, used only by the prerender
  app/                    App, Stage, routes (Route type, parse/pathOf/metaOf), own minimal router
  styles/                 tokens.css, global.css
  device/                 Slate hardware + controls (input model)
  os/                     screens inside the device
  canvas/                 canvas page + camera
  transition/             screen ↔ canvas transition (Web Animations API) + metrics
  pages/                  home, conventional pages, PageShell
  content/                typed content with sources: projects/, profile, site (meta), device
scripts/
  prerender.mjs           one index.html per route + 404.html, after the client and SSR builds
  dev/                    shot.ps1 (prototype screenshots), smoke.mjs (all routes), measure-transition.mjs
.github/workflows/        deploy.yml: GitHub Pages, manual trigger
dist/, dist-ssr/          build output (git-ignored)
```

Not created yet: `assets/` (optimized images, E6) and the Mi música page (route not registered in `src/app/routes.ts`; disabled in the device menu).

## Ground rules

- **The old portfolio is read-only.** `inigo-diez/inigo-diez.github.io` is never modified. It may be cloned into `_reference/` (git-ignored) only to read content.
- **Git remote is managed by the user.** Never push. Local commits only when the user asks.
- **Work phase by phase.** Stop for approval at the end of each step listed in PLAN.md. Never start the next phase unprompted.
- **Never invent content.** No made-up metrics, roles, dates, achievements or project results. Missing real data → explicit `TODO(content)` placeholder, listed in PLAN.md.
- Distinguish finished projects from ongoing work.
- Mistakes go to the global failure log (`Registro de fallos de Claude.md` in the Obsidian vault, rule in `~/.claude/CLAUDE.md`), not to this repo's docs.

## Concept

- 80% Pocket OS (an original retro-futuristic device: MP3 player × PDA × pocket computer) / 20% Infinite Canvas (spatial project explorer opened from Projects).
- The device screen *becomes* the canvas (shared-element / FLIP transition) and the transition is reversible.
- Identity = the person and their work, **not** a sector. No finance, chemistry, lab or "AI" theming.
- Recruiters must be able to skip the device: conventional nav links, list view, shareable project URLs.
- **Language: Spanish only** (UI, OS, copy, routes: `/sobre-mi`, `/trayectoria`, `/proyectos/<slug>`, `/habilidades`, `/formacion`, `/contacto`, `/mi-musica`; CV = PDF).
- **Name: always the full name "Iñigo Díez Osúa"** (titles, greeting, engraving, metadata). Never shorten it to "Iñigo Díez".
- **Sections (device menu, in this order):** Sobre mí · Trayectoria · Proyectos · Habilidades · Formación · Contacto · CV (the 7 of the old portfolio) · **Mi música** (personal, last). Trayectoria = old "Experiencia" (degree + TFG); Formación = old "Formación" (máster, degree, courses). All 8 appear in the device menu and the mobile link list; the desktop top nav shows only a selection (brief shortcuts + Mi música), and inner pages carry the full list in their footer.
- **Mi música** (agreed 2026-10-20; visual proposal v3 in [prototypes/musica/propuesta.html](prototypes/musica/propuesta.html), earbuds v3 pending approval; built in E4): route `/mi-musica`; songs chosen by Iñigo, one personal sentence each (`TODO(content)` — not published without them); official Spotify player loaded only when a track is chosen, never autoplay, unloaded (music stops) when leaving the section; title + direct link kept if Spotify fails; the device drives the official player through Spotify's iFrame API (decided 2026-10-21: centre = play/pause, ⏮ ⏭ = previous/next song, real playback position on screen); the official player stays visible; no volume control (the API has none); if the API fails, device controls are disabled and the official player + link remain. Never use Spotify's Web API (it needs a client secret). Hardware: discreet headphone socket on Slate's top edge (always there); a pair of button earbuds on a thin cable appears only inside Mi música — never on home or canvas.
- **Device: "Slate"** (E2 closed 2026-10-20), 100 × 124, 4:3 screen, ring with four axis symbols + − ⏮ ⏭ (labels for prev / next / back / open — they do not control volume) + centre button, BACK/HOME keys, menu opens on Proyectos, back engraving "○/" (no solid dot). Spec: [docs/design/device-spec.md](docs/design/device-spec.md).
- **Projects:** all 13 from the old portfolio, in its 4 original groups, all 4 featured as canvas piles. Source of truth: [docs/audit/project-map.md](docs/audit/project-map.md) (slugs, verified headline figures, corrections). "Experience" section is named **Trayectoria**.
- Project charts are re-rendered in the site palette (one per project, E6), not reused from matplotlib defaults.

## Design tokens

| Token | Value |
|---|---|
| bg | `#FFFFFF` |
| surface | `#FFFFFF` |
| surface-2 | `#F3F4F6` |
| metal | `#CFD2D6` |
| text | `#252525` |
| text-2 | `#6B6B6B` (#777 fails 4.5:1 on white) |
| accent | `#4F75AD` |

Direction "blanco tecnológico" (approved 2026-10-20): pure white page and canvas, no mint/second accent. Full system: [docs/design/design-system.md](docs/design/design-system.md).

Type: Geist everywhere (including the device OS). Geist Mono **only** for reference numbers (01, 02.1…). White dominates; blue (`accent`) signals selection only; figures go in `text`, not blue.

Forbidden: neon/cyberpunk, purple AI gradients, dot grids and decorative dots (also in marks/logos), screws, speaker grilles, glowing LEDs, dashed frames, heavy glassmorphism, blobs, particles, fake terminals, fake dashboards/metrics, generic hero + cards template, desktop-OS clone, mandatory boot/intro animation, Three.js unless truly unavoidable.

## Stack

Vite 8 + React 19 + TypeScript, static build for GitHub Pages. Decisions approved 2026-10-20 (E3):

- Plain CSS with tokens (`src/styles/tokens.css`), no Tailwind.
- No Motion for now: the transition uses the browser's Web Animations API. To be reconsidered in E4 and E5.
- Own minimal router, no react-router: the URL feeds the same state machine as the device, so the browser's back button runs the same transition.
- URLs with a trailing slash (`/proyectos/figuris/`): each route is a folder with its `index.html`.
- CSS/SVG for the device; fonts via `@fontsource-variable/geist` and `geist-mono`.

- Repo `portfolio-personal` is a project site → `base: '/portfolio-personal/'` while in development; it becomes `'/'` when it replaces the root site (E8). `base` is defined **only** in `vite.config.ts`; code reads `import.meta.env.BASE_URL`.
- Real paths (`/proyectos/<slug>/` …) with a prerendered `index.html` per route (own title/description/OG, `noindex` while base ≠ `/`) + `404.html`, so links survive refresh on GitHub Pages.
- Content lives in typed data files, separate from components; all user-facing strings in content (i18n-ready). Every factual claim records its source.
- Progressive enhancement: prerendered HTML holds real content + conventional nav; device and canvas enhance it.
- Screen aspect ratio of the device is a constraint of the screen → canvas transition: keep the 4:3 screen.

## Commands

Run npm from Bash (PowerShell blocks npm scripts until Iñigo changes the execution policy).

| Command | What |
|---|---|
| `npm run dev` | Dev server → http://localhost:5173/portfolio-personal/ (`?medir` = fps panel, `?tecnica=vt` = alternative transition) |
| `npm run build` | Typecheck + client build + SSR build + prerender into `dist/` |
| `npx vite preview --port 4173` | Serve `dist/` (needed by `scripts/dev/*.mjs`) |
| `npm run lint` · `npm run typecheck` · `npm run format` | ESLint · `tsc -b` · Prettier |
| `node scripts/dev/smoke.mjs <out>` | Every route in headless Edge, desktop + mobile: console errors + screenshots |
| `.\scripts\dev\shot.ps1 -Page home.html -Out x.png` | Screenshot of a prototype (`-Dir prototypes/musica` for Mi música) → `_reference/shots/` |

**Hook** ([.claude/settings.json](.claude/settings.json) → [.claude/hooks/check-file.mjs](.claude/hooks/check-file.mjs)): after every Write/Edit of `src/**/*.{ts,tsx,css}`, Prettier rewrites the file and ESLint checks ts/tsx. ESLint errors block until fixed; warnings are only reported. Typecheck is not part of it: run `npm run typecheck` before closing a task.

## Quality bar

Keyboard, pointer and touch share one navigation model. WCAG 2.2 AA, visible focus, `prefers-reduced-motion`, sound off by default. Mobile gets its own adapted experience, not a shrunken desktop.

## Skills

| Skill | When |
|---|---|
| `run` | Launch the Vite app to check a change in the real browser (E3–E8). Prototype screenshots: `scripts/dev/shot.ps1`. |
| `dataviz` | E6: before re-rendering each project chart in the site palette. |
| `trabajo-profesional` | E6: case studies and section texts (audience = recruiters; conclusion first, every figure traceable to its source). |
| `code-review` | Before asking for approval at the end of each stage from E4 on. |
| `simplify` | After large refactors (device, canvas, transition). |
| `security-review` | E8, before publishing (Spotify embed, contact form, external links). |
