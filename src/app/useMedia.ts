import { useSyncExternalStore } from 'react';

/** A media query as React state. The prerendered HTML assumes `false`; the client corrects it after hydration. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

export const MOBILE = '(max-width: 860px)';
