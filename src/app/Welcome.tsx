import { useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { person } from '../content/profile';
import { ui } from '../content/site';
import './welcome.css';

// Welcome screen (E8, Iñigo, 2026-10-24; exception in CLAUDE.md): before the home, once per session, a white
// screen where one line types itself out, then it fades into the home. Only when the session starts on the home
// (index.html decides it before the first paint and covers the page with white); never coming back from a
// project, on a reload or when the session starts on another page. A click, a touch or a key skips it; with
// reduced motion the line shows whole for a moment, without typing.
export const WELCOME_KEY = 'ido-welcome'; // sessionStorage; the dev checks set it to skip the welcome

const PROMPT = '> ';
const TEXT = `${ui.welcome} ${person.name}`;
const PAUSE_AFTER = TEXT.indexOf(' '); // after «Bienvenido»
const NAME_AT = TEXT.length - person.name.length; // before the name
const FIRST_MS = 450; // the white screen alone, before the first character
const HOLD_MS = 700; // the whole line, before its exit animation
const LINE_EXIT_MS = 500;
const FADE_MS = 400;

function Welcome({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const [typed, setTyped] = useState(reduced ? TEXT.length : 0);
  const [exiting, setExiting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // the overlay is on screen: the white cover index.html put on the page can go
  useLayoutEffect(() => {
    document.documentElement.classList.remove('welcome-pending');
  }, []);

  useEffect(() => {
    let timer = 0,
      done = false;
    const finish = (animateLine: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      setTyped(TEXT.length);
      if (animateLine) {
        setExiting(true);
        timer = window.setTimeout(() => {
          setLeaving(true);
          timer = window.setTimeout(onDone, FADE_MS);
        }, LINE_EXIT_MS);
      } else {
        setLeaving(true);
        timer = window.setTimeout(onDone, reduced ? 0 : FADE_MS);
      }
    };
    if (reduced) timer = window.setTimeout(() => finish(false), 1200);
    else {
      // 70–90 ms per character, a longer pause after «Bienvenido» and a short one before the name
      const step = (i: number) => {
        setTyped(i);
        if (i === TEXT.length) return void (timer = window.setTimeout(() => finish(true), HOLD_MS));
        const pause = i === PAUSE_AFTER ? 400 : i === NAME_AT ? 220 : 0;
        timer = window.setTimeout(() => step(i + 1), 70 + Math.random() * 20 + pause);
      };
      timer = window.setTimeout(() => step(1), FIRST_MS);
    }
    // skip: the click, touch or key is the welcome's own (it does not reach the home)
    const skip = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      finish(false);
    };
    addEventListener('pointerdown', skip, true);
    addEventListener('keydown', skip, true);
    return () => {
      clearTimeout(timer);
      removeEventListener('pointerdown', skip, true);
      removeEventListener('keydown', skip, true);
    };
  }, [onDone, reduced]);

  return (
    <div className={'welcome' + (exiting ? ' is-exiting' : '') + (leaving ? ' is-leaving' : '')} aria-hidden="true">
      {/* the whole line is laid out from the start (the untyped part invisible), so it never moves or rewraps */}
      <p className="welcome__line">
        <span>{PROMPT}</span>
        <span>{TEXT.slice(0, typed)}</span>
        <span key={typed} className="welcome__cursor" />
        <span className="welcome__rest">{TEXT.slice(typed)}</span>
      </p>
    </div>
  );
}

/** Shows the welcome over the home if index.html asked for it (session starting on the home). */
export function showWelcome() {
  if (!document.documentElement.classList.contains('welcome-pending')) return;
  document.documentElement.classList.add('welcome-active');
  try {
    sessionStorage.setItem(WELCOME_KEY, '1');
  } catch {
    /* private mode: it may show again on the next visit to the home in this tab, nothing else */
  }
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  root.render(
    <Welcome
      reduced={matchMedia('(prefers-reduced-motion: reduce)').matches}
      onDone={() => {
        root.unmount();
        host.remove();
        document.documentElement.classList.remove('welcome-active');
        dispatchEvent(new Event('portfolio-welcome-done'));
      }}
    />,
  );
}
