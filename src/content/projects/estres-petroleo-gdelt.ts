import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/oil-market-stress-gdelt';

// Draft (E3). Figures verified against the README (docs/audit/project-map.md, content-inventory.md).
export const estresPetroleoGdelt: Project = {
  slug: 'estres-petroleo-gdelt',
  ref: '02.1',
  collection: '02',
  title: 'Predicción de Estrés en el Mercado del Petróleo con GDELT',
  shortTitle: 'Estrés del petróleo con GDELT',
  summary:
    '¿Anticipan los titulares geopolíticos un día de pánico en el petróleo? 4.059 días, 67 variables sin fuga de información y una respuesta honesta (AUC 0,615).',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Series temporales', 'Clasificación', 'Interpretabilidad'],
  stack: ['Python', 'GDELT', 'SHAP'],
  headline: { value: '16 años', label: 'de noticias geopolíticas frente al WTI' },
  // README: Resumen ejecutivo, §2.7, §8 and §12 (Conclusiones).
  facts: [
    {
      value: '4 fuentes',
      text: 'Integré en un solo conjunto diario los precios de mercado (FRED), los índices de volatilidad (CBOE), el índice de riesgo geopolítico de Caldara e Iacoviello y las noticias de GDELT.',
    },
    {
      value: 'F1 0,571',
      text: 'El bosque aleatorio supera al azar y al modelo lineal de referencia (AUC 0,578) en la validación 2021–2026, con particiones que respetan el orden cronológico.',
    },
    {
      value: '35 eventos',
      text: 'Construí una cronología de eventos geopolíticos y estudié cómo reaccionó el mercado: choques parecidos provocan reacciones muy distintas según si el mercado los anticipaba y la magnitud real de la interrupción.',
    },
  ],
  // scripts/covers.py: the first two panels of the README figure fig_event_wti_path
  cover: {
    src: 'img/covers/estres-petroleo-gdelt.webp',
    alt: 'Trayectoria del WTI alrededor de conflictos armados y de sanciones',
  },
  canvas: { x: 1140, y: 100, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio oil-market-stress-gdelt', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Gráfico del WTI con los días de estrés (E6)'],
};
