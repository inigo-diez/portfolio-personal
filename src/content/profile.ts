import type { Source } from './types';

// Profile, path, training, skills and contact. Sources: CV (materials/cv) and the old portfolio
// (inventoried in docs/audit/content-inventory.md). Nothing here is invented.

export const person = {
  name: 'Iñigo Díez Osúa',
  /** Home greeting. */
  greeting: 'Hola, soy Iñigo Díez Osúa',
  role: 'Química · Ciencia de datos · IA',
  email: 'idiezosua@gmail.com',
  github: 'https://github.com/inigo-diez',
  linkedin: 'https://www.linkedin.com/in/i%C3%B1igo-d%C3%ADez-os%C3%BAa-233642401/',
  cv: 'cv.pdf',
  cvDownloadName: 'Inigo-Diez-Osua-CV.pdf',
  photo: null as null | string, // TODO(content): personal photo (audit/missing.md)
};

export const about = {
  // Verbatim from the old portfolio's "Sobre mí".
  paragraphs: [
    'Graduado en Química por la EHU y actualmente cursando el Máster en Ciencia de Datos e Inteligencia Artificial en Afi Global Education, con un perfil cuantitativo orientado a la ciencia de datos y el machine learning.',
    'Experiencia académica en análisis de datos reales, estadística aplicada, diseño experimental y modelización predictiva. He desarrollado proyectos en Python que abarcan la preparación de datos, la comparación y validación de modelos y la interpretación de resultados.',
    'Combino el rigor del método científico con la programación para formular hipótesis, contrastarlas y obtener conclusiones fundamentadas.',
  ],
  languages: ['Español · nativo', 'Inglés · B2'],
  sources: [{ label: 'Web antigua, sección «Sobre mí»' }, { label: 'CV' }] satisfies Source[],
};

export interface TimelineItem {
  title: string;
  place: string;
  /** null = not confirmed → TODO(content). */
  dates: string | null;
  detail?: string;
}

// Trayectoria = the old portfolio's "Experiencia": degree + final project (no professional experience yet).
export const trayectoria: TimelineItem[] = [
  {
    title: 'Trabajo Fin de Grado · Datos metabolómicos',
    place: 'EHU',
    dates: null, // TODO(content): year of the TFG
    detail: 'Análisis estadístico y modelización multivariante: PCA, PLS-DA, R²/Q², permutaciones, DoE/RSM.',
  },
  { title: 'Grado en Química', place: 'EHU', dates: null }, // TODO(content): years of the degree
];

export const formacion: TimelineItem[] = [
  {
    title: 'Máster en Ciencia de Datos e Inteligencia Artificial',
    place: 'Afi Global Education',
    dates: 'sept. 2026 – jul. 2027',
  },
  { title: 'Grado en Química', place: 'EHU', dates: null },
];

export const cursos: TimelineItem[] = [
  { title: 'Python Data Fundamentals', place: 'DataCamp', dates: 'ene. 2026' },
  { title: 'Statistics Fundamentals in Python', place: 'DataCamp', dates: 'ene. 2026' },
  { title: 'Applied Statistics in Python', place: 'DataCamp', dates: 'ene. 2026' },
  { title: 'Machine Learning Specialization', place: 'DeepLearning.AI · Stanford (Coursera)', dates: null },
  { title: 'SQL Fundamentals', place: 'DataCamp', dates: 'mar. 2026' },
  { title: 'De 0 a Data Scientist', place: 'Jyts', dates: 'abr. 2026' },
  { title: 'AI Engineering with LangChain', place: 'DataCamp', dates: 'oct. 2026' },
];

// Declared skills (CV = old portfolio).
export const habilidades = [
  { group: 'Lenguajes', items: ['Python', 'SQL'] },
  { group: 'Análisis y ML', items: ['NumPy', 'Pandas', 'scikit-learn', 'Matplotlib', 'Seaborn', 'SciPy', 'SHAP'] },
  { group: 'Deep learning', items: ['TensorFlow', 'Keras', 'XGBoost'] },
  { group: 'Herramientas', items: ['Git', 'Jupyter'] },
  {
    group: 'Métodos',
    items: [
      'Modelos predictivos',
      'Clasificación y scoring',
      'Clustering',
      'Interpretabilidad (XAI)',
      'Contraste de hipótesis',
      'Diseño de experimentos',
    ],
  },
];
