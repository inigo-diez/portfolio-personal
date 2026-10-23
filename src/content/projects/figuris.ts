import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/Figuris';

// Draft (E3). Figures verified against the README (docs/audit/project-map.md, content-inventory.md).
export const figuris: Project = {
  slug: 'figuris',
  ref: '04.1',
  collection: '04',
  title: 'Figuris — Explicación Verificable de Figuras Científicas',
  shortTitle: 'Figuris',
  summary:
    'La IA explica la figura; Figuris demuestra de dónde sale cada palabra. El modelo se inventó 7 citas en 149 explicaciones y el validador, sin IA, las bloqueó todas.',
  status: 'en-curso',
  year: null,
  featured: true,
  tags: ['LLMs multimodales', 'Document AI', 'Generación fundamentada', 'Evaluación'],
  stack: ['Python', 'FastAPI', 'Pydantic', 'Pytest', 'OCR · ONNX'],
  headline: { value: '0', label: 'citas inventadas llegaron al lector' },
  facts: [
    '292 figuras de 48 artículos (corpus propio SFI-48)',
    'F1 0,874 detectando figuras',
    '7 citas inventadas en 149 explicaciones: el validador detectó las siete y ninguna se mostró como fiable',
    'Coste total inferior a 1 $',
  ],
  cover: null,
  canvas: { x: 1100, y: 590, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio Figuris', url: REPO }],
  todo: ['Año del proyecto', 'Secciones del caso de estudio (E6)', 'Captura del visor y diagrama de arquitectura (E6)'],
  notes: ['Desarrollado con asistencia de Claude Code (como declara la web antigua).'],
};
