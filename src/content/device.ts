// Strings shown on the Pocket OS screen. Sources: CV, old portfolio, project map (as in E2).
import { collections, TOTAL_PROJECTS } from './projects';

export const os = {
  name: 'Pocket OS',
  peek: {
    'sobre-mi': { mono: 'ID', lines: ['Iñigo Díez Osúa', 'Química · Ciencia de datos · IA'] },
    trayectoria: { kicker: 'Trabajo Fin de Grado · EHU', title: 'Datos metabolómicos', chips: ['PCA', 'PLS-DA', 'DoE · RSM'] },
    proyectos: { cells: collections.map((c) => c.id), big: String(TOTAL_PROJECTS), lines: ['proyectos en', `${collections.length} colecciones`] },
    habilidades: { chips: ['Python', 'SQL', 'scikit-learn', 'XGBoost', 'TensorFlow', 'LLMs'] },
    formacion: {
      items: [
        { title: 'Máster CD e IA', sub: 'Afi · 2026–27' },
        { title: 'Grado en Química', sub: 'EHU' },
      ],
      more: '+ 7 cursos complementarios',
    },
    contacto: { lines: ['idiezosua@gmail.com', 'LinkedIn · GitHub'] },
    cv: { lines: ['Currículum · PDF'] },
    'mi-musica': { lines: ['Próximamente'] },
  },
};
