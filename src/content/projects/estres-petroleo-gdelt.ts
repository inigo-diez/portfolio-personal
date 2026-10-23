import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/oil-market-stress-gdelt';

// Draft (E3). Figures verified against the README (docs/audit/project-map.md, content-inventory.md).
export const estresPetroleoGdelt: Project = {
  slug: 'estres-petroleo-gdelt',
  ref: '02.1',
  collection: '02',
  title: 'Predicción de Estrés en el Mercado del Petróleo con GDELT',
  shortTitle: 'Estrés del petróleo con GDELT',
  summary:
    '¿Anticipan los titulares geopolíticos un día de pánico en el petróleo? 4.059 días, 67 variables sin fuga de información y una respuesta honesta (AUC 0,615).',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Series temporales', 'Clasificación', 'Interpretabilidad'],
  stack: ['Python', 'GDELT', 'SHAP'],
  headline: { value: '16 años', label: 'de noticias geopolíticas frente al WTI' },
  facts: ['Periodo 2010–2026: 4.059 días', '67 variables con control de fuga de información', 'F1 0,571 · AUC 0,615'],
  cover: null,
  canvas: { x: 1020, y: 100, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio oil-market-stress-gdelt', url: REPO }],
  todo: ['Año del proyecto', 'Secciones del caso de estudio (E6)', 'Gráfico del WTI con los días de estrés (E6)'],
};
