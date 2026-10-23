// Iñigo's monogram «iDO» (logos/Logotipo minimalista de Iñigo Díez Osúa.png, 2026-10-23), redrawn as SVG
// from measurements of that PNG. public/favicon.svg and scripts/brand.mjs repeat these paths: keep them in sync.
export const MONOGRAM = {
  viewBox: '0 0 608 347',
  dot: 'M3 6h56a3 3 0 0 1 3 3v51a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z',
  stem: 'M3 88h56a3 3 0 0 1 3 3v245a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V91a3 3 0 0 1 3-3z',
  d: 'M95 6H174.5A166.5 166.5 0 0 1 174.5 339H95V279H174.5A100.5 106.5 0 0 0 174.5 66H95Z',
  oTop: 'M322 40.6A173.5 173.5 0 0 1 606.6 161.5H546.4A113.5 113.5 0 0 0 360.5 86.6Z',
  oBottom: 'M606.6 185.5A173.5 173.5 0 0 1 322 306.4L360.5 260.4A113.5 113.5 0 0 0 546.4 185.5Z',
};

/** Single-colour version (currentColor), for engravings. */
export function Monogram({ className }: { className?: string }) {
  const m = MONOGRAM;
  return (
    <svg className={className} viewBox={m.viewBox} fill="currentColor" aria-hidden="true">
      <path d={`${m.dot}${m.stem}${m.d}${m.oTop}${m.oBottom}`} />
    </svg>
  );
}
