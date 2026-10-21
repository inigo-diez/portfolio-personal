import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/Analisis-Metabolomico-Estadistico-con-Python-2-Parte-';

// Draft (E3). Figures verified against the README (docs/audit/project-map.md, content-inventory.md).
// "8 notebooks" is NOT used: it was not verified.
export const analisisMetabolomicoGcms: Project = {
  slug: 'analisis-metabolomico-gcms',
  ref: '01.2',
  collection: '01',
  title: 'Análisis Metabolómico Estadístico sobre Datos GC-MS',
  shortTitle: 'Análisis metabolómico GC-MS',
  summary:
    'De 1.230 señales cromatográficas a 279 metabolitos de calidad, y de ahí a los que realmente distinguen entre condiciones (PCA, contrastes, RF, XGBoost, SHAP).',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Estadística multivariante', 'Clasificación', 'Interpretabilidad'],
  stack: ['Python', 'scikit-learn', 'XGBoost', 'SHAP'],
  headline: { value: '1.230 → 279', label: 'de picos brutos a metabolitos fiables' },
  facts: [
    '17 experimentos de GC-MS',
    'Filtrado por Match Factor ≥ 700',
    'PCA, K-Means, Mann-Whitney U, Random Forest, XGBoost y SHAP',
  ],
  cover: null,
  canvas: { x: 30, y: 150, w: 250 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (2.ª parte de la serie)', url: REPO }],
  todo: ['Año del proyecto', 'Secciones del caso de estudio (E6)', 'PCA de los 17 experimentos (E6)'],
};
