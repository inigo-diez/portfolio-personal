import { useEffect, useRef, useState, type RefObject } from 'react';
import { musicUi, type Track } from '../content/music';
import { Icon, STATE_PATHS } from '../device/icons';
import { Cover, Frame, useKeepInView, type Dir } from './Screen';
import { loadSpotify, type EmbedController, type PlaybackUpdate } from './spotify';

/** Mi música: the songs, each row with cover, title and artist. */
export function SongsScreen({
  tracks,
  sel,
  onPick,
  dir,
}: {
  tracks: Track[];
  sel: number;
  onPick: (i: number) => void;
  dir: Dir;
}) {
  const { list, bar } = useKeepInView(sel);
  return (
    <Frame title={musicUi.title} live={musicUi.announce(tracks[sel])} dir={dir}>
      <div className="os__main">
        <ul className="os__list songs" role="listbox" aria-label={musicUi.title} ref={list}>
          {tracks.map((t, i) => (
            <li
              key={i}
              className={'song' + (i === sel ? ' is-sel' : '')}
              role="option"
              aria-selected={i === sel}
              onClick={() => onPick(i)}
            >
              <Cover track={t} className="" />
              <span>
                <b>{t.title}</b>
                <small>{t.artist}</small>
              </span>
              <Icon name="chev" className="chev" />
            </li>
          ))}
        </ul>
        <div className="os__scroll" ref={bar} hidden aria-hidden="true">
          <i />
        </div>
      </div>
    </Frame>
  );
}

/** What the device can ask of the player. */
export interface PlayerHandle {
  /** Centre button: play / pause. */
  toggle(): void;
  /** A track is playing (or about to): the next one chosen with ⏮ ⏭ keeps playing. */
  playing(): boolean;
}

const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// https://open.spotify.com/track/ID → spotify:track:ID (what playback_update reports)
const uriOf = (url: string) => {
  const m = /open\.spotify\.com\/(?:intl-[a-z]+\/)?([a-z]+)\/([A-Za-z0-9]+)/.exec(url);
  return m ? `spotify:${m[1]}:${m[2]}` : url;
};

type Status = 'loading' | 'ready' | 'failed';

// paused: last state reported for the loaded track · want: what the centre asked for (true = playing)
// wanted: the track on screen · loaded: the track in the player (they differ while the player starts)
// autoplay: the loaded track follows one that ended, so it starts playing · over: the loaded track has ended
interface PlayerState {
  ready: boolean;
  paused: boolean | null;
  want: boolean;
  waiting: number;
  wanted: string;
  loaded: string;
  autoplay: boolean;
  over: boolean;
}

// The end of a track, as the embed reports it (measured 2026-10-24): it does not pause; its last updates say
// "playing" with the position equal to the duration, then they stop. Margin for rounding.
const END_EPS_MS = 250;

function load(s: PlayerState, c: EmbedController, url: string) {
  s.loaded = url;
  s.paused = null; // the new track starts paused, whatever the previous one was doing
  s.over = false;
  c.loadEntity(url);
}

/**
 * «Sonando»: the chosen track and the official Spotify player, loaded only now (never autoplay on arrival) and
 * destroyed when this screen closes, so the music always stops with it. The device controls the player
 * through the iFrame API: if the API does not answer, the device controls are switched off and the
 * official player (and the direct link) remain. Once the visitor has played a song, it continues by itself:
 * when a song ends, `onEnded` picks the next one (shuffled or in order) and it starts playing.
 */
export function NowPlayingScreen({
  tracks,
  index,
  dir,
  playerRef,
  shuffle,
  onShuffle,
  onEnded,
  autoplayRef,
}: {
  tracks: Track[];
  index: number;
  dir: Dir;
  playerRef: RefObject<PlayerHandle | null>;
  shuffle: boolean;
  onShuffle: () => void;
  onEnded: () => void;
  /** Set by the caller just before it moves to the song that follows an ended one. */
  autoplayRef: RefObject<boolean>;
}) {
  const t = tracks[index];
  const host = useRef<HTMLDivElement>(null);
  const ctl = useRef<EmbedController | null>(null);
  const ended = useRef(onEnded);
  useEffect(() => {
    ended.current = onEnded;
  });
  const state = useRef<PlayerState>({
    ready: false,
    paused: null,
    want: false,
    waiting: 0,
    wanted: t.url,
    loaded: t.url,
    autoplay: false,
    over: false,
  });
  const [status, setStatus] = useState<Status>('loading');
  const [playback, setPlayback] = useState<PlaybackUpdate | null>(null);
  const [controlsOff, setControlsOff] = useState(false);

  // Create the player once for this screen; destroy it on the way out.
  useEffect(() => {
    let alive = true;
    const s = state.current;
    const box = host.current!;
    const el = document.createElement('div');
    box.appendChild(el);
    const giveUp = window.setTimeout(() => alive && setStatus((st) => (st === 'loading' ? 'failed' : st)), 10000);
    loadSpotify()
      .then((api) =>
        api.createController(el, { url: s.loaded, width: '100%', height: 80 }, (c) => {
          if (!alive) return c.destroy();
          ctl.current = c;
          c.addListener('ready', () => {
            clearTimeout(giveUp);
            if (!alive) return;
            s.ready = true;
            setStatus('ready');
            if (s.wanted !== s.loaded)
              load(s, c, s.wanted); // ⏮ ⏭ pressed while the player was starting
            else if (s.autoplay) c.play(); // the embed says "ready" again for each track it loads
          });
          c.addListener('playback_update', (e) => {
            // ignore late updates from the previous track
            if (!alive || e.data.playingURI !== uriOf(s.loaded)) return;
            const d = e.data;
            if (s.waiting && !d.isPaused === s.want) {
              clearTimeout(s.waiting);
              s.waiting = 0;
            }
            s.paused = d.isPaused;
            setPlayback(d);
            // a song that follows an ended one: play it as soon as it is loaded
            if (s.autoplay) {
              if (!d.isPaused) s.autoplay = false;
              else if (!d.isBuffering) c.play();
              return;
            }
            // the end of a song: once per track, the next one follows
            if (!s.over && d.duration > 0 && d.position >= d.duration - END_EPS_MS) {
              s.over = true;
              ended.current();
            }
          });
        }),
      )
      .catch(() => alive && setStatus('failed'));
    return () => {
      alive = false;
      clearTimeout(giveUp);
      clearTimeout(s.waiting);
      ctl.current?.destroy();
      ctl.current = null;
      box.replaceChildren();
    };
  }, []);

  // ⏮ ⏭ load the previous / next track; if music was playing, it keeps playing (Iñigo, 2026-10-24; until then
  // they only loaded it). A song that follows an ended one plays too. Both arrive as `autoplayRef`, set by the
  // caller just before the track changes.
  useEffect(() => {
    const s = state.current;
    s.wanted = t.url;
    clearTimeout(s.waiting); // a pending play / pause retry belongs to the previous track
    s.waiting = 0;
    s.autoplay = autoplayRef.current;
    autoplayRef.current = false;
    if (ctl.current && s.ready && s.loaded !== t.url) load(s, ctl.current, t.url);
  }, [t.url, autoplayRef]);

  // Centre button = play / pause, only while the API answers. A command can be lost while a track loads,
  // so with no answer in 2.5 s it is sent once more; a second silence switches the device controls off
  // (the official player and the direct link remain).
  useEffect(() => {
    playerRef.current = {
      toggle() {
        const c = ctl.current,
          s = state.current;
        if (!c || status !== 'ready' || controlsOff) return;
        s.want = s.paused !== false;
        const send = () => (s.want ? c.resume() : c.pause());
        send();
        clearTimeout(s.waiting);
        s.waiting = window.setTimeout(() => {
          send();
          s.waiting = window.setTimeout(() => setControlsOff(true), 2500);
        }, 2500);
      },
      playing() {
        const s = state.current;
        return s.paused === false || s.autoplay || (!!s.waiting && s.want);
      },
    };
    return () => {
      playerRef.current = null;
    };
  }, [playerRef, status, controlsOff]);

  // position of the track on screen only (the previous one may still be reporting while the new one loads)
  const known = playback && playback.playingURI === uriOf(t.url) && playback.duration > 0;
  return (
    <Frame title={musicUi.nowPlaying} live={musicUi.announce(t)} dir={dir}>
      <div className="np">
        <div className="np__top">
          <Cover track={t} className="np__cov" />
          <div className="np__meta">
            <span className="np__k">{musicUi.of(index + 1, tracks.length)}</span>
            <span className="np__t">{t.title}</span>
            <span className="np__a">{t.artist}</span>
            {t.note && <span className="np__q">«{t.note}»</span>}
          </div>
        </div>
        {/* the progress line (real position, once known) and, at its end, the shuffle icon (blue when on) */}
        <div className="np__prog">
          {known && !controlsOff && (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={playback.isPaused ? STATE_PATHS.pause : STATE_PATHS.play} />
              </svg>
              <span aria-hidden="true">{mmss(playback.position)}</span>
              <i
                aria-hidden="true"
                style={{ ['--p' as string]: `${(100 * playback.position) / playback.duration}%` }}
              />
              <span aria-hidden="true">{mmss(playback.duration)}</span>
            </>
          )}
          <button
            className="np__mode"
            aria-pressed={shuffle}
            aria-label={musicUi.shuffle}
            title={musicUi.shuffleHint}
            onClick={onShuffle}
          >
            <Icon name="shuffle" />
          </button>
        </div>
        {(status === 'failed' || controlsOff) && (
          <p className="np__note" role="status">
            {status === 'failed' ? musicUi.playerFailed : musicUi.controlsOff}
          </p>
        )}
        <div
          className="np__player"
          ref={host}
          role="region"
          aria-label={musicUi.playerLabel}
          hidden={status === 'failed'}
        />
      </div>
    </Frame>
  );
}
