import { Fragment, useEffect, useRef, useState } from 'react';
import { OPEN_EVENT, type HomeIntent } from '../app/intent';
import { setLeaveHook } from '../app/leave';
import { href } from '../app/routes';
import { navigate } from '../app/router';
import { MOBILE, useMedia } from '../app/useMedia';
import { books } from '../content/books';
import { getTracks, musicAvailable } from '../content/music';
import { person } from '../content/profile';
import { TOTAL_PROJECTS } from '../content/projects';
import { isAvailable, openSections, sections, topNav, ui, type SectionId } from '../content/site';
import { Device, type Command, type Via } from '../device/Device';
import { Earbuds } from '../device/Earbuds';
import { AXIS_PATHS, Icon } from '../device/icons';
import { useSound } from '../device/sound';
import { BooksScreen } from '../os/Books';
import { NowPlayingScreen, SongsScreen, type PlayerHandle } from '../os/Music';
import { MenuScreen, useListNav, type Dir } from '../os/Screen';
import './home.css';

// The menu opens (and INICIO returns) with Proyectos selected: it is the main destination.
const DEFAULT_ENTRY = sections.findIndex((s) => s.id === 'proyectos');
const UNPLUG_MS = 300;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function TrainingLine() {
  const reduced = useMedia(REDUCED_MOTION);
  const [started, setStarted] = useState(false);
  const [area, setArea] = useState(0);
  const [length, setLength] = useState(person.trainingAreas[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const start = () => {
      setLength(0);
      setStarted(true);
    };
    if (document.documentElement.classList.contains('welcome-active'))
      addEventListener('portfolio-welcome-done', start, { once: true });
    else start();
    return () => removeEventListener('portfolio-welcome-done', start);
  }, []);

  useEffect(() => {
    if (!started || reduced) return;
    const word = person.trainingAreas[area];
    const delay = deleting ? (length === 0 ? 250 : 40) : length === word.length ? 1500 : 80;
    const timer = window.setTimeout(() => {
      if (!deleting && length === word.length) setDeleting(true);
      else if (deleting && length === 0) {
        setArea((i) => (i + 1) % person.trainingAreas.length);
        setDeleting(false);
      } else setLength((n) => n + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [area, deleting, length, reduced, started]);

  return (
    <p className="home__training">
      <span>{person.trainingLabel}</span> <span className="sr-only">: {person.trainingAreas.join(', ')}</span>
      <span className="home__training-word" aria-hidden="true">
        {reduced ? person.trainingAreas.join(' · ') : person.trainingAreas[area].slice(0, length)}
        {!reduced && <span className="home__training-cursor" />}
      </span>
    </p>
  );
}

// Mi música and Mis libros stay inside the device; every available portfolio section has its own route.
type View = 'menu' | 'mi-musica' | 'sonando' | 'mis-libros';

/** `entry`: section to select when the menu opens (the one a page was left from). */
export function HomePage({ entry }: { entry?: SectionId }) {
  const tracks = getTracks();
  const menu = useListNav(sections.length, entry ? sections.findIndex((s) => s.id === entry) : DEFAULT_ENTRY);
  const [view, setView] = useState<View>('menu');
  const [dir, setDir] = useState<Dir>(null);
  const songs = useListNav(tracks.length, 0);
  const track = songs.sel;
  const shelf = useListNav(books.length, 0);
  const [bookBack, setBookBack] = useState(false); // the book on screen is turned over (its back cover shows)
  const [flipped, setFlipped] = useState(false);
  const [sound, setSound] = useSound();
  const player = useRef<PlayerHandle | null>(null);
  // Shuffle (Iñigo, 2026-10-24): on by default; the + key or the line on «Sonando» toggles it. With it on, ⏭ and
  // the end of a song go to a random song not played yet in this round, and ⏮ to the one played before.
  const [shuffle, setShuffle] = useState(true);
  const round = useRef<{ played: Set<number>; history: number[] }>({ played: new Set(), history: [] });
  const autoplayRef = useRef(false); // the next song loaded should start playing (it follows one that ended)
  const mobile = useMedia(MOBILE);
  const plugged = view === 'mi-musica' || view === 'sonando';

  const go = (v: View, d: Dir) => {
    setView(v);
    setDir(d);
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

  // Mi música or Mis libros chosen on a docked device: the screen transition has landed, now it opens (for Mi
  // música, the earbuds plug in).
  useEffect(() => {
    const onOpen = (e: Event) => {
      const intent = (e as CustomEvent<HomeIntent>).detail;
      if (intent === 'mi-musica' && musicAvailable()) {
        setView('mi-musica');
        setDir('fwd');
      } else if (intent === 'mis-libros') {
        setBookBack(false);
        setView('mis-libros');
        setDir('fwd');
      }
    };
    addEventListener(OPEN_EVENT, onOpen);
    return () => removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const open = (i: number) => {
    const s = sections[i];
    if (!isAvailable(s.id)) return false;
    if (s.id === 'mi-musica') go('mi-musica', 'fwd');
    else if (s.id === 'mis-libros') {
      setBookBack(false);
      go('mis-libros', 'fwd');
    } else navigate(s.path);
    return true;
  };

  // The song after / before `from`, by the current mode; null = none (start or end of the list, in order).
  // `wrap`: in order, the end of the last song continues with the first.
  const nextSong = (from: number, wrap: boolean): number | null => {
    const n = tracks.length;
    if (!shuffle) return from + 1 < n ? from + 1 : wrap && n > 1 ? 0 : null;
    const r = round.current;
    r.played.add(from);
    let pool = tracks.map((_, i) => i).filter((i) => !r.played.has(i));
    if (!pool.length) {
      r.played = new Set([from]); // every song has played: a new round
      pool = tracks.map((_, i) => i).filter((i) => i !== from);
    }
    if (!pool.length) return null;
    r.history.push(from);
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const prevSong = (from: number): number | null =>
    shuffle ? (round.current.history.pop() ?? null) : from > 0 ? from - 1 : null;
  const goSong = (i: number | null) => {
    if (i === null) return false;
    songs.setSel(i);
    return true;
  };
  // A song ended in «Sonando»: the next one loads and plays.
  const onEnded = () => {
    autoplayRef.current = goSong(nextSong(songs.sel, true));
  };

  // Another book always comes face up. False at either end of the shelf.
  const moveBook = (step: 1 | -1) => {
    const moved = shelf.move(step);
    if (moved) setBookBack(false);
    return moved;
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
      case 'mis-libros':
        // + − go to the previous / next book, the open key turns it over, ATRÁS returns to the menu
        if (step) return moveBook(step);
        if (c === 'select') setBookBack((b) => !b);
        else go('menu', 'back');
        return true;
      case 'mi-musica':
        if (step) return songs.move(step);
        if (c === 'select') go('sonando', 'fwd');
        else go('menu', 'back');
        return true;
      case 'sonando': {
        // ⏮ ⏭ (and ← →, − and the ring) change track by the mode; + (and ↑) toggles shuffle; the centre plays
        // or pauses; ATRÁS / Esc return to the list.
        if (c === 'back' && via === 'other') {
          go('mi-musica', 'back');
          return true;
        }
        if (c === 'select' && via === 'other') {
          player.current?.toggle();
          return true;
        }
        if (c === 'prev' && via === 'axis') {
          setShuffle((s) => !s);
          return true;
        }
        const forward = c === 'next' || c === 'select';
        const moved = goSong(forward ? nextSong(songs.sel, false) : prevSong(songs.sel));
        // if music was playing, the song you move to keeps playing (Iñigo, 2026-10-24)
        if (moved) autoplayRef.current = player.current?.playing() ?? false;
        return moved;
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
        dir={dir}
        onPick={(i) => {
          menu.setSel(i);
          open(i);
        }}
      />
    );
  else if (view === 'mis-libros')
    screen = (
      <BooksScreen
        books={books}
        index={shelf.sel}
        flipped={bookBack}
        dir={dir}
        onFlip={() => setBookBack((b) => !b)}
        onMove={moveBook}
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
  else
    screen = (
      <NowPlayingScreen
        tracks={tracks}
        index={track}
        dir={dir}
        playerRef={player}
        shuffle={shuffle}
        onShuffle={() => setShuffle((s) => !s)}
        onEnded={onEnded}
        autoplayRef={autoplayRef}
      />
    );

  return (
    <div className="home" data-page="home">
      <a className="skip" href="#contenido">
        {ui.skipToContent}
      </a>
      <header className="home__header" data-chrome>
        <a className="home__brand" href={href('')} aria-label={`Inicio · ${person.name}`}>
          {person.name}
        </a>
        <nav className="topnav" aria-label={ui.primaryNav} id="enlaces">
          <ul>
            {topNav().map((n) => (
              <li key={n.label}>
                {/* inside Mi música (on the device) the top link marks Mi música, not Inicio */}
                <a href={href(n.path)} aria-current={n.id === (plugged ? 'mi-musica' : 'inicio') ? 'page' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="home__main" id="contenido" tabIndex={-1}>
        <div className="home__intro" data-chrome>
          <h1>{person.greeting}</h1>
          <TrainingLine />
          <p className="home__context">
            {person.context.map((part, i) =>
              typeof part === 'string' ? (
                part
              ) : (
                <span className="home__context-emphasis" key={i}>
                  {part.text}
                </span>
              ),
            )}
          </p>
        </div>

        <div className={'home__stage' + (plugged ? ' is-plugged' : '')}>
          <Device
            data-device="hero"
            onCommand={onCommand}
            globalKeys
            wheelOnBody
            tilt
            flipped={flipped}
            accessory={musicAvailable() && <Earbuds layout={mobile ? 'behind' : 'side'} plugged={plugged} />}
          >
            <Fragment key={view}>{screen}</Fragment>
          </Device>
          <div className="home__under">
            <div className="home__floor" data-chrome>
              <div className="home__floor-actions">
                <button className="ghost" aria-pressed={flipped} onClick={flip}>
                  <Icon name="flip" />
                  <span>{ui.device.flip}</span>
                </button>
                <button className="ghost" aria-pressed={sound} onClick={() => setSound(!sound)}>
                  <Icon name={sound ? 'sound' : 'mute'} />
                  <span>{ui.device.sound}</span>
                </button>
              </div>
            </div>
            <p className="home__keys" data-chrome>
              <span>
                <span className="home__control-symbol" aria-hidden="true">
                  +
                </span>{' '}
                {ui.device.controlsHint.prev}
                <span className="home__control-symbol" aria-hidden="true">
                  −
                </span>{' '}
                {ui.device.controlsHint.next}
              </span>
              <span>
                <span className="home__control-symbol" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={AXIS_PATHS.left} />
                  </svg>
                </span>{' '}
                {ui.device.controlsHint.back}
              </span>
              <span>
                <span className="home__control-symbol" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={AXIS_PATHS.right} />
                  </svg>
                </span>{' '}
                {ui.device.controlsHint.open}
              </span>
            </p>
            <div className="home__cta" data-chrome>
              <a className="pill" href={href('proyectos/')}>
                {ui.seeProjects}
              </a>
            </div>
          </div>
        </div>

        <nav className="home__quick" aria-label={ui.allSections} data-chrome>
          <ul>
            {openSections().map((s) => (
              <li key={s.id}>
                <a href={href(s.path)}>
                  {s.label} <span>{s.id === 'proyectos' ? TOTAL_PROJECTS : '→'}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
