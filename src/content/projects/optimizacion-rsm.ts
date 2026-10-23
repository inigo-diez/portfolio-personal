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
  facts: [
    'Diseño compuesto central: 3 factores y 17 experimentos en 3 bloques',
    'Ajuste cuadrático completo y localización del óptimo con el análisis del Hessiano',
    'Optimización conjunta con la deseabilidad de Derringer y Suich (1980)',
  ],
  cover: null,
  canvas: { x: 150, y: 430, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio RSM-estadistica-optimizacion-extraccion-VOCs', url: REPO }],
  todo: ['Secciones del caso de estudio (E6)', 'Superficie o contorno de la respuesta global (E6)'],
};
