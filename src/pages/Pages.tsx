import { href, isDocked } from '../app/routes';
import { about, cursos, formacion, habilidades, person, trayectoria, type TimelineItem } from '../content/profile';
import { getTracks, musicIntro, musicUi } from '../content/music';
import { projectBySlug } from '../content/projects';
import { labelOf, openSections, ui, type PageId } from '../content/site';
import { PageShell } from './PageShell';

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ul className="rows">
      {items.map((it) => (
        <li key={it.title}>
          <span>
            {it.title}
            <small>
              {it.place}
              {it.detail ? ` · ${it.detail}` : ''}
            </small>
          </span>
          {/* TODO(content): missing dates are listed in docs/PLAN.md */}
          <span>{it.dates ?? <span className="todo">{ui.pending}</span>}</span>
        </li>
      ))}
    </ul>
  );
}

function SobreMi() {
  return (
    <>
      <h1>{labelOf('sobre-mi')}</h1>
      {about.paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? 'lead' : undefined}>
          {p}
        </p>
      ))}
      <h2>{ui.labels.languages}</h2>
      <ul className="chips">
        {about.languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </>
  );
}

function Trayectoria() {
  return (
    <>
      <h1>{labelOf('trayectoria')}</h1>
      <Timeline items={trayectoria} />
    </>
  );
}

function Habilidades() {
  return (
    <>
      <h1>{labelOf('habilidades')}</h1>
      {habilidades.map((g) => (
        <section key={g.group}>
          <h2>{g.group}</h2>
          <ul className="chips">
            {g.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Formacion() {
  return (
    <>
      <h1>{labelOf('formacion')}</h1>
      <Timeline items={formacion} />
      <h2>{ui.labels.courses}</h2>
      <Timeline items={cursos} />
    </>
  );
}

function Contacto() {
  return (
    <>
      <h1>{labelOf('contacto')}</h1>
      <ul className="rows">
        <li>
          <a className="text-link" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <span>{ui.labels.email}</span>
        </li>
        <li>
          <a className="text-link" href={person.linkedin}>
            LinkedIn
          </a>
          <span>{ui.labels.profile}</span>
        </li>
        <li>
          <a className="text-link" href={person.github}>
            github.com/inigo-diez
          </a>
          <span>{ui.labels.code}</span>
        </li>
        <li>
          <a className="text-link" href={href(person.cv)} download={person.cvDownloadName}>
            {ui.labels.cv}
          </a>
          <span>PDF</span>
        </li>
      </ul>
    </>
  );
}

function MiMusica() {
  return (
    <>
      <h1>{labelOf('mi-musica')}</h1>
      {musicIntro && <p className="lead">{musicIntro}</p>}
      <ol className="rows songs-page">
        {getTracks().map((t, i) => (
          <li key={i}>
            <span>
              {t.title}
              <small>{t.artist}</small>
              <small className="songs-page__note">«{t.note}»</small>
            </span>
            <a className="text-link" href={t.url} target="_blank" rel="noopener">
              {musicUi.open}
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}

const PAGES: Record<PageId, () => React.JSX.Element> = {
  'sobre-mi': SobreMi,
  trayectoria: Trayectoria,
  habilidades: Habilidades,
  formacion: Formacion,
  contacto: Contacto,
  'mi-musica': MiMusica,
};

export function SectionPage({ id }: { id: PageId }) {
  const Body = PAGES[id];
  return (
    <PageShell current={`${id}/`} dock={isDocked(id) ? id : undefined}>
      <Body />
    </PageShell>
  );
}

export function ProjectPage({ slug }: { slug: string }) {
  const p = projectBySlug(slug)!;
  return (
    <PageShell current="proyectos/">
      <a className="back-link" href={href('proyectos/')}>
        ← {ui.backToProjects}
      </a>
      <div className="kicker">
        <span className="mono">{p.ref}</span>
        <span>{ui.status[p.status]}</span>
        {p.year && <span>{p.year}</span>}
      </div>
      <h1>{p.title}</h1>
      <p className="lead">{p.summary}</p>
      <div className="big-figure">
        <b>{p.headline.value}</b>
        <span>{p.headline.label}</span>
      </div>
      <h2>{ui.labels.facts}</h2>
      <ul className="rows">
        {p.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <h2>{ui.labels.stack}</h2>
      <ul className="chips">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {p.notes?.map((n) => (
        <p key={n} className="notice">
          {n}
        </p>
      ))}
      <h2>{ui.sources}</h2>
      <ul className="rows">
        {p.sources.map((s) => (
          <li key={s.label}>
            {s.url ? (
              <a className="text-link" href={s.url}>
                {s.label}
              </a>
            ) : (
              s.label
            )}
            {s.url === p.links.repo && <span>{ui.repo}</span>}
          </li>
        ))}
      </ul>
      <p className="notice">{ui.draftNotice}</p>
    </PageShell>
  );
}

export function NotFoundPage() {
  return (
    <PageShell>
      <h1>{ui.notFound.title}</h1>
      <p>{ui.notFound.body}</p>
      <ul className="rows">
        <li>
          <a className="text-link" href={href('')}>
            {ui.labels.home}
          </a>
        </li>
        {openSections()
          .filter((s) => s.id !== 'cv')
          .map((s) => (
            <li key={s.id}>
              <a className="text-link" href={href(s.path)}>
                {s.label}
              </a>
            </li>
          ))}
      </ul>
    </PageShell>
  );
}
