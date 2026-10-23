import type { ReactNode } from 'react';
import { href } from '../app/routes';
import { person } from '../content/profile';
import { openSections, topNav, ui, type PageId } from '../content/site';
import { ScreenFrame } from '../transition/ScreenFrame';
import { PageDock } from './PageDock';
import './page.css';

/**
 * Conventional page: name + top nav, content, and the full list of sections in the footer.
 * With `dock`, the page is one the device screen grows into: the device sits docked in the corner, and the
 * layer / world pair is what the transition scales (see transition/screenToCanvas.ts).
 */
export function PageShell({ current, dock, children }: { current?: string; dock?: PageId; children: ReactNode }) {
  const page = (
    <div
      className={'page' + (dock ? ' page--docked' : '')}
      data-page={dock ? undefined : 'page'}
      data-world={dock ? '' : undefined}
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
  if (!dock) return page;
  return (
    <div className="docked" data-page="page">
      <div className="docked__layer" data-layer>
        {page}
      </div>
      <ScreenFrame />
    </div>
  );
}
