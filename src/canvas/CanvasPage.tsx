import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { href } from '../app/routes';
import { navigate } from '../app/router';
import { person } from '../content/profile';
import { collections, projectBySlug, projects, TOTAL_PROJECTS } from '../content/projects';
import { topNav, ui } from '../content/site';
import type { Collection, Project } from '../content/types';
import { Device, type Command } from '../device/Device';
import { Icon } from '../device/icons';
import { ListScreen, useListNav, type Row } from '../os/Screen';
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
  /** Initial composition for the current viewport: every pile visible. */
  initialCam(): Cam;
  /** Camera that shows all the content inside a w × h window (the device screen). */
  fitWindow(w: number, h: number): Cam;
  centre(c: Cam): { x: number; y: number };
}
let active: CanvasController | null = null;
export const getCanvas = () => active;

// Camera kept for the session, so coming back from a case study returns to the same point (E5 builds on it).
let sessionCam: Cam | null = null;

// Prerendered HTML has no viewport: use the composition of a 1440 × 900 window until the client measures.
const SSR_CAM: Cam = fit({ x0: 30, y0: 140, x1: 1310, y1: 720 }, safeArea(1440, 900));

const DEVICE_ROWS: Row[] = [
  { label: ui.openCanvas, meta: String(TOTAL_PROJECTS), icon: 'canvas', strong: true },
  ...collections.map((c) => ({ label: c.shortTitle, meta: String(c.projectCount), icon: 'stack' as const })),
];

export function CanvasPage({ restore = false }: { restore?: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const cam = useRef<Cam>({ ...SSR_CAM });
  const [listOpen, setListOpen] = useState(false);
  const nav = useListNav(DEVICE_ROWS.length, 0);
  const api = useRef<{ animateTo(c: Cam): void; focus(id: string | null): void } | null>(null);
  const restoreOnMount = useRef(restore);

  useLayoutEffect(() => {
    document.documentElement.classList.add('is-canvas');
    const layer = layerRef.current!,
      world = worldRef.current!;
    const cards = () => [...world.querySelectorAll<HTMLElement>('[data-card]')];

    const apply = () => {
      world.style.transform = camTransform(cam.current);
      if (zoomRef.current) zoomRef.current.textContent = Math.round(cam.current.z * 100) + '%';
      if (coordsRef.current)
        coordsRef.current.textContent = `x: ${Math.round(-cam.current.x / cam.current.z)} · y: ${Math.round(-cam.current.y / cam.current.z)}`;
    };
    const initialCam = () => fit(boundsOf(cards()), safeArea(innerWidth, innerHeight));
    const clamp = (c: Cam) => {
      const b = boundsOf(cards()),
        m = 200;
      c.x = Math.min(innerWidth - m - b.x0 * c.z, Math.max(m - b.x1 * c.z, c.x));
      c.y = Math.min(innerHeight - m - b.y0 * c.z, Math.max(m - b.y1 * c.z, c.y));
      return c;
    };
    let animTimer = 0;
    const animateTo = (c: Cam) => {
      world.classList.add('is-animating');
      cam.current = clamp({ ...c });
      apply();
      clearTimeout(animTimer);
      animTimer = window.setTimeout(() => world.classList.remove('is-animating'), 620);
    };
    const focus = (id: string | null) => {
      if (!id) return animateTo(initialCam());
      const els = cards().filter((e) => e.dataset.collection === id);
      animateTo(fit(boundsOf(els, 24), safeArea(innerWidth, innerHeight), 1.4));
    };
    api.current = { animateTo, focus };

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
      fitWindow: (w, h) => fit(boundsOf(cards(), 30), { left: 0, top: 0, width: w, height: h }, 1),
      centre: (c) => centreOf(c, innerWidth, innerHeight),
    };

    // Pan (drag on the background) and zoom (ctrl/⌘ + wheel or pinch on a trackpad), outside React's render cycle.
    let drag: { x: number; y: number } | null = null;
    const zoomAt = (f: number, px: number, py: number) => {
      const c = cam.current,
        z = Math.min(Z_MAX, Math.max(Z_MIN, c.z * f));
      cam.current = clamp({ x: px - (px - c.x) * (z / c.z), y: py - (py - c.y) * (z / c.z), z });
      apply();
    };
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest('[data-card], a, button') || e.button !== 0) return;
      layer.setPointerCapture(e.pointerId);
      drag = { x: e.clientX - cam.current.x, y: e.clientY - cam.current.y };
      layer.classList.add('is-dragging');
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      cam.current = clamp({ ...cam.current, x: e.clientX - drag.x, y: e.clientY - drag.y });
      apply();
    };
    const up = () => {
      drag = null;
      layer.classList.remove('is-dragging');
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
      else {
        cam.current = clamp({ ...cam.current, x: cam.current.x - e.deltaX, y: cam.current.y - e.deltaY });
        apply();
      }
    };
    const key = (e: KeyboardEvent) => {
      if ((e.target as Element).closest?.('input, textarea')) return;
      if (e.key === '+' || e.key === '=') zoomAt(1.2, innerWidth / 2, innerHeight / 2);
      else if (e.key === '-') zoomAt(1 / 1.2, innerWidth / 2, innerHeight / 2);
      else if (e.key === '0') animateTo(initialCam());
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
      if (active?.layer === layer) active = null;
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

  // The docked device drives the canvas: its list moves the camera; ATRÁS / INICIO go back home.
  const pick = (i: number) => api.current?.focus(i === 0 ? null : collections[i - 1].id);
  const onCommand = (c: Command) => {
    if (c === 'next') nav.move(1);
    else if (c === 'prev') nav.move(-1);
    else if (c === 'select') pick(nav.sel);
    else navigate('');
  };
  const zoomBy = (f: number) => {
    const c = cam.current,
      z = Math.min(Z_MAX, Math.max(Z_MIN, c.z * f));
    const px = innerWidth / 2,
      py = innerHeight / 2;
    api.current?.animateTo({ x: px - (px - c.x) * (z / c.z), y: py - (py - c.y) * (z / c.z), z });
  };

  return (
    <div className="canvas-page" data-page="canvas">
      <div className="canvas" ref={layerRef} data-canvas-layer aria-label={ui.canvas.label} role="region">
        <div className="world" ref={worldRef} data-world style={{ transform: camTransform(SSR_CAM) }}>
          {collections.map((c) => (
            <CollectionCard key={c.id} c={c} onFocus={() => api.current?.focus(c.id)} />
          ))}
          {projects.map((p) => (
            <ProjectCard key={p.slug} p={p} />
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
        <Device data-device="dock" onCommand={onCommand} globalKeys>
          <ListScreen
            title={ui.canvas.title}
            rows={DEVICE_ROWS}
            sel={nav.sel}
            onPick={(i) => (nav.setSel(i), pick(i))}
          />
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
          <button onClick={() => api.current?.focus(null)}>
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

      <section id="lista-proyectos" className="list-view" hidden={!listOpen} aria-label={ui.canvas.listTitle}>
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
                    <a href={href(`proyectos/${slug}/`)}>{p.title}</a>
                    <span>
                      {p.headline.value} {p.headline.label}
                    </span>
                  </li>
                );
              })}
              <li className="is-muted">
                {c.projectCount - c.projects.length} {ui.labels.more} · {ui.canvas.notWritten}
              </li>
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function CollectionCard({ c, onFocus }: { c: Collection; onFocus: () => void }) {
  return (
    <article
      className="card pile"
      data-card
      data-collection={c.id}
      style={{ left: c.canvas.x, top: c.canvas.y, width: c.canvas.w }}
      onClick={(e) => {
        if (!(e.target as Element).closest('a')) onFocus();
      }}
    >
      <div className="card__top">
        <span className="mono">{c.id}</span>
        <span>{c.kicker}</span>
      </div>
      <h2 className="card__title">{c.title}</h2>
      <div className="metric">
        <b>{c.headline.value}</b>
        <span>{c.headline.label}</span>
      </div>
      <footer>
        <span>
          <b>{c.projectCount}</b> {ui.labels.projectsWord}
        </span>
        {c.projects.map((slug) => (
          <a key={slug} href={href(`proyectos/${slug}/`)}>
            {projectBySlug(slug)!.shortTitle} →
          </a>
        ))}
      </footer>
    </article>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <a
      className="card card--project"
      data-card
      data-collection={p.collection}
      href={href(`proyectos/${p.slug}/`)}
      style={{ left: p.canvas.x, top: p.canvas.y, width: p.canvas.w }}
    >
      <div className="card__top">
        <span className="mono">{p.ref}</span>
        <span className={p.status === 'en-curso' ? 'is-ongoing' : ''}>{ui.status[p.status]}</span>
      </div>
      <h3 className="card__title">{p.shortTitle}</h3>
      <div className="metric">
        <b>{p.headline.value}</b>
        <span>{p.headline.label}</span>
      </div>
    </a>
  );
}
