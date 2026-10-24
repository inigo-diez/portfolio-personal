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
  // README: Resumen, §2 (Sistema) and §3 (Evaluación). The 7 invented citations stay in the summary only.
  facts: [
    {
      value: '292 figuras',
      text: 'Construí SFI-48, un corpus propio de 48 artículos de PubMed Central revisados a mano, y dejé congelado un conjunto de prueba que evalué una sola vez, al final.',
    },
    {
      value: 'F1 0,874',
      text: 'Localiza las figuras del PDF con geometría y reglas, sin IA generativa, en unos 40 ms por página. Es el resultado en el conjunto de prueba reservado.',
    },
    {
      value: '< 1 $',
      text: 'Coste total en llamadas al modelo. Todo se ejecuta en local salvo una llamada por figura, y una caché por contenido evita volver a pagar al reprocesar.',
    },
  ],
  // scripts/covers.py: docs/img/fig01-visor.png, whole (the README's Figura 1)
  cover: {
    src: 'img/covers/figuris.webp',
    alt: 'Espacio de trabajo de Figuris: miniaturas de página, página con la figura recuadrada y panel de detalles',
  },
  canvas: { x: 1100, y: 590, w: 260 },
  links: { repo: REPO },
  sections: [],
  sources: [{ label: 'README del repositorio Figuris', url: REPO }],
  repoHasDetail: true, // README with methodology and results (2026-10-19 copy)
  todo: ['Secciones del caso de estudio (E6)', 'Captura del visor y diagrama de arquitectura (E6)'],
  notes: ['Desarrollado con asistencia de Claude Code (como declara la web antigua).'],
};
