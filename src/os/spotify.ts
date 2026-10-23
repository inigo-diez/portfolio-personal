// Spotify iFrame API (https://developer.spotify.com/documentation/embeds/references/iframe-api).
// The script is loaded only when a track is chosen in Mi música: nothing from Spotify runs before that.
// No volume control exists in this API, and there is no autoplay: playback only starts from a user action.

export interface PlaybackUpdate {
  playingURI: string;
  isPaused: boolean;
  isBuffering: boolean;
  /** milliseconds */
  duration: number;
  /** milliseconds */
  position: number;
}

export interface EmbedController {
  loadEntity(uriOrUrl: string, preferVideo?: boolean, startAt?: number): void;
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  destroy(): void;
  addListener(event: 'ready', fn: () => void): void;
  addListener(event: 'playback_update', fn: (e: { data: PlaybackUpdate }) => void): void;
}

interface IFrameAPI {
  createController(
    el: HTMLElement,
    opts: { url?: string; uri?: string; width?: number | string; height?: number },
    cb: (c: EmbedController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

const SRC = 'https://open.spotify.com/embed/iframe-api/v1';
// The script is added once and its promise kept, so a slow load is never duplicated; only a failed
// script (onerror) is removed so that a later call can try again.
let script: Promise<IFrameAPI> | null = null;

/** Load the API once. Rejects after `timeout` ms; the script keeps loading for the next call. */
export function loadSpotify(timeout = 8000): Promise<IFrameAPI> {
  if (!script) {
    script = new Promise<IFrameAPI>((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onerror = () => {
        s.remove();
        script = null;
        reject(new Error('Spotify: script failed'));
      };
      document.head.appendChild(s);
    });
  }
  return Promise.race([
    script,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Spotify: timeout')), timeout)),
  ]);
}
