// Mi música: the songs of Iñigo's public Spotify playlist, in its order (2026-10-24: he sent the playlist and
// left the sentences for later). The list comes from scripts/music-playlist.py (music-playlist.json + the
// official covers in public/img/music/); run it again when the playlist changes.
import playlist from './music-playlist.json';

export interface Track {
  /** Spotify link to the track (https://open.spotify.com/track/…). */
  url: string;
  title: string;
  artist: string;
  /** Iñigo's sentence about the song (≤ 140 characters, fits in 3 lines on the device); none yet. */
  note?: string;
  /** Official cover image from Spotify, unmodified. null = placeholder. */
  cover: string | null;
}

// TODO(content): Iñigo's sentence per song, by Spotify track id (he will write them later).
const notes: Record<string, string> = {};

export const tracks: Track[] = playlist.map((s) => ({
  url: `https://open.spotify.com/track/${s.id}`,
  title: s.title,
  artist: s.artist,
  note: notes[s.id],
  cover: `${import.meta.env.BASE_URL}img/music/${s.id}.jpg`,
}));

/** Optional intro sentence for the section. TODO(content). */
export const musicIntro: string | null = null;

// Development only (?musica=prueba, kept for the session), to test the player and the device controls.
// Not chosen by Iñigo; never prerendered or published. Two real tracks (title and artist checked with
// Spotify's public oEmbed and its player, 2026-10-21) and the example episode of the iFrame API docs.
const TEST_NOTE = 'Datos de prueba para desarrollo: aquí irá la frase de Iñigo sobre la canción.';
const TEST_TRACKS: Track[] = [
  {
    url: 'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl',
    title: 'Cut To The Feeling',
    artist: 'Carly Rae Jepsen',
    note: TEST_NOTE,
    cover: null,
  },
  {
    url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    note: TEST_NOTE,
    cover: null,
  },
  {
    url: 'https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5',
    title: 'Episodio de ejemplo',
    artist: 'Documentación de Spotify',
    note: TEST_NOTE,
    cover: null,
  },
];

let testMode = false;
export const setMusicTest = (on: boolean) => {
  testMode = on;
};

/** Songs shown by the site: the real ones, or the test list while in development mode. */
export const getTracks = (): Track[] => (tracks.length ? tracks : testMode ? TEST_TRACKS : []);
export const musicAvailable = () => getTracks().length > 0;
/** The test list is on screen (it is never in the prerendered HTML). */
export const usingTestTracks = () => !tracks.length && testMode;

export const musicUi = {
  title: 'Mi música',
  nowPlaying: 'Sonando',
  selected: 'Pista seleccionada',
  of: (i: number, n: number) => `${i} de ${n}`,
  open: 'Abrir en Spotify ↗',
  playerLabel: 'Reproductor de Spotify',
  playerFailed: 'No se ha podido cargar el reproductor.',
  controlsOff: 'Usa los controles del reproductor de Spotify.',
  announce: (t: Track) => `Pista seleccionada: ${t.title}, ${t.artist}`,
  shuffle: 'Aleatorio',
  shuffleHint: 'Aleatorio: actívalo o desactívalo (tecla +)',
};
