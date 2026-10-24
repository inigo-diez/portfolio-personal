import { useLayoutEffect, type RefObject } from 'react';

// Where Iñigo left the docked device by dragging it (desktop only), the same on every page and on the canvas
// (they dock it in the same corner): it stays there while he goes from one section to another and is forgotten
// on reload. The element keeps its corner in CSS; this is a translation on top.
let moved = { x: 0, y: 0 };
const CONTROLS = '[data-ring], [data-side], button, a'; // they have their own click / drag
const DRAG_PX = 5;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Lets a mouse drag a docked device (the element that places it: `.page-dock`, `.dock`) by its body or its screen.
 * Phones keep it where it is: there it sits in the page (position static) or is not shown.
 */
export function useDraggable(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current!;
    const placed = () => getComputedStyle(el).position !== 'static';
    const apply = () => {
      el.style.transform = placed() && (moved.x || moved.y) ? `translate(${moved.x}px, ${moved.y}px)` : '';
    };
    apply();

    let drag: {
      x0: number;
      y0: number;
      ox: number;
      oy: number;
      left: number;
      top: number;
      w: number;
      h: number;
      on: boolean;
    } | null = null;
    let swallowClick = false;
    const down = (e: PointerEvent) => {
      swallowClick = false;
      if (e.pointerType !== 'mouse' || e.button !== 0 || !placed() || (e.target as Element).closest(CONTROLS)) return;
      const r = el.getBoundingClientRect();
      drag = {
        x0: e.clientX,
        y0: e.clientY,
        ox: moved.x,
        oy: moved.y,
        left: r.left - moved.x,
        top: r.top - moved.y,
        w: r.width,
        h: r.height,
        on: false,
      };
      // on the window, not on the device: a quick first movement can leave the device before the drag has started
      addEventListener('pointermove', move);
      addEventListener('pointerup', up);
      addEventListener('pointercancel', up);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      if (e.buttons === 0) return up(); // the release was lost (outside the window): do not keep dragging
      const dx = e.clientX - drag.x0,
        dy = e.clientY - drag.y0;
      if (!drag.on) {
        if (Math.hypot(dx, dy) < DRAG_PX) return;
        drag.on = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-dragging');
      }
      // never off the window
      moved = {
        x: clamp(drag.ox + dx, -drag.left, innerWidth - drag.w - drag.left),
        y: clamp(drag.oy + dy, -drag.top, innerHeight - drag.h - drag.top),
      };
      apply();
    };
    const up = () => {
      if (drag?.on) {
        swallowClick = true; // the click that ends a drag must not press the row under the pointer
        setTimeout(() => (swallowClick = false), 60);
      }
      el.classList.remove('is-dragging');
      drag = null;
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
    };
    const click = (e: MouseEvent) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.stopPropagation();
      e.preventDefault();
    };
    // a smaller window must not leave it outside
    const resize = () => {
      if (placed() && (moved.x || moved.y)) {
        const r = el.getBoundingClientRect();
        moved = {
          x: moved.x + Math.max(0, -r.left) + Math.min(0, innerWidth - r.right),
          y: moved.y + Math.max(0, -r.top) + Math.min(0, innerHeight - r.bottom),
        };
      }
      apply();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('click', click, true);
    addEventListener('resize', resize);
    return () => {
      up();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('click', click, true);
      removeEventListener('resize', resize);
    };
  }, [ref]);
}
