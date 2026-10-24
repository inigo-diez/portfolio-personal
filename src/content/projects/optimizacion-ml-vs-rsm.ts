import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/Complete-optimization-of-an-anlytical-chemistry-experimental-design';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const optimizacionMlVsRsm: Project = {
  slug: 'optimizacion-ml-vs-rsm',
  ref: '01.5',
  collection: '01',
  title: 'Optimización Experimental SPME-GC-MS con ML',
  shortTitle: 'RSM frente a machine learning',
  summary:
    'RSM clásico frente a cuatro modelos de machine learning con solo 17 datos: cuál predice mejor y qué factor manda.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Diseño de experimentos', 'Comparación de modelos', 'Interpretabilidad'],
  stack: ['Python', 'scikit-learn', 'XGBoost', 'SHAP', 'statsmodels'],
  headline: { value: '~70 %', label: 'de la importancia en un solo factor' },
  // README (Spanish translation): «ML supervisado», «Optimización final» and «Conclusiones» C1, C4, C5.
  facts: [
    {
      value: '8 métodos',
      text: 'El tiempo de extracción (x₁) domina sea cual sea el análisis: lo confirman ocho métodos distintos, de las correlaciones y el RSM a SHAP y las curvas PDP.',
    },
    {
      value: 'R² CV 0,306 frente a −0,122',
      text: 'Comparé RSM con PLS, Random Forest, XGBoost y Gaussian Process dejando un experimento fuera cada vez: Random Forest generaliza mejor que el RSM y es el más equilibrado.',
    },
    {
      value: '85–120 min',
      text: 'Pasé los óptimos de los modelos a minutos reales y propuse una región para la campaña confirmatoria: extracción de 85–120 min, desorción de 1–2,5 min e incubación de 5–15 min.',
    },
  ],
  // scripts/covers.py: the README figure 05_03_rsm_surface_contour, whole
  cover: {
    src: 'img/covers/optimizacion-ml-vs-rsm.webp',
    alt: 'Mapas de contorno de los modelos RSM sobre el espacio de factores',
  },
  canvas: { x: 450, y: 470, w: 260 },
  links: { repo: REPO },
  readmeTranslated: true,
  sections: [],
  sources: [{ label: 'README del repositorio (en inglés)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Importancia de factores por modelo (E6)'],
};
