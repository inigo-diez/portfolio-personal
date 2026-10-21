// Signature transition: the device screen becomes the canvas (and back).
//
// Technique: FLIP with precomputed keyframes on the Web Animations API.
//  • First/Last: measure the screen rect (S), the viewport (V), the hero device and the dock slot.
//  • Invert: the canvas layer is transformed so that it covers exactly S; the world inside it carries the
//    inverse (compensated) scale, so cards never stretch even though the window goes from 4:3 to the
//    viewport's ratio.
//  • Play: every frame of the path is sampled in JS once (~60 per second), then handed to WAAPI as
//    linear keyframes. Only `transform` and `opacity` animate, so the compositor runs it without the main
//    thread; the counter-scale stays exact at every sample.
//  • Interruptible: the whole choreography is a function of two numbers — g (geometry, 0 = screen,
//    1 = canvas) and s (screen content hidden, 0 → 1). Retargeting reads (g, s) at the current time and
//    plans a new path from there, so going back mid-flight is continuous.
//
// Layering: the device body travels ABOVE the canvas (it ends docked on top of it). The aluminium plate
// has a hole behind the screen, so when the screen content fades out the canvas underneath shows through:
// the screen image literally is the canvas, which then grows while the body docks.

import { getCanvas } from '../canvas/CanvasPage';
import type { Cam } from '../canvas/camera';
import { startFrameMeter, type FrameStats } from './metrics';

export type Side = 'home' | 'canvas';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DUR_SCREEN = 110; // crossfade OS → canvas inside the screen (ms)
const DUR_GEOM = 620; // screen grows into the canvas while the body docks (ms)
const DUR_REDUCED = 200; // prefers-reduced-motion: plain crossfade
const FPS = 60;

// Standard easing: gentle departure, long settle (feels like a weight coming to rest).
const easeGeom = cubicBezier(0.2, 0, 0, 1);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};

export interface SharedTransition {
  target: Side;
  goTo(side: Side): void;
  /** Stop now (no commit): used when navigating to a third route mid-flight. */
  abort(): void;
  /** After React has committed the final page: drop animations, bake the final state. */
  cleanup(side: Side): void;
  stats: FrameStats[];
}

export function startScreenToCanvas(
  root: HTMLElement,
  from: Side,
  opts: { reduced: boolean; onDone: (side: Side) => void },
): SharedTransition {
  const home = root.querySelector<HTMLElement>('[data-page="home"]')!;
  const canvasPage = root.querySelector<HTMLElement>('[data-page="canvas"]')!;
  const hero = home.querySelector<HTMLElement>('[data-device="hero"]')!;
  const heroScreen = hero.querySelector<HTMLElement>('[data-screen]')!;
  const heroDim = hero.querySelector<HTMLElement>('[data-dim]')!;
  const dock = canvasPage.querySelector<HTMLElement>('[data-device="dock"]')!;
  const homeChrome = [...home.querySelectorAll<HTMLElement>('[data-chrome]')];
  const canvasChrome = [...canvasPage.querySelectorAll<HTMLElement>('[data-chrome]')];
  const ctrl = getCanvas()!;
  const { layer, world } = ctrl;

  root.dataset.transitioning = '';
  dock.style.visibility = 'hidden';
  hero.style.zIndex = '20'; // the body travels above the canvas

  // ── Measure (nothing is transformed yet) ──
  const V = { w: layer.clientWidth, h: layer.clientHeight };
  const devR = rectOf(hero);
  const S = rectOf(heroScreen);
  const D = rectOf(dock);
  const camEnd: Cam = from === 'home' ? ctrl.initialCam() : ctrl.getCam(); // leaving: from wherever the user is
  const camMini = ctrl.fitWindow(S.w, S.h);
  const cS = { x: (S.w / 2 - camMini.x) / camMini.z, y: (S.h / 2 - camMini.y) / camMini.z };
  const cE = ctrl.centre(camEnd);
  const r0 = camMini.z / S.w; // content scale relative to the window width…
  const r1 = camEnd.z / V.w; // …interpolated linearly, so the composition stays steady while it grows
  const kD = D.w / devR.w;

  // ── The whole choreography as a function of (g, s) ──
  type Props = { transform?: string; opacity?: number };
  const win = (g: number): Rect => ({ x: lerp(S.x, 0, g), y: lerp(S.y, 0, g), w: lerp(S.w, V.w, g), h: lerp(S.h, V.h, g) });
  const frame = canvasPage.querySelector<HTMLElement>('[data-canvas-frame]')!;
  const edge = (e: string) => frame.querySelector<HTMLElement>(`[data-edge="${e}"]`)!;
  const targets: [HTMLElement, (g: number, s: number) => Props][] = [
    [
      layer,
      (g) => {
        const W = win(g);
        return { transform: `translate(${W.x}px, ${W.y}px) scale(${W.w / V.w}, ${W.h / V.h})` };
      },
    ],
    // Thin grey outline of the growing screen, so it reads as the screen becoming the canvas (white on
    // white otherwise hides its edge). Appears as soon as it leaves the bezel, fades out before the end.
    [frame, (g) => ({ opacity: clamp01(g / 0.04) * (1 - clamp01((g - 0.8) / 0.17)) })],
    [edge('t'), (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y}px) scale(${win(g).w / V.w}, 1)` })],
    [edge('b'), (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y + win(g).h - 1}px) scale(${win(g).w / V.w}, 1)` })],
    [edge('l'), (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y}px) scale(1, ${win(g).h / V.h})` })],
    [edge('r'), (g) => ({ transform: `translate(${win(g).x + win(g).w - 1}px, ${win(g).y}px) scale(1, ${win(g).h / V.h})` })],
    [
      world,
      (g) => {
        const Ww = lerp(S.w, V.w, g),
          Wh = lerp(S.h, V.h, g);
        const z = Ww * lerp(r0, r1, g);
        const cx = lerp(cS.x, cE.x, g),
          cy = lerp(cS.y, cE.y, g);
        const ox = Ww / 2 - cx * z,
          oy = Wh / 2 - cy * z;
        return { transform: `scale(${V.w / Ww}, ${V.h / Wh}) translate(${ox}px, ${oy}px) scale(${z})` };
      },
    ],
    [
      hero,
      (g) => ({
        transform: `translate(${(D.x - devR.x) * g}px, ${(D.y - devR.y) * g}px) scale(${lerp(1, kD, g)})`,
      }),
    ],
    [heroScreen, (_g, s) => ({ opacity: 1 - s })],
    [heroDim, (g) => ({ opacity: clamp01(g / 0.22) })], // the screen switches off as the body leaves
    ...homeChrome.map((el) => [el, (g: number) => ({ opacity: 1 - clamp01(g / 0.3) })] as [HTMLElement, (g: number) => Props]),
    ...canvasChrome.map(
      (el) => [el, (g: number) => ({ opacity: clamp01((g - 0.7) / 0.3) })] as [HTMLElement, (g: number) => Props],
    ),
  ];
  hero.style.transformOrigin = '0 0';
  layer.style.transformOrigin = '0 0';

  let anims: Animation[] = [];
  let samples: { t: number; g: number; s: number }[] = [];
  let total = 0;
  let meter = startFrameMeter();
  const stats: FrameStats[] = [];
  let done = false;

  const api: SharedTransition = { target: from === 'home' ? 'canvas' : 'home', goTo, abort, cleanup, stats };

  function stateNow() {
    if (!anims.length || !samples.length) return from === 'home' ? { g: 0, s: 0 } : { g: 1, s: 1 };
    const t = Math.min(total, Number(anims[0].currentTime ?? 0));
    let i = 1;
    while (i < samples.length - 1 && samples[i].t < t) i++;
    const a = samples[i - 1],
      b = samples[i];
    const k = b.t === a.t ? 1 : clamp01((t - a.t) / (b.t - a.t));
    return { g: lerp(a.g, b.g, k), s: lerp(a.s, b.s, k) };
  }

  // Plan a path from the current (g, s) to a side, sampled at 60 fps.
  function plan(g0: number, s0: number, to: Side) {
    const out: { t: number; g: number; s: number }[] = [{ t: 0, g: g0, s: s0 }];
    let t = 0;
    const seg = (dur: number, f: (u: number) => { g: number; s: number }) => {
      const n = Math.max(2, Math.ceil((dur / 1000) * FPS));
      for (let i = 1; i <= n; i++) {
        const u = i / n;
        out.push({ t: t + dur * u, ...f(u) });
      }
      t += dur;
    };
    if (to === 'canvas') {
      if (s0 < 1) seg(DUR_SCREEN * (1 - s0), (u) => ({ g: g0, s: lerp(s0, 1, u) }));
      if (g0 < 1) seg(DUR_GEOM * Math.max(0.4, 1 - g0), (u) => ({ g: lerp(g0, 1, easeGeom(u)), s: 1 }));
    } else {
      if (g0 > 0) seg(DUR_GEOM * Math.max(0.4, g0), (u) => ({ g: lerp(g0, 0, easeGeom(u)), s: s0 }));
      if (s0 > 0) seg(DUR_SCREEN * s0, (u) => ({ g: 0, s: lerp(s0, 0, u) }));
    }
    return { samples: out, total: Math.max(t, 1) };
  }

  let firstPlay = true;
  function play(to: Side) {
    const cur = stateNow();
    const pageOpacity = firstPlay ? (from === 'home' ? 0 : 1) : Number(getComputedStyle(canvasPage).opacity);
    firstPlay = false;
    anims.forEach((a) => a.cancel()); // replaced in the same task: no frame is drawn in between
    anims = [];
    api.target = to;
    if (opts.reduced) {
      // Short crossfade, no movement.
      total = DUR_REDUCED;
      samples = [];
      dock.style.visibility = '';
      hero.style.zIndex = '';
      anims = [canvasPage.animate([{ opacity: pageOpacity }, { opacity: to === 'canvas' ? 1 : 0 }], { duration: total, fill: 'both' })];
    } else {
      const p = plan(cur.g, cur.s, to);
      samples = p.samples;
      total = p.total;
      for (const [el, f] of targets) {
        const kf = samples.map((sm) => ({ offset: sm.t / total, ...f(sm.g, sm.s) }));
        anims.push(el.animate(kf as Keyframe[], { duration: total, fill: 'both', easing: 'linear' }));
      }
    }
    const mine = anims;
    Promise.all(mine.map((a) => a.finished)).then(
      () => {
        if (mine !== anims || done) return; // superseded by a retarget
        done = true;
        stats.push(meter.stop(`${from === 'home' ? 'pantalla→lienzo' : 'lienzo→pantalla'}${opts.reduced ? ' (reducido)' : ''}`, total));
        opts.onDone(to);
      },
      () => {}, // cancelled
    );
  }

  function goTo(side: Side) {
    if (done || side === api.target) return;
    stats.push(meter.stop('interrumpida', total));
    meter = startFrameMeter();
    play(side);
  }

  function abort() {
    done = true;
    meter.stop('abortada', total);
    anims.forEach((a) => a.cancel());
    reset();
  }

  function reset() {
    delete root.dataset.transitioning;
    dock.style.visibility = '';
    hero.style.zIndex = '';
    hero.style.transformOrigin = '';
    layer.style.transformOrigin = '';
  }

  function cleanup(side: Side) {
    if (side === 'canvas') ctrl.setCam(camEnd); // bake the final camera before dropping the animation
    anims.forEach((a) => a.cancel());
    anims = [];
    reset();
    if (side === 'canvas' && !opts.reduced) {
      dock.classList.add('is-waking'); // the docked screen powers on
      setTimeout(() => dock.classList.remove('is-waking'), 500);
    }
  }

  play(api.target);
  return api;
}

/** CSS-style cubic-bezier easing (x/y control points), solved with Newton + bisection. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x,
        d = dx(t);
      if (Math.abs(e) < 1e-6) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0,
      hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sx(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}
