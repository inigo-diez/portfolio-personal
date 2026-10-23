import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/prediccion-morosidad-crediticia';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const morosidadCrediticia: Project = {
  slug: 'morosidad-crediticia',
  ref: '03.1',
  collection: '03',
  title: 'Predicción de Morosidad Crediticia — Sistema de Alerta Temprana',
  shortTitle: 'Alerta temprana de morosidad',
  summary: 'Un sistema de alerta temprana de impago, con análisis de umbrales y del coste de cada tipo de error.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Clasificación', 'Scoring', 'Evaluación de modelos'],
  stack: ['Python', 'pandas', 'scikit-learn'],
  headline: { value: 'F1 0,90', label: 'en 8.399 clientes' },
  facts: [
    '8.399 clientes de una entidad financiera peruana',
    'Regresión logística, árbol de decisión y Random Forest ajustado con GridSearchCV',
    'Random Forest: F1 0,90 y el 96,9 % de los morosos reales detectados',
    'Aviso del propio README: ~70 % de los registros son morosos, lo que puede inflar el recall',
  ],
  cover: null,
  canvas: { x: 0, y: 930, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio prediccion-morosidad-crediticia', url: REPO }],
  todo: [
    'Año del proyecto',
    'Secciones del caso de estudio (E6)',
    '¿Se usó SMOTE? (la web antigua lo decía; el README no)',
    'Curva precisión/recall según el umbral (E6)',
  ],
};
