import type { Project } from '../types';

const REPO =
  'https://github.com/inigo-diez/Analisis-de-Metabolitos-de-Salud-Mental-de-Mayor-Importancia-y-Caracterizacion-de-ellos-3-Parte-';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const priorizacionMetabolitos: Project = {
  slug: 'priorizacion-metabolitos',
  ref: '01.3',
  collection: '01',
  title: 'Caracterización de Metabolitos Clave',
  shortTitle: 'Priorización de metabolitos',
  summary:
    'Un sistema de puntuación diseñado desde cero (varianza 40 %, magnitud del cambio 30 %, SHAP 20 %, significación 10 %), contrastado con la base de ~39.000 compuestos.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Estadística multivariante', 'Interpretabilidad', 'Priorización'],
  stack: ['SHAP'],
  headline: { value: '4 criterios', label: 'un ranking propio de prioridad' },
  // README: «Introducción», «Qué hace este proyecto» and the figure note.
  facts: [
    // Not the README's «0.65–0.73» reading of its ranking figure: in that figure the value labels look reversed
    // against the bar lengths (told to Iñigo, 2026-10-24), so no score from it is published.
    {
      value: 'Top 30',
      text: 'El ranking ordena los 30 metabolitos más sensibles al cambio entre condiciones experimentales. Son candidatos priorizados, no biomarcadores confirmados.',
    },
    {
      value: 'Señales débiles incluidas',
      text: 'El ranking no descarta compuestos con cambios pequeños o sin significación convencional, para no perder candidatos que podrían interesar en etapas posteriores.',
    },
    {
      value: '5 atributos',
      text: 'Cada coincidencia con la base curada del proyecto 01.1 recibe sus condiciones asociadas, matriz biológica, método de detección, tipo de evidencia y vínculo con la microbiota.',
    },
  ],
  // scripts/covers.py: the bars of the README ranking figure, without its text
  cover: {
    src: 'img/covers/priorizacion-metabolitos.webp',
    alt: 'Barras del ranking de metabolitos más sensibles al cambio experimental, de azul a rojo',
  },
  canvas: { x: 600, y: 60, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (3.ª parte de la serie)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Ranking con el desglose de los 4 criterios (E6)'],
};
