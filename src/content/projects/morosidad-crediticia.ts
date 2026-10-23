import type { Project } from '../types';

const REPO = 'https://github.com/inigo-diez/prediccion-morosidad-crediticia';

// E6: full case study. Sources: the README (identical to Iñigo's local copy in
// Desktop/2020-2026/Curso/archive (2)) and the notebook analisis_nulos.ipynb of that copy. Figures not in
// the README are marked as derived from it in their section's `source`.
export const morosidadCrediticia: Project = {
  slug: 'morosidad-crediticia',
  ref: '03.1',
  collection: '03',
  title: 'Predicción de Morosidad Crediticia — Sistema de Alerta Temprana',
  shortTitle: 'Alerta temprana de morosidad',
  summary:
    'Un sistema de alerta temprana que anticipa qué clientes van a dejar de pagar: sobre 8.399 clientes de una entidad financiera, el Random Forest detecta el 96,9 % de los morosos, y el análisis del umbral muestra cuántas falsas alarmas cuesta cada punto de detección.',
  status: 'terminado',
  year: null,
  featured: false,
  tags: ['Clasificación', 'Scoring', 'Evaluación de modelos'],
  stack: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'seaborn'],
  headline: { value: 'F1 0,90', label: 'y el 96,9 % de los morosos detectados' },
  facts: [
    '8.399 clientes de una entidad financiera peruana',
    'Regresión logística, árbol de decisión y Random Forest ajustado con GridSearchCV',
    'Random Forest: F1 0,90 y el 96,9 % de los morosos reales detectados',
    'Análisis del umbral de decisión: cuántas falsas alarmas cuesta cada punto de detección',
  ],
  cover: null,
  canvas: { x: 0, y: 930, w: 260 },
  links: { repo: REPO },
  sections: [
    {
      id: 'problema',
      title: 'El problema',
      body: [
        'Una entidad financiera quiere saber qué clientes van a dejar de pagar antes de que ocurra, para ajustar las condiciones del crédito, reforzar el seguimiento o limitar su exposición.',
        'Los dos errores posibles no cuestan lo mismo: no detectar a un moroso sale más caro que una falsa alarma. Por eso la métrica que se prioriza es la proporción de morosos que el modelo detecta (recall).',
      ],
      source: 'README: «Contexto y motivación» y «Random Forest — Optimización con GridSearchCV»',
    },
    {
      id: 'datos',
      title: 'Los datos',
      body: [
        '8.399 clientes de una entidad financiera peruana. Para cada uno, si ha entrado en mora y doce variables socioeconómicas y de comportamiento crediticio: días de atraso, edad, días en activo laboral, experiencia en el sistema financiero, ingreso, línea de crédito, deuda, puntuación crediticia, clasificación de la Superintendencia de Banca y Seguros, zona, tipo de vivienda y nivel educativo.',
        'Tres variables tenían huecos: la experiencia en el sistema financiero (1.830 clientes), la línea de crédito (1.127) y la deuda (461).',
      ],
      source: 'README: «Dataset» (tabla de variables y valores nulos)',
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
        'Variables numéricas estandarizadas, categóricas convertidas en indicadoras y partición 70/30: 5.879 clientes para entrenar y 2.520 para evaluar.',
        'Tres modelos (regresión logística, árbol de decisión y Random Forest) y una búsqueda de hiperparámetros del Random Forest con validación cruzada de 3 particiones, optimizando primero la exactitud y después el recall.',
      ],
      source:
        'README: «Tratamiento de datos», «Ingeniería de variables», «Preprocesamiento» y «Modelado». Notebook (celdas 8–62) para lo que el README resume: los valores extremos se sustituyen por Q1/Q3 (el README dice «eliminación») y el logaritmo se aplica también a la deuda.',
    },
    {
      id: 'resultados',
      title: 'Resultados',
      body: [
        'El Random Forest es el mejor de los tres modelos en todas las métricas: F1 0,90, precisión 0,84 y el 96,9 % de los morosos detectados.',
        'Después ajusté sus hiperparámetros para no dejar escapar morosos: la búsqueda elige árboles de profundidad 5, con un recall medio de 0,967 en validación cruzada. Detectar más morosos tiene un precio en falsas alarmas, y la sección siguiente lo cuantifica.',
      ],
      table: {
        caption: 'Clase «moroso», sobre los 2.520 clientes de test',
        head: ['Modelo', 'Exactitud', 'Precisión', 'Recall', 'F1'],
        rows: [
          ['Regresión logística', '0,710', '0,728', '0,931', '0,817'],
          ['Árbol de decisión', '0,744', '0,791', '0,858', '0,823'],
          ['Random Forest', '0,850', '0,839', '0,969', '0,899'],
        ],
        highlight: 2,
      },
      source:
        'README: «Comparativa de modelos» y «Clasificación final del modelo optimizado». Notebook (celda 99): el Random Forest de la tabla usa los parámetros por defecto de scikit-learn.',
    },
    {
      id: 'umbral',
      title: 'El umbral de decisión',
      body: [
        'El modelo da una probabilidad de impago, y el umbral la convierte en una decisión: por encima, el cliente se marca como posible moroso. Elegirlo no es un detalle técnico, es una decisión de negocio: cuántas falsas alarmas acepta la entidad a cambio de no dejar escapar morosos.',
      ],
      chart: 'morosidad-umbral',
      source:
        'Notebook (celda 84), reproducido con scripts/charts/morosidad-crediticia.py, que comprueba antes las cifras del README (exactitud 0,710, recall 0,931, F1 0,817, AUC 0,71).',
    },
    {
      id: 'limitaciones',
      title: 'Limitaciones',
      body: [],
      list: [
        'Clases desbalanceadas: alrededor del 70 % de los registros son morosos, lo que puede inflar el recall. Hay que tenerlo en cuenta antes de llevar el modelo a producción.',
        'Datos de una sola entidad financiera: para generalizar, el modelo tendría que validarse con clientes de otras entidades.',
      ],
      source: 'README: «Contexto y motivación» y «Conclusiones» (aviso del desbalance de clases).',
    },
  ],
  sources: [
    { label: 'README del repositorio prediccion-morosidad-crediticia', url: REPO },
    { label: 'Notebook analisis_nulos.ipynb del proyecto' },
  ],
  todo: [
    'Antes de E8: con el 69 % de morosos en test (1.747 de 2.520), marcar a todos como morosos ya da F1 0,82 en esa clase (cálculo propio: precisión 0,693, recall 1). El Random Forest (0,90) lo supera; la regresión logística (0,817), no. Decidir si se cuenta en la web.',
    'Antes de E8: el modelo ajustado por recall (profundidad 5) solo reconoce al 18 % de los clientes que pagan y su F1 en test es 0,83; el README habla de él como modelo final.',
    'Antes de E8 (decisión de Iñigo, 2026-10-23): revisar fugas de información. El notebook ajusta la imputación, los valores extremos, la agrupación de zonas y el escalado con todos los datos antes de la partición, y falta saber si los días de atraso se conocen antes del impago.',
  ],
};
