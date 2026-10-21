// E3 test switches, read once at start-up and kept for the session:
//   ?tecnica=vt   → View Transitions API variant (comparison only)
//   ?tecnica=flip → default technique (FLIP + WAAPI)
//   ?medir        → show the frame meter panel after each transition
import { setShowPanel, setTechnique } from './metrics';

export type Technique = 'flip' | 'vt';
let technique: Technique = 'flip';

export function readTestSwitches() {
  const q = new URLSearchParams(location.search);
  const store = (k: string, v: string | null) => {
    try {
      if (v === null) return sessionStorage.getItem(k);
      sessionStorage.setItem(k, v);
      return v;
    } catch {
      return v;
    }
  };
  const t = store('e3-tecnica', q.get('tecnica'));
  technique = t === 'vt' && 'startViewTransition' in document ? 'vt' : 'flip';
  const medir = store('e3-medir', q.has('medir') ? '1' : null) === '1';
  document.documentElement.dataset.tecnica = technique;
  setTechnique(technique === 'vt' ? 'view-transitions' : 'flip-waapi');
  setShowPanel(medir);
}

export const getTechnique = () => technique;
