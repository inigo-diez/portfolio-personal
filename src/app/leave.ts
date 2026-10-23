// A side of the screen transition can ask for a short pause before it starts:
//  • home: leaving Mi música, the earbuds unplug first (0.3 s), so the cable never travels with the device;
//  • away: leaving the canvas, it folds its piles and returns to its initial composition first (brief §7).
import type { Side } from '../transition/shared';

type Hook = () => number;
const hooks: Partial<Record<Side, Hook | null>> = {};

export function setLeaveHook(side: Side, h: Hook | null) {
  hooks[side] = h;
}

/** Milliseconds to wait before that side can be left (0 = now). */
export const prepareLeave = (side: Side) => hooks[side]?.() ?? 0;
