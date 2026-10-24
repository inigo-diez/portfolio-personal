import type { Source } from './types';

// Profile, path, training, skills and contact. Sources: CV (materials/cv) and the old portfolio
// (inventoried in docs/audit/content-inventory.md). Nothing here is invented.

export const person = {
  name: 'Iñigo Díez Osúa',
  /** Home greeting. */
  greeting: 'Hola, soy Iñigo Díez Osúa',
  context: [
    'Graduado en ',
    { text: 'Química' },
    ' y actualmente cursando el Máster en ',
    { text: 'Ciencia de Datos' },
    ' e ',
    { text: 'Inteligencia Artificial' },
    ' en Afi Global Education. Combino el rigor del método científico con la programación para formular hipótesis, contrastarlas y obtener conclusiones fundamentadas.',
  ],
  trainingLabel: 'con formación en',
  /** Rotating terms from the old portfolio's home animation. */
  trainingAreas: ['Química', 'Ciencia de Datos', 'Inteligencia Artificial', 'Machine Learning', 'Estadística Aplicada'],
  role: 'Química · ciencia de datos · IA',
  email: 'idiezosua@gmail.com',
  github: 'https://github.com/inigo-diez',
  linkedin: 'https://www.linkedin.com/in/i%C3%B1igo-d%C3%ADez-os%C3%BAa-233642401/',
  cv: 'cv.pdf',
  cvDownloadName: 'Inigo-Diez-Osua-CV.pdf',
  /** The CV's single page as an image, for phones (scripts/cv-preview.py, from cv.pdf). */
  cvPreview: { src: 'img/cv-preview.webp', width: 1440, height: 2038 },
  // The whole of IMG_3145.jpg (3:4, uncropped; the same photo as the CV), 600 × 800, metadata stripped.
  // Paths relative to the base. (Until 2026-10-24 it was a square crop of the face.)
  photo: {
    avif: 'img/inigo-diez-osua.avif',
    webp: 'img/inigo-diez-osua.webp',
    width: 600,
    height: 800,
    alt: 'Retrato de Iñigo Díez Osúa',
  },
};

// Contacto, as in the old portfolio (index.html #contact; Iñigo, 2026-10-24: links with their logos and the form).
// The visible link texts and every form string are verbatim from it; the form posts to its same Formspree endpoint.
export const contacto = {
  /** Gmail's own logo (2020), unchanged from Wikimedia Commons, "Gmail_icon_(2020).svg" (Iñigo, 2026-10-24). */
  gmailLogo: 'img/contact/gmail.svg',
  links: {
    email: 'idiezosua@gmail.com',
    github: 'github.com/inigo-diez',
    linkedin: 'linkedin.com/in/iñigo-díez-osúa',
  },
  form: {
    endpoint: 'https://formspree.io/f/xpqokykq',
    title: 'Envíame un mensaje',
    intro: '¿Tienes una idea, proyecto o propuesta? ¡Hablemos!',
    name: 'Nombre',
    email: 'Email',
    message: 'Mensaje',
    submit: 'Enviar mensaje',
    sending: 'Enviando…',
    success: '¡Mensaje enviado! Te responderé pronto.',
    error: 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme directamente a idiezosua@gmail.com',
  },
};

// The master's and the degree's own pages (both answered HTTP 200 on 2026-10-24); their titles in Trayectoria and
// Formación link to them (Iñigo, 2026-10-24).
const AFI_MASTER_URL =
  'https://www.afiglobaleducation.com/master-fulltime/master-en-ciencia-de-datos-e-inteligencia-artificial';
const EHU_DEGREE_URL = 'https://www.ehu.eus/es/web/graduak/grado-quimica-bizkaia/creditos-y-asignaturas';

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

export interface TrajectoryEntry {
  title: string;
  place: string;
  url?: string;
  status?: string;
  bullets?: string[];
}

// The master's current status is supplied by Iñigo; the degree and TFG copy comes from his old portfolio.
export const trayectoria: TrajectoryEntry[] = [
  {
    title: 'Máster en Ciencia de Datos e Inteligencia Artificial',
    place: 'Afi Global Education',
    url: AFI_MASTER_URL,
    status: 'Cursando actualmente',
  },
  {
    title: 'Grado en Química',
    place: 'EHU/UPV — Universidad del País Vasco',
    url: EHU_DEGREE_URL,
    bullets: [
      'Base sólida en ciencias experimentales y análisis cuantitativo, adquirida a través de formación teórica y práctica en distintas áreas de la química.',
      'Experiencia en el tratamiento e interpretación de datos experimentales en laboratorio, aplicando métodos estadísticos al análisis de resultados.',
      'Aplicación creciente de herramientas computacionales y de análisis de datos al estudio de problemas científicos reales.',
    ],
  },
  {
    title: 'Trabajo Fin de Grado — Análisis Estadístico y Modelización Multivariante de Datos Metabolómicos',
    place: 'EHU/UPV — Universidad del País Vasco',
    bullets: [
      'Construcción, limpieza, transformación y preprocesamiento de conjuntos de datos experimentales reales para su posterior análisis.',
      'Análisis exploratorio y reducción de dimensionalidad mediante PCA, junto con modelización supervisada mediante PLS-DA.',
      'Evaluación de la capacidad predictiva y robustez de los modelos mediante validación cruzada, métricas R²/Q², tests de permutación y métodos de importancia de variables.',
      'Optimización multivariable mediante diseño de experimentos y metodología de superficies de respuesta, integrando técnicas estadísticas y computacionales para comparar grupos y extraer conclusiones interpretables.',
    ],
  },
];

// Formación, verbatim from the old portfolio's section (index.html #education; Iñigo, 2026-10-24: "igual que el
// portfolio original"): one card per institution, then the certificates card. `certificate` = PDF in
// public/certificates/, byte-identical to the old portfolio's assets/certificates/ (renamed); the title links to it.
export interface Degree {
  institution: string;
  /** The institution's name links here, in a new tab. */
  url: string;
  degree: string;
  dates?: string;
}

export const formacion: Degree[] = [
  {
    institution: 'Afi Global Education',
    url: AFI_MASTER_URL,
    degree: 'Máster en Ciencia de Datos e Inteligencia Artificial',
    dates: 'sept. 2026 – jul. 2027',
  },
  { institution: 'EHU — Universidad del País Vasco', url: EHU_DEGREE_URL, degree: 'Grado en Química' },
];

export interface Course {
  title: string;
  provider: string;
  /** Hours, as the old portfolio shows them (dates removed: Iñigo, 2026-10-24). */
  meta?: string;
  description: string;
  certificate?: string;
}

export const certificaciones = {
  title: 'Formación Complementaria y Certificaciones',
  items: [
    {
      title: 'Programa Python Data Fundamentals',
      provider: 'DataCamp',
      meta: '28h',
      description:
        'Fundamentos de Python, manipulación de datos con pandas, unión de datasets, análisis exploratorio, visualización de datos.',
      certificate: 'certificates/python-data-fundamentals.pdf',
    },
    {
      title: 'Statistics Fundamentals in Python',
      provider: 'DataCamp',
      meta: '20h',
      description:
        'Estadística descriptiva, probabilidad, muestreo, inferencia estadística, contrastes de hipótesis, regresión lineal y logística, aplicación a datasets reales.',
      certificate: 'certificates/statistics-fundamentals-in-python.pdf',
    },
    {
      title: 'Applied Statistics in Python',
      provider: 'DataCamp',
      meta: '16h',
      description:
        'Diseño experimental, A/B testing, inferencia estadística, análisis bayesiano, toma de decisiones basada en datos.',
      certificate: 'certificates/applied-statistics-in-python.pdf',
    },
    {
      title: 'Machine Learning Specialization (Andrew Ng)',
      provider: 'DeepLearning.AI / Stanford University (Coursera)',
      description: 'Fundamentos de aprendizaje automático, modelos supervisados, evaluación y validación de modelos.',
    },
    {
      title: 'SQL Fundamentals',
      provider: 'DataCamp',
      meta: '26h',
      description:
        'Fundamentos de SQL para consultar y analizar bases de datos relacionales: selección, filtrado, agregación, combinación de tablas, funciones de ventana y diseño de bases de datos.',
      certificate: 'certificates/sql-fundamentals.pdf',
    },
    {
      title: 'De 0 a Data Scientist: Python, Machine Learning y Negocio',
      provider: 'Jyts',
      description:
        'Python, manipulación de datos, estadística, análisis exploratorio, feature engineering, clasificación, regresión y proyecto final sobre datos reales.',
      certificate: 'certificates/de-0-a-data-scientist.pdf',
    },
    {
      title: 'AI Engineering with LangChain',
      provider: 'DataCamp',
      meta: '15h',
      description:
        'Desarrollo de aplicaciones con LLMs en LangChain: salida estructurada y memoria conversacional, prompt engineering, RAG, uso de herramientas, sistemas agénticos con LangGraph y evaluación con LangSmith.',
      certificate: 'certificates/ai-engineering-langchain.pdf',
    },
  ] satisfies Course[],
};

// Declared skills, laid out as in the old portfolio's Habilidades (index.html #skills): same group titles, names and
// images. `logo` = file in public/img/skills/: the logos copied unchanged from its assets/img, and the method icons
// (metodo-*.svg) extracted unchanged from its inline SVGs.
export type Skill = { name: string; logo: string };
export const habilidades: { group: string; items: Skill[] }[] = [
  {
    group: 'Lenguajes',
    items: [
      { name: 'Python', logo: 'python-logo-1-300x300.jpg' },
      { name: 'SQL', logo: 'mysql-dolphin.svg' },
    ],
  },
  {
    group: 'Librerías',
    items: [
      { name: 'NumPy', logo: 'numpy-logo-1-500x500.jpg' },
      { name: 'Pandas', logo: 'pandas-logo-2-500x500.jpg' },
      { name: 'Scikit-learn', logo: 'sk-learn-logo-1-500x500.jpg' },
      { name: 'Matplotlib', logo: 'matplotlib-logo-new.svg' },
      { name: 'Seaborn', logo: 'seaborn-logo.svg' },
      { name: 'SciPy', logo: 'scipy-logo.svg' },
      { name: 'SHAP', logo: 'shap-logo.png' },
    ],
  },
  {
    group: 'Frameworks / ML',
    items: [
      { name: 'TensorFlow', logo: 'tensorflow-logo-1.png' },
      { name: 'Keras', logo: 'keras-logo.png' },
      { name: 'XGBoost', logo: 'xgboost-logo.png' },
    ],
  },
  {
    group: 'Herramientas',
    items: [
      { name: 'Git', logo: 'git.png' },
      { name: 'Jupyter', logo: 'jupyter-logo.svg' },
    ],
  },
  {
    group: 'Técnicas y métodos',
    items: [
      { name: 'Modelos predictivos', logo: 'metodo-modelos-predictivos.svg' },
      { name: 'Clasificación y scoring', logo: 'metodo-clasificacion-scoring.svg' },
      { name: 'Clustering y segmentación', logo: 'metodo-clustering-segmentacion.svg' },
      { name: 'Interpretabilidad (XAI)', logo: 'metodo-interpretabilidad-xai.svg' },
      { name: 'Contraste de hipótesis', logo: 'metodo-contraste-hipotesis.svg' },
      { name: 'Diseño de experimentos', logo: 'metodo-diseno-experimentos.svg' },
    ],
  },
];
