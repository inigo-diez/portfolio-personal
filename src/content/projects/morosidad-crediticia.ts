import type { Project } from '../types';
import data from '../charts/morosidad-crediticia.json';

const REPO = 'https://github.com/inigo-diez/prediccion-morosidad-crediticia';

// E6: full case study. Sources: the README (identical to Iñigo's local copy in
// Desktop/2020-2026/Curso/archive (2)) and the notebook analisis_nulos.ipynb of that copy.
// E8 (2026-10-23, Iñigo asked for the audit and for deciding which figures to show): 2,325 of the 8,399 rows
// are exact copies, so the notebook's test set shares rows with its training set and the published Random
// Forest figures (F1 0.90, recall 0.969) do not hold. Every evaluation figure below comes from
// scripts/charts/morosidad-crediticia.py (no copies, recipe fitted on the training part only), through
// the JSON it writes; none is typed by hand.

const num = (v: number, d = 2) => v.toFixed(d).replace('.', ',');
const pct = (v: number) => `${Math.round(v * 100)} %`;
const int = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const row = (name: string) => data.models.find((m) => m.model === name)!;
const rf = row('Random Forest');
const lr = row('Regresión logística');
const base = row('Todos morosos (referencia)');
const share = (part: number, whole: number) => pct(part / whole);
/** The point of the threshold curve at threshold `t`. */
const at = (t: number) => data.points.find((p) => p.t === t)!;

export const morosidadCrediticia: Project = {
  slug: 'morosidad-crediticia',
  ref: '03.1',
  collection: '03',
  title: 'Predicción de Morosidad Crediticia — Sistema de Alerta Temprana',
  shortTitle: 'Alerta temprana de morosidad',
  summary: `Un modelo que estima qué clientes de una entidad financiera van a dejar de pagar. Al revisar la evaluación encontré que el ${share(data.records.copies, data.records.total)} de los ${int(data.records.total)} registros eran copias de otros y la rehíce sin ellos: el Random Forest es el mejor de tres modelos (AUC ${num(rf.auc)}) y el análisis del umbral muestra cuántas falsas alarmas cuesta cada punto de detección.`,
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Clasificación', 'Scoring', 'Evaluación de modelos'],
  stack: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'seaborn'],
  headline: { value: `AUC ${num(rf.auc)}`, label: 'Random Forest, evaluado sin registros repetidos' },
  // Every figure from the JSON of scripts/charts/morosidad-crediticia.py (the AUC and the share of copies stay
  // in the headline and the summary).
  facts: [
    {
      value: `${int(data.notebookTest.withTwinInTrain)} de ${int(data.notebookTest.n)}`,
      text: `Clientes de test que tenían una copia exacta en entrenamiento. Rehíce la evaluación sin registros repetidos, para medir el modelo con clientes que no había visto.`,
    },
    {
      value: pct(rf.recall),
      text: `De los morosos detectados por el Random Forest, que además reconoce al ${pct(rf.payers_recognised)} de los clientes que pagan. Es el mejor de los tres modelos que comparé con una referencia que marca a todos como morosos.`,
    },
    {
      value: `Umbral ${num(0.5, 1)} → ${num(0.7, 1)}`,
      text: `Subirlo reduce las falsas alarmas del ${pct(at(0.5).fpr)} al ${pct(at(0.7).fpr)} de los clientes que pagan y sigue detectando el ${pct(at(0.7).tpr)} de los morosos. Así la entidad elige cuántas falsas alarmas asume.`,
    },
  ],
  // scripts/covers.py: the README figure img_06 (default rate by region), whole
  cover: {
    src: 'img/covers/morosidad-crediticia.webp',
    alt: 'Tasa de morosidad por zona geográfica',
  },
  canvas: { x: 200, y: 930, w: 260 },
  links: { repo: REPO },
  // until Iñigo updates the README (PLAN.md, E8): it still shows the evaluation with repeated records
  readmeNote:
    'El README del repositorio todavía refleja la evaluación original, con registros repetidos: algunas de sus cifras difieren de la evaluación revisada de arriba.',
  sections: [
    {
      id: 'problema',
      title: 'El problema',
      body: [
        'Una entidad financiera quiere saber qué clientes van a dejar de pagar antes de que ocurra, para ajustar las condiciones del crédito, reforzar el seguimiento o limitar su exposición.',
        'Los dos errores posibles no cuestan lo mismo: no detectar a un moroso sale más caro que una falsa alarma. Por eso interesa detectar a casi todos los morosos, pero sabiendo cuántos clientes que pagan se marcan por el camino.',
      ],
      source: 'README: «Contexto y motivación» y «Random Forest — Optimización con GridSearchCV»',
    },
    {
      id: 'datos',
      title: 'Los datos',
      body: [
        `${int(data.records.total)} registros de clientes de una entidad financiera peruana. Para cada uno, si ha entrado en mora y doce variables socioeconómicas y de comportamiento crediticio: días de atraso, edad, días en activo laboral, experiencia en el sistema financiero, ingreso, línea de crédito, deuda, puntuación crediticia, clasificación de la Superintendencia de Banca y Seguros, zona, tipo de vivienda y nivel educativo. Tres variables tenían huecos: la experiencia en el sistema financiero (1.830 clientes), la línea de crédito (1.127) y la deuda (461).`,
        `Al revisar los datos encontré que ${int(data.records.copies)} registros (el ${share(data.records.copies, data.records.total)}) eran copias exactas de otro, con la misma respuesta. Repartidos al azar, el modelo se evalúa con clientes que ya ha visto: en la partición original, ${int(data.notebookTest.withTwinInTrain)} de los ${int(data.notebookTest.n)} clientes de test (el ${share(data.notebookTest.withTwinInTrain, data.notebookTest.n)}) tenían su copia en entrenamiento. La evaluación final usa los ${int(data.records.unique)} registros únicos.`,
      ],
      source:
        'README: «Dataset» (tabla de variables y valores nulos). Registros repetidos y partición original: scripts/charts/morosidad-crediticia.py sobre data.csv de la copia local.',
    },
    {
      id: 'enfoque',
      title: 'Cómo lo abordé',
      body: [],
      list: [
        'Huecos rellenados con la media de cada variable.',
        'Valores fuera de 1,5 veces el rango intercuartílico sustituidos por el primer o el tercer cuartil, sin eliminar clientes. Raíz cuadrada para el ingreso y logaritmo para la línea de crédito y la deuda, muy asimétricas.',
        'Fuera el nivel de ahorro: tenía el mismo valor en todos los registros.',
        'Tres variables nuevas: endeudamiento (deuda entre ingreso), si la deuda supera la línea disponible y qué parte de esa línea está en uso.',
        'Las zonas con menos del 5 % de los clientes, agrupadas en dos categorías según su tasa de mora: por encima o por debajo de la media.',
        `Partición 70/30 de los registros únicos: ${int(data.train.n)} para entrenar y ${int(data.test.n)} para evaluar. Las medias, los cuartiles, la agrupación de zonas y la escala se calculan solo con la parte de entrenamiento, para que el test no influya en nada de lo que aprende el modelo.`,
        'Tres modelos (regresión logística, árbol de decisión y Random Forest) y una referencia que marca a todos como morosos, para medir cuánto aporta cada uno.',
      ],
      source:
        'README: «Tratamiento de datos», «Ingeniería de variables», «Preprocesamiento» y «Modelado». Notebook (celdas 8–99) para lo que el README resume: los valores extremos se sustituyen por Q1/Q3 (el README dice «eliminación») y el logaritmo se aplica también a la deuda. Partición sobre registros únicos y ajuste solo con entrenamiento: evaluación revisada del 2026-10-23 (scripts/charts/morosidad-crediticia.py).',
    },
    {
      id: 'resultados',
      title: 'Resultados',
      body: [
        `El Random Forest es el mejor de los tres modelos: ordena a los clientes por riesgo mejor que los demás (AUC ${num(rf.auc)}, frente a ${num(lr.auc)} de la regresión logística) y detecta el ${pct(rf.recall)} de los morosos.`,
        `Con un ${pct(base.precision)} de morosos, marcar a todos como morosos ya da un F1 de ${num(base.f1)} en esa clase, así que el F1 y la detección de morosos, por sí solos, dicen poco. Lo que distingue a los modelos es cuántos clientes que pagan reconocen y el AUC, que mide cómo ordenan el riesgo.`,
        `La evaluación original del notebook, con registros repetidos entre entrenamiento y test, daba al Random Forest un F1 de 0,90; sin ellos es ${num(rf.f1)}. El orden de los modelos se mantiene.`,
      ],
      table: {
        caption: `Clase «moroso», sobre los ${int(data.test.n)} clientes de test sin registros repetidos`,
        head: ['Modelo', 'Precisión', 'Recall', 'F1', 'Pagadores reconocidos', 'AUC'],
        rows: data.models.map((m) => [
          m.model,
          num(m.precision, 3),
          num(m.recall, 3),
          num(m.f1, 3),
          pct(m.payers_recognised),
          num(m.auc, 3),
        ]),
        highlight: data.models.findIndex((m) => m.model === 'Random Forest'),
      },
      source:
        'Evaluación revisada del 2026-10-23: scripts/charts/morosidad-crediticia.py (modelos de la celda 99 del notebook con semilla fija; con diez semillas, el F1 del Random Forest varía ±0,003). F1 0,90 original: README, «Comparativa de modelos».',
    },
    {
      id: 'umbral',
      title: 'El umbral de decisión',
      body: [
        'El modelo da una probabilidad de impago, y el umbral la convierte en una decisión: por encima, el cliente se marca como posible moroso. Elegirlo no es un detalle técnico, es una decisión de negocio: cuántas falsas alarmas acepta la entidad a cambio de no dejar escapar morosos.',
      ],
      chart: 'morosidad-umbral',
      source:
        'Análisis de la celda 84 del notebook, rehecho para el Random Forest sobre los registros únicos con scripts/charts/morosidad-crediticia.py, que comprueba antes que reproduce las cifras del README (exactitud 0,710, recall 0,931, F1 0,817, AUC 0,71).',
    },
    {
      id: 'limitaciones',
      title: 'Limitaciones',
      body: [],
      list: [
        `Clases desbalanceadas: el ${pct(base.precision)} de los registros son morosos, así que detectar a casi todos es fácil; lo difícil es no marcar también a los que pagan. Con el umbral estándar, el Random Forest reconoce al ${pct(rf.payers_recognised)} de ellos.`,
        `Los datos no dicen en qué momento se miden los días de atraso. Sin esa variable, el Random Forest da el mismo resultado (AUC ${num(data.aucWithoutAtraso)}).`,
        'Datos de una sola entidad financiera: para generalizar, el modelo tendría que validarse con clientes de otras entidades.',
      ],
      source:
        'README: «Conclusiones» (aviso del desbalance de clases). Pagadores reconocidos y resultado sin días de atraso: scripts/charts/morosidad-crediticia.py.',
    },
  ],
  sources: [
    { label: 'README del repositorio prediccion-morosidad-crediticia', url: REPO },
    { label: 'Notebook analisis_nulos.ipynb del proyecto' },
    { label: 'Evaluación revisada sin registros repetidos: scripts/charts/morosidad-crediticia.py del portfolio' },
  ],
  todo: [
    'Iñigo: actualizar el README del repositorio con la evaluación sin registros repetidos. Hasta entonces, el repo da F1 0,90 y la web explica por qué no lo usa.',
  ],
};
