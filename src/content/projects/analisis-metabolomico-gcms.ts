import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/Analisis-Metabolomico-Estadistico-con-Python-2-Parte-';

// Draft (E3). Figures verified against the README (docs/audit/project-map.md, content-inventory.md).
// "8 notebooks" is NOT used: it was not verified.
export const analisisMetabolomicoGcms: Project = {
  slug: 'analisis-metabolomico-gcms',
  ref: '01.2',
  collection: '01',
  title: 'Análisis Metabolómico Estadístico sobre Datos GC-MS',
  shortTitle: 'Análisis metabolómico GC-MS',
  summary:
    'De 1.230 señales cromatográficas a 279 metabolitos de calidad, y de ahí a los que realmente distinguen entre condiciones (PCA, contrastes, RF, XGBoost, SHAP).',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Estadística multivariante', 'Clasificación', 'Interpretabilidad'],
  stack: ['Python', 'scikit-learn', 'XGBoost', 'SHAP'],
  headline: { value: '1.230 → 279', label: 'de picos brutos a metabolitos fiables' },
  // README: «Resultados principales» and «Conclusiones».
  facts: [
    {
      value: 'Exp_12',
      text: 'Comparé la cobertura de los 17 experimentos y propuse Exp_12 como la mejor condición: el mejor equilibrio entre metabolitos detectados y estabilidad del perfil, para analizar después muestras de pacientes y controles.',
    },
    {
      value: '2 atípicos',
      text: 'Detecté Exp_9 y Exp_11 con Isolation Forest, PCA y clustering jerárquico. Sin ellos, el clustering revela tres grupos que el atípico extremo ocultaba.',
    },
    {
      value: '5 candidatos',
      text: 'Metabolitos que coinciden en al menos dos criterios (importancia SHAP, cambio de abundancia y significación): Phenol, p-Cresol y Humulene en el análisis original; Cyclohexanol acetato y Benzeneacetaldehyde en el refinado.',
    },
  ],
  // scripts/covers.py: the README figure 05_cluster_profiles, whole
  cover: {
    src: 'img/covers/analisis-metabolomico-gcms.webp',
    alt: 'Perfil de intensidad medio de los dos grupos de compuestos en los 17 experimentos',
  },
  canvas: { x: 300, y: 110, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (2.ª parte de la serie)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['PCA de los 17 experimentos (E6)'],
};
