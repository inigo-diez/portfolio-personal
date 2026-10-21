// Typed content model. Every user-facing string lives in src/content (i18n-ready);
// every factual claim records where it comes from (`sources`).

/** Where a claim comes from: a README, the CV, the old portfolio… */
export interface Source {
  label: string;
  url?: string;
}

/** Finished work vs. work still in progress (shown differently on the site). */
export type ProjectStatus = 'terminado' | 'en-curso';

export type CollectionId = '01' | '02' | '03' | '04';

/** The big number on a card and its caption. Only verified figures. */
export interface Headline {
  value: string;
  label: string;
}

/** Position and size of a card in canvas world coordinates (px at zoom 1). */
export interface CanvasPlacement {
  x: number;
  y: number;
  w: number;
}

/** One block of a case study (problem, data, method, result…). Filled in E6. */
export interface CaseSection {
  id: string;
  title: string;
  body: string[];
}

export interface Project {
  slug: string;
  /** Reference number inside its collection, e.g. "04.1" (Geist Mono). */
  ref: string;
  collection: CollectionId;
  title: string;
  /** Short title for cards and the device. */
  shortTitle: string;
  /** One-paragraph hook (from the approved project map). */
  summary: string;
  status: ProjectStatus;
  /** Year of the work. null = not confirmed yet → TODO(content). */
  year: number | null;
  featured: boolean;
  /** Capabilities, not sectors. */
  tags: string[];
  stack: string[];
  headline: Headline;
  /** Extra verified facts shown on the case study. */
  facts: string[];
  cover: { src: string; alt: string } | null;
  canvas: CanvasPlacement;
  links: { repo?: string; demo?: string; paper?: string };
  sections: CaseSection[];
  sources: Source[];
  /** Explicit TODO(content) items: missing real data, never invented. */
  todo: string[];
  /** Honest notes that must accompany the project (e.g. AI-assisted development). */
  notes?: string[];
}

export interface Collection {
  id: CollectionId;
  title: string;
  /** Short title for the device list. */
  shortTitle: string;
  /** Uppercase tag line on the card. */
  kicker: string;
  projectCount: number;
  /** Verified headline figure of the collection (from one of its projects). */
  headline: Headline & { from: string };
  canvas: CanvasPlacement;
  /** Slugs of the projects already written up (E3: drafts only). */
  projects: string[];
}

export interface PageMeta {
  title: string;
  description: string;
}
