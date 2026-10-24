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
  // README: §6 (Modelos), §7 (K-Means) and §9 (Comparativa final).
  facts: [
    {
      value: 'Error a la mitad',
      text: 'XGBoost optimizado y Random Forest reducen el error medio a la mitad frente a la regresión lineal, el árbol de decisión y la red neuronal.',
    },
    {
      value: 'Año y kilometraje',
      text: 'Las variables que más pesan en todos los modelos: los coches más nuevos y menos usados valen más, como en el mercado real de segunda mano.',
    },
    {
      value: '4 segmentos',
      text: 'Segmenté el mercado con K-Means: uno de los grupos es de gama alta, con un precio medio de unos 46.000, frente a entre 10.000 y 15.000 en los otros tres.',
    },
  ],
  // scripts/covers.py: the README figure 22_kmeans_scatter_mileage_vs_year, whole
  cover: {
    src: 'img/covers/precio-vehiculos.webp',
    alt: 'Segmentación K-Means de los vehículos por kilometraje y año de producción',
  },
  canvas: { x: 500, y: 970, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio car-price-prediction-ml', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Importancia de variables o los clusters (E6)'],
};
