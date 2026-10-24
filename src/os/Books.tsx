import { href } from '../app/routes';
import { booksUi, type Book } from '../content/books';
import { Icon } from '../device/icons';
import { Frame, type Dir } from './Screen';

/**
 * Mis libros: one book at a time, its cover with title and author under it. Pressing the cover turns it over to
 * show the back (what the book is about); under the book, «Anterior» and «Siguiente» go to the other books.
 */
export function BooksScreen({
  books,
  index,
  flipped,
  dir,
  onFlip,
  onMove,
}: {
  books: Book[];
  index: number;
  flipped: boolean;
  dir: Dir;
  onFlip: () => void;
  onMove: (step: 1 | -1) => void;
}) {
  const b = books[index];
  const n = books.length;
  return (
    <Frame
      title={booksUi.title}
      live={flipped ? `${booksUi.flipToFront}. ${b.synopsis}` : booksUi.announce(b, index + 1, n)}
      dir={dir}
    >
      <div className="bk">
        <button
          type="button"
          className="bk__card"
          aria-pressed={flipped}
          aria-label={flipped ? booksUi.flipToFront : booksUi.flipToBack}
          onClick={onFlip}
        >
          <span className={'bk__inner' + (flipped ? ' is-back' : '')}>
            <img
              className="bk__face bk__front"
              src={href(b.cover)}
              width={b.coverWidth}
              height={b.coverHeight}
              alt={booksUi.coverAlt(b)}
              aria-hidden={flipped}
              draggable={false}
            />
            <span
              className="bk__face bk__back"
              style={{ ['--back' as string]: b.backColor }}
              aria-hidden={!flipped}
            >
              {b.synopsis}
            </span>
          </span>
        </button>
        <div className="bk__meta">
          <b>{b.title}</b>
          <small>{b.author}</small>
        </div>
        <div className="bk__nav">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>
            <Icon name="back" />
            {booksUi.prev}
          </button>
          <span aria-hidden="true">{booksUi.of(index + 1, n)}</span>
          <button type="button" disabled={index === n - 1} onClick={() => onMove(1)}>
            {booksUi.next}
            <Icon name="chev" />
          </button>
        </div>
      </div>
    </Frame>
  );
}
