import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/RSM-estadistica-optimizacion-extraccion-VOCs';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const optimizacionRsm: Project = {
  slug: 'optimizacion-rsm',
  ref: '01.4',
  collection: '01',
  title: 'Optimización de Extracción de VOCs mediante RSM',
  shortTitle: 'Extracción de VOCs con RSM',
  summary:
    'Encontrar el mejor punto de un proceso con solo 17 experimentos y nueve objetivos en conflicto, con la función de deseabilidad de Derringer-Suich.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Diseño de experimentos', 'Optimización multirrespuesta', 'Estadística'],
  stack: ['Python', 'statsmodels', 'SciPy'],
  headline: { value: '9 respuestas', label: 'optimizadas a la vez con 17 experimentos' },
  // README: §2 (Diseño experimental) and §6 (Conclusiones finales).
  facts: [
    {
      value: 'R² > 0,85',
      text: 'El modelo cuadrático ajusta bien las respuestas principales (metabolitos diana, totales e indol): el diseño compuesto central cubre la región relevante del proceso.',
    },
    {
      value: 'x₁ × x₂',
      text: 'La interacción que manda: el indol solo alcanza fracciones altas con extracción larga y desorción intensa a la vez, señal de un mecanismo de liberación secuencial.',
    },
    {
      value: '±15 %',
      text: 'Recomendé condiciones de operación (extracción de ~90–120 min, desorción de ~2,5–3 min, incubación de ~10 min) y comprobé que el óptimo se mantiene ante perturbaciones del ±15 % en las especificaciones.',
    },
  ],
  // scripts/covers.py: the README figure Y1_Superficies, whole
  cover: {
    src: 'img/covers/optimizacion-rsm.webp',
    alt: 'Superficies de respuesta del número de metabolitos diana según los tiempos del proceso',
  },
  canvas: { x: 150, y: 430, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio RSM-estadistica-optimizacion-extraccion-VOCs', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Superficie o contorno de la respuesta global (E6)'],
};
