import type { PageMeta } from './types';
import { musicAvailable } from './music';
import { person } from './profile';

/** Conventional pages (each one is a real, prerendered route). */
export type PageId = 'sobre-mi' | 'trayectoria' | 'habilidades' | 'formacion' | 'contacto' | 'mi-musica';

export type SectionId = PageId | 'proyectos' | 'cv';

export interface Section {
  id: SectionId;
  label: string;
  /** Route path relative to the base (trailing slash), or the CV file. */
  path: string;
}

// Device menu and mobile link list: the 7 sections of the old portfolio, in their order, + Mi música (last).
export const sections: Section[] = [
  { id: 'sobre-mi', label: 'Sobre mí', path: 'sobre-mi/' },
  { id: 'trayectoria', label: 'Trayectoria', path: 'trayectoria/' },
  { id: 'proyectos', label: 'Proyectos', path: 'proyectos/' },
  { id: 'habilidades', label: 'Habilidades', path: 'habilidades/' },
  { id: 'formacion', label: 'Formación', path: 'formacion/' },
  { id: 'contacto', label: 'Contacto', path: 'contacto/' },
  { id: 'cv', label: 'CV', path: person.cv },
  { id: 'mi-musica', label: 'Mi música', path: 'mi-musica/' },
];

export const labelOf = (id: SectionId) => sections.find((s) => s.id === id)!.label;

/** Mi música is not published without Iñigo's songs (content/music.ts): until then it is disabled. */
export const isAvailable = (id: SectionId) => id !== 'mi-musica' || musicAvailable();

/** The sections that can be opened right now (link lists, footer). */
export const openSections = () => sections.filter((s) => isAvailable(s.id));

// Desktop top nav: approved selection (2026-10-20). Mi música only once the section exists.
export const topNav = (): { label: string; path?: string; href?: string }[] => [
  { label: 'Proyectos', path: 'proyectos/' },
  { label: 'Sobre mí', path: 'sobre-mi/' },
  { label: 'Contacto', path: 'contacto/' },
  { label: 'CV', path: person.cv },
  { label: 'GitHub ↗', href: person.github },
  ...(musicAvailable() ? [{ label: 'Mi música', path: 'mi-musica/' }] : []),
];

const suffix = ` · ${person.name}`;

export const meta = {
  home: {
    title: `${person.name} · Ciencia de datos e IA`,
    description:
      'Portfolio de Iñigo Díez Osúa: graduado en Química y estudiante del Máster en Ciencia de Datos e Inteligencia Artificial en Afi. Python, machine learning y estadística aplicada.',
  },
  proyectos: {
    title: `Proyectos${suffix}`,
    description:
      '13 proyectos en 4 colecciones: metabolómica, mercados del petróleo, machine learning aplicado e IA generativa verificable.',
  },
  'sobre-mi': { title: `Sobre mí${suffix}`, description: 'Quién soy, qué estudio y cómo trabajo con datos.' },
  trayectoria: {
    title: `Trayectoria${suffix}`,
    description: 'Grado en Química (EHU) y Trabajo Fin de Grado con datos metabolómicos.',
  },
  habilidades: {
    title: `Habilidades${suffix}`,
    description: 'Python, SQL, machine learning, estadística y diseño de experimentos.',
  },
  formacion: {
    title: `Formación${suffix}`,
    description: 'Máster en Ciencia de Datos e IA (Afi), Grado en Química (EHU) y cursos complementarios.',
  },
  contacto: { title: `Contacto${suffix}`, description: 'Correo, LinkedIn y GitHub de Iñigo Díez Osúa.' },
  'mi-musica': {
    title: `Mi música${suffix}`,
    description: 'Canciones elegidas por Iñigo Díez Osúa, cada una con una frase suya.',
  },
  notFound: { title: `Página no encontrada${suffix}`, description: 'Esta dirección no existe.' },
} satisfies Record<string, PageMeta>;

export const ui = {
  skipToContent: 'Saltar al contenido',
  primaryNav: 'Principal',
  allSections: 'Secciones',
  seeProjects: 'Ver proyectos',
  openCanvas: 'Vista general',
  projectsCount: (n: number, c: number) => `${n} proyectos en ${c} colecciones`,
  projectsInCollection: (n: number) => `${n} proyectos`,
  backToProjects: 'Volver a proyectos',
  repo: 'Repositorio',
  sources: 'Fuentes',
  status: { terminado: 'Terminado', 'en-curso': 'En curso' },
  draftNotice: 'Borrador: el caso de estudio completo llega en E6.',
  canvas: {
    title: 'Proyectos',
    label: 'Lienzo de proyectos',
    controls: 'Controles del lienzo',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    reset: 'Reset',
    list: 'Lista',
    home: 'Inicio',
    listTitle: 'Lista de proyectos',
    openProject: 'Página del proyecto',
    about: 'De qué va',
    highlight: 'Destacado',
    github: 'Ver en GitHub',
    loading: 'Cargando…',
    readme: 'README',
    readmeTranslated: 'Traducido del inglés',
  },
  device: {
    label:
      'iDO Pocket: flechas arriba y abajo para moverte, derecha o Intro para abrir, izquierda o Escape para volver',
    dock: 'iDO Pocket',
    select: 'Seleccionar',
    back: 'Atrás',
    home: 'Inicio',
    keysHint: { move: 'moverse', open: 'abrir', back: 'volver' },
    soon: 'Próximamente',
    flip: 'Girar',
    sound: 'Sonido',
    position: (label: string, i: number, n: number) => `${label}, ${i} de ${n}`,
  },
  notFound: { title: 'Esta página no existe', body: 'Puede que el enlace haya cambiado. Prueba desde aquí:' },
  labels: {
    languages: 'Idiomas',
    courses: 'Cursos complementarios',
    facts: 'Datos verificados',
    stack: 'Stack',
    email: 'Correo',
    profile: 'Perfil',
    code: 'Código',
    cv: 'Currículum',
    home: 'Inicio',
    projectsWord: 'proyectos',
    chartData: 'Ver los datos',
  },
};
