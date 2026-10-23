import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { openOnHome } from '../app/intent';
import { setLeaveHook } from '../app/leave';
import { href } from '../app/routes';
import { navigate } from '../app/router';
import { MOBILE } from '../app/useMedia';
import { person } from '../content/profile';
import { collections, projectBySlug, projects, TOTAL_PROJECTS } from '../content/projects';
import { isAvailable, labelOf, topNav, ui } from '../content/site';
import type { CollectionId, Project } from '../content/types';
import { Device, type Command } from '../device/Device';
import { Icon } from '../device/icons';
import { ListScreen, useListNav, type Row } from '../os/Screen';
import { PageShell } from '../pages/PageShell';
import { ScreenFrame } from '../transition/ScreenFrame';
import { boundsOf, camTransform, centreOf, fit, safeArea, Z_MAX, Z_MIN, type Cam } from './camera';
import './canvas.css';

/** What the screen → canvas transition needs from the canvas (registered while mounted). */
export interface CanvasController {
  layer: HTMLElement;
  world: HTMLElement;
  getCam(): Cam;
  /** Set the camera (no animation). */
  setCam(c: Cam): void;
  /** Initial composition for the current viewport: the whole universe of projects. */
  initialCam(): Cam;
  /** Camera that shows all the content inside a w × h window (the device screen). */
  fitWindow(w: number, h: number): Cam;
  centre(c: Cam): { x: number; y: number };
}
let active: CanvasController | null = null;
export const getCanvas = () => active;

// Kept for the session, so coming back from a case study returns to the same point with the same project open.
let sessionCam: Cam | null = null;
let sessionFocus: string | null = null;
let sessionListScroll = 0; // phones: where the projects list was read
/** Scroll of the projects list when it was left (phones), to come back to it from a case study. */
export const canvasListScroll = () => sessionListScroll;

// Layout of an opened project around its cover (world px, from the cover's top-left corner). The cover is
// 260 × 300 (canvas.css); the cards it unfolds into keep these sizes.
const COVER = { w: 260, h: 300 };
// Prerendered HTML has no viewport: frame the universe (from the content data) in a 1440 × 900 window until
// the client measures.
const UNIVERSE = {
  x0: Math.min(...collections.map((c) => c.canvas.x), ...projects.map((p) => p.canvas.x)),
  y0: Math.min(...collections.map((c) => c.canvas.y), ...projects.map((p) => p.canvas.y)),
  x1: Math.max(...projects.map((p) => p.canvas.x + COVER.w)),
  y1: Math.max(...projects.map((p) => p.canvas.y + COVER.h)),
};
const SSR_CAM: Cam = fit(UNIVERSE, safeArea(1440, 900));
const PAN_STEP = 80; // px per arrow key
const RETURN_MS = 420; // back to the initial composition before the screen transition home
const MIN_START_Z = 0.62; // the opening view never shrinks the cards below this (the rest is explored)

const GAP = 24;
const SUMMARY = { x: COVER.w + GAP, w: 300 };
const README = { x: SUMMARY.x + SUMMARY.w + GAP, w: 480 };
// highlights: two columns under the cover and the summary, so they never reach the README
const FACT = { y: COVER.h + GAP, w: 280, col: 304, row: 150 };

// The docked device's list: the overview, the four collections and, last, Mi música (back home, it opens there).
const deviceRows = (): Row[] => [
  { label: ui.openCanvas, meta: String(TOTAL_PROJECTS), icon: 'canvas', strong: true },
  ...collections.map((c) => ({ label: c.shortTitle, meta: String(c.projects.length), icon: 'stack' as const })),
  { label: labelOf('mi-musica'), icon: 'note', disabled: !isAvailable('mi-musica') },
];
const MUSIC_ROW = collections.length + 1;

const isDesktopCanvas = (layer: HTMLElement) => layer.offsetParent !== null && !matchMedia(MOBILE).matches;
/** The canvas layer if it is the live, interactive canvas (desktop); on phones the projects are a list. */
export const liveCanvasLayer = (root: ParentNode) => {
  const layer = root.querySelector<HTMLElement>('[data-canvas-layer]');
  return layer && isDesktopCanvas(layer) ? layer : null;
};

// README of each project, converted from the E1 copies by scripts/readmes.mjs and loaded when it is opened.
const readmes = import.meta.glob<string>('../content/readmes/*.html', { query: '?raw', import: 'default' });

export function CanvasPage({ restore = false }: { restore?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const cam = useRef<Cam>({ ...SSR_CAM });
  const [listOpen, setListOpen] = useState(false);
  const [focus, setFocus] = useState<string | null>(restore ? sessionFocus : null);
  const focusRef = useRef(focus);
  const rows = deviceRows(); // on render: Mi música's availability is only known after start-up
  const nav = useListNav(rows.length, 0);
  const api = useRef<{
    frame(target: string | null, ms?: number): void;
    frameCollection(id: CollectionId): void;
    zoomBy(f: number): void;
  } | null>(null);
  const restoreOnMount = useRef(restore);
  const returnMs = useRef<number | undefined>(undefined); // set while closing on the way home

  useLayoutEffect(() => {
    focusRef.current = focus;
  });

  useLayoutEffect(() => {
    document.documentElement.classList.add('is-canvas');
    const layer = layerRef.current!,
      world = worldRef.current!;
    // What is on the canvas right now: the covers, the collection labels and the cards of the open project.
    const visible = () => [...world.querySelectorAll<HTMLElement>('[data-card]:not([inert] *), [data-label]')];
    const universe = () => [...world.querySelectorAll<HTMLElement>('[data-cover], [data-label]')];

    const apply = () => {
      world.style.transform = camTransform(cam.current);
      if (zoomRef.current) zoomRef.current.textContent = Math.round(cam.current.z * 100) + '%';
      if (coordsRef.current)
        coordsRef.current.textContent = `x: ${Math.round(-cam.current.x / cam.current.z)} · y: ${Math.round(-cam.current.y / cam.current.z)}`;
    };
    // The whole universe if it fits at a readable size; otherwise its centre at that size (the rest is explored).
    const initialCam = () => {
      const b = boundsOf(universe()),
        area = safeArea(innerWidth, innerHeight);
      const c = fit(b, area);
      if (c.z >= MIN_START_Z) return c;
      const z = MIN_START_Z;
      return {
        z,
        x: area.left + area.width / 2 - ((b.x0 + b.x1) / 2) * z,
        y: area.top + area.height / 2 - ((b.y0 + b.y1) / 2) * z,
      };
    };
    const clamp = (c: Cam) => {
      const b = boundsOf(visible()),
        m = 200;
      c.x = Math.min(innerWidth - m - b.x0 * c.z, Math.max(m - b.x1 * c.z, c.x));
      c.y = Math.min(innerHeight - m - b.y0 * c.z, Math.max(m - b.y1 * c.z, c.y));
      return c;
    };
    let animTimer = 0;
    const animateTo = (c: Cam, ms?: number) => {
      if (ms) world.style.setProperty('--cam-ms', ms + 'ms');
      world.classList.add('is-animating');
      cam.current = clamp({ ...c });
      apply();
      clearTimeout(animTimer);
      animTimer = window.setTimeout(
        () => {
          world.classList.remove('is-animating');
          world.style.removeProperty('--cam-ms');
        },
        (ms ?? 600) + 20,
      );
    };
    // Frame an open project with its cards, or the whole universe (null).
    const frame = (slug: string | null, ms?: number) => {
      if (!slug) return animateTo(initialCam(), ms);
      const els = [...world.querySelectorAll<HTMLElement>(`[data-project="${slug}"] [data-card]`)];
      animateTo(fit(boundsOf(els, 24), safeArea(innerWidth, innerHeight), 1), ms);
    };
    const frameCollection = (id: CollectionId) => {
      const els = [
        ...world.querySelectorAll<HTMLElement>(`[data-cover][data-collection="${id}"], [data-label="${id}"]`),
      ];
      animateTo(fit(boundsOf(els, 24), safeArea(innerWidth, innerHeight), 1));
    };
    // Zoom by a factor around a screen point, keeping that point still.
    const zoomed = (f: number, px: number, py: number): Cam => {
      const c = cam.current,
        z = Math.min(Z_MAX, Math.max(Z_MIN, c.z * f));
      return { x: px - (px - c.x) * (z / c.z), y: py - (py - c.y) * (z / c.z), z };
    };
    api.current = { frame, frameCollection, zoomBy: (f) => animateTo(zoomed(f, innerWidth / 2, innerHeight / 2)) };

    cam.current = restoreOnMount.current && sessionCam ? { ...sessionCam } : initialCam();
    apply();

    active = {
      layer,
      world,
      getCam: () => ({ ...cam.current }),
      setCam: (c) => {
        cam.current = { ...c };
        apply();
      },
      initialCam,
      fitWindow: (w, h) => fit(boundsOf(universe(), 30), { left: 0, top: 0, width: w, height: h }, 1),
      centre: (c) => centreOf(c, innerWidth, innerHeight),
    };

    // Leaving for the home: close the open project and return to the initial composition first (brief §7).
    setLeaveHook('away', () => {
      if (!isDesktopCanvas(layer)) return 0;
      const target = initialCam();
      const c = cam.current;
      const moved = Math.abs(c.x - target.x) + Math.abs(c.y - target.y) > 2 || Math.abs(c.z - target.z) > 0.01;
      setListOpen(false);
      if (!focusRef.current && !moved) return 0;
      if (focusRef.current) {
        returnMs.current = RETURN_MS; // the project closes and the effect below frames the universe
        setFocus(null);
      } else animateTo(target, RETURN_MS);
      return RETURN_MS;
    });

    // Pan (drag on the background, one finger) and zoom (ctrl/⌘ + wheel, trackpad pinch, two fingers),
    // outside React's render cycle. A click on the background (no drag) closes the open project.
    const zoomAt = (f: number, px: number, py: number) => {
      cam.current = clamp(zoomed(f, px, py));
      apply();
    };
    const panBy = (dx: number, dy: number) => {
      cam.current = clamp({ ...cam.current, x: cam.current.x + dx, y: cam.current.y + dy });
      apply();
    };
    const touches = new Map<number, { x: number; y: number }>();
    let pinch: { d: number; x: number; y: number } | null = null;
    let drag: { x: number; y: number; x0: number; y0: number } | null = null;
    const two = () => {
      const [a, b] = [...touches.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (touches.size === 2) {
          pinch = two();
          drag = null;
          layer.classList.remove('is-dragging');
          return;
        }
      }
      if ((e.target as Element).closest('[data-card], a, button') || e.button !== 0) return;
      layer.setPointerCapture(e.pointerId);
      drag = { x: e.clientX - cam.current.x, y: e.clientY - cam.current.y, x0: e.clientX, y0: e.clientY };
      layer.classList.add('is-dragging');
    };
    const move = (e: PointerEvent) => {
      if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && touches.size === 2) {
        const n = two();
        panBy(n.x - pinch.x, n.y - pinch.y);
        if (pinch.d > 0) zoomAt(n.d / pinch.d, n.x, n.y);
        pinch = n;
        return;
      }
      if (!drag) return;
      cam.current = clamp({ ...cam.current, x: e.clientX - drag.x, y: e.clientY - drag.y });
      apply();
    };
    const up = (e: PointerEvent) => {
      if (drag && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4 && focusRef.current) setFocus(null);
      touches.delete(e.pointerId);
      if (touches.size < 2) pinch = null;
      drag = null;
      layer.classList.remove('is-dragging');
    };
    const wheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('.readme')) return; // the README scrolls itself
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
      else panBy(-e.deltaX, -e.deltaY);
    };
    // Keyboard (brief §8): arrows pan, + / − zoom, 0 resets, Esc closes the open project. The docked device,
    // the list view and the README keep their own keys.
    const key = (e: KeyboardEvent) => {
      if (!isDesktopCanvas(layer) || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (layer.closest('[data-transitioning]')) return; // the transition owns the camera meanwhile
      if ((e.target as Element).closest?.('input, textarea, [data-device], .list-view, .readme')) return;
      const k = e.key;
      if (k === '+' || k === '=') zoomAt(1.2, innerWidth / 2, innerHeight / 2);
      else if (k === '-') zoomAt(1 / 1.2, innerWidth / 2, innerHeight / 2);
      else if (k === '0') setFocusAndFrame(null);
      else if (k === 'Escape' && focusRef.current) setFocusAndFrame(null);
      else if (k.startsWith('Arrow')) {
        const dx = k === 'ArrowLeft' ? PAN_STEP : k === 'ArrowRight' ? -PAN_STEP : 0;
        const dy = k === 'ArrowUp' ? PAN_STEP : k === 'ArrowDown' ? -PAN_STEP : 0;
        panBy(dx, dy);
      } else return;
      e.preventDefault();
    };
    const setFocusAndFrame = (slug: string | null) => {
      if (slug === focusRef.current) frame(slug);
      else setFocus(slug); // framed once its cards are out (effect below)
    };
    layer.addEventListener('pointerdown', down);
    layer.addEventListener('pointermove', move);
    layer.addEventListener('pointerup', up);
    layer.addEventListener('pointercancel', up);
    layer.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('keydown', key);
    const onResize = () => {
      cam.current = clamp(cam.current);
      apply();
    };
    addEventListener('resize', onResize);
    return () => {
      sessionCam = { ...cam.current };
      sessionFocus = focusRef.current;
      sessionListScroll = matchMedia(MOBILE).matches ? window.scrollY : 0;
      if (active?.layer === layer) active = null;
      setLeaveHook('away', null);
      document.documentElement.classList.remove('is-canvas');
      clearTimeout(animTimer);
      layer.removeEventListener('pointerdown', down);
      layer.removeEventListener('pointermove', move);
      layer.removeEventListener('pointerup', up);
      layer.removeEventListener('pointercancel', up);
      layer.removeEventListener('wheel', wheel);
      document.removeEventListener('keydown', key);
      removeEventListener('resize', onResize);
    };
  }, []);

  // A project opened or closed: frame it once its cards are out (not on mount: the camera is already the
  // initial or the restored one).
  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    api.current?.frame(focus, returnMs.current);
    returnMs.current = undefined;
  }, [focus]);

  useEffect(() => {
    if (!listOpen) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setListOpen(false);
      }
    };
    document.addEventListener('keydown', esc, true);
    return () => document.removeEventListener('keydown', esc, true);
  }, [listOpen]);

  const toggle = (slug: string) => setFocus((f) => (f === slug ? null : slug));
  const reset = () => {
    if (focus) setFocus(null);
    else api.current?.frame(null);
  };

  // The docked device drives the canvas: its list shows the universe or a collection; ATRÁS / INICIO go home.
  const pick = (i: number) => {
    if (i === MUSIC_ROW) {
      if (!isAvailable('mi-musica')) return;
      openOnHome('mi-musica');
      navigate('');
    } else if (i === 0) reset();
    else {
      setFocus(null);
      api.current?.frameCollection(collections[i - 1].id);
    }
  };
  const onCommand = (c: Command) => {
    if (c === 'next') nav.move(1);
    else if (c === 'prev') nav.move(-1);
    else if (c === 'select') pick(nav.sel);
    else navigate('');
  };
  const zoomBy = (f: number) => api.current?.zoomBy(f);

  return (
    <div className="canvas-page" data-page="canvas">
      <div className="canvas" ref={layerRef} data-canvas-layer aria-label={ui.canvas.label} role="region" tabIndex={-1}>
        <div
          className={'world' + (focus ? ' has-focus' : '')}
          ref={worldRef}
          data-world
          style={{ transform: camTransform(SSR_CAM) }}
        >
          {collections.map((c) => (
            <section key={c.id} className="zone" aria-label={c.title}>
              <header
                className="zone__head"
                data-label={c.id}
                style={{ left: c.canvas.x, top: c.canvas.y, width: c.canvas.w }}
              >
                <span className="mono">{c.id}</span>
                <h2>{c.title}</h2>
                <p>
                  {c.kicker} · {c.projects.length} {ui.labels.projectsWord}
                </p>
              </header>
              {c.projects.map((slug) => (
                <ProjectGroup key={slug} p={projectBySlug(slug)!} open={focus === slug} onToggle={() => toggle(slug)} />
              ))}
            </section>
          ))}
        </div>
      </div>
      <ScreenFrame />

      <header className="canvas-top" data-chrome>
        <div className="crumb">
          <a href={href('')}>{person.name}</a>
          <span>/</span>
          <h1>{ui.canvas.title}</h1>
        </div>
        <nav className="topnav" aria-label={ui.primaryNav}>
          <ul>
            {topNav().map((n) => (
              <li key={n.label}>
                <a
                  href={n.href ?? href(n.path!)}
                  aria-current={n.path === 'proyectos/' ? 'page' : undefined}
                  {...(n.href ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="dock">
        <Device data-device="dock" onCommand={onCommand}>
          <ListScreen title={ui.canvas.title} rows={rows} sel={nav.sel} onPick={(i) => (nav.setSel(i), pick(i))} />
        </Device>
      </div>

      <div className="hud" data-chrome>
        <span className="hud__coords" ref={coordsRef} aria-hidden="true" />
        <div className="hud__bar" role="toolbar" aria-label={ui.canvas.controls}>
          <button aria-label={ui.canvas.zoomOut} onClick={() => zoomBy(1 / 1.2)}>
            <Icon name="minus" />
          </button>
          <span className="hud__zoom" ref={zoomRef}>
            100%
          </span>
          <button aria-label={ui.canvas.zoomIn} onClick={() => zoomBy(1.2)}>
            <Icon name="plus" />
          </button>
          <span className="hud__sep" />
          <button onClick={reset}>
            <Icon name="reset" />
            {ui.canvas.reset}
          </button>
          <button aria-pressed={listOpen} aria-controls="lista-proyectos" onClick={() => setListOpen((o) => !o)}>
            <Icon name="list" />
            {ui.canvas.list}
          </button>
          <button onClick={() => navigate('')}>
            <Icon name="home" />
            {ui.canvas.home}
          </button>
        </div>
      </div>

      {/* data-chrome: it fades with the rest of the controls if the canvas is left with it open */}
      <section
        id="lista-proyectos"
        className="list-view"
        hidden={!listOpen}
        aria-label={ui.canvas.listTitle}
        data-chrome
      >
        <ProjectList />
      </section>

      {/* Phones: the projects as a list page, with the device docked like on the other pages (CSS picks it). */}
      <div className="canvas-page__mobile">
        <PageShell current="proyectos/" dock="proyectos">
          <h1>{ui.canvas.title}</h1>
          <p className="lead">{ui.projectsCount(TOTAL_PROJECTS, collections.length)}</p>
          <ProjectList />
        </PageShell>
      </div>
    </div>
  );
}

/**
 * A project on the canvas: its cover and, folded under it until it is opened, the cards it unfolds into —
 * what it is about (with its stack), one card per verified highlight, and its full README with the link to
 * GitHub and to its page.
 */
function ProjectGroup({ p, open, onToggle }: { p: Project; open: boolean; onToggle: () => void }) {
  const { x, y } = p.canvas;
  // Each card starts folded under the cover (--fx/--fy: offset back to it) and unfolds to its own place.
  const at = (dx: number, dy: number, w: number, i: number) =>
    ({ left: x + dx, top: y + dy, width: w, '--fx': `${-dx}px`, '--fy': `${-dy}px`, '--i': i }) as CSSProperties;
  return (
    <div className={'proj' + (open ? ' is-open' : '')} data-project={p.slug}>
      <article
        className="card cover"
        data-card
        data-cover
        data-slug={p.slug}
        data-collection={p.collection}
        style={{ left: x, top: y, width: COVER.w, height: COVER.h }}
      >
        {/* TODO(content): project image (E6); until then, an empty frame with its reference number */}
        <div className="cover__img" aria-hidden="true">
          <span className="mono">{p.ref}</span>
        </div>
        <div className="cover__body">
          <div className="card__top">
            <span className="mono">{p.ref}</span>
            <span className={p.status === 'en-curso' ? 'is-ongoing' : ''}>{ui.status[p.status]}</span>
          </div>
          <h3 className="card__title">
            <button className="cover__open" aria-expanded={open} aria-controls={`detalle-${p.slug}`} onClick={onToggle}>
              {p.shortTitle}
            </button>
          </h3>
          <div className="metric">
            <b>{p.headline.value}</b>
            <span>{p.headline.label}</span>
          </div>
        </div>
      </article>

      <div id={`detalle-${p.slug}`} className="sats" inert={!open} aria-label={p.title}>
        <section className="card sat" data-card style={at(SUMMARY.x, 0, SUMMARY.w, 0)}>
          <h4>{ui.canvas.about}</h4>
          <p className="sat__lead">{p.summary}</p>
          {p.stack.length > 0 && (
            <>
              <h4>{ui.labels.stack}</h4>
              <ul className="card__stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </section>
        {p.facts.map((f, i) => (
          <section
            key={f}
            className="card sat sat--fact"
            data-card
            style={at((i % 2) * FACT.col, FACT.y + Math.floor(i / 2) * FACT.row, FACT.w, i + 1)}
          >
            <h4>{ui.canvas.highlight}</h4>
            <p>{f}</p>
          </section>
        ))}
        <section className="card sat sat--readme" data-card style={at(README.x, 0, README.w, p.facts.length + 1)}>
          <header>
            <h4>{ui.canvas.readme}</h4>
            {p.readmeLang === 'en' && <span className="sat__note">{ui.canvas.readmeEn}</span>}
            {p.links.repo && (
              <a href={p.links.repo} target="_blank" rel="noopener">
                {ui.canvas.github} ↗
              </a>
            )}
            <a href={href(`proyectos/${p.slug}/`)}>{ui.canvas.openProject} →</a>
          </header>
          <Readme slug={p.slug} active={open} lang={p.readmeLang} />
        </section>
      </div>
    </div>
  );
}

/** The README, loaded the first time its project is opened. */
function Readme({ slug, active, lang }: { slug: string; active: boolean; lang?: 'en' }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    if (!active || html !== null) return;
    let alive = true;
    readmes[`../content/readmes/${slug}.html`]?.().then((h) => alive && setHtml(h));
    return () => {
      alive = false;
    };
  }, [active, html, slug]);
  return html === null ? (
    <div className="readme readme--loading">{ui.canvas.loading}</div>
  ) : (
    <div className="readme" tabIndex={0} lang={lang} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/** The same content as the canvas, as a conventional list (List view on desktop, the projects page on phones). */
function ProjectList() {
  return (
    <>
      {collections.map((c) => (
        <div key={c.id} className="list-view__group">
          <h2>
            <span className="mono">{c.id}</span> {c.title}
          </h2>
          <ul>
            {c.projects.map((slug) => {
              const p = projectBySlug(slug)!;
              return (
                <li key={slug}>
                  <a href={href(`proyectos/${slug}/`)}>
                    <span className="mono">{p.ref}</span> {p.shortTitle}
                  </a>
                  <span>
                    {p.headline.value} {p.headline.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
