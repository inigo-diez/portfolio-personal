// Mis libros (Iñigo, 2026-10-25): the five books he named, in the order he said them. Covers are the publishers'
// own, unmodified except for the WebP conversion, in public/img/books/. Which edition's cover is Claude's choice
// (the most striking of the Spanish editions found); the synopses are Claude's own wording of facts taken from
// the sources listed per book. TODO(content): Iñigo reviews the covers and the synopses.

export interface Book {
  slug: string;
  title: string;
  author: string;
  /** Back cover: what it is about, in ≤ 130 characters (fits the device's back face). */
  synopsis: string;
  /** Colour of the back cover: a dark tone taken from the cover itself (light text on it). */
  backColor: string;
  /** Cover image, relative to the base URL. */
  cover: string;
  coverWidth: number;
  coverHeight: number;
  /** Edition the cover belongs to. */
  edition: string;
  /** Where the cover file came from. */
  coverSource: string;
  /** Pages the synopsis is based on. */
  sources: string[];
}

const OPEN_LIBRARY = 'covers.openlibrary.org (portada por ISBN)';
const CASA_DEL_LIBRO = 'imagessl2.casadellibro.com (portada por ISBN)';

export const books: Book[] = [
  {
    slug: 'tokio-blues',
    title: 'Tokio blues (Norwegian Wood)',
    author: 'Haruki Murakami',
    synopsis:
      'Toru Watanabe recuerda el Tokio de los sesenta: la muerte de su amigo Kizuki, Naoko y Midori.',
    backColor: '#180d12',
    cover: 'img/books/tokio-blues.webp',
    coverWidth: 229,
    coverHeight: 344,
    edition: 'Tusquets, colección Andanzas (ISBN 978-84-8310-307-4)',
    coverSource: CASA_DEL_LIBRO,
    sources: ['https://en.wikipedia.org/wiki/Norwegian_Wood_(novel)'],
  },
  {
    slug: 'kafka-en-la-orilla',
    title: 'Kafka en la orilla',
    author: 'Haruki Murakami',
    synopsis:
      'Kafka Tamura, de 15 años, huye de casa. Nakata, un anciano que busca gatos, viaja por Japón. Sus caminos convergen.',
    backColor: '#1f2922',
    cover: 'img/books/kafka-en-la-orilla.webp',
    coverWidth: 229,
    coverHeight: 344,
    edition: 'Tusquets, colección Andanzas (ISBN 978-84-8310-356-2)',
    coverSource: CASA_DEL_LIBRO,
    sources: ['https://es.wikipedia.org/wiki/Kafka_en_la_orilla'],
  },
  {
    slug: 'el-extranjero',
    title: 'El extranjero',
    author: 'Albert Camus',
    synopsis:
      'Meursault no muestra dolor en el entierro de su madre. Tras un hecho violento, lo juzgan por su conducta.',
    backColor: '#0b0b0b',
    cover: 'img/books/el-extranjero.webp',
    coverWidth: 333,
    coverHeight: 500,
    edition: 'Alianza Editorial, El Libro de Bolsillo (ISBN 978-84-206-6978-6)',
    coverSource: OPEN_LIBRARY,
    sources: ['https://es.wikipedia.org/wiki/El_extranjero'],
  },
  {
    slug: 'ecce-homo',
    title: 'Ecce homo',
    author: 'Friedrich Nietzsche',
    synopsis:
      'Nietzsche repasa su vida y sus libros. Subtítulo: «Cómo se llega a ser lo que se es». Escrito en 1888, publicado en 1908.',
    backColor: '#0d0c0c',
    cover: 'img/books/ecce-homo.webp',
    coverWidth: 334,
    coverHeight: 500,
    edition: 'Alianza Editorial, El Libro de Bolsillo (ISBN 978-84-206-5355-6)',
    coverSource: OPEN_LIBRARY,
    sources: [
      'https://en.wikipedia.org/wiki/Ecce_Homo_(book)',
      'https://www.polifemo.com/libros/ecce-homo-como-se-llega-a-ser-lo-que-se-es/140439/',
    ],
  },
  {
    slug: 'la-muerte-de-ivan-ilich',
    title: 'La muerte de Iván Ilich',
    author: 'Lev Tolstói',
    synopsis:
      'Iván Ilich, un funcionario de prestigio, afronta una enfermedad terminal y ve lo vacía que ha sido su vida.',
    backColor: '#2a2a27',
    cover: 'img/books/la-muerte-de-ivan-ilich.webp',
    coverWidth: 229,
    coverHeight: 321,
    edition: 'Alianza Editorial, edición ilustrada por Mariano Henestrosa (ISBN 978-84-9104-332-4)',
    coverSource: CASA_DEL_LIBRO,
    sources: ['https://es.wikipedia.org/wiki/La_muerte_de_Iv%C3%A1n_Ilich'],
  },
];

export const booksUi = {
  title: 'Mis libros',
  of: (i: number, n: number) => `${i} de ${n}`,
  prev: 'Anterior',
  next: 'Siguiente',
  flipToBack: 'Ver la contraportada',
  flipToFront: 'Ver la portada',
  coverAlt: (b: Book) => `Portada de ${b.title}, de ${b.author}`,
  announce: (b: Book, i: number, n: number) => `${b.title}, de ${b.author}, ${i} de ${n}`,
};
