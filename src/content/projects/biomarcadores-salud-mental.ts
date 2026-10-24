import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/Mental-Health-Biomarkers-Database-1-Parte-';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const biomarcadoresSaludMental: Project = {
  slug: 'biomarcadores-salud-mental',
  ref: '01.1',
  collection: '01',
  title: 'Base de Datos de Biomarcadores Metabólicos Psiquiátricos',
  shortTitle: 'Base de biomarcadores metabólicos',
  summary:
    'Un pipeline automático que unifica seis bases científicas abiertas en un único recurso consultable, con un dashboard interactivo.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Ingesta de datos', 'Limpieza y deduplicación', 'Visualización'],
  stack: ['Python', 'SQLite', 'API de PubChem', 'DataTables'],
  headline: { value: '~39.000', label: 'candidatos de 6 bases de datos abiertas' },
  // README (Spanish translation): intro, «Lo más destacado» and «Fuentes de datos».
  facts: [
    {
      value: '6 bases abiertas',
      text: 'Automaticé la recogida desde MarkerDB, CTD, Metabolomics Workbench, MetaboLights, Europe PMC y HMDB Feces, en lugar de consultarlas una a una.',
    },
    {
      value: 'InChIKey → CID → nombre',
      text: 'Eliminé duplicados con una cascada de identificadores químicos, para que cada compuesto aparezca una sola vez aunque llegue de varias fuentes.',
    },
    {
      value: '7 condiciones',
      text: 'Esquizofrenia, depresión, trastorno bipolar, ansiedad, TEPT, autismo y TDAH, en un panel web que filtra por condición, fuente, origen y vínculo con la microbiota sin instalar nada.',
    },
  ],
  // scripts/covers.py: a capture of the real dashboard (report_mhb.html, scripts/covers-capture.mjs)
  cover: {
    src: 'img/covers/biomarcadores-salud-mental.webp',
    alt: 'Tabla del panel de la base de datos: metabolitos con sus etiquetas de condición, fuente y matriz',
  },
  canvas: { x: 0, y: 70, w: 260 },
  links: { repo: REPO },
  readmeTranslated: true,
  sections: [],
  sources: [{ label: 'README del repositorio (1.ª parte de la serie)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Secciones del caso de estudio (E6)', 'Gráfico de candidatos por base de datos o por condición (E6)'],
};
