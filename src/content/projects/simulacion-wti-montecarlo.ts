import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/wti-geopolitical-simulation-Parte-2';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const simulacionWtiMontecarlo: Project = {
  slug: 'simulacion-wti-montecarlo',
  ref: '02.2',
  collection: '02',
  title: 'Simulación del Precio WTI bajo Estrés Geopolítico',
  shortTitle: 'Simulación del WTI con Monte Carlo',
  summary:
    'Regímenes de Markov, saltos calibrados y un mercado simulado con agentes para medir cómo sufren las estrategias de cobertura.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Simulación estocástica', 'Modelado basado en agentes', 'Riesgo financiero'],
  stack: [],
  headline: { value: '2.000', label: 'trayectorias Monte Carlo por escenario' },
  // README: Resumen, «Resultados principales», «Discusión» and «Conclusiones».
  facts: [
    {
      value: '15,67 frente a 1,76',
      text: 'Curtosis en exceso del régimen de alto estrés frente al de bajo, en 2.800 días de 2015 a 2026. Por eso modelé las colas de cada régimen por separado.',
    },
    {
      value: '+8,8 puntos',
      text: 'Añadí un mercado con cuatro tipos de agente (productor OPEC+, especulador técnico, creador de mercado y fondo geopolítico). Con ellos, la caída máxima es 8,8 puntos mayor que en el Monte Carlo puro: los modelos estándar subestiman el riesgo de caída.',
    },
    {
      value: '−72 %',
      text: 'Evalué cinco estrategias: el fondo geopolítico reduce la caída máxima un 72 % frente al inversor pasivo en el escenario base. Su valor está en la protección ante choques, no en ganar más.',
    },
  ],
  // scripts/covers.py: redrawn fan chart of the published run, in its scenario colours
  cover: {
    src: 'img/covers/simulacion-wti-montecarlo.svg',
    alt: 'Abanicos de trayectorias simuladas del WTI en los escenarios de baja tensión, base y alta tensión',
  },
  canvas: { x: 1440, y: 140, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (2.ª parte de la serie)', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Secciones del caso de estudio (E6)', 'Fan chart de 3 escenarios (E6)'],
};
