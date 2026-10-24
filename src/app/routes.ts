import { projectBySlug, projects } from '../content/projects';
import { musicAvailable } from '../content/music';
import { meta, type PageId } from '../content/site';
import type { PageMeta } from '../content/types';

export type Route =
  | { kind: 'home' }
  | { kind: 'canvas' }
  | { kind: 'project'; slug: string }
  | { kind: 'page'; id: PageId }
  | { kind: 'notfound' };

// Mi música is a route only while it has songs (content/music.ts); never prerendered without them.
const pages = (): PageId[] => [
  'sobre-mi',
  'trayectoria',
  'habilidades',
  'formacion',
  'contacto',
  'cv',
  ...(musicAvailable() ? (['mi-musica'] as const) : []),
  'mis-libros',
];

/**
 * Sections whose screen grows into their page, with the device docked (decided 2026-10-23: the text is
 * read at web size, not inside the 4:3 screen). Mi música and Mis libros stay inside the device.
 */
export const DOCKED_PAGES: readonly PageId[] = [
  'sobre-mi',
  'trayectoria',
  'habilidades',
  'formacion',
  'contacto',
  'cv',
];
export const isDocked = (id: PageId) => DOCKED_PAGES.includes(id);

/** Routes the device screen grows into (and shrinks back from). */
export const opensFromScreen = (r: Route) => r.kind === 'canvas' || (r.kind === 'page' && isDocked(r.id));

export const BASE = import.meta.env.BASE_URL; // from vite.config.ts (single source)

/** Absolute URL path for a path relative to the base ("proyectos/" → "/portfolio-personal/proyectos/"). */
export const href = (rel: string) => BASE + rel.replace(/^\//, '');

/** Parse a location pathname (with base) into a route. Trailing slash optional. */
export function parse(pathname: string): Route {
  let p = decodeURI(pathname);
  if (p.startsWith(BASE)) p = p.slice(BASE.length);
  else if (p + '/' === BASE) p = '';
  else return { kind: 'notfound' };
  p = p.replace(/index\.html$/, '').replace(/\/+$/, '');
  if (p === '') return { kind: 'home' };
  if (p === 'proyectos') return { kind: 'canvas' };
  const m = /^proyectos\/([a-z0-9-]+)$/.exec(p);
  if (m) return projectBySlug(m[1]) ? { kind: 'project', slug: m[1] } : { kind: 'notfound' };
  if ((pages() as string[]).includes(p)) return { kind: 'page', id: p as PageId };
  return { kind: 'notfound' };
}

/** Canonical path (relative to base, trailing slash) of a route. */
export function pathOf(r: Route): string {
  switch (r.kind) {
    case 'home':
      return '';
    case 'canvas':
      return 'proyectos/';
    case 'project':
      return `proyectos/${r.slug}/`;
    case 'page':
      return `${r.id}/`;
    case 'notfound':
      return '404.html';
  }
}

export const sameRoute = (a: Route, b: Route) => pathOf(a) === pathOf(b);

export function metaOf(r: Route): PageMeta {
  switch (r.kind) {
    case 'home':
      return meta.home;
    case 'canvas':
      return meta.proyectos;
    case 'project': {
      const p = projectBySlug(r.slug)!;
      return { title: `${p.shortTitle} · ${meta.proyectos.title}`, description: p.summary };
    }
    case 'page':
      return meta[r.id];
    case 'notfound':
      return meta.notFound;
  }
}

/** Every route that gets its own prerendered index.html. */
export const allRoutes: Route[] = [
  { kind: 'home' },
  { kind: 'canvas' },
  ...projects.map((p) => ({ kind: 'project' as const, slug: p.slug })),
  ...pages().map((id) => ({ kind: 'page' as const, id })),
];
