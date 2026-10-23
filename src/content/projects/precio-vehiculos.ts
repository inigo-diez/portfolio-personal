import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/car-price-prediction-ml';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const precioVehiculos: Project = {
  slug: 'precio-vehiculos',
  ref: '03.2',
  collection: '03',
  title: 'Predicción de Precio de Vehículos de Segunda Mano',
  shortTitle: 'Precio de vehículos de segunda mano',
  summary:
    'Regresión lineal, árboles, Random Forest, XGBoost y una red neuronal, y una segmentación del mercado en 4 clusters de precio.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Regresión', 'Clustering', 'Feature engineering'],
  stack: ['Python', 'scikit-learn', 'XGBoost', 'TensorFlow · Keras'],
  headline: { value: 'R² 0,77', label: 'sobre 19.237 vehículos' },
  facts: [
    '19.237 vehículos y 18 variables (dataset público de Kaggle)',
    'XGBoost optimizado con GridSearchCV: R² 0,7712',
    'K-Means: 4 segmentos de precio, uno de gama alta',
  ],
  cover: null,
  canvas: { x: 300, y: 970, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio car-price-prediction-ml', url: REPO }],
  todo: ['Secciones del caso de estudio (E6)', 'Importancia de variables o los clusters (E6)'],
};
