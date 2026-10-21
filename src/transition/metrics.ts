// Frame meter for the transition (E3 measurement). Records every rendered frame with rAF while a
// transition runs. Results go to window.__e3.transitions, the console and, with ?medir in the URL,
// a small on-screen panel.

export interface FrameStats {
  label: string;
  technique: string;
  plannedMs: number;
  measuredMs: number;
  frames: number;
  fps: number;
  /** Longest gap between two frames (ms). */
  worstMs: number;
  p95Ms: number;
  /** Frames that took longer than 1.5 × 16.7 ms (a skipped vsync at 60 Hz). */
  longFrames: number;
}

declare global {
  interface Window {
    __e3?: { technique: string; transitions: FrameStats[] };
  }
}

let technique = 'flip-waapi';
export const setTechnique = (t: string) => {
  technique = t;
};

export function startFrameMeter() {
  const times: number[] = [];
  let raf = 0;
  let running = true;
  const loop = (t: number) => {
    times.push(t);
    if (running) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return {
    stop(label: string, plannedMs: number): FrameStats {
      running = false;
      cancelAnimationFrame(raf);
      const gaps = times.slice(1).map((t, i) => t - times[i]);
      const sorted = [...gaps].sort((a, b) => a - b);
      const measured = times.length > 1 ? times[times.length - 1] - times[0] : 0;
      const s: FrameStats = {
        label,
        technique,
        plannedMs: Math.round(plannedMs),
        measuredMs: Math.round(measured),
        frames: gaps.length,
        fps: measured ? +((gaps.length * 1000) / measured).toFixed(1) : 0,
        worstMs: +(sorted[sorted.length - 1] ?? 0).toFixed(1),
        p95Ms: +(sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1),
        longFrames: gaps.filter((g) => g > 25).length,
      };
      report(s);
      return s;
    },
  };
}

function report(s: FrameStats) {
  if (typeof window === 'undefined') return;
  window.__e3 ??= { technique, transitions: [] };
  window.__e3.transitions.push(s);
  console.info('[E3] transición', s);
  if (!showPanel) return;
  let el = document.getElementById('e3-meter');
  if (!el) {
    el = document.createElement('pre');
    el.id = 'e3-meter';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText =
      'position:fixed;right:12px;top:12px;z-index:9999;margin:0;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,.94);box-shadow:0 0 0 1px rgba(0,0,0,.1);font:11px/1.5 ui-monospace,monospace;color:#252525;pointer-events:none;max-width:360px;white-space:pre-wrap';
    document.body.appendChild(el);
  }
  el.textContent =
    `${s.technique} · ${s.label}\n${s.fps} fps · ${s.frames} fotogramas en ${s.measuredMs} ms\n` +
    `peor ${s.worstMs} ms · p95 ${s.p95Ms} ms · largos ${s.longFrames}`;
}

let showPanel = false;
export const setShowPanel = (v: boolean) => {
  showPanel = v;
};
