import { Fragment, useEffect, useRef, useState } from 'react';
import { OPEN_EVENT, type HomeIntent } from '../app/intent';
import { setLeaveHook } from '../app/leave';
import { href } from '../app/routes';
import { navigate } from '../app/router';
import { MOBILE, useMedia } from '../app/useMedia';
import { cvRows, type RowAction } from '../content/device';
import { getTracks, musicAvailable } from '../content/music';
import { person } from '../content/profile';
import { TOTAL_PROJECTS } from '../content/projects';
import { isAvailable, labelOf, openSections, sections, topNav, ui, type SectionId } from '../content/site';
import { Device, type Command, type Via } from '../device/Device';
import { Earbuds } from '../device/Earbuds';
import { Icon } from '../device/icons';
import { useSound } from '../device/sound';
import { NowPlayingScreen, SongsScreen, type PlayerHandle } from '../os/Music';
import { ListScreen, MenuScreen, useListNav, type Dir } from '../os/Screen';
import './home.css';

// The menu opens (and INICIO returns) with Proyectos selected: it is the main destination.
const DEFAULT_ENTRY = sections.findIndex((s) => s.id === 'proyectos');
const UNPLUG_MS = 300;

// Inside the device: the menu, CV and Mi música. The other sections grow into their page (routes.ts).
type View = 'menu' | 'cv' | 'mi-musica' | 'sonando';
const inDevice = (id: SectionId): id is 'cv' | 'mi-musica' => id === 'cv' || id === 'mi-musica';

function runAction(a: RowAction) {
  const url = /^[a-z]+:/.test(a.href) ? a.href : href(a.href);
  if (a.download) {
    const el = document.createElement('a');
    el.href = url;
    el.download = a.download;
    el.click();
  } else if (a.external) window.open(url, '_blank', 'noopener');
  else location.href = url; // mailto:
}

/** `entry`: section to select when the menu opens (the one a page was left from). */
export function HomePage({ entry }: { entry?: SectionId }) {
  const tracks = getTracks();
  const menu = useListNav(sections.length, entry ? sections.findIndex((s) => s.id === entry) : DEFAULT_ENTRY);
  const [view, setView] = useState<View>('menu');
  const [dir, setDir] = useState<Dir>(null);
  const rows = useListNav(cvRows.length, 0);
  const songs = useListNav(tracks.length, 0);
  const track = songs.sel;
  const [flipped, setFlipped] = useState(false);
  const [sound, setSound] = useSound();
  const player = useRef<PlayerHandle | null>(null);
  const mobile = useMedia(MOBILE);
  const plugged = view === 'mi-musica' || view === 'sonando';

  const go = (v: View, d: Dir) => {
    setView(v);
    setDir(d);
    rows.setSel(0);
  };

  // Leaving the home from Mi música (e.g. the "Proyectos" link): unplug first, then the transition.
  const pluggedRef = useRef(plugged);
  useEffect(() => {
    pluggedRef.current = plugged;
  });
  useEffect(() => {
    setLeaveHook('home', () => {
      if (!pluggedRef.current) return 0;
      setView('menu');
      setDir('back');
      return UNPLUG_MS;
    });
    return () => setLeaveHook('home', null);
  }, []);

  // Mi música chosen on a docked device: the screen transition has landed, now it opens (earbuds plug in).
  useEffect(() => {
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<HomeIntent>).detail === 'mi-musica' && musicAvailable()) {
        setView('mi-musica');
        setDir('fwd');
      }
    };
    addEventListener(OPEN_EVENT, onOpen);
    return () => removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const open = (i: number) => {
    const s = sections[i];
    if (!isAvailable(s.id)) return false;
    if (inDevice(s.id)) go(s.id, 'fwd');
    else navigate(s.path);
    return true;
  };

  // Returns false when nothing happened (the device then stays silent).
  const onCommand = (c: Command, via: Via): boolean => {
    if (flipped) {
      setFlipped(false); // any control puts it face up again
      return true;
    }
    if (c === 'home') {
      if (view === 'menu' && menu.sel === DEFAULT_ENTRY) return false;
      if (view !== 'menu') go('menu', 'back');
      menu.setSel(DEFAULT_ENTRY);
      return true;
    }
    const step = c === 'next' ? 1 : c === 'prev' ? -1 : 0;
    switch (view) {
      case 'menu':
        if (step) return menu.move(step);
        return c === 'select' && open(menu.sel);
      case 'mi-musica':
        if (step) return songs.move(step);
        if (c === 'select') go('sonando', 'fwd');
        else go('menu', 'back');
        return true;
      case 'sonando': {
        // ⏮ ⏭ (and ← →) change track; the centre plays or pauses; ATRÁS / Esc return to the list.
        if (c === 'back' && via === 'other') {
          go('mi-musica', 'back');
          return true;
        }
        if (c === 'select' && via === 'other') {
          player.current?.toggle();
          return true;
        }
        return songs.move(step || (c === 'select' ? 1 : -1));
      }
      case 'cv': {
        if (step) return rows.move(step);
        if (c === 'select') {
          const a = cvRows[rows.sel].action;
          if (!a) return false;
          runAction(a);
          return true;
        }
        go('menu', 'back');
        return true;
      }
    }
    return false;
  };

  // «Girar» from Mi música: the earbuds unplug first.
  const flip = () => {
    if (!plugged) return setFlipped((f) => !f);
    go('menu', 'back');
    setTimeout(() => setFlipped(true), UNPLUG_MS);
  };

  let screen;
  if (view === 'menu')
    screen = (
      <MenuScreen
        items={sections}
        sel={menu.sel}
        track={tracks[track]}
        dir={dir}
        onPick={(i) => {
          menu.setSel(i);
          open(i);
        }}
      />
    );
  else if (view === 'mi-musica')
    screen = (
      <SongsScreen
        tracks={tracks}
        sel={track}
        dir={dir}
        onPick={(i) => {
          songs.setSel(i);
          go('sonando', 'fwd');
        }}
      />
    );
  else if (view === 'sonando') screen = <NowPlayingScreen tracks={tracks} index={track} dir={dir} playerRef={player} />;
  else
    screen = (
      <ListScreen
        title={labelOf('cv')}
        rows={cvRows}
        sel={rows.sel}
        dir={dir}
        onPick={(i) => {
          rows.setSel(i);
          const a = cvRows[i].action;
          if (a) runAction(a);
        }}
      />
    );

  return (
    <div className="home" data-page="home">
      <a className="skip" href="#enlaces">
        {ui.skipToContent}
      </a>
      <header className="home__header" data-chrome>
        <nav className="topnav" aria-label={ui.primaryNav} id="enlaces">
          <ul>
            {topNav().map((n) => (
              <li key={n.label}>
                <a href={n.href ?? href(n.path!)} {...(n.href ? { target: '_blank', rel: 'noopener' } : {})}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="home__main">
        <div className="home__intro" data-chrome>
          <h1>{person.greeting}</h1>
        </div>

        <div className={'home__stage' + (plugged ? ' is-plugged' : '')}>
          <Device
            data-device="hero"
            onCommand={onCommand}
            globalKeys
            tilt
            reflect={!(mobile && plugged)}
            flipped={flipped}
            accessory={musicAvailable() && <Earbuds layout={mobile ? 'behind' : 'side'} plugged={plugged} />}
          >
            <Fragment key={view}>{screen}</Fragment>
          </Device>
          <p className="home__keys" data-chrome>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {ui.device.keysHint.move} · <kbd>→</kbd> {ui.device.keysHint.open} · <kbd>←</kbd>{' '}
            {ui.device.keysHint.back}
          </p>
        </div>

        <div className="home__cta" data-chrome>
          <a className="pill" href={href('proyectos/')}>
            {ui.seeProjects}
          </a>
          <button className="ghost" aria-pressed={flipped} onClick={flip}>
            <Icon name="flip" />
            <span>{ui.device.flip}</span>
          </button>
          <button className="ghost" aria-pressed={sound} onClick={() => setSound(!sound)}>
            <Icon name={sound ? 'sound' : 'mute'} />
            <span>{ui.device.sound}</span>
          </button>
        </div>

        <nav className="home__quick" aria-label={ui.allSections} data-chrome>
          <ul>
            {openSections().map((s) => (
              <li key={s.id}>
                <a href={href(s.path)} {...(s.id === 'cv' ? { target: '_blank', rel: 'noopener' } : {})}>
                  {s.label} <span>{s.id === 'proyectos' ? TOTAL_PROJECTS : s.id === 'cv' ? 'PDF' : '→'}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
