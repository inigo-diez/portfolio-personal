import { useEffect, useRef, useState, type FormEvent } from 'react';
import { href, isDocked } from '../app/routes';
import { about, certificaciones, contacto, formacion, habilidades, person, trayectoria } from '../content/profile';
import { booksUi, books } from '../content/books';
import { getTracks, musicIntro, musicUi } from '../content/music';
import { projectBySlug } from '../content/projects';
import { loadReadme, readmeNow } from '../content/readmes';
import { labelOf, openSections, ui, type PageId } from '../content/site';
import { charts } from '../content/charts';
import type { CaseSection } from '../content/types';
import { Glyph, icons } from './contactIcons';
import { LineChart } from './LineChart';
import { PageShell } from './PageShell';
import '../styles/readme.css';

/** One block of a case study: text, then its list, table and chart (each optional). */
function CaseBlock({ section: s }: { section: CaseSection }) {
  return (
    <section className="case-section" aria-labelledby={`caso-${s.id}`}>
      <h2 id={`caso-${s.id}`}>{s.title}</h2>
      {s.body.map((b, i) => (
        <p key={i}>{b}</p>
      ))}
      {s.list && (
        <ul className="bullets">
          {s.list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>
      )}
      {s.table && (
        // it scrolls sideways on phones: reachable with the keyboard (WCAG 2.1.1), named by its caption
        <div className="table-wrap" tabIndex={0} role="region" aria-label={s.table.caption}>
          <table className="data-table">
            <caption>{s.table.caption}</caption>
            <thead>
              <tr>
                {s.table.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map(([first, ...rest], i) => (
                <tr key={first} className={i === s.table!.highlight ? 'is-highlight' : undefined}>
                  <th scope="row">{first}</th>
                  {rest.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.chart && charts[s.chart] && <LineChart spec={charts[s.chart]} />}
    </section>
  );
}

function SobreMi() {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  // The portrait is as tall as the text: publish the text's height as --about-h (page.css does the rest).
  useEffect(() => {
    const el = body.current!;
    const set = (h: number) => root.current?.style.setProperty('--about-h', h + 'px'); // the observer can fire as the page unmounts
    set(el.offsetHeight);
    const ro = new ResizeObserver(([e]) => set(e.contentRect.height)); // layout size: a page transition's scale does not change it
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="about" ref={root}>
      <div className="about__body" ref={body}>
        <h1>{labelOf('sobre-mi')}</h1>
        {about.paragraphs.map((p, i) => (
          <p key={i} className="about__text">
            {p}
          </p>
        ))}
      </div>
      <picture className="portrait">
        <source srcSet={href(person.photo.avif)} type="image/avif" />
        <img
          src={href(person.photo.webp)}
          alt={person.photo.alt}
          width={person.photo.width}
          height={person.photo.height}
          decoding="async"
        />
      </picture>
    </div>
  );
}

function Trayectoria() {
  return (
    <>
      <h1>{labelOf('trayectoria')}</h1>
      <div className="trajectory">
        {trayectoria.map((item) => (
          <section className="trajectory__entry" key={item.title}>
            <div className="trajectory__place">{item.place}</div>
            <h2>
              {item.url ? (
                <a className="text-link" href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h2>
            {item.status && <p className="trajectory__status">{item.status}</p>}
            {item.bullets && (
              <ul className="bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

function Habilidades() {
  return (
    <>
      <h1>{labelOf('habilidades')}</h1>
      {habilidades.map((g) => (
        <section key={g.group} className="skills">
          <h2>{g.group}</h2>
          <ul className="skills__grid">
            {g.items.map((s) => (
              <li key={s.name}>
                <img src={href(`img/skills/${s.logo}`)} alt="" loading="lazy" />
                {s.name}
              </li>
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
      {formacion.map((d) => (
        <section key={d.institution} className="panel">
          <h2>
            <a className="text-link" href={d.url} target="_blank" rel="noopener noreferrer">
              {d.institution}
            </a>
          </h2>
          <p className="panel__line">
            {d.degree} {d.dates && <small>({d.dates})</small>}
          </p>
        </section>
      ))}
      <section className="panel">
        <h2>{certificaciones.title}</h2>
        <ul className="certs">
          {certificaciones.items.map((c) => (
            <li key={c.title}>
              {c.certificate ? (
                <a className="text-link" href={href(c.certificate)} target="_blank" rel="noopener">
                  <b>{c.title}</b>
                </a>
              ) : (
                <b>{c.title}</b>
              )}{' '}
              — {c.provider} {c.meta && <small>({c.meta})</small>}
              <br />
              {c.description}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Contacto() {
  return (
    <>
      <h1>{labelOf('contacto')}</h1>
      <ul className="contact-links">
        <li>
          <a href={`mailto:${person.email}`}>
            <img className="contact-links__icon contact-links__icon--gmail" src={href(contacto.gmailLogo)} alt="" />
            {contacto.links.email}
          </a>
        </li>
        <li>
          <a href={person.github} target="_blank" rel="noopener noreferrer">
            <Glyph icon={icons.github} className="contact-links__icon contact-links__icon--github" />
            {contacto.links.github}
          </a>
        </li>
        <li>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
            <Glyph icon={icons.linkedin} className="contact-links__icon contact-links__icon--linkedin" />
            {contacto.links.linkedin}
          </a>
        </li>
      </ul>
      <ContactForm />
    </>
  );
}

/** The old portfolio's form: posts name, email and message as JSON to Formspree; on success the form gives way to
 * a thank-you line, on failure the button comes back with the error under it (the old one used an alert). */
function ContactForm() {
  const f = contacto.form;
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };
    if (!body.name || !body.email || !body.message) return;
    setState('sending');
    try {
      const res = await fetch(f.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <section className="panel contact-form" aria-labelledby="contact-form-title">
      <span className="contact-form__icon">
        <Glyph icon={icons.envelope} />
      </span>
      <h2 id="contact-form-title">{f.title}</h2>
      <p className="contact-form__intro">{f.intro}</p>
      {state === 'sent' ? (
        <p className="contact-form__done" role="status">
          {f.success}
        </p>
      ) : (
        <form onSubmit={submit}>
          <label>
            {f.name}
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            {f.email}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {f.message}
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? (
              f.sending
            ) : (
              <>
                {f.submit} <Glyph icon={icons.paperPlane} />
              </>
            )}
          </button>
          {state === 'error' && (
            <p className="contact-form__error" role="alert">
              {f.error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function Cv() {
  const pdf = href(person.cv);
  return (
    <div className="cv-page">
      <h1>{labelOf('cv')}</h1>
      <div className="cv-page__actions">
        <a className="pill" href={pdf} target="_blank" rel="noopener">
          Ver CV ↗
        </a>
        <a className="cv-page__download" href={pdf} download={person.cvDownloadName}>
          Descargar PDF ↓
        </a>
      </div>
      {/* The CV as a loose sheet of paper (Iñigo, 2026-10-24: no frame): an image of its page
          (scripts/cv-preview.py), linked to the PDF. */}
      <a className="cv-page__sheet" href={pdf} target="_blank" rel="noopener">
        <img
          src={href(person.cvPreview.src)}
          width={person.cvPreview.width}
          height={person.cvPreview.height}
          alt={`CV de ${person.name}. Abre el PDF`}
          loading="lazy"
        />
      </a>
    </div>
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
              {t.note && <small className="songs-page__note">«{t.note}»</small>}
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

function MisLibros() {
  return (
    <>
      <h1>{labelOf('mis-libros')}</h1>
      <ol className="books-page">
        {books.map((b) => (
          <li key={b.slug}>
            <img
              src={href(b.cover)}
              width={b.coverWidth}
              height={b.coverHeight}
              alt={booksUi.coverAlt(b)}
              loading="lazy"
            />
            <div>
              <h2>{b.title}</h2>
              <p className="books-page__author">{b.author}</p>
              <p>{b.synopsis}</p>
            </div>
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
  cv: Cv,
  'mi-musica': MiMusica,
  'mis-libros': MisLibros,
};

export function SectionPage({ id }: { id: PageId }) {
  const Body = PAGES[id];
  return (
    <PageShell current={`${id}/`} dock={isDocked(id) ? id : undefined} wide={id === 'cv'} about={id === 'sobre-mi'}>
      <Body />
    </PageShell>
  );
}

/**
 * A project page (E8, Iñigo, 2026-10-24): a short introduction (title, its summary, the repository) and, right
 * under it, its full README with its images and captions. Morosidad keeps its revised case study before the
 * README. Nothing repeats the README.
 */
export function ProjectPage({ slug }: { slug: string }) {
  const p = projectBySlug(slug)!;
  const caseStudy = p.sections.length > 0;
  const repo = p.links.repo && (
    <a className="text-link" href={p.links.repo} target="_blank" rel="noopener">
      {ui.canvas.github} ↗
    </a>
  );
  return (
    <PageShell current="proyectos/" layered wide>
      <div className="project__intro">
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
        {!caseStudy && repo && <p className="case-link">{repo}</p>}
        {p.notes?.map((n) => (
          <p key={n} className="notice">
            {n}
          </p>
        ))}
      </div>
      {caseStudy && (
        <div className="project__case">
          <div className="big-figure">
            <b>{p.headline.value}</b>
            <span>{p.headline.label}</span>
          </div>
          {p.sections.map((s) => (
            <CaseBlock key={s.id} section={s} />
          ))}
          <h2>{ui.labels.stack}</h2>
          <ul className="chips">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {repo && <p className="case-link">{repo}</p>}
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
        </div>
      )}
      <section className="project__readme" aria-labelledby="readme-title">
        <div className="project__readme-head">
          <h2 id="readme-title">{ui.canvas.readme}</h2>
          {p.readmeTranslated && <span>{ui.canvas.readmeTranslated}</span>}
          {repo}
        </div>
        {p.readmeNote && <p className="notice">{p.readmeNote}</p>}
        <ProjectReadme slug={slug} />
      </section>
    </PageShell>
  );
}

/**
 * The full README on its page: in the prerendered HTML (so it is there on a reload or a direct visit) and read
 * back from it on hydration; on a visit from inside the site it loads at once.
 */
function ProjectReadme({ slug }: { slug: string }) {
  const id = `readme-${slug}`;
  const [html, setHtml] = useState<string | null>(() =>
    typeof document === 'undefined' ? readmeNow(slug) : (document.getElementById(id)?.innerHTML ?? null),
  );
  useEffect(() => {
    if (html !== null) return;
    let alive = true;
    loadReadme(slug)?.then((h) => alive && setHtml(h));
    return () => {
      alive = false;
    };
  }, [html, slug]);
  return html === null ? (
    <div className="readme readme--page readme--loading">{ui.canvas.loading}</div>
  ) : (
    <div id={id} className="readme readme--page" dangerouslySetInnerHTML={{ __html: html }} />
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
        {openSections().map((s) => (
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
