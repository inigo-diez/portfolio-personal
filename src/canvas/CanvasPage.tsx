import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import { openOnHome } from '../app/intent';
import { setLeaveHook } from '../app/leave';
import { href } from '../app/routes';
import { navigate } from '../app/router';
import { MOBILE } from '../app/useMedia';
import { person } from '../content/profile';
import { collections, projectBySlug, projects, TOTAL_PROJECTS } from '../content/projects';
import { loadReadme } from '../content/readmes';
import { isAvailable, labelOf, topNav, ui } from '../content/site';
import type { CollectionId, Project } from '../content/types';
import { Device, type Command } from '../device/Device';
import { useDraggable } from '../device/useDraggable';
import { Icon } from '../device/icons';
import { ListScreen, useListNav, type Row } from '../os/Screen';
import { PageShell } from '../pages/PageShell';
import { ScreenFrame } from '../transition/ScreenFrame';
import { boundsOf, camTransform, centreOf, fit, safeArea, Z_MAX, Z_MIN, type Cam } from './camera';
import '../styles/readme.css';
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
// The cards unfold in a cascade (canvas.css, .sat: 550 ms + 45 ms per card); opening a project, the camera
// ends with the last one.
const UNFOLD_MS = 550;
const UNFOLD_STEP_MS = 45;
const MIN_START_Z = 0.62; // the opening view never shrinks the cards below this (the rest is explored)

// Layout of an opened project (E8): the README in the middle, as tall as the free area of the window; the
// cover and «De qué va» on its left, the highlights on its right. In a narrow window the highlights go under
// «De qué va» (explored by panning) so the README keeps a readable width. World px from the cover's top-left
// corner; `z` is the zoom it is framed at, never below 0.9 so the text keeps its size.
const GAP = 24;
const SIDE_W = 260; // the cover's width: the left column; the highlights column has the same width
const README_W = { min: 380, max: 760 };
const FACT_STEP = 190; // approximate height of a highlight: only where it starts folding from
interface OpenLayout {
  z: number;
  /** Size of the composition (world px). */
  w: number;
  h: number;
  readme: { x: number; w: number };
  /** Highlights column on the right, or null: under «De qué va». */
  factsX: number | null;
}
function openLayout(vw: number, vh: number): OpenLayout {
  const area = safeArea(vw, vh);
  const z = Math.min(1.15, Math.max(0.9, area.width / 1150));
  const w = area.width / z,
    h = area.height / z;
  const middle = w - 2 * (SIDE_W + GAP);
  if (middle >= README_W.min + 120) {
    const rw = Math.min(README_W.max, middle);
    return { z, w: 2 * (SIDE_W + GAP) + rw, h, readme: { x: SIDE_W + GAP, w: rw }, factsX: SIDE_W + 2 * GAP + rw };
  }
  return { z, w, h, readme: { x: SIDE_W + GAP, w: Math.max(README_W.min, w - SIDE_W - GAP) }, factsX: null };
}
// Editorial index (E8, Iñigo, 2026-10-24, after his mock-up; exception in CLAUDE.md): every collection the same
// way (the one of 04, his reference): a fine rule just left of its heading, with a short blue segment at its
// start, and under it a large numeral in a thin light-grey outline, ending just before the heading. Derived from
// each collection's position (world px), so the four stay alike; nothing lies under a card or a heading.
const INDEX = {
  numeral: { size: 120, dx: -14, dy: 136 }, // right edge and baseline, from the heading's top-left corner
  rule: { x1: -190, x2: -16, dy: 12, blue: 50 },
};
// the index drawing extends left of and above the world origin (01 sits at x < 0): its SVG is offset by this, so
// nothing is drawn outside its own box (drawn outside, it flickered while panning)
const INDEX_OFFSET = 260;

// The window size as React state (the layout follows it). Prerendered HTML and hydration assume 1440 × 900.
const onWindowResize = (cb: () => void) => {
  addEventListener('resize', cb);
  return () => removeEventListener('resize', cb);
};
const windowSize = () => `${innerWidth}x${innerHeight}`;

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

export function CanvasPage({ restore = false }: { restore?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const cam = useRef<Cam>({ ...SSR_CAM });
  const [listOpen, setListOpen] = useState(false);
  const [focus, setFocus] = useState<string | null>(restore ? sessionFocus : null);
  const focusRef = useRef(focus);
  const size = useSyncExternalStore(onWindowResize, windowSize, () => '1440x900');
  const layout = useMemo(() => {
    const [w, h] = size.split('x').map(Number);
    return openLayout(w, h);
  }, [size]);
  const layoutRef = useRef(layout);
  const rows = deviceRows(); // on render: Mi música's availability is only known after start-up
  const nav = useListNav(rows.length, 0);
  const dockRef = useRef<HTMLElement>(null);
  useDraggable(dockRef);
  const api = useRef<{
    frame(target: string | null, ms?: number): void;
    frameCollection(id: CollectionId): void;
    atOverview(): boolean;
    zoomBy(f: number): void;
  } | null>(null);
  const restoreOnMount = useRef(restore);
  const returnMs = useRef<number | undefined>(undefined); // set while closing on the way home

  useLayoutEffect(() => {
    focusRef.current = focus;
    layoutRef.current = layout;
  });

  // An open project is a history entry of its own (same URL, state { canvasOpen }), so the browser's back button
  // closes it and stays on the canvas instead of leaving for the home (Iñigo, 2026-10-24). Closing it from the
  // canvas goes back through that entry; switching to another project replaces it.
  const openProject = useCallback((slug: string | null) => {
    const cur = focusRef.current;
    if (slug === cur) return;
    if (slug && !cur) history.pushState({ canvasOpen: slug }, '', location.pathname);
    else if (slug) history.replaceState({ canvasOpen: slug }, '', location.pathname);
    else if (history.state?.canvasOpen) return history.back(); // its popstate closes it (effect below)
    setFocus(slug);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.add('is-canvas');
    const layer = layerRef.current!,
      world = worldRef.current!;
    // What is on the canvas right now: the covers and the collection labels, or, with a project open, only it
    // (the rest is hidden and inert).
    const visible = () => [
      ...world.querySelectorAll<HTMLElement>(
        focusRef.current ? '[data-card]:not([inert] *)' : '[data-card]:not([inert] *), [data-label]',
      ),
    ];
    const universe = () => [...world.querySelectorAll<HTMLElement>('[data-cover], [data-label]')];

    const apply = () => {
      world.style.transform = camTransform(cam.current);
      if (zoomRef.current) zoomRef.current.textContent = Math.round(cam.current.z * 100) + '%';
      if (coordsRef.current)
        coordsRef.current.textContent = `x: ${Math.round(-cam.current.x / cam.current.z)} · y: ${Math.round(-cam.current.y / cam.current.z)}`;
    };
    // The whole universe if it fits at a readable size; otherwise, at that size, centred across and from the top
    // of the safe area down (the first collection label clear of the top bar; the rest is explored).
    const initialCam = () => {
      const b = boundsOf(universe()),
        area = safeArea(innerWidth, innerHeight);
      const c = fit(b, area);
      if (c.z >= MIN_START_Z) return c;
      const z = MIN_START_Z;
      return {
        z,
        x: area.left + area.width / 2 - ((b.x0 + b.x1) / 2) * z,
        y: area.top - b.y0 * z,
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
    // Frame an open project (its layout, centred across, from the top of the free area), or the whole universe.
    const frame = (slug: string | null, ms?: number) => {
      if (!slug) return animateTo(initialCam(), ms);
      const cover = world.querySelector<HTMLElement>(`[data-cover][data-slug="${slug}"]`);
      if (!cover) return;
      const l = layoutRef.current,
        area = safeArea(innerWidth, innerHeight);
      animateTo(
        {
          z: l.z,
          x: area.left + (area.width - l.w * l.z) / 2 - cover.offsetLeft * l.z,
          y: area.top - cover.offsetTop * l.z,
        },
        ms,
      );
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
    // Is the camera on the initial composition (the whole universe, nothing zoomed)? Same test as the leave hook.
    const atOverview = () => {
      const t = initialCam(),
        c = cam.current;
      return Math.abs(c.x - t.x) + Math.abs(c.y - t.y) <= 2 && Math.abs(c.z - t.z) <= 0.01;
    };
    api.current = {
      frame,
      frameCollection,
      atOverview,
      zoomBy: (f) => animateTo(zoomed(f, innerWidth / 2, innerHeight / 2)),
    };

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
      if (drag && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4 && focusRef.current) openProject(null);
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
      else openProject(slug); // framed once its cards are out (effect below)
    };
    // back / forward between an open project and the canvas (same URL): the history state says which is open
    const onPop = () => {
      if (location.pathname === href('proyectos/')) setFocus(history.state?.canvasOpen ?? null);
    };
    // the entry this page starts on must say what is open (coming back from the home it may still say a project)
    if ((history.state?.canvasOpen ?? null) !== focusRef.current)
      history.replaceState(focusRef.current ? { canvasOpen: focusRef.current } : null, '', location.pathname);
    layer.addEventListener('pointerdown', down);
    layer.addEventListener('pointermove', move);
    layer.addEventListener('pointerup', up);
    layer.addEventListener('pointercancel', up);
    layer.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('keydown', key);
    addEventListener('popstate', onPop);
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
      removeEventListener('popstate', onPop);
      removeEventListener('resize', onResize);
    };
  }, [openProject]);

  // A project opened or closed: frame it once its cards are out (not on mount: the camera is already the
  // initial or the restored one).
  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const cards = focus ? document.querySelectorAll(`[data-project="${focus}"] .sat`).length : 0;
    api.current?.frame(focus, returnMs.current ?? (cards ? UNFOLD_MS + UNFOLD_STEP_MS * (cards - 1) : undefined));
    returnMs.current = undefined;
  }, [focus]);

  // The window changed size with a project open: its layout changed, frame it again at once.
  useLayoutEffect(() => {
    if (focusRef.current) api.current?.frame(focusRef.current, 1);
  }, [layout]);

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

  const toggle = (slug: string) => openProject(focus === slug ? null : slug);
  const reset = () => {
    if (focus) openProject(null);
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
      openProject(null);
      api.current?.frameCollection(collections[i - 1].id);
    }
  };
  const onCommand = (c: Command) => {
    if (c === 'next') return nav.move(1);
    if (c === 'prev') return nav.move(-1);
    if (c === 'select') pick(nav.sel);
    else if (c === 'back' && focus)
      openProject(null); // ATRÁS closes the open project first; INICIO goes home
    else if (c === 'back' && api.current && !api.current.atOverview()) {
      // zoomed into a collection (or moved): ATRÁS returns to the unzoomed overview, a second one goes home
      api.current.frame(null);
      nav.setSel(0);
    } else navigate('');
    return true;
  };
  const zoomBy = (f: number) => api.current?.zoomBy(f);

  return (
    <div className="canvas-page" data-page="canvas">
      <div className="canvas" ref={layerRef} data-canvas-layer aria-label={ui.canvas.label} role="region" tabIndex={-1}>
        {/* data-open: a project is open, the others and the collection labels are hidden (canvas.css) */}
        <div
          className="world"
          ref={worldRef}
          data-world
          data-open={focus ? '' : undefined}
          style={{ transform: camTransform(SSR_CAM) }}
        >
          <svg
            className="index"
            style={{ left: -INDEX_OFFSET, top: -INDEX_OFFSET }}
            width={UNIVERSE.x1 + INDEX_OFFSET + 60}
            height={UNIVERSE.y1 + INDEX_OFFSET + 60}
            aria-hidden="true"
          >
            <g transform={`translate(${INDEX_OFFSET} ${INDEX_OFFSET})`}>
              {collections.map(({ id, canvas: { x, y } }) => {
                const { numeral: n, rule: r } = INDEX;
                return (
                  <g key={id}>
                    <line className="index__rule" x1={x + r.x1} y1={y + r.dy} x2={x + r.x2} y2={y + r.dy} />
                    <line
                      className="index__rule is-blue"
                      x1={x + r.x1}
                      y1={y + r.dy}
                      x2={x + r.x1 + r.blue}
                      y2={y + r.dy}
                    />
                    <text className="index__num" x={x + n.dx} y={y + n.dy} fontSize={n.size} textAnchor="end">
                      {id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
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
                <ProjectGroup
                  key={slug}
                  p={projectBySlug(slug)!}
                  open={focus === slug}
                  hidden={focus !== null && focus !== slug}
                  layout={layout}
                  onToggle={() => toggle(slug)}
                />
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
                <a href={href(n.path)} aria-current={n.path === 'proyectos/' ? 'page' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <aside className="dock" aria-label={ui.device.dock} ref={dockRef}>
        <Device data-device="dock" onCommand={onCommand}>
          <ListScreen title={ui.canvas.title} rows={rows} sel={nav.sel} onPick={(i) => (nav.setSel(i), pick(i))} />
        </Device>
      </aside>

      <aside className="hud" aria-label={ui.canvas.controls} data-chrome>
        <span className="hud__coords" ref={coordsRef} aria-hidden="true" />
        <div className="hud__bar" role="toolbar">
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
      </aside>

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
function ProjectGroup({
  p,
  open,
  hidden,
  layout,
  onToggle,
}: {
  p: Project;
  open: boolean;
  /** Another project is open: this one is hidden and takes no clicks or keyboard focus. */
  hidden: boolean;
  layout: OpenLayout;
  onToggle: () => void;
}) {
  const { x, y } = p.canvas;
  // Each card starts folded under the cover (--fx/--fy: offset back to it) and unfolds to its own place. The
  // two side columns stack their cards (heights depend on the text), so each card folds back from roughly
  // where it sits in its column.
  const fold = (dx: number, dy: number, i: number) =>
    ({ '--fx': `${-dx}px`, '--fy': `${-dy}px`, '--i': i }) as CSSProperties;
  const place = (dx: number, dy: number, w: number) => ({ left: x + dx, top: y + dy, width: w });
  const below = COVER.h + GAP; // «De qué va», under the cover
  const factsAt = (i: number) =>
    layout.factsX === null
      ? fold(0, below + FACT_STEP * (i + 1.4), i + 1) // under «De qué va»
      : fold(layout.factsX, FACT_STEP * i, i + 1);
  const facts = p.facts.map((f, i) => (
    <section key={f.value} className="card sat sat--fact" style={factsAt(i)}>
      <h4>{ui.canvas.highlight}</h4>
      <b className="sat__figure">{f.value}</b>
      <p>{f.text}</p>
    </section>
  ));
  return (
    <div className={'proj' + (open ? ' is-open' : '')} data-project={p.slug} inert={hidden}>
      <article
        className="card cover"
        data-card
        data-cover
        data-slug={p.slug}
        data-collection={p.collection}
        style={{ left: x, top: y, width: COVER.w, height: COVER.h }}
      >
        {/* the cover image (scripts/covers.py), decorative next to the title and figure; TODO(content): the
            projects without one keep an empty frame with their reference number */}
        <div className={'cover__img' + (p.cover ? ' has-image' : '')} aria-hidden="true">
          {p.cover ? (
            <img src={import.meta.env.BASE_URL + p.cover.src} alt="" width={COVER.w} height={120} decoding="async" />
          ) : (
            <span className="mono">{p.ref}</span>
          )}
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
        {/* the side columns are the measured boxes (data-card) of the camera; their cards stack inside */}
        <div className="sat-col" data-card style={place(0, below, SIDE_W)}>
          <section className="card sat" style={fold(0, below, 0)}>
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
          {layout.factsX === null && facts}
        </div>
        {layout.factsX !== null && (
          <div className="sat-col" data-card style={place(layout.factsX, 0, SIDE_W)}>
            {facts}
          </div>
        )}
        <section
          className="card sat sat--readme"
          data-card
          style={{
            ...place(layout.readme.x, 0, layout.readme.w),
            height: layout.h,
            ...fold(layout.readme.x, 0, p.facts.length + 1),
          }}
        >
          <header>
            <h4>{ui.canvas.readme}</h4>
            {p.readmeTranslated && <span className="sat__note">{ui.canvas.readmeTranslated}</span>}
            {p.links.repo && (
              <a href={p.links.repo} target="_blank" rel="noopener">
                {ui.canvas.github} ↗
              </a>
            )}
            <a href={href(`proyectos/${p.slug}/`)}>{ui.canvas.openProject} →</a>
          </header>
          <Readme slug={p.slug} active={open} />
        </section>
      </div>
    </div>
  );
}

/** The README, loaded the first time its project is opened. */
function Readme({ slug, active }: { slug: string; active: boolean }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    if (!active || html !== null) return;
    let alive = true;
    loadReadme(slug)?.then((h) => alive && setHtml(h)); // the first time its project is opened
    return () => {
      alive = false;
    };
  }, [active, html, slug]);
  return html === null ? (
    <div className="readme readme--loading">{ui.canvas.loading}</div>
  ) : (
    <div className="readme" tabIndex={0} dangerouslySetInnerHTML={{ __html: html }} />
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
