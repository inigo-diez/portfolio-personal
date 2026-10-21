// Canvas camera: one transformed layer. screen = (x, y) + z · world.

export interface Cam {
  x: number;
  y: number;
  z: number;
}
export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
export interface Area {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const Z_MIN = 0.5;
export const Z_MAX = 2;

export const camTransform = (c: Cam) => `translate(${c.x}px, ${c.y}px) scale(${c.z})`;

/** Camera that fits a world box inside an area of the screen (centred). */
export function fit(box: Box, area: Area, maxZ = 1): Cam {
  const z = Math.min(area.width / (box.x1 - box.x0), area.height / (box.y1 - box.y0), maxZ);
  return {
    z,
    x: area.left + area.width / 2 - ((box.x0 + box.x1) / 2) * z,
    y: area.top + area.height / 2 - ((box.y0 + box.y1) / 2) * z,
  };
}

/** World bounding box of the given elements (positioned in world coordinates). */
export function boundsOf(els: HTMLElement[], pad = 0): Box {
  const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const e of els) {
    b.x0 = Math.min(b.x0, e.offsetLeft);
    b.y0 = Math.min(b.y0, e.offsetTop);
    b.x1 = Math.max(b.x1, e.offsetLeft + e.offsetWidth);
    b.y1 = Math.max(b.y1, e.offsetTop + e.offsetHeight + 16); // piles: two cards peek out below
  }
  return { x0: b.x0 - pad, y0: b.y0 - pad, x1: b.x1 + pad, y1: b.y1 + pad };
}

/** Free area of the viewport for the initial composition (leaves room for the top bar, HUD and dock). */
export function safeArea(vw: number, vh: number): Area {
  const desktop = vw > 860;
  const left = desktop ? 250 : 16;
  const top = desktop ? 84 : 64;
  const bottom = desktop ? 84 : 190;
  return { left, top, width: vw - left - (desktop ? 40 : 16), height: vh - top - bottom };
}

/** World point at the centre of a window of size (w, h) under camera c. */
export const centreOf = (c: Cam, w: number, h: number) => ({ x: (w / 2 - c.x) / c.z, y: (h / 2 - c.y) / c.z });
