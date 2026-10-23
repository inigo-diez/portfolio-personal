// Engine shared by the two growing transitions: the device screen into the canvas or a page
// (screenToCanvas.ts) and a canvas card into its case study (cardToPage.ts).
//
// Technique: FLIP with precomputed keyframes on the Web Animations API.
//  • First/Last: measure the source rect (the screen, the card) and the destination at full size.
//  • Invert: the destination's layer is transformed so that it covers exactly the source; the world inside
//    it carries the inverse (compensated) scale, so content never stretches even though the window changes
//    its aspect ratio on the way.
//  • Play: every frame of the path is sampled in JS once (~60 per second), then handed to WAAPI as linear
//    keyframes. Only `transform` and `opacity` animate, so the compositor runs it without the main thread;
//    the counter-scale stays exact at every sample.
//  • Interruptible: the whole choreography is a function of two numbers — g (geometry, 0 = source,
//    1 = destination) and s (source content hidden, 0 → 1). Retargeting reads (g, s) at the current time
//    and plans a new path from there, so going back mid-flight is continuous.

import { startFrameMeter, type FrameStats } from './metrics';

/** home = the source side (the home device, or the canvas card); away = the destination at full size. */
export type Side = 'home' | 'away';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Size {
  w: number;
  h: number;
}
export type Props = { transform?: string; opacity?: number };
export type Target = [HTMLElement, (g: number, s: number) => Props];

const DUR_SCREEN = 110; // crossfade source → destination inside the source (ms)
const DUR_GEOM = 620; // the window grows into the destination (ms)
const DUR_REDUCED = 200; // prefers-reduced-motion: plain crossfade
const FPS = 60;

// Standard easing: gentle departure, long settle (feels like a weight coming to rest).
const easeGeom = cubicBezier(0.2, 0, 0, 1);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rectOf = (el: Element): Rect => {
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

/** What a transition provides to the engine. */
export interface Choreography {
  targets: Target[];
  /** With reduced motion: the element that crossfades in (the destination page). */
  fade: HTMLElement;
  /** With reduced motion, before the crossfade starts. */
  onReduced?(): void;
  /** Bake the final state before the animations are dropped. */
  settle?(side: Side): void;
  /** Remove the inline styles the transition needed. */
  reset(): void;
  /** Once the layout is normal again (the page no longer a fixed window): restore its scroll, wake the dock. */
  land?(side: Side, reduced: boolean): void;
  /** Labels for the frame meter: [home → away, away → home]. */
  label: [string, string];
}

/** The caller sets `root.dataset.transitioning` before measuring (layered pages become a fixed window then). */
export function runShared(
  root: HTMLElement,
  from: Side,
  opts: { reduced: boolean; onDone: (side: Side) => void },
  ch: Choreography,
): SharedTransition {
  let anims: Animation[] = [];
  let samples: { t: number; g: number; s: number }[] = [];
  let total = 0;
  let meter = startFrameMeter();
  const stats: FrameStats[] = [];
  let done = false;

  const api: SharedTransition = { target: from === 'home' ? 'away' : 'home', goTo, abort, cleanup, stats };

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
    if (to === 'away') {
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
    const fadeFrom = firstPlay ? (from === 'home' ? 0 : 1) : Number(getComputedStyle(ch.fade).opacity);
    const reducedStart = firstPlay;
    firstPlay = false;
    anims.forEach((a) => a.cancel()); // replaced in the same task: no frame is drawn in between
    anims = [];
    api.target = to;
    if (opts.reduced) {
      // Short crossfade, no movement.
      total = DUR_REDUCED;
      samples = [];
      if (reducedStart) ch.onReduced?.();
      anims = [
        ch.fade.animate([{ opacity: fadeFrom }, { opacity: to === 'away' ? 1 : 0 }], { duration: total, fill: 'both' }),
      ];
    } else {
      const p = plan(cur.g, cur.s, to);
      samples = p.samples;
      total = p.total;
      for (const [el, f] of ch.targets) {
        const kf = samples.map((sm) => ({ offset: sm.t / total, ...f(sm.g, sm.s) }));
        anims.push(el.animate(kf as Keyframe[], { duration: total, fill: 'both', easing: 'linear' }));
      }
    }
    const mine = anims;
    Promise.all(mine.map((a) => a.finished)).then(
      () => {
        if (mine !== anims || done) return; // superseded by a retarget
        done = true;
        stats.push(meter.stop(`${ch.label[from === 'home' ? 0 : 1]}${opts.reduced ? ' (reducido)' : ''}`, total));
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
    ch.reset();
  }

  function cleanup(side: Side) {
    ch.settle?.(side);
    anims.forEach((a) => a.cancel());
    anims = [];
    reset();
    ch.land?.(side, opts.reduced);
  }

  play(api.target);
  return api;
}

/** Width of a classic scrollbar (0 with overlay scrollbars, as on phones). */
function scrollbarWidth() {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;top:-999px;width:100px;height:100px;overflow:scroll';
  document.body.append(probe);
  const w = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return w;
}

/** A destination the window grows into: its layer (the window) and the world inside it. */
export interface Destination {
  layer: HTMLElement;
  world: HTMLElement;
  /** Size of the layer at full size. */
  V: Size;
  /** Transform of `world` when the window is Ww × Wh at geometry g. */
  worldAt(g: number, Ww: number, Wh: number): string;
  settle?(side: Side): void;
  reset(): void;
  land?(side: Side): void;
}

/**
 * A layered page (PageShell with `layered`). While a transition runs ([data-transitioning]), its layer is a
 * fixed window over the page underneath (page.css); the page inside is shown at a uniform scale, so its text
 * never stretches. Leaving a page that was scrolled, the window shows that scroll and eases it back to the top
 * as it shrinks; if it comes back, the scroll is restored.
 */
export function pageDestination(page: HTMLElement, from: Side, scrollY: number): Destination {
  const layer = page.querySelector<HTMLElement>('[data-layer]')!;
  const world = page.querySelector<HTMLElement>('[data-world]')!;
  // Same width as the page will have on its own: without the scrollbar if it is taller than the viewport.
  let w = innerWidth - scrollbarWidth();
  layer.style.width = w + 'px';
  if (world.offsetHeight <= layer.clientHeight) layer.style.width = (w = innerWidth) + 'px';
  const V = { w, h: layer.clientHeight };
  const yEnd = from === 'away' ? scrollY : 0;
  world.style.transformOrigin = '0 0';
  layer.style.transformOrigin = '0 0';
  return {
    layer,
    world,
    V,
    worldAt: (g, Ww, Wh) => `scale(${V.w / Ww}, ${V.h / Wh}) scale(${Ww / V.w}) translate(0px, ${-yEnd * g}px)`,
    land: (side) => window.scrollTo(0, side === 'away' ? yEnd : 0),
    reset: () => {
      layer.style.width = '';
      layer.style.transformOrigin = '';
      world.style.transformOrigin = '';
    },
  };
}

/**
 * The growing window: the layer goes from the rect S to the full size V, with a thin grey outline (white on
 * white otherwise hides its edge) that appears as soon as it leaves S and fades out before the end.
 */
export function windowTargets(dest: Destination, frame: HTMLElement, S: Rect): Target[] {
  const { layer, world, V } = dest;
  const win = (g: number): Rect => ({
    x: lerp(S.x, 0, g),
    y: lerp(S.y, 0, g),
    w: lerp(S.w, V.w, g),
    h: lerp(S.h, V.h, g),
  });
  frame.style.width = V.w + 'px';
  frame.style.height = V.h + 'px';
  const edge = (e: string) => frame.querySelector<HTMLElement>(`[data-edge="${e}"]`)!;
  return [
    [
      layer,
      (g) => {
        const W = win(g);
        return { transform: `translate(${W.x}px, ${W.y}px) scale(${W.w / V.w}, ${W.h / V.h})` };
      },
    ],
    [frame, (g) => ({ opacity: clamp01(g / 0.04) * (1 - clamp01((g - 0.8) / 0.17)) })],
    [edge('t'), (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y}px) scale(${win(g).w / V.w}, 1)` })],
    [
      edge('b'),
      (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y + win(g).h - 1}px) scale(${win(g).w / V.w}, 1)` }),
    ],
    [edge('l'), (g) => ({ transform: `translate(${win(g).x}px, ${win(g).y}px) scale(1, ${win(g).h / V.h})` })],
    [
      edge('r'),
      (g) => ({ transform: `translate(${win(g).x + win(g).w - 1}px, ${win(g).y}px) scale(1, ${win(g).h / V.h})` }),
    ],
    [world, (g) => ({ transform: dest.worldAt(g, lerp(S.w, V.w, g), lerp(S.h, V.h, g)) })],
  ];
}

/** The frame's inline size, set by windowTargets. */
export function resetFrame(frame: HTMLElement) {
  frame.style.width = '';
  frame.style.height = '';
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
