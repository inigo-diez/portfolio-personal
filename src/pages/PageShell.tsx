import type { ReactNode } from 'react';
import { href } from '../app/routes';
import { person } from '../content/profile';
import { openSections, topNav, ui, type SectionId } from '../content/site';
import { ScreenFrame } from '../transition/ScreenFrame';
import { PageDock } from './PageDock';
import './page.css';

/**
 * Conventional page: name + top nav, content, and the full list of sections in the footer.
 * `layered`: the page is one a transition grows into (the device screen, a canvas card): the layer / world
 * pair is what it scales (transition/shared.ts). `dock` (implies layered): the device sits docked on it.
 */
export function PageShell({
  current,
  dock,
  layered = !!dock,
  children,
}: {
  current?: string;
  dock?: SectionId;
  layered?: boolean;
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
                  href={n.href ?? href(n.path!)}
                  aria-current={n.path === current ? 'page' : undefined}
                  {...(n.href ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {dock && <PageDock id={dock} />}
      <main id="contenido" className="page__main" tabIndex={-1}>
        {children}
      </main>
      <footer className="page__footer">
        <nav aria-label={ui.allSections}>
          <ul>
            {openSections().map((s) => (
              <li key={s.id}>
                <a
                  href={href(s.path)}
                  aria-current={s.path === current ? 'page' : undefined}
                  {...(s.id === 'cv' ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p>
          <a href={`mailto:${person.email}`}>{person.email}</a> · <a href={person.github}>GitHub</a> ·{' '}
          <a href={person.linkedin}>LinkedIn</a>
        </p>
      </footer>
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
