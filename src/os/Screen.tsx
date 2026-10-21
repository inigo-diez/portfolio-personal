import { useEffect, useState, type ReactNode } from 'react';
import { os } from '../content/device';
import type { Section } from '../content/site';
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

function RowList({ rows, sel, label, onPick }: { rows: Row[]; sel: number; label: string; onPick: (i: number) => void }) {
  return (
    <ul className="os__list" role="listbox" aria-label={label}>
      {rows.map((r, i) => (
        <li
          key={r.label}
          className={
            'os__item' + (i === sel ? ' is-sel' : '') + (r.strong ? ' is-strong' : '') + (r.disabled ? ' is-disabled' : '')
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
  );
}

function Peek({ id }: { id: Section['id'] }) {
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
      return <div className="peek__label">{p['mi-musica'].lines[0]}</div>;
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
export function MenuScreen({ items, sel, onPick }: { items: Section[]; sel: number; onPick: (i: number) => void }) {
  const rows: Row[] = items.map((s) => ({ label: s.label, disabled: !s.path }));
  return (
    <Frame title={os.name} live={items[sel].label}>
      <div className="os__view os__split">
        <div className="os__main">
          <RowList rows={rows} sel={sel} label="Menú" onPick={onPick} />
        </div>
        <div className="os__peek" aria-hidden="true">
          <Peek id={items[sel].id} />
        </div>
      </div>
    </Frame>
  );
}

/** A full-width list (e.g. Proyectos on the docked device). */
export function ListScreen({ title, rows, sel, onPick }: { title: string; rows: Row[]; sel: number; onPick: (i: number) => void }) {
  return (
    <Frame title={title} live={rows[sel].label}>
      <div className="os__view anim-fwd">
        <div className="os__main">
          <RowList rows={rows} sel={sel} label={title} onPick={onPick} />
        </div>
      </div>
    </Frame>
  );
}

function Frame({ title, live, children }: { title: string; live: string; children: ReactNode }) {
  return (
    <div className="os">
      <StatusBar title={title} />
      {children}
      <span className="sr-only" aria-live="polite">
        {live}
      </span>
    </div>
  );
}

/** Selection state for a list driven by the five commands. */
export function useListNav(count: number, initial: number) {
  const [sel, setSel] = useState(initial);
  const move = (d: 1 | -1, wrap = false) =>
    setSel((s) => (wrap ? (s + d + count) % count : Math.max(0, Math.min(count - 1, s + d))));
  return { sel, setSel, move };
}
