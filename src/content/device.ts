// Strings shown on the iDO Pocket screen. Sources: CV, old portfolio, project map (as in E2).
// The CV rows reuse the sourced data of profile.ts; nothing new is written here.
import { person } from './profile';
import { collections, TOTAL_PROJECTS } from './projects';

export const os = {
  /** Device name «iDO Pocket» (Iñigo, 2026-10-23); its screen shows only «iDO». */
  name: 'iDO',
  peek: {
    'sobre-mi': { lines: ['Iñigo Díez Osúa', 'Química', 'Ciencia de datos', 'IA'] },
    proyectos: {
      cells: collections.map((c) => c.id),
      big: String(TOTAL_PROJECTS),
      lines: ['proyectos en', `${collections.length} colecciones`],
    },
    formacion: {
      items: [
        { title: 'Máster CD e IA', sub: 'Afi · 2026–27' },
        { title: 'Grado en Química', sub: 'EHU' },
      ],
      more: '+ 7 cursos complementarios',
    },
    'mi-musica': { soon: 'Próximamente' },
  },
  /** Engraving on the back face (E2 v3). */
  back: { line: 'Pocket', fine: `${person.name} · 2026` }, // under the monogram: reads «iDO POCKET»
};

