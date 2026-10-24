import type { PageMeta } from './types';
import { musicAvailable } from './music';
import { person } from './profile';

/** Conventional pages (each one is a real, prerendered route). */
export type PageId =
  'sobre-mi' | 'trayectoria' | 'habilidades' | 'formacion' | 'contacto' | 'cv' | 'mi-musica' | 'mis-libros';

export type SectionId = PageId | 'proyectos';

export interface Section {
  id: SectionId;
  label: string;
  /** Route path relative to the base (trailing slash). */
  path: string;
}

export interface NavItem {
  id: SectionId | 'inicio';
  label: string;
  path: string;
}

// Device menu and mobile link list: the 7 sections of the old portfolio, in their order, + Mi música and Mis libros (last).
export const sections: Section[] = [
  { id: 'sobre-mi', label: 'Sobre mí', path: 'sobre-mi/' },
  { id: 'trayectoria', label: 'Trayectoria', path: 'trayectoria/' },
  { id: 'proyectos', label: 'Proyectos', path: 'proyectos/' },
  { id: 'habilidades', label: 'Habilidades', path: 'habilidades/' },
  { id: 'formacion', label: 'Formación', path: 'formacion/' },
  { id: 'contacto', label: 'Contacto', path: 'contacto/' },
  { id: 'cv', label: 'CV', path: 'cv/' },
  { id: 'mi-musica', label: 'Mi música', path: 'mi-musica/' },
  { id: 'mis-libros', label: 'Mis libros', path: 'mis-libros/' },
];

export const labelOf = (id: SectionId) => sections.find((s) => s.id === id)!.label;

/** Mi música is not published without Iñigo's songs (content/music.ts): until then it is disabled. */
export const isAvailable = (id: SectionId) => id !== 'mi-musica' || musicAvailable();

/** The sections that can be opened right now (navigation and link lists). */
export const openSections = () => sections.filter((s) => isAvailable(s.id));

// Top nav: every section but Mi música (2026-10-25: Iñigo took it out), with Contacto as the final destination.
const topNavOrder: SectionId[] = ['sobre-mi', 'proyectos', 'trayectoria', 'habilidades', 'formacion', 'cv', 'contacto'];
export const topNav = (): NavItem[] => [
  { id: 'inicio', label: 'Inicio', path: '' },
  ...topNavOrder.map((id) => sections.find((s) => s.id === id)!).filter((s) => isAvailable(s.id)),
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
    description:
      'Máster en Ciencia de Datos e Inteligencia Artificial en curso (Afi), Grado en Química (EHU) y TFG de modelización de datos metabolómicos.',
  },
  habilidades: {
    title: `Habilidades${suffix}`,
    description: 'Python, SQL, machine learning, estadística y diseño de experimentos.',
  },
  formacion: {
    title: `Formación${suffix}`,
    description: 'Máster en Ciencia de Datos e IA (Afi), Grado en Química (EHU) y cursos complementarios.',
  },
  cv: { title: `CV${suffix}`, description: 'Consulta o descarga el currículum de Iñigo Díez Osúa en PDF.' },
  contacto: { title: `Contacto${suffix}`, description: 'Correo, LinkedIn y GitHub de Iñigo Díez Osúa.' },
  'mi-musica': {
    title: `Mi música${suffix}`,
    description: 'Canciones elegidas por Iñigo Díez Osúa, cada una con una frase suya.',
  },
  'mis-libros': {
    title: `Mis libros${suffix}`,
    description: 'Libros elegidos por Iñigo Díez Osúa: portada, autor y de qué trata cada uno.',
  },
  notFound: { title: `Página no encontrada${suffix}`, description: 'Esta dirección no existe.' },
} satisfies Record<string, PageMeta>;

export const ui = {
  skipToContent: 'Saltar al contenido',
  welcome: 'Bienvenido al portfolio de', // + the full name (app/Welcome.tsx)
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
  // wording chosen by Iñigo (2026-10-23), only for projects whose README has methodology and results
  summaryNotice: 'Ficha resumida. Consulta la metodología y los resultados en el repositorio.',
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
    controlsHint: { prev: 'anterior', next: 'siguiente', back: 'volver', open: 'abrir' },
    soon: 'Próximamente',
    flip: 'Girar',
    sound: 'Sonido',
    position: (label: string, i: number, n: number) => `${label}, ${i} de ${n}`,
  },
  notFound: { title: 'Esta página no existe', body: 'Puede que el enlace haya cambiado. Prueba desde aquí:' },
  labels: {
    languages: 'Idiomas',
    facts: 'Datos verificados',
    stack: 'Stack',
    home: 'Inicio',
    projectsWord: 'proyectos',
    chartData: 'Ver los datos',
  },
};
