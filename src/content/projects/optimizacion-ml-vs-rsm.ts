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
  facts: [
    'N = 17: RSM frente a PLS, Random Forest, XGBoost y Gaussian Process, validados con LOOCV',
    'Random Forest y XGBoost atribuyen ~70 % de la importancia a un solo factor (x₁)',
    'Random Forest, el más equilibrado: primero del ranking global (36,0 puntos)',
    'Con 17 puntos la generalización es limitada: solo XGBoost logra un R² de validación positivo en Y_detected (0,136)',
  ],
  cover: null,
  canvas: { x: 450, y: 470, w: 260 },
  links: { repo: REPO },
  readmeLang: 'en',
  sections: [],
  sources: [{ label: 'README del repositorio (en inglés)', url: REPO }],
  todo: [
    'Año del proyecto',
    'Secciones del caso de estudio (E6)',
    '¿x₁ = tiempo de extracción? (el README lo define así: confirmar antes de nombrarlo)',
    'Importancia de factores por modelo (E6)',
  ],
};
