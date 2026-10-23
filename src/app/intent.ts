// Something to open on the home device once the screen transition back has landed. Only Mi música for now:
// chosen from a docked device, it returns home with the reverse transition and the earbuds plug in there
// (decided 2026-10-20).
export type HomeIntent = 'mi-musica';

let pending: HomeIntent | null = null;

export function openOnHome(v: HomeIntent) {
  pending = v;
}
export const peekOpenOnHome = () => pending;
/** Read and clear it (the Stage does it when a transition lands). */
export function takeOpenOnHome() {
  const v = pending;
  pending = null;
  return v;
}

export const OPEN_EVENT = 'pocket:open';
