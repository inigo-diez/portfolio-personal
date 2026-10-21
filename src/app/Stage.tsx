import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { CanvasPage } from '../canvas/CanvasPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage, ProjectPage, SectionPage } from '../pages/Pages';
import { getTechnique } from '../transition/config';
import { startFrameMeter } from '../transition/metrics';
import { startScreenToCanvas, type SharedTransition, type Side } from '../transition/screenToCanvas';
import { metaOf, pathOf, sameRoute, type Route } from './routes';

const sideOf = (r: Route): Side | null => (r.kind === 'home' ? 'home' : r.kind === 'canvas' ? 'canvas' : null);
const ROUTE_OF: Record<Side, Route> = { home: { kind: 'home' }, canvas: { kind: 'canvas' } };
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Renders the current route. Between home and the canvas it mounts both pages at once and runs the
 * shared screen ↔ canvas transition; any other change is a plain page swap. The URL is the source of
 * truth: device keys, links and the browser's back/forward all arrive here as a new `route`.
 */
export function Stage({ route }: { route: Route }) {
  const [shown, setShown] = useState<Route[]>([route]);
  const [restoreCanvas, setRestoreCanvas] = useState(false);
  const shownRef = useRef(shown);
  const rootRef = useRef<HTMLDivElement>(null);
  const tr = useRef<SharedTransition | null>(null);
  const startFrom = useRef<Side | null>(null);
  const finished = useRef<Side | null>(null);
  const focusPage = useRef(false);

  useLayoutEffect(() => {
    shownRef.current = shown;
  });

  const swap = (next: Route) => {
    const cur = shownRef.current;
    setRestoreCanvas(next.kind === 'canvas' && cur[cur.length - 1]?.kind === 'project');
    focusPage.current = true;
    setShown([next]);
  };

  // A new route arrived (link, device, history).
  useLayoutEffect(() => {
    const cur = shownRef.current;
    const side = sideOf(route);
    const t = tr.current;
    if (t) {
      if (side) t.goTo(side); // e.g. browser Back mid-flight: reverse from where it is
      else {
        t.abort();
        tr.current = null;
        swap(route);
      }
      return;
    }
    if (cur.length === 1 && sameRoute(cur[0], route)) return;
    const curSide = cur.length === 1 ? sideOf(cur[0]) : null;
    if (curSide && side && curSide !== side) {
      if (getTechnique() === 'vt' && document.startViewTransition) {
        const meter = startFrameMeter();
        const vt = document.startViewTransition(() => flushSync(() => setShown([route])));
        vt.finished.finally(() => meter.stop(curSide === 'home' ? 'pantalla→lienzo' : 'lienzo→pantalla', 730));
        return;
      }
      startFrom.current = curSide;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the route drives an imperative animation that must be set up before paint
      setShown([ROUTE_OF.home, ROUTE_OF.canvas]); // home underneath, canvas on top
      return;
    }
    swap(route);
  }, [route]);

  // After React has committed the pages: start the transition, or finish it.
  useLayoutEffect(() => {
    if (startFrom.current && shown.length === 2) {
      const from = startFrom.current;
      startFrom.current = null;
      tr.current = startScreenToCanvas(rootRef.current!, from, {
        reduced: reducedMotion(),
        onDone: (side) => {
          finished.current = side;
          setShown([ROUTE_OF[side]]);
        },
      });
    } else if (finished.current && shown.length === 1) {
      const side = finished.current;
      finished.current = null;
      tr.current?.cleanup(side);
      tr.current = null;
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
        <PageView key={pathOf(r)} route={r} restoreCanvas={restoreCanvas} />
      ))}
    </div>
  );
}

function PageView({ route, restoreCanvas }: { route: Route; restoreCanvas: boolean }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />;
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
