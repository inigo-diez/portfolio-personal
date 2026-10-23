import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { LineChartSpec } from '../content/charts';
import { ui } from '../content/site';

// Line chart drawn by the site (design-system «Gráficos»): main series in the accent, the rest in the
// comparison gray, no background grid, 2 px lines. Hover or focus + arrows show every series at one x;
// the table under it holds the same values, so the tooltip never gates them (dataviz skill).

const HEIGHT = 280;
const M = { top: 12, right: 16, bottom: 46, left: 48 };
/** Below this width the direct labels would collide: the legend carries identity alone. */
const NARROW = 460;

export function LineChart({ spec }: { spec: LineChartSpec }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(680);
  const [active, setActive] = useState<number | null>(null);
  const id = useId();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, series, format } = spec;
  const xs = spec.x.ticks;
  const ys = spec.y.ticks;
  const [x0, x1] = [xs[0], xs[xs.length - 1]];
  const [y0, y1] = [ys[0], ys[ys.length - 1]];
  const iw = width - M.left - M.right;
  const ih = HEIGHT - M.top - M.bottom;
  const sx = (v: number) => M.left + ((v - x0) / (x1 - x0)) * iw;
  const sy = (v: number) => M.top + (1 - (v - y0) / (y1 - y0)) * ih;
  const xKey = 't';
  const nearest = (v: number) =>
    points.reduce((best, p, i) => (Math.abs(p[xKey] - v) < Math.abs(points[best][xKey] - v) ? i : best), 0);

  const path = (key: string) =>
    points.map((p, i) => `${i ? 'L' : 'M'}${sx(p[xKey]).toFixed(1)},${sy(p[key]).toFixed(1)}`).join('');

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = x0 + ((e.clientX - r.left) / r.width) * (x1 - x0);
    setActive(nearest(v));
  };
  const onKey = (e: KeyboardEvent) => {
    const last = points.length - 1;
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1 };
    let next: number | null = null;
    if (e.key in step) next = Math.min(last, Math.max(0, (active ?? 0) + step[e.key]));
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
  };

  const at = active === null ? null : points[active];
  const readout = at
    ? `${spec.xName} ${format.x(at[xKey])}: ` +
      series.map((s) => `${s.label.toLowerCase()}, ${format.y(at[s.key])}`).join('; ')
    : '';
  const labelPoint = points[nearest(spec.labelAt)];
  const tableRows = points.filter((p) => Math.round(p[xKey] * 100) % Math.round(spec.tableStep * 100) === 0);
  const tipLeft = at ? sx(at[xKey]) : 0;
  const tipFlip = tipLeft > width - 230;

  return (
    <figure className="chart">
      <figcaption className="chart__title" id={`${id}-t`}>
        {spec.title}
      </figcaption>
      <ul className="chart__legend">
        {series.map((s) => (
          <li key={s.key} className={s.main ? 'is-main' : undefined}>
            {s.label}
          </li>
        ))}
      </ul>
      <div
        ref={box}
        className="chart__plot"
        tabIndex={0}
        role="group"
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-c`}
        onKeyDown={onKey}
        onFocus={() => setActive((a) => a ?? nearest(spec.markers[0]?.x ?? x0))}
        onBlur={() => setActive(null)}
      >
        <svg width={width} height={HEIGHT} aria-hidden="true">
          <line className="chart__axis" x1={M.left} x2={width - M.right} y1={sy(y0)} y2={sy(y0)} />
          {ys.map((v) => (
            <text key={v} className="chart__tick" x={M.left - 8} y={sy(v)} dy="0.32em" textAnchor="end">
              {format.y(v)}
            </text>
          ))}
          {xs.map((v) => (
            <text key={v} className="chart__tick" x={sx(v)} y={sy(y0) + 18} textAnchor="middle">
              {format.x(v)}
            </text>
          ))}
          <text className="chart__axis-label" x={M.left + iw / 2} y={HEIGHT - 4} textAnchor="middle">
            {spec.x.label}
          </text>
          {spec.markers.map((m) => (
            <g key={m.x}>
              <line className="chart__marker" x1={sx(m.x)} x2={sx(m.x)} y1={M.top} y2={sy(y0)} />
              <text className="chart__marker-label" x={sx(m.x) + 6} y={sy(y0) - 8}>
                {m.label}
              </text>
            </g>
          ))}
          {series.map((s) => (
            <path key={s.key} className={'chart__line' + (s.main ? ' is-main' : '')} d={path(s.key)} />
          ))}
          {width >= NARROW &&
            series.map((s) => (
              // Main series: above and right of its line; the others: below and left, where the falling
              // comparison line has already passed.
              <text
                key={s.key}
                className="chart__direct"
                x={sx(labelPoint[xKey]) + (s.main ? 8 : -8)}
                y={sy(labelPoint[s.key]) + (s.main ? -10 : 18)}
                textAnchor={s.main ? 'start' : 'end'}
              >
                {s.short ?? s.label}
              </text>
            ))}
          {at && (
            <g>
              <line className="chart__crosshair" x1={sx(at[xKey])} x2={sx(at[xKey])} y1={M.top} y2={sy(y0)} />
              {series.map((s) => (
                <circle
                  key={s.key}
                  className={'chart__dot' + (s.main ? ' is-main' : '')}
                  cx={sx(at[xKey])}
                  cy={sy(at[s.key])}
                  r={4}
                />
              ))}
            </g>
          )}
          <rect
            className="chart__hit"
            x={M.left}
            y={M.top}
            width={iw}
            height={ih}
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
          />
        </svg>
        {at && (
          <div
            className="chart__tip"
            style={tipFlip ? { right: width - tipLeft + 12 } : { left: tipLeft + 12 }}
            aria-hidden="true"
          >
            <span className="chart__tip-x">
              {spec.xName} {format.x(at[xKey])}
            </span>
            {series.map((s) => (
              <span key={s.key} className={'chart__tip-row' + (s.main ? ' is-main' : '')}>
                <b>{format.y(at[s.key])}</b> {s.label}
              </span>
            ))}
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {readout}
        </p>
      </div>
      <p className="chart__caption" id={`${id}-c`}>
        {spec.caption}
      </p>
      <details className="chart__data">
        <summary>{ui.labels.chartData}</summary>
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{spec.xName}</th>
              {series.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((p) => (
              <tr key={p[xKey]}>
                <th scope="row">{format.x(p[xKey])}</th>
                {series.map((s) => (
                  <td key={s.key}>{format.y(p[s.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
