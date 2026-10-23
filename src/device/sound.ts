// Optional device sounds (brief §6: off by default). Synthesised with the Web Audio API, no audio files:
// a short tick when the selection moves (next / prev) and a lower click for select, back and home.
// The choice is remembered in this browser (localStorage); the audio context starts on the click that enables it.
import { useSyncExternalStore } from 'react';
import type { Command } from './Device';

const KEY = 'pocket-sonido';
let enabled = read();
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

function read() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1';
  } catch {
    return false; // blocked storage (private mode, previews): stays off
  }
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // not remembered, but still works for this visit
  }
  if (on) {
    ctx ??= new AudioContext();
    void ctx.resume();
    blip(1500, 0.05, 0.06); // confirms it is on
  }
  listeners.forEach((l) => l());
}

export function useSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => enabled,
    () => false, // prerender: off
  );
  return [on, setSound];
}

/** A short decaying tone: frequency (Hz), length (s), peak gain. */
function blip(freq: number, len: number, gain: number) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + len);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + len);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + len + 0.01);
}

/** The sound of a device command (nothing while sound is off). */
export function commandSound(c: Command) {
  if (!enabled) return;
  ctx ??= new AudioContext(); // enabled on a past visit: created on this first input (a user gesture)
  if (ctx.state === 'suspended') void ctx.resume();
  if (c === 'next' || c === 'prev') blip(2200, 0.018, 0.05);
  else blip(700, 0.05, 0.09);
}
