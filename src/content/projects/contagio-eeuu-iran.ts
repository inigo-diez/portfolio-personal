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
  // README: Resumen, §9 (Conclusiones de la Parte 3) and §10.
  facts: [
    {
      value: '23 de marzo de 2026',
      text: 'Apliqué el modelo a un evento real extremo: guerra EE. UU.–Irán, Ormuz bloqueado, OVX en el percentil 98,6 y GPR en el 97,8. En los escenarios más extremos se declara fuera de dominio en vez de responder con falsa confianza.',
    },
    {
      value: '717 mercados',
      text: 'Filtré mercados de Polymarket y los crucé con el modelo histórico, como fuente auxiliar y nunca como validación. Las divergencias entre ambos, más que cada señal por separado, son lo más valioso del análisis.',
    },
    {
      value: '+33,6 % frente a −4,95 %',
      text: 'Exxon frente al S&P 500 en lo que iba de año (Chevron, +34,8 %): confirmé el desacoplamiento del sector energético que ya documentaba la guerra de Ucrania de 2022.',
    },
  ],
  // scripts/covers.py: the README figure polymarket_heatmap, whole
  cover: {
    src: 'img/covers/contagio-eeuu-iran.webp',
    alt: 'Mapa de convicción de los mercados de Polymarket por categoría y nivel de probabilidad',
  },
  canvas: { x: 1740, y: 90, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (3.ª parte de la serie)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Modelo frente a Polymarket (E6)'],
};
