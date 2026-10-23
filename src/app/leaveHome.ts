// The home can ask for a short pause before the screen → canvas transition starts:
// leaving Mi música, the earbuds unplug first (0.3 s) so the cable never travels with the device.
type Hook = () => number;
let hook: Hook | null = null;

export function setLeaveHomeHook(h: Hook | null) {
  hook = h;
}

/** Milliseconds to wait before the home can be left (0 = now). */
export const prepareLeaveHome = () => hook?.() ?? 0;
