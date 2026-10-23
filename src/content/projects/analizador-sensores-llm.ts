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
  facts: [
    'LangChain, Gemini 3.5 Flash-Lite y una interfaz Gradio',
    'Doce tests unitarios sin llamadas reales a la API',
    'Documenta sus errores: el modelo diagnosticó fugas de forma demasiado categórica, y el prompt revisado lo mitiga sin eliminarlo',
  ],
  cover: null,
  canvas: { x: 1400, y: 630, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio llm-electrolyzer-sensor-analyzer', url: REPO }],
  todo: ['Año del proyecto', 'Secciones del caso de estudio (E6)', 'Diagrama de la app (E6)'],
};
