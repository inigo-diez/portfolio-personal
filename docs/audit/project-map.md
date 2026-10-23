# Mapa de proyectos (aprobado en E1)

Decisión de Iñigo (2026-10-19): **aparecen todos los proyectos del portfolio antiguo, con su agrupación original, y las 4 agrupaciones son destacadas.** Las cifras sin respaldo se corrigen, buscando a la vez el dato verificado más atractivo de cada proyecto.

Cada agrupación es una **pila** en el canvas que se despliega en sus proyectos. Cada proyecto tiene su propio caso de estudio (`/proyectos/<slug>`).

Columna "Cifra destacada": el número grande de la tarjeta (como en la web antigua) y su etiqueta. Todas están verificadas en el README del repo, salvo las marcadas con `TODO(content)`.

---

## 1 · Metabolómica & Biomarcadores de Salud Mental
*GC-MS · Python · Machine Learning · Estadística multivariante · TFG*

| Proyecto | Slug | Cifra destacada | Gancho | Corrección respecto a la web antigua |
|---|---|---|---|---|
| Base de Datos de Biomarcadores Metabólicos Psiquiátricos | `biomarcadores-salud-mental` | **~39.000** · candidatos de 6 bases de datos abiertas | Un pipeline automático que unifica seis bases científicas en un único recurso consultable, con dashboard interactivo | "biomarcadores indexados" → "candidatos a biomarcador indexados" (así lo dice el repo) |
| Análisis Metabolómico Estadístico sobre Datos GC-MS | `analisis-metabolomico-gcms` | **1.230 → 279** · de picos brutos a metabolitos fiables | De 1.230 señales cromatográficas a 279 metabolitos de calidad, y de ahí a los que realmente distinguen entre condiciones (PCA, contrastes, RF, XGBoost, SHAP) | Antes: "279 metabolitos". "8 notebooks" solo se menciona si se comprueba |
| Caracterización de Metabolitos Clave | `priorizacion-metabolitos` | **4 criterios** · un ranking propio de prioridad | Un sistema de puntuación diseñado desde cero (varianza 40 %, efecto 30 %, SHAP 20 %, significación 10 %), contrastado con la base de 39.000 compuestos | Se quita "esquizofrenia" (no está en el repo). Se presentan como "candidatos priorizados", como dice el README `TODO(content): confirmar si se orientó a alguna patología concreta` |
| Optimización de Extracción de VOCs mediante RSM | `optimizacion-rsm` | **9 respuestas** · optimizadas a la vez con 17 experimentos | Encontrar el mejor punto de un proceso con solo 17 experimentos y nueve objetivos en conflicto (función de deseabilidad de Derringer-Suich) | Antes: "63+ superficies de respuesta" → el repo dice "63 figuras". Se cambia la cifra principal |
| Optimización Experimental SPME-GC-MS con ML | `optimizacion-ml-vs-rsm` | **~70 %** · de la importancia en un solo factor | RSM clásico frente a ~~cinco~~ **cuatro** modelos de ML con solo 17 datos: cuál predice mejor y qué factor manda (corregido el 2026-10-23: el README compara RSM con PLS, Random Forest, XGBoost y Gaussian Process) | Se mantiene ~70 %. `TODO(content): confirmar que x₁ = tiempo de extracción` antes de nombrarlo |

## 2 · Geopolítica, Crudo WTI y Mercados Financieros
*GDELT · Monte Carlo · RSJD · Machine Learning · Modelado de agentes*

| Proyecto | Slug | Cifra destacada | Gancho | Corrección |
|---|---|---|---|---|
| Predicción de Estrés en el Mercado del Petróleo con GDELT | `estres-petroleo-gdelt` | **16 años** · de noticias geopolíticas frente al WTI | ¿Anticipan los titulares geopolíticos un día de pánico en el petróleo? 4.059 días, 67 variables sin fuga de información y una respuesta honesta (AUC 0,615) | Antes: "AUC 0.62" como cifra principal. Pasa al texto con su valor exacto |
| Simulación del Precio WTI bajo Estrés Geopolítico | `simulacion-wti-montecarlo` | **2.000** · trayectorias Monte Carlo por escenario | Regímenes de Markov, saltos calibrados y un mercado simulado con agentes para medir cómo sufren las estrategias de cobertura | "4 tipos de agentes" solo se menciona si se confirma `TODO(content)` |
| Motor de Inferencia Bélica: Contagio Financiero EE. UU.–Irán 2026 | `contagio-eeuu-iran` | **8 fuentes** · y 67 variables, con datos desde 1986 | Un modelo cuantitativo enfrentado a la "sabiduría colectiva" de los mercados de predicción (Polymarket) en un conflicto en tiempo real | "más de 40 años" → "datos desde 1986" (verificado) |

## 3 · Machine Learning Aplicado — Proyectos Kaggle
*Regresión · Clasificación · XGBoost · Random Forest · Feature Engineering*

| Proyecto | Slug | Cifra destacada | Gancho | Corrección |
|---|---|---|---|---|
| Predicción de Morosidad Crediticia — Sistema de Alerta Temprana | `morosidad-crediticia` | **F1 0,90** · en 8.399 clientes | Un sistema de alerta temprana de impago, con análisis de umbrales y del coste de cada tipo de error | Se quita "SMOTE": el notebook no lo usa (comprobado el 2026-10-23). El caso de estudio explica el desbalance de clases que ya señala el README (contarlo es una señal de rigor) |
| Predicción de Precio de Vehículos de Segunda Mano | `precio-vehiculos` | **R² 0,77** · sobre 19.237 vehículos | ~~Cuatro familias de modelos~~ Regresión lineal, árboles, Random Forest, XGBoost y una red neuronal, y una segmentación del mercado en 4 clusters de precio (corregido el 2026-10-23: el README entrena cinco modelos supervisados) | Sin cambios |
| Predicción de Precio de Portátiles Reacondicionados (Egipto) | `precio-portatiles` | **R² 0,82** · MAE 152 € | Valoración automática para e-commerce de segunda mano, mejorando en 23 € el error de la solución de referencia del curso | "web scraping propio" → "dataset público de Kaggle obtenido por scraping". Se aclara que la referencia es la del curso |

## 4 · IA Generativa para Ciencia e Ingeniería
*LLMs multimodales · Document AI · LangChain · Grounded Generation · Evaluación*

| Proyecto | Slug | Cifra destacada | Gancho | Corrección |
|---|---|---|---|---|
| Figuris — Explicación Verificable de Figuras Científicas | `figuris` | **0** · citas inventadas llegaron al lector | *La IA explica la figura; Figuris demuestra de dónde sale cada palabra.* El modelo se inventó 7 citas en 149 explicaciones y el validador, sin IA, las bloqueó todas. 292 figuras de 48 artículos, F1 0,874 detectando figuras, todo por menos de 1 $ | Antes: "292 figuras". Ahora el dato contraintuitivo (0 de 7 llegan al lector) es la cifra principal. Verificado en el README: "el validador detectó las siete y ninguna se mostró como fiable" y "coste total inferior a un dólar". Se mantiene la nota de desarrollo asistido con Claude Code |
| Analizador LLM de Sensores en Electrolizadores | `analizador-sensores-llm` | **12** · tests unitarios sin llamadas a la API | Una mini-app que explica sensores industriales con LangChain, Gemini y Gradio, y que evalúa críticamente dónde falla el LLM | Sin cambios |

---

## Fuera de la web

- **GC-MS Compound Profiler** (sin terminar): **no aparece** (decisión de Iñigo, 2026-10-19).
- `proj-bank-marketing-roc.png`: imagen sin proyecto asociado. No se usa.

## Gráficos (decisión: se rehacen)

Cada proyecto tendrá **un gráfico clave rehecho con la paleta del sitio**: fondo blanco, tinta `#252525`, acento `#4F75AD` y un segundo color de apoyo solo si hace falta. Se generan a partir de los datos y resultados de cada repo, en E6. Candidatos a partir de las figuras existentes:

| Proyecto | Gráfico a rehacer |
|---|---|
| Biomarcadores | Candidatos por base de datos o por condición (barras) |
| Análisis GC-MS | PCA de los 17 experimentos (con el outlier Exp. 9) |
| Priorización | Ranking de los candidatos con el desglose de los 4 criterios |
| RSM | Superficie o contorno de la respuesta global |
| ML vs RSM | Importancia de factores por modelo |
| GDELT | Serie del WTI con los días de estrés marcados |
| Monte Carlo | Fan chart de 3 escenarios (P5–P95) |
| EE. UU.–Irán | Modelo frente a Polymarket |
| Morosidad | Curva precisión/recall según el umbral |
| Vehículos | Importancia de variables o los clusters |
| Portátiles | Real frente a predicho (no hay figura previa) |
| Figuris | Captura real del visor (`docs/img/fig01-visor.png` en el repo) + diagrama de arquitectura rehecho en la paleta (el repo tiene `fig02-arquitectura.svg`) |
| Analizador LLM | Diagrama de la app |
