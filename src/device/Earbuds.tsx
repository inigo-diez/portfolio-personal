// Plug, cable and a pair of button earbuds (v3, approved 2026-10-21), ported from
// prototypes/musica/propuesta.html. Drawn in device units (device body = 0..100 × 0..124, floor ≈ 125);
// light from the top left. Decorative only (aria-hidden): the screen title already says "Mi música".
//   side:   desktop — the cable loops off the socket, hangs away from the body, lands on the floor and splits;
//           the buds rest to the right, clear of the body, its reflection and the buttons.
//   behind: mobile — no room at the sides, so the cable drops behind the device and the buds rest below it.
import './earbuds.css';

type Pt = [number, number];
interface Bud {
  at: Pt;
  rot: number;
  fx: 1 | -1;
  c1: Pt;
  k: number;
}
interface Layout {
  main: string;
  split: { at: Pt; rot: number };
  a: Bud;
  b: Bud;
}
export type EarbudsLayout = 'side' | 'behind';

const S = 1.15; // earbud scale
const LAYOUTS: Record<EarbudsLayout, Layout> = {
  side: {
    main: 'M80 -10.2 C80 -17.5 84 -21 90.5 -20.6 C98.5 -20.1 104.6 -13 106.6 -2 C108.2 7 108.4 30 108.3 55 C108.2 80 108.4 100 109.6 112 C110.6 121.5 112.6 125.6 116.2 126.6 C116.8 126.75 117.2 126.8 117.6 126.8',
    split: { at: [119.2, 126.85], rot: 2 },
    a: { at: [128.5, 135.5], rot: 26, fx: -1, c1: [123.4, 127.6], k: 3.4 },
    b: { at: [143, 128.6], rot: -14, fx: -1, c1: [124.5, 125.2], k: 3.6 },
  },
  behind: {
    main: 'M80 -10.2 C80 -16 82 -19.5 87 -19.8 C92.5 -20.1 96 -15.5 95.2 -8 C94.6 -2.5 92 4 90 12 C82 60 70 100 74 124 C74.6 127.5 76.8 129.2 79.6 129.6',
    split: { at: [81, 129.8], rot: 8 },
    a: { at: [72.5, 139], rot: -24, fx: 1, c1: [85, 131.4], k: 2.8 },
    b: { at: [93, 140.2], rot: 10, fx: -1, c1: [83.6, 133.4], k: 2.9 },
  },
};
const NECK_END = 6.65; // local x of the neck tip, where the cable enters
const rotPt = ([x, y]: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
};
const f = (n: number) => n.toFixed(2);
const neck = (b: Bud) => {
  const [dx, dy] = rotPt([b.fx * S * NECK_END, 0], b.rot);
  return { tip: [b.at[0] + dx, b.at[1] + dy] as Pt, dir: rotPt([b.fx, 0], b.rot) };
};
const branch = (split: Layout['split'], b: Bud) => {
  const [ox, oy] = rotPt([1.75, 0], split.rot);
  const { tip, dir } = neck(b);
  const c2 = [tip[0] + dir[0] * b.k, tip[1] + dir[1] * b.k];
  return `M${f(split.at[0] + ox)} ${f(split.at[1] + oy)} C${b.c1.join(' ')} ${f(c2[0])} ${f(c2[1])} ${f(tip[0])} ${f(tip[1])}`;
};
// a round white cable: soft grey rim, white satin body, broad highlight on the lit side
const wire = (d: string, w: number) =>
  `<path pathLength="1" d="${d}" stroke="#C9CDD2" stroke-width="${w}"/>` +
  `<path pathLength="1" d="${d}" stroke="#F3F4F6" stroke-width="${f(w * 0.8)}"/>` +
  `<path pathLength="1" d="${d}" stroke="#FFFFFF" stroke-width="${f(w * 0.38)}" transform="translate(${f(-w * 0.12)} ${f(-w * 0.1)})"/>`;

// one button earbud around its centre: glossy oval shell, domed acoustic face tilted away, tapered neck
// with a white collar where the cable enters. Mirrored with fx = -1.
const bud = (b: Bud) => {
  const [x, y] = b.at,
    L = b.fx > 0 ? '' : 'R';
  return `<g transform="translate(${x} ${y}) rotate(${b.rot}) scale(${b.fx * S} ${S})">
    <path d="M2.4 -1.3 C4 -1.1 5.6 -.78 6.35 -.64 C6.75 -.58 6.75 .58 6.35 .64 C5.6 .78 4 1.1 2.4 1.3 Z" fill="url(#gNeck)" stroke="rgba(0,0,0,.14)" stroke-width=".1"/>
    <rect x="5.5" y="-.66" width="1.3" height="1.32" rx=".3" fill="url(#gCollar)" stroke="rgba(0,0,0,.12)" stroke-width=".08"/>
    <ellipse cx=".3" cy="0" rx="3.7" ry="3.15" fill="url(#gShell${L})" stroke="rgba(0,0,0,.13)" stroke-width=".12"/>
    <ellipse cx="1.5" cy="1.6" rx="2" ry=".8" fill="rgba(60,66,74,.07)" transform="rotate(-18 1.5 1.6)"/>
    <g transform="rotate(-8 -2.15 .15)">
      <ellipse cx="-2.15" cy=".15" rx="1.9" ry="3.14" fill="rgba(20,24,32,.18)" filter="url(#fCore)"/>
      <ellipse cx="-2.15" cy=".15" rx="1.7" ry="3" fill="url(#gRim${L})" stroke="rgba(0,0,0,.12)" stroke-width=".08"/>
      <ellipse cx="-2.24" cy=".18" rx="1.34" ry="2.6" fill="url(#gDome${L})"/>
      <ellipse cx="-2.4" cy=".2" rx=".84" ry="1.72" fill="none" stroke="#fff" stroke-width=".09" opacity=".9" transform="translate(${b.fx * 0.07} .08)"/>
      <ellipse cx="-2.4" cy=".2" rx=".84" ry="1.72" fill="url(#gCap${L})" stroke="rgba(0,0,0,.2)" stroke-width=".08"/>
      <ellipse cx="${-2.3 - b.fx * 0.62}" cy="-1.15" rx=".24" ry=".95" fill="#fff" opacity=".85" filter="url(#fSpec)"/>
    </g>
    <ellipse cx="${b.fx * -0.2}" cy="-2" rx="1.5" ry=".48" fill="#fff" opacity=".95" transform="rotate(${b.fx * -10} ${b.fx * -0.2} -2)" filter="url(#fSpec)"/>
  </g>`;
};
// contact shadow: a tight dark core where the shell touches the floor + a wider soft penumbra
const contact = ([x, y]: Pt, rx: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx * 1.25}" ry="1.1" fill="rgba(20,24,32,.10)" filter="url(#fSoft)"/>` +
  `<ellipse cx="${x}" cy="${y - 0.2}" rx="${rx * 0.7}" ry=".42" fill="rgba(20,24,32,.22)" filter="url(#fCore)"/>`;

const DEFS = `<defs>
  <linearGradient id="gPlug" x1="0" x2="1"><stop offset="0" stop-color="#C9CDD2"/><stop offset=".45" stop-color="#FAFBFC"/><stop offset="1" stop-color="#C4C8CD"/></linearGradient>
  <linearGradient id="gWhite" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3F4F6"/><stop offset="1" stop-color="#D5D8DC"/></linearGradient>
  <linearGradient id="gWhiteV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F2F3F5"/><stop offset="1" stop-color="#D3D6DA"/></linearGradient>
  <linearGradient id="gCollar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCDFE2"/></linearGradient>
  <linearGradient id="gNeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDFDFD"/><stop offset=".55" stop-color="#E3E5E8"/><stop offset="1" stop-color="#B8BDC3"/></linearGradient>
  <radialGradient id="gShell" cx=".36" cy=".28" r=".78"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".42" stop-color="#F4F5F7"/><stop offset=".82" stop-color="#DADDE1"/><stop offset="1" stop-color="#C2C7CC"/></radialGradient>
  <radialGradient id="gShellR" cx=".64" cy=".28" r=".78"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".42" stop-color="#F4F5F7"/><stop offset=".82" stop-color="#DADDE1"/><stop offset="1" stop-color="#C2C7CC"/></radialGradient>
  <linearGradient id="gRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#EEF0F2"/><stop offset="1" stop-color="#AEB3BA"/></linearGradient>
  <linearGradient id="gRimR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#EEF0F2"/><stop offset="1" stop-color="#AEB3BA"/></linearGradient>
  <radialGradient id="gDome" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#F1F2F4"/><stop offset=".68" stop-color="#D7DADE"/><stop offset="1" stop-color="#ADB2B9"/></radialGradient>
  <radialGradient id="gDomeR" cx=".58" cy=".4" r=".62"><stop offset="0" stop-color="#F1F2F4"/><stop offset=".68" stop-color="#D7DADE"/><stop offset="1" stop-color="#ADB2B9"/></radialGradient>
  <radialGradient id="gCap" cx=".62" cy=".64" r=".7"><stop offset="0" stop-color="#D9DCE0"/><stop offset=".7" stop-color="#C6CACF"/><stop offset="1" stop-color="#AFB4BB"/></radialGradient>
  <radialGradient id="gCapR" cx=".38" cy=".64" r=".7"><stop offset="0" stop-color="#D9DCE0"/><stop offset=".7" stop-color="#C6CACF"/><stop offset="1" stop-color="#AFB4BB"/></radialGradient>
  <filter id="fSoft" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation=".55"/></filter>
  <filter id="fCore" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation=".18"/></filter>
  <filter id="fSpec" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation=".12"/></filter>
  <filter id="fCable" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx=".25" dy=".55" stdDeviation=".35" flood-color="#141820" flood-opacity=".16"/></filter>
</defs>`;

const PLUG = `<g class="plug">
  <rect x="79.25" y="-10.4" width="1.5" height="3.4" rx=".35" fill="url(#gWhite)" stroke="rgba(0,0,0,.13)" stroke-width=".1"/>
  <rect x="78.4" y="-7.3" width="3.2" height="6.9" rx=".85" fill="url(#gWhite)" stroke="rgba(0,0,0,.14)" stroke-width=".12"/>
  <path d="M79.05 -6.6 v5.4" stroke="#fff" stroke-width=".45" stroke-linecap="round"/>
  <rect x="78.55" y="-.7" width="2.9" height=".75" rx=".2" fill="url(#gPlug)" stroke="rgba(0,0,0,.12)" stroke-width=".08"/>
</g>`;

function art(kind: EarbudsLayout) {
  const L = LAYOUTS[kind],
    sp = L.split;
  return `${DEFS}
  <g class="cable cable--main" fill="none" filter="url(#fCable)">${wire(L.main, 1)}</g>
  ${PLUG}
  <g class="bud">${contact([sp.at[0], sp.at[1] + 0.95], 2)}${contact([L.a.at[0], L.a.at[1] + 3.45], 3.9)}${contact([L.b.at[0], L.b.at[1] + 3.45], 3.9)}</g>
  <g class="cable cable--pair" fill="none" filter="url(#fCable)">${wire(branch(sp, L.a), 0.85)}${wire(branch(sp, L.b), 0.85)}</g>
  <g class="bud">
    <g transform="translate(${sp.at.join(' ')}) rotate(${sp.rot})">
      <rect x="-1.8" y="-.78" width="3.6" height="1.56" rx=".7" fill="url(#gWhiteV)" stroke="rgba(0,0,0,.13)" stroke-width=".1"/>
      <path d="M-1.3 -.42 h2.6" stroke="#fff" stroke-width=".32" stroke-linecap="round"/>
    </g>
    ${bud(L.a)}${bud(L.b)}
  </g>`;
}
const ART: Record<EarbudsLayout, string> = { side: art('side'), behind: art('behind') };

/** Static, trusted markup built above from constants (no user content). */
export function Earbuds({ layout, plugged }: { layout: EarbudsLayout; plugged: boolean }) {
  return (
    <svg
      className={`acc acc--${layout}` + (plugged ? ' is-plugged' : '')}
      viewBox="-10 -30 160 182"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ART[layout] }}
    />
  );
}
