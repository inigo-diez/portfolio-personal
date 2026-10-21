import { href } from '../app/routes';
import { navigate } from '../app/router';
import { person } from '../content/profile';
import { TOTAL_PROJECTS } from '../content/projects';
import { sections, topNav, ui } from '../content/site';
import { Device, type Command } from '../device/Device';
import { MenuScreen, useListNav } from '../os/Screen';
import './home.css';

// The menu opens (and INICIO returns) with Proyectos selected: it is the main destination.
const DEFAULT_ENTRY = sections.findIndex((s) => s.id === 'proyectos');

export function HomePage() {
  const nav = useListNav(sections.length, DEFAULT_ENTRY);

  const open = (i: number) => {
    const s = sections[i];
    if (!s.path) return; // Mi música: E4
    if (s.id === 'cv') window.open(href(s.path), '_blank', 'noopener');
    else navigate(s.path);
  };
  const onCommand = (c: Command) => {
    if (c === 'next') nav.move(1, true);
    else if (c === 'prev') nav.move(-1, true);
    else if (c === 'select') open(nav.sel);
    else if (c === 'home') nav.setSel(DEFAULT_ENTRY);
  };

  return (
    <div className="home" data-page="home">
      <a className="skip" href="#enlaces">
        {ui.skipToContent}
      </a>
      <header className="home__header" data-chrome>
        <nav className="topnav" aria-label={ui.primaryNav} id="enlaces">
          <ul>
            {topNav.map((n) => (
              <li key={n.label}>
                <a href={n.href ?? href(n.path!)} {...(n.href ? { target: '_blank', rel: 'noopener' } : {})}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="home__main">
        <div className="home__intro" data-chrome>
          <h1>{person.greeting}</h1>
        </div>

        <div className="home__stage">
          <Device data-device="hero" onCommand={onCommand} globalKeys>
            <MenuScreen
              items={sections}
              sel={nav.sel}
              onPick={(i) => {
                nav.setSel(i);
                open(i);
              }}
            />
          </Device>
          <p className="home__keys" data-chrome>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {ui.device.keysHint.move} · <kbd>→</kbd> {ui.device.keysHint.open} · <kbd>←</kbd>{' '}
            {ui.device.keysHint.back}
          </p>
        </div>

        <div className="home__cta" data-chrome>
          <a className="pill" href={href('proyectos/')}>
            {ui.seeProjects}
          </a>
        </div>

        <nav className="home__quick" aria-label={ui.allSections} data-chrome>
          <ul>
            {sections
              .filter((s) => s.path)
              .map((s) => (
                <li key={s.id}>
                  <a href={href(s.path!)} {...(s.id === 'cv' ? { target: '_blank', rel: 'noopener' } : {})}>
                    {s.label} <span>{s.id === 'proyectos' ? TOTAL_PROJECTS : s.id === 'cv' ? 'PDF' : '→'}</span>
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
