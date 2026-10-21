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
};

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
