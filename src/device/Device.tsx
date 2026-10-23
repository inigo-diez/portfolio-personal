import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { os } from '../content/device';
import { ui } from '../content/site';
import { AXIS_PATHS, Icon } from './icons';
import { Monogram } from './Monogram';
import { commandSound } from './sound';
import './device.css';

/** Every physical input becomes one of these five commands (docs/design/device-spec.md). */
export type Command = 'next' | 'prev' | 'select' | 'back' | 'home';
/** Where a command came from. In «Sonando» the ⏮ ⏭ axes (and ← →) change track instead of back / select. */
export type Via = 'axis' | 'other';

type Axis = keyof typeof AXIS_PATHS;
const AXIS_CMD: Record<Axis, Command> = { up: 'prev', down: 'next', left: 'back', right: 'select' };
const CMD_AXIS: Partial<Record<Command, Axis>> = { prev: 'up', next: 'down', back: 'left', select: 'right' };
const KEYS: Record<string, Command> = {
  ArrowDown: 'next',
  ArrowUp: 'prev',
  ArrowRight: 'select',
  ArrowLeft: 'back',
  Enter: 'select',
  ' ': 'select',
  Escape: 'back',
  Backspace: 'back',
  Home: 'home',
};

interface DeviceProps {
  /** Screen content (the OS). */
  children: ReactNode;
  /** Returns false when the command changed nothing (end of a list, ATRÁS on the top menu): no click sound. */
  onCommand: (c: Command, via: Via) => boolean | void;
  /** Listen to the keyboard on the whole document (home), not only when the device has focus. */
  globalKeys?: boolean;
  /** Ignore all input (e.g. while a transition owns the device). */
  inert?: boolean;
  /** Home only: lean towards the mouse, with a highlight that follows it. */
  tilt?: boolean;
  /** Home only: soft reflection on the floor. */
  reflect?: boolean;
  /** Show the engraved back face. */
  flipped?: boolean;
  /** Things that hang off the hardware (the earbuds' plug and cable), drawn in device units. */
  accessory?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-device'?: string;
}

/** Slate: hardware + input model. */
export function Device({
  children,
  onCommand,
  globalKeys,
  inert,
  tilt,
  reflect,
  flipped,
  accessory,
  className,
  style,
  ...rest
}: DeviceProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const spin = useRef<HTMLSpanElement>(null);
  const cmdRef = useRef(onCommand);
  const inertRef = useRef(inert);
  useEffect(() => {
    cmdRef.current = onCommand;
    inertRef.current = inert;
  });

  useEffect(() => {
    const el = root.current!;
    const flash = (sel: string) => {
      const b = el.querySelector(sel);
      if (!b) return;
      b.classList.add('is-pressed');
      setTimeout(() => b.classList.remove('is-pressed'), 110);
    };
    const run = (c: Command, via: Via = 'other') => {
      if (inertRef.current) return;
      if (cmdRef.current(c, via) !== false) commandSound(c);
    };

    // Keyboard: arrows mirror the ring's four axes (← back, → open, like a column browser)
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.('input, textarea, select, a, nav, iframe, [role="toolbar"], .list-view')) return;
      if ((e.key === 'Enter' || e.key === ' ') && t?.closest?.('button')) return; // the button handles its own click
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const c = KEYS[e.key];
      if (!c) return;
      e.preventDefault();
      const axis = e.key.startsWith('Arrow') ? CMD_AXIS[c] : undefined;
      run(c, axis ? 'axis' : 'other');
      if (axis) flash(`[data-axis="${axis}"]`);
      else if (c === 'select') flash('.ring__center');
      else if (c === 'back') flash('.key--back');
      else if (c === 'home') flash('.key--home');
    };
    const keyTarget: Document | HTMLElement = globalKeys ? document : el;
    keyTarget.addEventListener('keydown', onKey as EventListener);

    // Ring: real circular gesture (30° = one step, clockwise = next). A tap without rotation presses the nearest axis.
    const ring = el.querySelector<HTMLElement>('[data-ring]')!;
    const STEP = Math.PI / 6;
    let drag: { cx: number; cy: number; last: number; acc: number; moved: boolean; axis: Axis } | null = null;
    let rot = 0;
    const setRot = (deg: number) => spin.current?.style.setProperty('--rot', deg + 'deg');
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest('.ring__center')) return;
      ring.setPointerCapture(e.pointerId);
      const r = ring.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      const dx = e.clientX - cx,
        dy = e.clientY - cy;
      const axis: Axis = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
      drag = { cx, cy, last: Math.atan2(dy, dx), acc: 0, moved: false, axis };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const a = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx);
      let d = a - drag.last;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      drag.last = a;
      drag.acc += d;
      while (drag.acc > STEP) {
        run('next');
        drag.acc -= STEP;
        drag.moved = true;
        rot += 30;
      }
      while (drag.acc < -STEP) {
        run('prev');
        drag.acc += STEP;
        drag.moved = true;
        rot -= 30;
      }
      setRot(rot + (drag.acc * 180) / Math.PI);
    };
    const up = () => {
      if (!drag) return;
      if (!drag.moved) {
        flash(`[data-axis="${drag.axis}"]`);
        run(AXIS_CMD[drag.axis], 'axis');
      }
      setRot(rot); // detent: the metal settles on the last step
      drag = null;
    };
    // Mouse wheel over the ring: one notch (100 px) = one step; trackpads accumulate.
    let wheelAcc = 0;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc += e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;
      while (Math.abs(wheelAcc) >= 100) {
        const d = Math.sign(wheelAcc);
        wheelAcc -= d * 100;
        run(d > 0 ? 'next' : 'prev');
        rot += d * 30;
        setRot(rot);
      }
    };

    // Side key: mouse wheel or vertical drag scrolls (one step per notch / per 14 px).
    const side = el.querySelector<HTMLElement>('[data-side]')!;
    let sideY: number | null = null,
      sideAcc = 0,
      sideWheel = 0;
    const sideDown = (e: PointerEvent) => {
      side.setPointerCapture(e.pointerId);
      sideY = e.clientY;
      sideAcc = 0;
      side.classList.add('is-pressed');
    };
    const sideMove = (e: PointerEvent) => {
      if (sideY === null) return;
      sideAcc += e.clientY - sideY;
      sideY = e.clientY;
      while (Math.abs(sideAcc) >= 14) {
        run(sideAcc > 0 ? 'next' : 'prev');
        sideAcc -= Math.sign(sideAcc) * 14;
      }
    };
    const sideUp = () => {
      sideY = null;
      side.classList.remove('is-pressed');
    };
    const sideWheelFn = (e: WheelEvent) => {
      e.preventDefault();
      sideWheel += e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;
      while (Math.abs(sideWheel) >= 100) {
        run(sideWheel > 0 ? 'next' : 'prev');
        sideWheel -= Math.sign(sideWheel) * 100;
      }
    };

    // Touch on the screen: vertical swipe = next / prev (one step per row height), horizontal swipe:
    // finger to the right = back, to the left = open. A tap still reaches the row underneath (its click).
    const screen = el.querySelector<HTMLElement>('[data-screen]')!;
    let swipe: { x0: number; y0: number; y: number; acc: number; moved: boolean } | null = null;
    let swallowClick = false;
    const swDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      swallowClick = false; // a swipe produces no click, so the flag must not outlive it
      swipe = { x0: e.clientX, y0: e.clientY, y: e.clientY, acc: 0, moved: false };
    };
    const swMove = (e: PointerEvent) => {
      if (!swipe) return;
      const rowPx = el.clientWidth * 0.07;
      if (Math.abs(e.clientY - swipe.y0) < 8 && !swipe.moved) return;
      swipe.acc += swipe.y - e.clientY; // finger up = content up = next
      swipe.y = e.clientY;
      while (Math.abs(swipe.acc) >= rowPx) {
        run(swipe.acc > 0 ? 'next' : 'prev');
        swipe.acc -= Math.sign(swipe.acc) * rowPx;
        swipe.moved = true;
      }
    };
    const swUp = (e: PointerEvent) => {
      if (!swipe) return;
      const dx = e.clientX - swipe.x0,
        dy = e.clientY - swipe.y0;
      if (!swipe.moved && Math.abs(dx) > 40 && Math.abs(dx) > 2 * Math.abs(dy)) {
        run(dx > 0 ? 'back' : 'select');
        swipe.moved = true;
      }
      swallowClick = swipe.moved;
      swipe = null;
    };
    const swClick = (e: MouseEvent) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.stopPropagation();
      e.preventDefault();
    };

    ring.addEventListener('pointerdown', down);
    ring.addEventListener('pointermove', move);
    ring.addEventListener('pointerup', up);
    ring.addEventListener('pointercancel', up);
    ring.addEventListener('wheel', wheel, { passive: false });
    side.addEventListener('pointerdown', sideDown);
    side.addEventListener('pointermove', sideMove);
    side.addEventListener('pointerup', sideUp);
    side.addEventListener('pointercancel', sideUp);
    side.addEventListener('wheel', sideWheelFn, { passive: false });
    screen.addEventListener('pointerdown', swDown);
    screen.addEventListener('pointermove', swMove);
    screen.addEventListener('pointerup', swUp);
    screen.addEventListener('pointercancel', swUp);
    screen.addEventListener('click', swClick, true);
    return () => {
      keyTarget.removeEventListener('keydown', onKey as EventListener);
      ring.removeEventListener('pointerdown', down);
      ring.removeEventListener('pointermove', move);
      ring.removeEventListener('pointerup', up);
      ring.removeEventListener('pointercancel', up);
      ring.removeEventListener('wheel', wheel);
      side.removeEventListener('pointerdown', sideDown);
      side.removeEventListener('pointermove', sideMove);
      side.removeEventListener('pointerup', sideUp);
      side.removeEventListener('pointercancel', sideUp);
      side.removeEventListener('wheel', sideWheelFn);
      screen.removeEventListener('pointerdown', swDown);
      screen.removeEventListener('pointermove', swMove);
      screen.removeEventListener('pointerup', swUp);
      screen.removeEventListener('pointercancel', swUp);
      screen.removeEventListener('click', swClick, true);
    };
  }, [globalKeys]);

  // Lean towards the mouse (never with touch or reduced motion), with a highlight that follows it.
  useEffect(() => {
    if (!tilt) return;
    const el = root.current!;
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    const set = (rx: number, ry: number, sx: number, sy: number) => {
      el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      el.style.setProperty('--sx', sx.toFixed(1) + '%');
      el.style.setProperty('--sy', sy.toFixed(1) + '%');
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || still.matches) return;
      const nx = e.clientX / innerWidth - 0.5,
        ny = e.clientY / innerHeight - 0.5;
      set(-ny * 7, nx * 9, 32 + nx * 50, ny * 30); // max ±4.5°
    };
    const reset = () => set(0, 0, 32, 0);
    addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', reset);
    return () => {
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [tilt]);

  function press(c: Command) {
    if (inertRef.current) return;
    if (cmdRef.current(c, 'other') !== false) commandSound(c);
  }

  return (
    <div
      ref={root}
      className={'pocket' + (reflect ? ' pocket--reflect' : '') + (className ? ' ' + className : '')}
      style={style}
      tabIndex={0}
      role="group"
      aria-roledescription="dispositivo"
      aria-label={ui.device.label}
      {...rest}
    >
      <div className="pocket__tilt">
        <div className={'pocket__card' + (flipped ? ' is-flipped' : '')}>
          <div className="pocket__front">
            <div className="pocket__plate" />
            <span className="jack" aria-hidden="true" />
            <div className="pocket__glass">
              <div className="pocket__screen" data-screen>
                {children}
              </div>
              <div className="pocket__dim" data-dim />
            </div>
            <div className="ring" data-ring aria-hidden="true">
              <span className="ring__spin" ref={spin} />
              {(Object.keys(AXIS_PATHS) as Axis[]).map((a) => (
                <span key={a} className={`ring__axis ring__axis--${a}`} data-axis={a}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={AXIS_PATHS[a]} />
                  </svg>
                </span>
              ))}
              <button
                className="ring__center"
                aria-label={ui.device.select}
                tabIndex={-1}
                onClick={() => press('select')}
              />
            </div>
            <button className="key key--back" aria-label={ui.device.back} onClick={() => press('back')}>
              <Icon name="back" />
            </button>
            <button className="key key--home" aria-label={ui.device.home} onClick={() => press('home')}>
              <Icon name="home" />
            </button>
            <span className="side-key" data-side aria-hidden="true" />
          </div>
          <div className="pocket__back" aria-hidden="true">
            <div className="engr">
              <Monogram className="back__mark" />
              <div className="back__line">{os.back.line}</div>
              <div className="back__fine">{os.back.fine}</div>
            </div>
          </div>
        </div>
      </div>
      {accessory}
    </div>
  );
}
