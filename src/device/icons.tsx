// Line icons for the OS and the keys (24 × 24, stroke = currentColor).
const PATHS = {
  canvas: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="5.5" width="7" height="5" rx="1" />
      <rect x="5.5" y="13.5" width="6" height="7" rx="1" />
      <rect x="14.5" y="13.5" width="6" height="6" rx="1" />
    </>
  ),
  stack: (
    <>
      <path d="M4 9l8-4 8 4-8 4z" />
      <path d="M4 13l8 4 8-4M4 17l8 4 8-4" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="1" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8.2 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.8" />
    </>
  ),
  chev: <path d="M9 5.5l6.5 6.5L9 18.5" />,
  back: <path d="M19 12H5.5M11 6l-6 6 6 6" />,
  home: (
    <>
      <path d="M4 11l8-6.5 8 6.5" />
      <path d="M6.5 9.5v10h11v-10" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  plus: <path d="M5 12h14M12 5v14" />,
  reset: <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7" />,
  list: <path d="M5 7h14M5 12h14M5 17h14" />,
  link: <path d="M10 14l4-4M8.5 11.5l-2 2a3 3 0 004.2 4.2l2-2M15.5 12.5l2-2a3 3 0 00-4.2-4.2l-2 2" />,
  doc: (
    <>
      <path d="M6.5 3.5h7.5l4 4v13h-11.5z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  download: <path d="M12 4.5v11M7 11l5 5 5-5M5 19.5h14" />,
  note: (
    <>
      <path d="M9 17.5V6l10-2v11.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="15.5" r="2.5" />
    </>
  ),
  // one eighth note (head, stem, flag): the Mi música mark in the home menu preview
  music: (
    <>
      <circle cx="8" cy="17.5" r="3" />
      <path d="M11 17.5V4.5M11 4.5c0 3.5 6 3.5 6 8" />
    </>
  ),
  // an open book: two pages meeting at the spine (the Mis libros mark in the home menu preview)
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v12.5c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z" />
      <path d="M12 6.5V19" />
    </>
  ),
  flip: (
    <>
      <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
      <path d="M18.5 3.5v3.6h-3.6M5.5 20.5v-3.6h3.6" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  shuffle: (
    <>
      <path d="M4 7h3.5c3 0 4.5 10 8 10H20M4 17h3.5c1.4 0 2.4-2.1 3.3-4.4M13.2 11.4c.9-2.3 1.9-4.4 3.3-4.4H20" />
      <path d="M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="M16 10l4 4M20 10l-4 4" />
    </>
  ),
};

// Official brand marks in their official colours, for the Contacto preview. Gmail: its own four-colour logo (2020),
// paths unchanged from Wikimedia Commons "Gmail_icon_(2020).svg", the same file as public/img/contact/gmail.svg
// (Iñigo, 2026-10-24). LinkedIn and GitHub: Simple Icons 13.0.0 (CC0), 24 × 24, one colour each.
type BrandMark = { viewBox: string; paths: readonly { fill: string; d: string }[] };

export const BRAND_LOGOS: Record<'gmail' | 'linkedin' | 'github', BrandMark> = {
  gmail: {
    viewBox: '52 42 88 66',
    paths: [
      { fill: '#4285f4', d: 'M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6' },
      { fill: '#34a853', d: 'M120 108h14c3.32 0 6-2.69 6-6V59l-20 15' },
      { fill: '#fbbc04', d: 'M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2' },
      { fill: '#ea4335', d: 'M72 74V48l24 18 24-18v26L96 92' },
      { fill: '#c5221f', d: 'M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2' },
    ],
  },
  linkedin: {
    viewBox: '0 0 24 24',
    paths: [
      {
        fill: '#0A66C2',
        d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      },
    ],
  },
  github: {
    viewBox: '0 0 24 24',
    paths: [
      {
        fill: '#181717',
        d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
      },
    ],
  },
};

export function BrandLogo({ name, className }: { name: keyof typeof BRAND_LOGOS; className?: string }) {
  const b = BRAND_LOGOS[name];
  return (
    <svg className={className} viewBox={b.viewBox} aria-hidden="true">
      {b.paths.map((p) => (
        <path key={p.d} fill={p.fill} d={p.d} />
      ))}
    </svg>
  );
}

/** Solid status glyphs for «Sonando» (state display only, not controls). */
export const STATE_PATHS = {
  play: 'M8 5.5v13l10.5-6.5z',
  pause: 'M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

// Ring axis symbols chosen by Iñigo (2026-10-20): + − ⏮ ⏭. Labels only: prev / next / back / select.
export const AXIS_PATHS = {
  up: 'M10.5 5h3v5.5H19v3h-5.5V19h-3v-5.5H5v-3h5.5z',
  down: 'M5 10.5h14v3H5z',
  left: 'M3.5 6.5h2.4v11H3.5zM5.9 12l7.6-5.5v11zM13 12l7.6-5.5v11z',
  right: 'M20.5 6.5h-2.4v11h2.4zM18.1 12l-7.6-5.5v11zM11 12L3.4 6.5v11z',
} as const;

export function Battery() {
  return (
    <svg className="os__batt" viewBox="0 0 26 13" aria-hidden="true">
      <rect x=".7" y=".7" width="22" height="11.6" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.6" y="2.6" width="16" height="7.8" rx=".8" fill="currentColor" />
      <rect x="23.6" y="4.2" width="1.8" height="4.6" rx=".6" fill="currentColor" />
    </svg>
  );
}
