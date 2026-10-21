import type { ReactNode } from 'react';
import { href } from '../app/routes';
import { person } from '../content/profile';
import { sections, topNav, ui } from '../content/site';
import './page.css';

/** Conventional page: name + top nav, content, and the full list of sections in the footer. */
export function PageShell({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <div className="page" data-page="page">
      <a className="skip" href="#contenido">
        {ui.skipToContent}
      </a>
      <header className="page__header">
        <a className="page__name" href={href('')}>
          {person.name}
        </a>
        <nav className="topnav" aria-label={ui.primaryNav}>
          <ul>
            {topNav.map((n) => (
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
      <main id="contenido" className="page__main" tabIndex={-1}>
        {children}
      </main>
      <footer className="page__footer">
        <nav aria-label={ui.allSections}>
          <ul>
            {sections
              .filter((s) => s.path)
              .map((s) => (
                <li key={s.id}>
                  <a
                    href={href(s.path!)}
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
}
