// Signature transition: the device screen becomes the canvas or a section page (and back).
// Engine and technique: shared.ts.
//
// Layering: the device body travels ABOVE the destination (it ends docked on top of it). The aluminium plate
// has a hole behind the screen, so when the screen content fades out the destination underneath shows
// through: the screen image literally is the canvas (or the page), which then grows while the body docks.
// Canvas: the camera is interpolated. Page: it is shown at a uniform scale that makes it exactly as wide as
// the window (a miniature of the real page).

import { MOBILE } from '../app/useMedia';
import { getCanvas } from '../canvas/CanvasPage';
import type { Cam } from '../canvas/camera';
import {
  clamp01,
  lerp,
  pageDestination,
  rectOf,
  resetFrame,
  runShared,
  windowTargets,
  type Destination,
  type Props,
  type Rect,
  type SharedTransition,
  type Side,
  type Target,
} from './shared';

/** The canvas: the camera goes from "everything inside the screen" to the initial (or current) one. */
function canvasDestination(from: Side, S: Rect): Destination {
  const ctrl = getCanvas()!;
  const { layer, world } = ctrl;
  const V = { w: layer.clientWidth, h: layer.clientHeight };
  const camEnd: Cam = from === 'home' ? ctrl.initialCam() : ctrl.getCam(); // leaving: from wherever it is
  const camMini = ctrl.fitWindow(S.w, S.h);
  const cS = { x: (S.w / 2 - camMini.x) / camMini.z, y: (S.h / 2 - camMini.y) / camMini.z };
  const cE = ctrl.centre(camEnd);
  const r0 = camMini.z / S.w; // content scale relative to the window width…
  const r1 = camEnd.z / V.w; // …interpolated linearly, so the composition stays steady while it grows
  layer.style.transformOrigin = '0 0';
  return {
    layer,
    world,
    V,
    worldAt: (g, Ww, Wh) => {
      const z = Ww * lerp(r0, r1, g);
      const cx = lerp(cS.x, cE.x, g),
        cy = lerp(cS.y, cE.y, g);
      const ox = Ww / 2 - cx * z,
        oy = Wh / 2 - cy * z;
      return `scale(${V.w / Ww}, ${V.h / Wh}) translate(${ox}px, ${oy}px) scale(${z})`;
    },
    settle: (side) => {
      if (side === 'away') ctrl.setCam(camEnd); // bake the final camera before dropping the animation
    },
    reset: () => {
      layer.style.transformOrigin = '';
    },
  };
}

/** The docked device that is on screen (a page on a phone can hold a second, hidden one). */
export const visibleDock = (page: HTMLElement) =>
  [...page.querySelectorAll<HTMLElement>('[data-device="dock"]')].find((d) => d.offsetParent !== null) ?? null;

export function startScreenTransition(
  root: HTMLElement,
  from: Side,
  opts: { reduced: boolean; scrollY: number; onDone: (side: Side) => void },
): SharedTransition {
  const home = root.querySelector<HTMLElement>(':scope > [data-page="home"]')!;
  const awayPage = root.querySelector<HTMLElement>(':scope > [data-page]:not([data-page="home"])')!;
  const hero = home.querySelector<HTMLElement>('[data-device="hero"]')!;
  const heroScreen = hero.querySelector<HTMLElement>('[data-screen]')!;
  const heroDim = hero.querySelector<HTMLElement>('[data-dim]')!;
  const homeChrome = [...home.querySelectorAll<HTMLElement>('[data-chrome]')];
  // On phones the projects are a list page, not the canvas.
  const isCanvas = awayPage.dataset.page === 'canvas' && !matchMedia(MOBILE).matches;
  const awayChrome = isCanvas ? [...awayPage.querySelectorAll<HTMLElement>('[data-chrome]')] : [];

  root.dataset.transitioning = '';
  if (!isCanvas && from === 'away') window.scrollTo(0, 0); // the home comes back at its top; the page window keeps its scroll
  const dock = visibleDock(awayPage)!;
  dock.style.visibility = 'hidden';
  hero.style.zIndex = '20'; // the body travels above the destination

  // ── Measure (nothing is transformed yet) ──
  const devR = rectOf(hero);
  const S = rectOf(heroScreen);
  const D = rectOf(dock);
  // On phones the projects route is the list page nested in the canvas page: that is what grows.
  const pageEl = awayPage.querySelector<HTMLElement>(':scope > .canvas-page__mobile > .layered') ?? awayPage;
  const dest = isCanvas ? canvasDestination(from, S) : pageDestination(pageEl, from, opts.scrollY);
  // On phones the docked device sits in the page and scrolls with it (on desktop it is fixed in the corner).
  if (!isCanvas && from === 'away' && getComputedStyle(dock.parentElement!).position !== 'fixed') D.y -= opts.scrollY;
  const kD = D.w / devR.w;
  const frame = (isCanvas ? awayPage : pageEl).querySelector<HTMLElement>('[data-screen-frame]')!;

  // ── The whole choreography as a function of (g, s) ──
  const fadeOut = (el: HTMLElement): Target => [el, (g) => ({ opacity: 1 - clamp01(g / 0.3) })];
  const fadeIn = (el: HTMLElement): Target => [el, (g): Props => ({ opacity: clamp01((g - 0.7) / 0.3) })];
  const targets: Target[] = [
    ...windowTargets(dest, frame, S),
    [
      hero,
      (g) => ({
        transform: `translate(${(D.x - devR.x) * g}px, ${(D.y - devR.y) * g}px) scale(${lerp(1, kD, g)})`,
      }),
    ],
    [heroScreen, (_g, s) => ({ opacity: 1 - s })],
    [heroDim, (g) => ({ opacity: clamp01(g / 0.22) })], // the screen switches off as the body leaves
    ...homeChrome.map(fadeOut),
    ...awayChrome.map(fadeIn),
  ];
  hero.style.transformOrigin = '0 0';

  return runShared(root, from, opts, {
    targets,
    fade: awayPage,
    onReduced: () => {
      dock.style.visibility = '';
      hero.style.zIndex = '';
      // a page left while scrolled keeps showing that scroll while it fades (no jump to its top); scrolling
      // the window, not transforming the page, so the fixed docked device stays in its corner
      if (!isCanvas) dest.layer.scrollTop = from === 'away' ? opts.scrollY : 0;
    },
    settle: dest.settle,
    reset: () => {
      dock.style.visibility = '';
      hero.style.zIndex = '';
      hero.style.transformOrigin = '';
      resetFrame(frame);
      dest.reset();
    },
    land: (side, reduced) => {
      dest.land?.(side);
      if (side === 'away' && !reduced) {
        dock.classList.add('is-waking'); // the docked screen powers on
        setTimeout(() => dock.classList.remove('is-waking'), 500);
      }
    },
    label: isCanvas ? ['pantalla→lienzo', 'lienzo→pantalla'] : ['pantalla→página', 'página→pantalla'],
  });
}
