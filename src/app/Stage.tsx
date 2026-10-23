import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { CanvasPage } from '../canvas/CanvasPage';
import type { SectionId } from '../content/site';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage, ProjectPage, SectionPage } from '../pages/Pages';
import { getTechnique } from '../transition/config';
import { startFrameMeter } from '../transition/metrics';
import { startScreenTransition, type SharedTransition, type Side } from '../transition/screenToCanvas';
import { prepareLeaveHome } from './leaveHome';
import { metaOf, opensFromScreen, pathOf, sameRoute, type Route } from './routes';

const HOME: Route = { kind: 'home' };
const sideOf = (r: Route): Side | null => (r.kind === 'home' ? 'home' : opensFromScreen(r) ? 'away' : null);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Renders the current route. Between home and the canvas or a docked section page it mounts both pages at
 * once and runs the shared screen transition; any other change is a plain page swap. The URL is the source
 * of truth: device keys, links and the browser's back/forward all arrive here as a new `route`.
 */
export function Stage({ route }: { route: Route }) {
  const [shown, setShown] = useState<Route[]>([route]);
  const [restoreCanvas, setRestoreCanvas] = useState(false);
  // Coming back from a section page, the home menu opens on that section.
  const [homeEntry, setHomeEntry] = useState<SectionId | undefined>(undefined);
  const shownRef = useRef(shown);
  const rootRef = useRef<HTMLDivElement>(null);
  const tr = useRef<SharedTransition | null>(null);
  const away = useRef<Route | null>(null); // the canvas or page of the running transition
  const startFrom = useRef<Side | null>(null);
  const leftScroll = useRef(0); // scroll of the page being left
  const finished = useRef<Side | null>(null);
  const focusPage = useRef(false);
  const waiting = useRef(0);

  useLayoutEffect(() => {
    shownRef.current = shown;
  });

  const swap = (next: Route) => {
    const cur = shownRef.current;
    setRestoreCanvas(next.kind === 'canvas' && cur[cur.length - 1]?.kind === 'project');
    setHomeEntry(undefined);
    focusPage.current = true;
    setShown([next]);
  };

  // A new route arrived (link, device, history).
  useLayoutEffect(() => {
    clearTimeout(waiting.current);
    const cur = shownRef.current;
    const side = sideOf(route);
    const t = tr.current;
    if (t) {
      if (route.kind === 'home') t.goTo('home');
      // e.g. browser Back mid-flight: reverse from where it is
      else if (away.current && sameRoute(route, away.current)) t.goTo('away');
      else {
        t.abort();
        tr.current = null;
        away.current = null;
        swap(route);
      }
      return;
    }
    if (cur.length === 1 && sameRoute(cur[0], route)) return;
    const curSide = cur.length === 1 ? sideOf(cur[0]) : null;
    if (curSide && side && curSide !== side) {
      const awayRoute = curSide === 'away' ? cur[0] : route;
      // ?tecnica=vt: E3 comparison of the canvas transition only
      if (getTechnique() === 'vt' && document.startViewTransition && awayRoute.kind === 'canvas') {
        const meter = startFrameMeter();
        const vt = document.startViewTransition(() => flushSync(() => setShown([route])));
        vt.finished.finally(() => meter.stop(curSide === 'home' ? 'pantalla→lienzo' : 'lienzo→pantalla', 730));
        return;
      }
      leftScroll.current = window.scrollY;
      const begin = () => {
        away.current = awayRoute;
        startFrom.current = curSide;
        setHomeEntry(awayRoute.kind === 'page' ? awayRoute.id : undefined);
        setShown([HOME, awayRoute]); // home underneath, destination on top
      };
      const wait = curSide === 'home' ? prepareLeaveHome() : 0;
      if (wait) waiting.current = window.setTimeout(begin, wait);
      else begin();
      return;
    }
    swap(route);
  }, [route]);

  // After React has committed the pages: start the transition, or finish it.
  useLayoutEffect(() => {
    if (startFrom.current && shown.length === 2) {
      const from = startFrom.current;
      startFrom.current = null;
      tr.current = startScreenTransition(rootRef.current!, from, {
        reduced: reducedMotion(),
        scrollY: leftScroll.current,
        onDone: (side) => {
          finished.current = side;
          setShown([side === 'home' ? HOME : away.current!]);
        },
      });
    } else if (finished.current && shown.length === 1) {
      const side = finished.current;
      finished.current = null;
      tr.current?.cleanup(side);
      tr.current = null;
      away.current = null;
      // keyboard flow continues on the device of the destination
      rootRef.current?.querySelector<HTMLElement>(`[data-device="${side === 'home' ? 'hero' : 'dock'}"]`)?.focus({
        preventScroll: true,
      });
    } else if (focusPage.current && shown.length === 1) {
      focusPage.current = false;
      window.scrollTo(0, 0);
      rootRef.current?.querySelector<HTMLElement>('#contenido')?.focus({ preventScroll: true });
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
