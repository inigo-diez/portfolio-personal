import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/laptop-price-prediction-egypt';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const precioPortatiles: Project = {
  slug: 'precio-portatiles',
  ref: '03.3',
  collection: '03',
  title: 'Predicción de Precio de Portátiles Reacondicionados (Egipto)',
  shortTitle: 'Precio de portátiles reacondicionados',
  summary:
    'Valoración automática para e-commerce de segunda mano, mejorando en 23 € el error de la solución de referencia del curso.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Regresión', 'Feature engineering', 'Limpieza de datos'],
  stack: ['Python', 'scikit-learn', 'XGBoost'],
  headline: { value: 'R² 0,82', label: 'MAE 152 €' },
  facts: [
    '1.033 portátiles de un dataset público de Kaggle, obtenido por scraping por su autor',
    'XGBoost optimizado: MAE 152,32 € y R² 0,823',
    'Solución de referencia del curso: MAE 175,31 € y R² 0,730',
  ],
  cover: null,
  canvas: { x: 600, y: 920, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio laptop-price-prediction-egypt', url: REPO }],
  todo: ['Secciones del caso de estudio (E6)', 'Real frente a predicho (E6; no hay figura previa)'],
};
