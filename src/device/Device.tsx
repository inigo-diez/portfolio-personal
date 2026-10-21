import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { ui } from '../content/site';
import { AXIS_PATHS, Icon } from './icons';
import './device.css';

/** Every physical input becomes one of these five commands (docs/design/device-spec.md). */
export type Command = 'next' | 'prev' | 'select' | 'back' | 'home';

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
  onCommand: (c: Command) => void;
  /** Listen to the keyboard on the whole document (home), not only when the device has focus. */
  globalKeys?: boolean;
  /** Ignore all input (e.g. while a transition owns the device). */
  inert?: boolean;
  className?: string;
  style?: CSSProperties;
  'data-device'?: string;
}

/** Slate: hardware + input model. E3 = simplified (no flip, tilt, reflection or side dial: E4). */
export function Device({ children, onCommand, globalKeys, inert, className, style, ...rest }: DeviceProps) {
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
    const run = (c: Command) => {
      if (!inertRef.current) cmdRef.current(c);
    };

    // Keyboard: arrows mirror the ring's four axes (← back, → open, like a column browser)
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.('input, textarea, select, a, nav, [role="toolbar"], .list-view')) return;
      if ((e.key === 'Enter' || e.key === ' ') && t?.closest?.('button')) return; // the button handles its own click
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const c = KEYS[e.key];
      if (!c) return;
      e.preventDefault();
      run(c);
      const axis = e.key.startsWith('Arrow') ? CMD_AXIS[c] : undefined;
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
        run(AXIS_CMD[drag.axis]);
      }
      setRot(rot);
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
    ring.addEventListener('pointerdown', down);
    ring.addEventListener('pointermove', move);
    ring.addEventListener('pointerup', up);
    ring.addEventListener('pointercancel', up);
    ring.addEventListener('wheel', wheel, { passive: false });
    return () => {
      keyTarget.removeEventListener('keydown', onKey as EventListener);
      ring.removeEventListener('pointerdown', down);
      ring.removeEventListener('pointermove', move);
      ring.removeEventListener('pointerup', up);
      ring.removeEventListener('pointercancel', up);
      ring.removeEventListener('wheel', wheel);
    };
  }, [globalKeys]);

  function press(c: Command) {
    if (!inertRef.current) cmdRef.current(c);
  }

  return (
    <div
      ref={root}
      className={'pocket' + (className ? ' ' + className : '')}
      style={style}
      tabIndex={0}
      role="group"
      aria-roledescription="dispositivo"
      aria-label={ui.device.label}
      {...rest}
    >
      <div className="pocket__front">
        <div className="pocket__plate" />
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
          <button className="ring__center" aria-label={ui.device.select} tabIndex={-1} onClick={() => press('select')} />
        </div>
        <button className="key key--back" aria-label={ui.device.back} onClick={() => press('back')}>
          <Icon name="back" />
        </button>
        <button className="key key--home" aria-label={ui.device.home} onClick={() => press('home')}>
          <Icon name="home" />
        </button>
        <span className="side-key" aria-hidden="true" />
      </div>
    </div>
  );
}
