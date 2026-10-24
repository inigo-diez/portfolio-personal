import type { ReactNode } from 'react';
import { href } from '../app/routes';
import { person } from '../content/profile';
import { topNav, ui, type SectionId } from '../content/site';
import { ScreenFrame } from '../transition/ScreenFrame';
import { PageDock } from './PageDock';
import './page.css';

/**
 * Conventional page: name + top nav and content.
 * `layered`: the page is one a transition grows into (the device screen, a canvas card): the layer / world
 * pair is what it scales (transition/shared.ts). `dock` (implies layered): the device sits docked on it.
 * `wide`: a wider column, for a project page and its full README.
 */
export function PageShell({
  current,
  dock,
  layered = !!dock,
  wide = false,
  about = false,
  children,
}: {
  current?: string;
  dock?: SectionId;
  layered?: boolean;
  wide?: boolean;
  /** Sobre mí: the text with the portrait to its right. */
  about?: boolean;
  children: ReactNode;
}) {
  const page = (
    <div
      className={'page' + (dock ? ' page--docked' : '')}
      data-page={layered ? undefined : 'page'}
      data-world={layered ? '' : undefined}
    >
      <a className="skip" href="#contenido">
        {ui.skipToContent}
      </a>
      <header className="page__header">
        <a className="page__name" href={href('')}>
          {person.name}
        </a>
        <nav className="topnav" aria-label={ui.primaryNav}>
          <ul>
            {topNav().map((n) => (
              <li key={n.label}>
                <a
                  href={href(n.path)}
                  aria-current={n.path === current ? 'page' : undefined}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {dock && <PageDock id={dock} />}
      <main
        id="contenido"
        className={'page__main' + (wide ? ' page__main--wide' : '') + (about ? ' page__main--about' : '')}
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
  if (!layered) return page;
  return (
    <div className="layered" data-page="page">
      <div className="layered__layer" data-layer>
        {page}
      </div>
      <ScreenFrame />
    </div>
  );
}
