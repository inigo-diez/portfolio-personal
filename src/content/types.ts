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

/** A small results table inside a case study. `highlight` = index of the row the text is about. */
export interface CaseTable {
  caption: string;
  head: string[];
  rows: string[][];
  highlight?: number;
}

/**
 * One block of a case study, in the order of brief §9 (problem, data, approach, results, limitations…).
 * Blocks without real content are left out, never filled. `source` says where its claims come from.
 */
export interface CaseSection {
  id: string;
  title: string;
  body: string[];
  list?: string[];
  table?: CaseTable;
  /** Key of a chart in content/charts (drawn by the site, in its palette). */
  chart?: string;
  source: string;
}

/**
 * A highlight of a project: its figure or short result, and one or two sentences on what Iñigo did, what came of
 * it and why it matters, as far as the README says so. Only verified content.
 */
export interface Fact {
  value: string;
  text: string;
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
  /** Year of the work. null = not shown (Iñigo, 2026-10-23: no project years on the site). */
  year: number | null;
  featured: boolean;
  /** Capabilities, not sectors. */
  tags: string[];
  stack: string[];
  headline: Headline;
  /** Highlights: the cards of the open project on the canvas, and the list of a compact case study. */
  facts: Fact[];
  cover: { src: string; alt: string } | null;
  canvas: CanvasPlacement;
  links: { repo?: string; demo?: string; paper?: string };
  sections: CaseSection[];
  sources: Source[];
  /** Explicit TODO(content) items: missing real data, never invented. */
  todo: string[];
  /** README written in English: the canvas shows its Spanish translation (with a note); the original stays on GitHub. */
  readmeTranslated?: true;
  /** A note shown over its README on the project page (e.g. figures the README has not caught up with). */
  readmeNote?: string;
  /** Honest notes that must accompany the project (e.g. AI-assisted development). */
  notes?: string[];
  /**
   * Its README holds both the methodology and the results (checked on the 2026-10-19 copy). A project without
   * a case study is then a compact card that sends to the repository (Iñigo, 2026-10-23); otherwise no notice.
   */
  repoHasDetail?: true;
}

export interface Collection {
  id: CollectionId;
  title: string;
  /** Short title for the device list. */
  shortTitle: string;
  /** Uppercase tag line on the card. */
  kicker: string;
  /** Verified headline figure of the collection (from one of its projects). */
  headline: Headline & { from: string };
  canvas: CanvasPlacement;
  /** Slugs of its projects, in reference order. */
  projects: string[];
}

export interface PageMeta {
  title: string;
  description: string;
}
