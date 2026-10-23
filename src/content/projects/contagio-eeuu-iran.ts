import type { Project } from '../types';

const REPO =
  'https://github.com/inigo-diez/Geopolitica-y-Crudo-Motor-de-Inferencia-Belica-con-RSJD-y-Senales-de-Mercado-EEUU-Iran-2026-Parte-3';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const contagioEeuuIran: Project = {
  slug: 'contagio-eeuu-iran',
  ref: '02.3',
  collection: '02',
  title: 'Motor de Inferencia Bélica: Contagio Financiero EE. UU.–Irán 2026',
  shortTitle: 'Contagio EE. UU.–Irán 2026',
  summary:
    'Un modelo cuantitativo enfrentado a la «sabiduría colectiva» de los mercados de predicción (Polymarket) en un conflicto en tiempo real.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Series temporales', 'Clasificación', 'Integración de fuentes'],
  stack: ['Python', 'pandas', 'scikit-learn', 'yfinance', 'API de Polymarket'],
  headline: { value: '8 fuentes', label: 'y 67 variables, con datos desde 1986' },
  facts: [
    '8 fuentes de datos; precio diario del WTI desde enero de 1986 (FRED)',
    '67 variables predictoras; Random Forest con AUC 0,615 fuera de muestra (2021–2026)',
    '717 mercados de Polymarket filtrados y cruzados con el modelo histórico',
    'Polymarket como fuente auxiliar de expectativas, nunca como validación independiente',
  ],
  cover: null,
  canvas: { x: 1620, y: 90, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (3.ª parte de la serie)', url: REPO }],
  todo: ['Secciones del caso de estudio (E6)', 'Modelo frente a Polymarket (E6)'],
};
