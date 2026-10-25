import { useRef } from 'react';
import { openOnHome } from '../app/intent';
import { navigate } from '../app/router';
import { isAvailable, labelOf, sections, ui, type SectionId } from '../content/site';
import { Device, type Command } from '../device/Device';
import { useDraggable } from '../device/useDraggable';
import { ListScreen, useListNav, type Row } from '../os/Screen';

/**
 * The device docked in the corner of a section page (the screen became this page). Its list goes to the
 * other sections; ATRÁS and INICIO shrink the page back into the screen. It only listens to the keyboard
 * when it has focus, so the arrows still scroll the page.
 */
export function PageDock({ id }: { id: SectionId }) {
  const dock = useRef<HTMLElement>(null);
  useDraggable(dock);
  // computed on render: Mi música's availability is only known after start-up (content/music.ts)
  const rows: Row[] = sections.map((s) => ({ label: s.label, disabled: !isAvailable(s.id) }));
  const nav = useListNav(
    sections.length,
    sections.findIndex((s) => s.id === id),
  );

  const open = (i: number) => {
    const s = sections[i];
    if (!isAvailable(s.id)) return false;
    if (s.id === 'mi-musica' || s.id === 'mis-libros') {
      openOnHome(s.id); // they live in the home device: back home, and they open there
      navigate('');
    } else navigate(s.path);
    return true;
  };
  const onCommand = (c: Command) => {
    if (c === 'next') return nav.move(1);
    if (c === 'prev') return nav.move(-1);
    if (c === 'select') return open(nav.sel);
    navigate('');
    return true;
  };

  return (
    <aside className="page-dock" aria-label={ui.device.dock} ref={dock}>
      <Device data-device="dock" onCommand={onCommand} wheelOnBody>
        <ListScreen title={labelOf(id)} rows={rows} sel={nav.sel} onPick={(i) => (nav.setSel(i), open(i))} />
      </Device>
    </aside>
  );
}
