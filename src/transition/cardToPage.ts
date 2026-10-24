// A canvas card (the README card of the open project, else its cover) grows into its case study (and back), with
// the same engine and timing as the screen (shared.ts): the card fades into a miniature of the real page, which
// grows to fill the window while the canvas controls fade out. Coming back, the canvas is already where it was
// left (camera and open pile), so the page shrinks into the very card it came from.

import {
  clamp01,
  pageDestination,
  rectOf,
  resetFrame,
  runShared,
  windowTargets,
  type SharedTransition,
  type Side,
  type Target,
} from './shared';

/** home = the card on the canvas; away = the project page. */
export function startCardTransition(
  root: HTMLElement,
  from: Side,
  slug: string,
  opts: { reduced: boolean; scrollY: number; onDone: (side: Side) => void },
): SharedTransition {
  const canvasPage = root.querySelector<HTMLElement>(':scope > [data-page="canvas"]')!;
  // a page of the stage, not the projects list nested in the canvas (phones)
  const projectPage = root.querySelector<HTMLElement>(':scope > [data-page]:not([data-page="canvas"])')!;
  // The page grows out of the big README card, where the «Página del proyecto» link is (Iñigo, 2026-10-24), and
  // shrinks back into it. If the project is not open (no README card) or that card is off screen, the cover.
  const cover = canvasPage.querySelector<HTMLElement>(`[data-slug="${slug}"]`)!;
  const readme = canvasPage.querySelector<HTMLElement>(`#detalle-${slug}:not([inert]) .sat--readme`);
  const onScreen = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
  };
  const card = readme && onScreen(readme) ? readme : cover;
  const chrome = [...canvasPage.querySelectorAll<HTMLElement>('[data-chrome], .dock')];

  root.dataset.transitioning = '';
  const S = rectOf(card);
  const dest = pageDestination(projectPage, from, opts.scrollY);
  const frame = projectPage.querySelector<HTMLElement>('[data-screen-frame]')!;

  const targets: Target[] = [
    ...windowTargets(dest, frame, S),
    [dest.layer, (_g, s) => ({ opacity: s })], // the miniature page appears over the card…
    [card, (_g, s) => ({ opacity: 1 - s })], // …which gives way to it
    ...chrome.map((el): Target => [el, (g) => ({ opacity: 1 - clamp01(g / 0.4) })]),
  ];

  return runShared(root, from, opts, {
    targets,
    fade: projectPage,
    onReduced: () => {
      dest.layer.scrollTop = from === 'away' ? opts.scrollY : 0; // fades out where it was read, no jump
    },
    reset: () => {
      resetFrame(frame);
      dest.reset();
    },
    land: (side) => dest.land?.(side),
    label: ['tarjeta→proyecto', 'proyecto→tarjeta'],
  });
}
