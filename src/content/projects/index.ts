import type { Collection, Project } from '../types';
import { analisisMetabolomicoGcms } from './analisis-metabolomico-gcms';
import { estresPetroleoGdelt } from './estres-petroleo-gdelt';
import { figuris } from './figuris';

// E3: 3 real projects as drafts. The other 10 are added in E6 (see docs/audit/project-map.md).
export const projects: Project[] = [analisisMetabolomicoGcms, estresPetroleoGdelt, figuris];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

// The 4 original groups of the old portfolio, all featured as canvas piles.
// Laid out 2 × 2 like the "Proyectos" preview on the device (01 02 / 03 04).
// Headline figures: verified (docs/audit/project-map.md).
export const collections: Collection[] = [
  {
    id: '01',
    title: 'Metabolómica & Biomarcadores de Salud Mental',
    shortTitle: 'Metabolómica & Biomarcadores',
    kicker: 'GC-MS · ML · TFG',
    projectCount: 5,
    headline: { value: '~39.000', label: 'candidatos a biomarcador indexados', from: 'biomarcadores-salud-mental' },
    canvas: { x: 320, y: 140, w: 330 },
    projects: ['analisis-metabolomico-gcms'],
  },
  {
    id: '02',
    title: 'Geopolítica, Crudo WTI y Mercados Financieros',
    shortTitle: 'Geopolítica y Crudo WTI',
    kicker: 'GDELT · MONTE CARLO · RSJD',
    projectCount: 3,
    headline: { value: '2.000', label: 'trayectorias Monte Carlo por escenario', from: 'simulacion-wti-montecarlo' },
    canvas: { x: 690, y: 140, w: 330 },
    projects: ['estres-petroleo-gdelt'],
  },
  {
    id: '03',
    title: 'Machine Learning Aplicado — Proyectos Kaggle',
    shortTitle: 'ML Aplicado · Kaggle',
    kicker: 'REGRESIÓN · CLASIFICACIÓN',
    projectCount: 3,
    headline: { value: 'F1 0,90', label: 'alerta temprana de morosidad', from: 'morosidad-crediticia' },
    canvas: { x: 320, y: 490, w: 330 },
    projects: [],
  },
  {
    id: '04',
    title: 'IA Generativa para Ciencia e Ingeniería',
    shortTitle: 'IA Generativa',
    kicker: 'LLM · DOCUMENT AI',
    projectCount: 2,
    headline: { value: '0', label: 'citas inventadas llegaron al lector', from: 'figuris' },
    canvas: { x: 690, y: 490, w: 330 },
    projects: ['figuris'],
  },
];

export const TOTAL_PROJECTS = collections.reduce((n, c) => n + c.projectCount, 0); // 13
