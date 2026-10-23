// Strings shown on the iDO Pocket screen. Sources: CV, old portfolio, project map (as in E2).
// The CV rows reuse the sourced data of profile.ts; nothing new is written here.
import { person } from './profile';
import { collections, TOTAL_PROJECTS } from './projects';

export const os = {
  /** Device name «iDO Pocket» (Iñigo, 2026-10-23); its screen shows only «iDO». */
  name: 'iDO',
  peek: {
    'sobre-mi': { mono: 'ID', lines: ['Iñigo Díez Osúa', 'Química · Ciencia de datos · IA'] },
    trayectoria: {
      kicker: 'Trabajo Fin de Grado · EHU',
      title: 'Datos metabolómicos',
      chips: ['PCA', 'PLS-DA', 'DoE · RSM'],
    },
    proyectos: {
      cells: collections.map((c) => c.id),
      big: String(TOTAL_PROJECTS),
      lines: ['proyectos en', `${collections.length} colecciones`],
    },
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
    'mi-musica': { soon: 'Próximamente' },
  },
  /** Engraving on the back face (E2 v3). */
  back: { line: 'Pocket', fine: `${person.name} · 2026` }, // under the monogram: reads «iDO POCKET»
};

/** What selecting a row does (none = information only). */
export type RowAction = { href: string; external?: boolean; download?: string };

export interface DeviceRow {
  label: string;
  meta?: string;
  icon?: 'mail' | 'link' | 'doc' | 'download';
  strong?: boolean;
  action?: RowAction;
}

// The CV stays inside the device (two actions); the other sections open as pages (app/routes.ts).
export const cvRows: DeviceRow[] = [
  { label: 'Ver CV', icon: 'doc', action: { href: person.cv, external: true } },
  { label: 'Descargar PDF', icon: 'download', action: { href: person.cv, download: person.cvDownloadName } },
];
