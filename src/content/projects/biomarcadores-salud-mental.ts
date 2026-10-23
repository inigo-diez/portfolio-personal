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
  facts: [
    '6 bases de datos abiertas: MarkerDB, CTD, Metabolomics Workbench, MetaboLights, Europe PMC y HMDB (heces)',
    'Deduplicación química por InChIKey → PubChem CID → nombre normalizado',
    'Dashboard HTML interactivo con filtros por condición, fuente y origen',
    'Conjunto curado incluido: 38.952 entradas revisadas a mano',
  ],
  cover: null,
  canvas: { x: 0, y: 70, w: 260 },
  links: { repo: REPO },
  readmeLang: 'en',
  sections: [],
  sources: [{ label: 'README del repositorio (1.ª parte de la serie)', url: REPO }],
  todo: [
    'Año del proyecto',
    'Secciones del caso de estudio (E6)',
    'Gráfico de candidatos por base de datos o por condición (E6)',
  ],
};
