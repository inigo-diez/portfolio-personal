import type { Collection, CollectionId, Project } from '../types';
import { analisisMetabolomicoGcms } from './analisis-metabolomico-gcms';
import { analizadorSensoresLlm } from './analizador-sensores-llm';
import { biomarcadoresSaludMental } from './biomarcadores-salud-mental';
import { contagioEeuuIran } from './contagio-eeuu-iran';
import { estresPetroleoGdelt } from './estres-petroleo-gdelt';
import { figuris } from './figuris';
import { morosidadCrediticia } from './morosidad-crediticia';
import { optimizacionMlVsRsm } from './optimizacion-ml-vs-rsm';
import { optimizacionRsm } from './optimizacion-rsm';
import { precioPortatiles } from './precio-portatiles';
import { precioVehiculos } from './precio-vehiculos';
import { priorizacionMetabolitos } from './priorizacion-metabolitos';
import { simulacionWtiMontecarlo } from './simulacion-wti-montecarlo';

// The 13 projects of the old portfolio (docs/audit/project-map.md), in reference order. E5: card-level data
// for all of them; the case studies are written in E6.
export const projects: Project[] = [
  biomarcadoresSaludMental,
  analisisMetabolomicoGcms,
  priorizacionMetabolitos,
  optimizacionRsm,
  optimizacionMlVsRsm,
  estresPetroleoGdelt,
  simulacionWtiMontecarlo,
  contagioEeuuIran,
  morosidadCrediticia,
  precioVehiculos,
  precioPortatiles,
  figuris,
  analizadorSensoresLlm,
];
const slugsOf = (id: CollectionId) => projects.filter((p) => p.collection === id).map((p) => p.slug);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

// The 4 original groups of the old portfolio. On the canvas each is a region of the universe, laid out like the
// "Proyectos" preview on the device (01 02 / 03 04); `canvas` is the position of its label.
// Headline figures: verified (docs/audit/project-map.md).
export const collections: Collection[] = [
  {
    id: '01',
    title: 'Metabolómica & Biomarcadores de Salud Mental',
    shortTitle: 'Metabolómica & Biomarcadores',
    kicker: 'GC-MS · ML · TFG',
    headline: { value: '~39.000', label: 'candidatos a biomarcador indexados', from: 'biomarcadores-salud-mental' },
    canvas: { x: 0, y: 0, w: 560 },
    projects: slugsOf('01'),
  },
  {
    id: '02',
    title: 'Geopolítica, Crudo WTI y Mercados Financieros',
    shortTitle: 'Geopolítica y Crudo WTI',
    kicker: 'GDELT · MONTE CARLO · RSJD',
    headline: { value: '2.000', label: 'trayectorias Monte Carlo por escenario', from: 'simulacion-wti-montecarlo' },
    canvas: { x: 1020, y: 30, w: 560 },
    projects: slugsOf('02'),
  },
  {
    id: '03',
    title: 'Machine Learning Aplicado — Proyectos Kaggle',
    shortTitle: 'ML Aplicado · Kaggle',
    kicker: 'REGRESIÓN · CLASIFICACIÓN',
    headline: { value: 'F1 0,90', label: 'alerta temprana de morosidad', from: 'morosidad-crediticia' },
    canvas: { x: 0, y: 860, w: 560 },
    projects: slugsOf('03'),
  },
  {
    id: '04',
    title: 'IA Generativa para Ciencia e Ingeniería',
    shortTitle: 'IA Generativa',
    kicker: 'LLM · DOCUMENT AI',
    headline: { value: '0', label: 'citas inventadas llegaron al lector', from: 'figuris' },
    canvas: { x: 1100, y: 520, w: 560 },
    projects: slugsOf('04'),
  },
];

export const TOTAL_PROJECTS = projects.length; // 13 (a collection's count is its projects.length)
