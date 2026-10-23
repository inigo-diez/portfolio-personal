import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { canvasListScroll, CanvasPage, liveCanvasLayer } from '../canvas/CanvasPage';
import type { SectionId } from '../content/site';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage, ProjectPage, SectionPage } from '../pages/Pages';
import { startCardTransition } from '../transition/cardToPage';
import { getTechnique } from '../transition/config';
import { startFrameMeter } from '../transition/metrics';
import { startScreenTransition, visibleDock } from '../transition/screenToCanvas';
import type { SharedTransition, Side } from '../transition/shared';
import { OPEN_EVENT, peekOpenOnHome, takeOpenOnHome } from './intent';
import { prepareLeave } from './leave';
import { metaOf, opensFromScreen, pathOf, sameRoute, type Route } from './routes';
import { MOBILE } from './useMedia';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Two routes joined by a shared transition: `near` is where it starts small (home: the device screen;
 * canvas: a card), `far` is what it grows into (the canvas or a docked page; the project's case study).
 */
interface Pair {
  kind: 'screen' | 'card';
  near: Route;
  far: Route;
}
function pairOf(a: Route, b: Route): Pair | null {
  for (const [x, y] of [
    [a, b],
    [b, a],
  ]) {
    if (x.kind === 'home' && opensFromScreen(y)) return { kind: 'screen', near: x, far: y };
    // The cover grows into its case study and the page shrinks back into it; not on phones (the projects are
    // a list there) and not from the List view (the covers are behind it).
    if (x.kind === 'canvas' && y.kind === 'project' && !matchMedia(MOBILE).matches) {
      if (a !== x || document.querySelector('#lista-proyectos[hidden]')) return { kind: 'card', near: x, far: y };
    }
  }
  return null;
}

/** Where the keyboard continues once a transition has landed. */
function focusAfter(root: HTMLElement, p: Pair, side: Side) {
  let el: HTMLElement | null;
  if (p.kind === 'card')
    el =
      side === 'away'
        ? root.querySelector('#contenido')
        : root.querySelector(`[data-slug="${p.far.kind === 'project' ? p.far.slug : ''}"] button`);
  else if (side === 'home') el = root.querySelector('[data-device="hero"]');
  else {
    // the canvas takes the arrows itself (they pan it); a page continues on its docked device
    el = liveCanvasLayer(root) ?? visibleDock(root);
  }
  el?.focus({ preventScroll: true });
}

/**
 * Renders the current route. Between the two routes of a Pair it mounts both pages at once and runs their
 * shared transition; any other change is a plain page swap. The URL is the source of truth: device keys,
 * links and the browser's back/forward all arrive here as a new `route`.
 */
export function Stage({ route }: { route: Route }) {
  const [shown, setShown] = useState<Route[]>([route]);
  const [restoreCanvas, setRestoreCanvas] = useState(false);
  // Coming back from a section page, the home menu opens on that section.
  const [homeEntry, setHomeEntry] = useState<SectionId | undefined>(undefined);
  const shownRef = useRef(shown);
  const rootRef = useRef<HTMLDivElement>(null);
  const tr = useRef<SharedTransition | null>(null);
  const pair = useRef<Pair | null>(null); // the pair of the running transition
  const startFrom = useRef<Side | null>(null);
  const leftScroll = useRef(0); // scroll of the page being left
  const finished = useRef<Side | null>(null);
  const focusPage = useRef(false);
  const backToList = useRef(false); // a plain change back to the canvas from a case study (phones: the list)
  const waiting = useRef(0);

  useLayoutEffect(() => {
    shownRef.current = shown;
  });

  const swap = (next: Route) => {
    const cur = shownRef.current;
    backToList.current = next.kind === 'canvas' && cur[cur.length - 1]?.kind === 'project';
    setRestoreCanvas(backToList.current);
    setHomeEntry(undefined);
    focusPage.current = true;
    setShown([next]);
  };

  // A new route arrived (link, device, history).
  useLayoutEffect(() => {
    clearTimeout(waiting.current);
    if (route.kind !== 'home') takeOpenOnHome(); // opening Mi musica at home only holds on the way home
    const cur = shownRef.current;
    const t = tr.current;
    if (t) {
      const p = pair.current!;
      // e.g. browser Back mid-flight: reverse from where it is
      if (sameRoute(route, p.near)) t.goTo('home');
      else if (sameRoute(route, p.far)) t.goTo('away');
      else {
        t.abort();
        tr.current = null;
        pair.current = null;
        finished.current = null; // it may have landed in the same tick: nothing left to finish
        swap(route);
      }
      return;
    }
    if (cur.length === 1 && sameRoute(cur[0], route)) return;
    const p = cur.length === 1 ? pairOf(cur[0], route) : null;
    if (p) {
      const from: Side = sameRoute(cur[0], p.near) ? 'home' : 'away';
      // ?tecnica=vt: E3 comparison of the canvas transition only
      if (getTechnique() === 'vt' && document.startViewTransition && p.far.kind === 'canvas') {
        const meter = startFrameMeter();
        const vt = document.startViewTransition(() => flushSync(() => setShown([route])));
        vt.finished.finally(() => meter.stop(from === 'home' ? 'pantalla→lienzo' : 'lienzo→pantalla', 730));
        return;
      }
      leftScroll.current = window.scrollY;
      const begin = () => {
        pair.current = p;
        startFrom.current = from;
        setHomeEntry(peekOpenOnHome() ?? (p.far.kind === 'page' ? p.far.id : undefined));
        setRestoreCanvas(p.kind === 'card'); // back from a project, the canvas is where it was left
        setShown([p.near, p.far]); // the small side underneath, the one that grows on top
      };
      const wait = p.kind === 'screen' ? prepareLeave(from) : 0;
      if (wait) waiting.current = window.setTimeout(begin, wait);
      else begin();
      return;
    }
    swap(route);
  }, [route]);

  // After React has committed the pages: start the transition, or finish it.
  useLayoutEffect(() => {
    const root = rootRef.current!;
    if (startFrom.current && shown.length === 2) {
      const from = startFrom.current;
      startFrom.current = null;
      const p = pair.current!;
      const opts = {
        reduced: reducedMotion(),
        scrollY: leftScroll.current,
        onDone: (side: Side) => {
          finished.current = side;
          setShown([side === 'home' ? p.near : p.far]);
        },
      };
      tr.current =
        p.kind === 'screen'
          ? startScreenTransition(root, from, opts)
          : startCardTransition(root, from, p.far.kind === 'project' ? p.far.slug : '', opts);
    } else if (finished.current && shown.length === 1 && pair.current) {
      const side = finished.current;
      const p = pair.current;
      finished.current = null;
      tr.current?.cleanup(side);
      tr.current = null;
      focusAfter(root, p, side);
      // something chosen on a docked device to open at home (Mi música): only once it has landed there
      const intent = takeOpenOnHome();
      if (intent && side === 'home' && p.kind === 'screen')
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: intent }));
      pair.current = null;
    } else if (focusPage.current && shown.length === 1) {
      focusPage.current = false;
      // back from a case study on a phone, the projects list returns to where it was read
      window.scrollTo(0, backToList.current ? canvasListScroll() : 0);
      // the canvas takes the keyboard itself on desktop; any other page, its content
      (liveCanvasLayer(root) ?? root.querySelector<HTMLElement>('#contenido'))?.focus({ preventScroll: true });
    }
  }, [shown]);

  // Per-route title and description (the prerendered HTML already has them on first load).
  useEffect(() => {
    if (shown.length !== 1) return;
    const m = metaOf(shown[0]);
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
  }, [shown]);

  return (
    <div ref={rootRef} className="stage">
      {shown.map((r) => (
        <PageView key={pathOf(r)} route={r} restoreCanvas={restoreCanvas} homeEntry={homeEntry} />
      ))}
    </div>
  );
}

function PageView({
  route,
  restoreCanvas,
  homeEntry,
}: {
  route: Route;
  restoreCanvas: boolean;
  homeEntry?: SectionId;
}) {
  switch (route.kind) {
    case 'home':
      return <HomePage entry={homeEntry} />;
    case 'canvas':
      return <CanvasPage restore={restoreCanvas} />;
    case 'project':
      return <ProjectPage slug={route.slug} />;
    case 'page':
      return <SectionPage id={route.id} />;
    case 'notfound':
      return <NotFoundPage />;
  }
}
