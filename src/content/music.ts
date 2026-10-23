// Mi música: songs chosen by Iñigo, one personal sentence each (docs/PLAN.md, agreed 2026-10-20).
// Nothing here is invented: the section is not published until `tracks` has real entries.

export interface Track {
  /** Spotify link to the track, as Iñigo sends it (https://open.spotify.com/track/…). */
  url: string;
  title: string;
  artist: string;
  /** Iñigo's sentence about the song (≤ 140 characters, fits in 3 lines on the device). */
  note: string;
  /** Official cover image from Spotify, unmodified. null = placeholder. */
  cover: string | null;
}

// TODO(content): Iñigo's songs, in the order he wants them (new ones go at the end).
export const tracks: Track[] = [];

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
};
