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
  facts: [
    '2.800 observaciones diarias, de enero de 2015 a marzo de 2026',
    'Monte Carlo RSJD: 2.000 trayectorias a 252 días en 3 escenarios',
    'Modelo basado en agentes con impacto de precio de Kyle (1985)',
    'Evaluación financiera de cinco estrategias de inversión',
  ],
  cover: null,
  canvas: { x: 1320, y: 140, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio (2.ª parte de la serie)', url: REPO }],
  todo: [
    'Año del proyecto',
    'Secciones del caso de estudio (E6)',
    'Stack (el README no lo lista)',
    '¿Nombrar los 4 tipos de agentes? (el README los describe; la web antigua usaba otros nombres)',
    'Fan chart de 3 escenarios (E6)',
  ],
};
