import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/llm-electrolyzer-sensor-analyzer';

// E5: card-level data only. Every figure verified against the README (docs/audit/project-map.md,
// content-inventory.md); the case study is written in E6.
export const analizadorSensoresLlm: Project = {
  slug: 'analizador-sensores-llm',
  ref: '04.2',
  collection: '04',
  title: 'Analizador LLM de Sensores en Electrolizadores',
  shortTitle: 'Analizador LLM de sensores',
  summary:
    'Una mini-app que explica sensores industriales con LangChain, Gemini y Gradio, y que evalúa críticamente dónde falla el LLM.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['LLMs', 'Evaluación', 'Testing'],
  stack: ['Python', 'LangChain', 'Gemini', 'Gradio', 'Pytest'],
  headline: { value: '12', label: 'tests unitarios sin llamadas a la API' },
  // README: «Trabajo realizado» and «Observación y limitación».
  facts: [
    {
      value: '3 sensores',
      text: 'La probé con temperatura de celda, presión y caudal de H₂: recibe el nombre de un sensor y explica qué mide, su importancia operativa y qué anomalías vigilar.',
    },
    {
      value: '3 errores documentados',
      text: 'El modelo diagnosticó fugas de forma demasiado categórica, confundió temperatura con calor y exageró lo que garantiza el sensor de presión. Revisé el prompt: mejoró el lenguaje de incertidumbre, aunque no sustituye la evidencia.',
    },
    {
      value: 'Gradio + LangChain',
      text: 'Separé la interfaz de la lógica, validé las entradas, manejé los errores de la API y guardé la clave fuera del código, en un archivo .env.',
    },
  ],
  // scripts/covers.py: the picture Iñigo gave for this project (2026-10-24; its README has no image)
  cover: {
    src: 'img/covers/analizador-sensores-llm.webp',
    alt: 'Sensor de presión de acero montado en una tubería industrial, con trazas de circuito en azul',
  },
  canvas: { x: 1400, y: 630, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio llm-electrolyzer-sensor-analyzer', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Diagrama de la app (E6)'],
};
