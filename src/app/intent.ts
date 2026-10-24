// Something to open on the home device once the screen transition back has landed. Mi música and Mis libros:
// chosen from a docked device, it returns home with the reverse transition and opens there (Mi música: the
// earbuds plug in; decided 2026-10-20).
export type HomeIntent = 'mi-musica' | 'mis-libros';

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
