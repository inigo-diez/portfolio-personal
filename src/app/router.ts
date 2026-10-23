import { useSyncExternalStore } from 'react';
import { BASE, href } from './routes';

// Minimal history router. Device commands, links and the browser's back/forward buttons all end up
// here, so they feed the same navigation state (and therefore the same transitions).

type Listener = () => void;
const listeners = new Set<Listener>();
// Server: the route being prerendered. Client: the real URL, so hydration matches the prerendered page.
let ssrPath = typeof window === 'undefined' ? BASE : window.location.pathname;

const current = () => (typeof window === 'undefined' ? ssrPath : window.location.pathname);

function emit() {
  listeners.forEach((l) => l());
}

export function setServerPath(p: string) {
  ssrPath = p;
}

/** Navigate to a path relative to the base ("proyectos/"). */
export function navigate(rel: string, opts: { replace?: boolean } = {}) {
  const url = href(rel);
  if (url === window.location.pathname) return;
  if (opts.replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  emit();
}

export function back() {
  history.back();
}

let installed = false;
function install() {
  if (installed) return;
  installed = true;
  // The stage decides the scroll of every page change (top, or the place a list was left), so the browser's
  // own restoration on back / forward must not move it afterwards.
  history.scrollRestoration = 'manual';
  addEventListener('popstate', emit);
  // Same-origin links under the base are handled in-app (no reload), so the shared transition can run.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.('a');
    if (!a || a.target || a.hasAttribute('download') || a.origin !== location.origin) return;
    if (!a.pathname.startsWith(BASE) || /\.[a-z0-9]+$/i.test(a.pathname)) return; // files (cv.pdf) load normally
    e.preventDefault();
    navigate(a.pathname.slice(BASE.length) + (a.pathname.endsWith('/') ? '' : '/'));
  });
}

export function usePathname() {
  return useSyncExternalStore(
    (l) => {
      install();
      listeners.add(l);
      return () => listeners.delete(l);
    },
    current,
    () => ssrPath,
  );
}
