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
  // README: «Resultados del modelo final» and «Conclusiones».
  facts: [
    {
      value: '175 € → 152 €',
      text: 'Error medio de la solución de referencia del curso frente al mío, sobre 1.033 portátiles reales: casi 10 puntos más de R² gracias a la ingeniería de variables.',
    },
    {
      value: '3–6 niveles',
      text: 'Reduje procesador, gráfica, webcam y sistema operativo a categorías de entre 3 y 6 niveles: la calidad de las variables pesó más que la complejidad del modelo.',
    },
    {
      value: '~50 €',
      text: 'Lo que se quedó atrás la regresión lineal frente a los modelos de árboles: GPU, procesador y RAM de gama alta se combinan en el precio de forma no lineal.',
    },
  ],
  // scripts/covers.py: the README figure fig_15, whole
  cover: {
    src: 'img/covers/precio-portatiles.webp',
    alt: 'Precio predicho frente al precio real de los portátiles, con la diagonal de acierto',
  },
  canvas: { x: 800, y: 920, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio laptop-price-prediction-egypt', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Real frente a predicho (E6; no hay figura previa)'],
};
