import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { os } from '../content/device';
import type { Track } from '../content/music';
import { musicUi } from '../content/music';
import { isAvailable, ui, type Section } from '../content/site';
import { Battery, Icon, type IconName } from '../device/icons';
import './os.css';

function useClock() {
  // Client-only (the prerendered HTML has no time, so hydration never mismatches).
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function StatusBar({ title }: { title: string }) {
  const time = useClock();
  return (
    <div className="os__status">
      <span className="os__time">{time}</span>
      <span className="os__title">{title}</span>
      <Battery />
    </div>
  );
}

export interface Row {
  label: string;
  meta?: string;
  icon?: IconName;
  strong?: boolean;
  disabled?: boolean;
}

/** Push direction of the last screen change (internal OS transition, 220 ms). */
export type Dir = 'fwd' | 'back' | null;

/** Scrolls a long list so the selection stays visible, with a grey position bar (not blue: blue = selection). */
export function useKeepInView(sel: number) {
  const list = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const top = useRef(0);
  useLayoutEffect(() => {
    const ul = list.current!,
      row = ul.children[sel] as HTMLElement | undefined;
    if (!row) return;
    const h = row.offsetHeight,
      n = ul.children.length;
    const visible = Math.max(1, Math.floor(ul.clientHeight / h + 0.01));
    bar.current!.hidden = n <= visible;
    if (n <= visible) {
      top.current = 0;
      ul.scrollTop = 0;
      return;
    }
    if (sel < top.current) top.current = sel;
    if (sel >= top.current + visible) top.current = sel - visible + 1;
    top.current = Math.min(top.current, n - visible);
    ul.scrollTop = top.current * h;
    bar.current!.style.setProperty('--p', ((100 * (top.current + visible)) / n).toFixed(1) + '%');
  });
  return { list, bar };
}

function RowList({
  rows,
  sel,
  label,
  onPick,
}: {
  rows: Row[];
  sel: number;
  label: string;
  onPick: (i: number) => void;
}) {
  const { list, bar } = useKeepInView(sel);
  return (
    <>
      <ul className="os__list" role="listbox" aria-label={label} ref={list}>
        {rows.map((r, i) => (
          <li
            key={r.label + i}
            className={
              'os__item' +
              (i === sel ? ' is-sel' : '') +
              (r.strong ? ' is-strong' : '') +
              (r.disabled ? ' is-disabled' : '')
            }
            role="option"
            aria-selected={i === sel}
            aria-disabled={r.disabled || undefined}
            onClick={() => onPick(i)}
          >
            {r.icon && <Icon name={r.icon} />}
            <span>{r.label}</span>
            {r.meta ? <span className="meta">{r.meta}</span> : <Icon name="chev" className="chev" />}
          </li>
        ))}
      </ul>
      <div className="os__scroll" ref={bar} hidden aria-hidden="true">
        <i />
      </div>
    </>
  );
}

export function Cover({ track, className }: { track: Track | undefined; className: string }) {
  return track?.cover ? (
    <img className={'cov ' + className} src={track.cover} alt="" />
  ) : (
    <span className={'cov ' + className}>
      <Icon name="note" />
    </span>
  );
}

function Peek({ id, track }: { id: Section['id']; track?: Track }) {
  const p = os.peek;
  switch (id) {
    case 'sobre-mi':
      return (
        <>
          <div className="peek__mono">{p['sobre-mi'].mono}</div>
          <div className="peek__label">
            {p['sobre-mi'].lines[0]}
            <br />
            {p['sobre-mi'].lines[1]}
          </div>
        </>
      );
    case 'trayectoria':
      return (
        <>
          <div className="peek__kicker">{p.trayectoria.kicker}</div>
          <div className="peek__title">{p.trayectoria.title}</div>
          <Chips items={p.trayectoria.chips} />
        </>
      );
    case 'proyectos':
      return (
        <>
          <div className="peek__map">
            {p.proyectos.cells.map((n, i) => (
              <i key={n} className={i ? '' : 'on'}>
                {n}
              </i>
            ))}
          </div>
          <div className="peek__big">{p.proyectos.big}</div>
          <div className="peek__label">
            {p.proyectos.lines[0]}
            <br />
            {p.proyectos.lines[1]}
          </div>
        </>
      );
    case 'habilidades':
      return <Chips items={p.habilidades.chips} />;
    case 'formacion':
      return (
        <>
          {p.formacion.items.map((it) => (
            <div key={it.title} className="peek__title" style={{ margin: '0 0 1.6cqw' }}>
              {it.title}
              <div className="peek__kicker">{it.sub}</div>
            </div>
          ))}
          <div className="peek__label">{p.formacion.more}</div>
        </>
      );
    case 'contacto':
      return (
        <>
          <Icon name="mail" className="peek__icon" />
          <div className="peek__label">
            {p.contacto.lines[0]}
            <br />
            {p.contacto.lines[1]}
          </div>
        </>
      );
    case 'cv':
      return (
        <>
          <div className="peek__doc">
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <div className="peek__label">{p.cv.lines[0]}</div>
        </>
      );
    case 'mi-musica':
      return track ? (
        <>
          <div className="peek__kicker pm__k">{musicUi.selected}</div>
          <Cover track={track} className="pm__cov" />
          <div className="pm__t">{track.title}</div>
          <div className="pm__a">{track.artist}</div>
        </>
      ) : (
        <div className="peek__label">{p['mi-musica'].soon}</div>
      );
  }
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="peek__chips">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

/** Home menu: list (52 %) + preview of the selected entry. */
export function MenuScreen({
  items,
  sel,
  onPick,
  track,
  dir,
}: {
  items: Section[];
  sel: number;
  onPick: (i: number) => void;
  /** Selected song (preview of Mi música). */
  track?: Track;
  dir: Dir;
}) {
  const rows: Row[] = items.map((s) => ({ label: s.label, disabled: !isAvailable(s.id) }));
  const live = ui.device.position(items[sel].label, sel + 1, items.length);
  return (
    <Frame title={os.name} live={live} dir={dir} split>
      <div className="os__main os__menu">
        <RowList rows={rows} sel={sel} label="Menú" onPick={onPick} />
      </div>
      <div className="os__peek" key={items[sel].id} aria-hidden="true">
        <Peek id={items[sel].id} track={track} />
      </div>
    </Frame>
  );
}

/** A full-width list (sections, the docked device). */
export function ListScreen({
  title,
  rows,
  sel,
  onPick,
  dir = 'fwd',
}: {
  title: string;
  rows: Row[];
  sel: number;
  onPick: (i: number) => void;
  dir?: Dir;
}) {
  return (
    <Frame title={title} live={ui.device.position(rows[sel].label, sel + 1, rows.length)} dir={dir}>
      <div className="os__main">
        <RowList rows={rows} sel={sel} label={title} onPick={onPick} />
      </div>
    </Frame>
  );
}

export function Frame({
  title,
  live,
  dir,
  split,
  children,
}: {
  title: string;
  live: string;
  dir: Dir;
  split?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="os">
      <StatusBar title={title} />
      <div className={'os__view' + (split ? ' os__split' : '') + (dir ? ' anim-' + dir : '')}>{children}</div>
      <span className="sr-only" aria-live="polite">
        {live}
      </span>
    </div>
  );
}

/** Selection state for a list driven by the five commands. It stops at the first and last rows (no wrap-around). */
export function useListNav(count: number, initial: number) {
  const [sel, setSelState] = useState(initial);
  const cur = useRef(initial); // current value even between renders (several wheel steps in one frame)
  const setSel = (i: number) => {
    cur.current = i;
    setSelState(i);
  };
  /** Moves one row; false if it was already at that end (nothing happened: no click sound). */
  const move = (d: 1 | -1) => {
    const n = Math.max(0, Math.min(count - 1, cur.current + d));
    if (n === cur.current) return false;
    setSel(n);
    return true;
  };
  return { sel, setSel, move };
}
