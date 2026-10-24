import morosidad from './morosidad-crediticia.json';

// Project charts, redrawn by the site in its palette (E6, brief §9 · design-system «Gráficos»).
// Each data file is written by its script in scripts/charts/, which re-runs the project's notebook from
// Iñigo's local copy and checks it reproduces the README figures before writing (and, for morosidad, then
// computes the revised evaluation without repeated records).

export interface ChartSeries {
  key: string;
  label: string;
  /** Label drawn next to the line, when `label` is too long for it. */
  short?: string;
  /** The series the text is about: drawn in the accent; the rest, in the comparison gray. */
  main?: boolean;
}

export interface LineChartSpec {
  kind: 'line';
  title: string;
  caption: string;
  x: { label: string; ticks: number[] };
  y: { ticks: number[] };
  series: ChartSeries[];
  points: Record<string, number>[];
  /** Vertical reference lines (a decision threshold…). */
  markers: { x: number; label: string }[];
  /** Where the direct labels sit (x value), where the series are far apart. */
  labelAt: number;
  /** Rows of the table view: one every `tableStep` on x. */
  tableStep: number;
  /** Labels and formats of the readout, the table and the axes. */
  xName: string;
  format: { x: (v: number) => string; y: (v: number) => string };
  source: string;
}

const pct = (v: number) => `${Math.round(v * 100)} %`;
const dec = (v: number) => v.toFixed(2).replace('.', ',');
/** Thousands with a dot, also for 4 digits (es-ES toLocaleString leaves «2520» ungrouped). */
const int = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** The point of a threshold curve at threshold `t` (the figures quoted in the caption come from the data). */
const at = (t: number) => morosidad.points.find((p) => p.t === t)!;

export const charts: Record<string, LineChartSpec> = {
  'morosidad-umbral': {
    kind: 'line',
    title: 'Qué pasa al mover el umbral de decisión',
    caption: `Random Forest sobre los ${int(morosidad.test.n)} clientes de test, sin registros repetidos (AUC ${dec(morosidad.test.auc)}). Con el umbral estándar de 0,5 detecta el ${pct(at(0.5).tpr)} de los morosos y marca como morosos al ${pct(at(0.5).fpr)} de los clientes que pagan. Subirlo a 0,7 reduce esas falsas alarmas al ${pct(at(0.7).fpr)} y sigue detectando el ${pct(at(0.7).tpr)} de los morosos.`,
    x: { label: 'Umbral de probabilidad', ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    y: { ticks: [0, 0.25, 0.5, 0.75, 1] },
    series: [
      { key: 'tpr', label: 'Morosos detectados', main: true },
      { key: 'fpr', label: 'Clientes que pagan marcados como morosos', short: 'Buenos pagadores marcados' },
    ],
    points: morosidad.points,
    markers: [{ x: 0.5, label: 'Umbral estándar' }],
    labelAt: 0.72,
    tableStep: 0.1,
    xName: 'Umbral',
    format: { x: dec, y: pct },
    source: morosidad.source,
  },
};
