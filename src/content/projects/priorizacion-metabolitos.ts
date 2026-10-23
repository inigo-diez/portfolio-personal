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
  facts: [
    'Ranking integrado: varianza entre condiciones 40 %, magnitud del cambio 30 %, importancia SHAP 20 % y significación estadística 10 %',
    'Candidatos contrastados con la base curada de ~39.000 compuestos (01.1)',
    'Son candidatos priorizados, no biomarcadores confirmados: así lo advierte el README',
  ],
  cover: null,
  canvas: { x: 600, y: 60, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (3.ª parte de la serie)', url: REPO }],
  todo: [
    'Secciones del caso de estudio (E6)',
    'Ranking con el desglose de los 4 criterios (E6)',
  ],
};
