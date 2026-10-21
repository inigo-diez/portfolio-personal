# E1 · Inventario de contenido

Fecha: 2026-10-19. Fuentes revisadas:
- CV: `materials/cv/Inigo_Diez_Osua_cv.pdf` (español, 1 página).
- Portfolio antiguo: clon de solo lectura en `_reference/old-portfolio/` (un solo `index.html` con Materialize, 1.033 líneas).
- 15 repos públicos de github.com/inigo-diez (14 proyectos + el propio portfolio). README descargados en `_reference/readmes/`.

Leyenda de verificación: ✅ la cifra aparece en el README del repo · ⚠️ dato correcto pero matizable o no comprobado del todo · ❌ la web antigua lo dice, pero el repo no lo respalda o lo contradice.

---

## 1. Perfil (CV + web antigua)

| Dato | Valor | Fuente |
|---|---|---|
| Nombre | Iñigo Díez Osúa | CV |
| Titular actual | Junior Data Scientist · Python · Machine Learning · Estadística aplicada | CV |
| Formación | Máster en Ciencia de Datos e Inteligencia Artificial, Afi Global Education (sept. 2026 – jul. 2027) | CV, web |
| Formación | Grado en Química, EHU (sin fechas) | CV, web |
| TFG | Análisis estadístico y modelización multivariante de datos metabolómicos (PCA, PLS-DA, R²/Q², permutaciones, DoE/RSM) | CV, web |
| Idiomas | Español nativo · Inglés B2 | CV |
| Contacto | idiezosua@gmail.com · GitHub · LinkedIn (`/in/iñigo-díez-osúa-233642401`) | web |
| Experiencia profesional | **Ninguna en CV ni en la web.** La sección "Experiencia" de la web antigua muestra el grado y el TFG. | CV, web |

**Formación complementaria** (con PDF de certificado en el repo antiguo, salvo la de Andrew Ng):
Python Data Fundamentals (DataCamp, ene 2026, 28 h) · Statistics Fundamentals in Python (DataCamp, ene 2026, 20 h) · Applied Statistics in Python (DataCamp, ene 2026, 16 h) · Machine Learning Specialization (DeepLearning.AI/Stanford, Coursera; **sin PDF**) · SQL Fundamentals (DataCamp, mar 2026, 26 h) · De 0 a Data Scientist (Jyts, abr 2026) · AI Engineering with LangChain (DataCamp, oct 2026, 15 h).

**Skills declaradas** (CV = web): Python, SQL · NumPy, Pandas, scikit-learn, Matplotlib, Seaborn, SciPy, SHAP · TensorFlow, Keras, XGBoost · Git, Jupyter. Métodos: modelos predictivos, clasificación y scoring, clustering, interpretabilidad (XAI), contraste de hipótesis, diseño de experimentos.
Los proyectos demuestran además skills que **no están declaradas**: LangChain, LLMs multimodales, FastAPI, Pydantic, Pytest, OCR/ONNX (Figuris), Gradio, Monte Carlo, Markov switching, modelado basado en agentes, web APIs (PubChem, FRED, GDELT), Gaussian Processes, PLS.

---

## 2. Proyectos

Los 14 repos forman **5 familias**. Varias ya son series numeradas (Parte 1/2/3), lo que encaja con la idea de "pila que se despliega" del canvas.

### A · Metabolómica: de los datos brutos a candidatos priorizados (relacionada con el TFG)

| ID | Repo | Qué es | Estado | Verificación |
|---|---|---|---|---|
| A1 | [Mental-Health-Biomarkers-Database-1-Parte-](https://github.com/inigo-diez/Mental-Health-Biomarkers-Database-1-Parte-) | Pipeline que recopila ~39.000 candidatos a biomarcador de 6 bases de datos abiertas, deduplica por InChIKey→PubChem CID y genera un dashboard HTML interactivo | Terminado | ✅ 39.000, 6 bases, InChIKey, dashboard. README en inglés; la descripción dice "BSc Final Project" |
| A2 | [Analisis-Metabolomico-Estadistico-con-Python-2-Parte-](https://github.com/inigo-diez/Analisis-Metabolomico-Estadistico-con-Python-2-Parte-) | GC-MS de 17 experimentos: 1.230 picos → 279 metabolitos (Match Factor ≥ 700); EDA, PCA, K-Means, Mann-Whitney, RF, XGBoost, SHAP | Terminado | ✅ 1.230, 279, 17, SHAP · ⚠️ "8 notebooks" no comprobado |
| A3 | [Analisis-de-Metabolitos-…-3-Parte-](https://github.com/inigo-diez/Analisis-de-Metabolitos-de-Salud-Mental-de-Mayor-Importancia-y-Caracterizacion-de-ellos-3-Parte-) | Ranking propio multicriterio (40 % varianza, 30 % magnitud, 20 % SHAP, 10 % significación) cruzado con la base de A1 | Terminado | ✅ pesos y cruce con 39.000 · ❌ la web dice "biomarcadores de **esquizofrenia**": el README no lo menciona y aclara que son "candidatos priorizados, no biomarcadores confirmados" |
| A4 | [GCMS-Compound-Profiler--sin-terminar-](https://github.com/inigo-diez/GCMS-Compound-Profiler--sin-terminar-) | Pipeline desde archivos `.CDF` brutos: detección de picos, identificación con librerías NIST, PCA y heatmaps | **Sin terminar** | No aparece en la web antigua |

### B · Diseño de experimentos y optimización

| ID | Repo | Qué es | Estado | Verificación |
|---|---|---|---|---|
| B1 | [RSM-estadistica-optimizacion-extraccion-VOCs](https://github.com/inigo-diez/RSM-estadistica-optimizacion-extraccion-VOCs) | RSM con diseño compuesto central: 3 factores, 17 experimentos, 9 respuestas, ajuste cuadrático, análisis del Hessiano, deseabilidad de Derringer-Suich | Terminado | ✅ 3/17/9, Derringer · ⚠️ la web dice "63+ superficies de respuesta"; el README dice "63 figuras PNG" (no todas son superficies) |
| B2 | [Complete-optimization-of-an-anlytical-chemistry-experimental-design](https://github.com/inigo-diez/Complete-optimization-of-an-anlytical-chemistry-experimental-design) | Con N=17, compara RSM, PLS, Random Forest, XGBoost y Gaussian Process, validados con LOO | Terminado | ✅ ~70 % de importancia en x₁, RF "más equilibrado y ganador del ranking global" · ⚠️ confirmar que x₁ = tiempo de extracción. Los R² de validación cruzada son modestos (p. ej. 0,136 en una respuesta) y conviene contarlo así. README en inglés |

### C · Geopolítica y crudo WTI (serie de 3)

| ID | Repo | Qué es | Estado | Verificación |
|---|---|---|---|---|
| C1 | [oil-market-stress-gdelt](https://github.com/inigo-diez/oil-market-stress-gdelt) | ¿Anticipan las noticias geopolíticas (GDELT) los días de estrés del WTI con un día de antelación? 2010–2026, 4.059 días, 67 variables con control anti-leakage, SHAP | Terminado | ✅ F1 0,571, AUC 0,615, 4.059, 67. La web redondea a "AUC 0.62" |
| C2 | [wti-geopolitical-simulation-Parte-2](https://github.com/inigo-diez/wti-geopolitical-simulation-Parte-2) | Regímenes de Markov, Monte Carlo RSJD (2.000 trayectorias, 252 días, 3 escenarios), ABM con impacto de precio de Kyle (1985) y evaluación de estrategias | Terminado | ✅ 2.800 obs. (2015–2026), 2.000 trayectorias, Kyle · ⚠️ "4 tipos de agentes" no comprobado en el README |
| C3 | [Geopolitica-y-Crudo-…-Parte-3](https://github.com/inigo-diez/Geopolitica-y-Crudo-Motor-de-Inferencia-Belica-con-RSJD-y-Senales-de-Mercado-EEUU-Iran-2026-Parte-3) | Motor de inferencia sobre el conflicto EE. UU.–Irán 2026: 8 fuentes, WTI desde 1986, 67 variables, RSJD comparado con mercados de predicción (Polymarket) | Terminado | ✅ 8 fuentes, desde 1986, 67, Polymarket |

### D · Machine learning aplicado a datos tabulares

| ID | Repo | Qué es | Estado | Verificación |
|---|---|---|---|---|
| D1 | [prediccion-morosidad-crediticia](https://github.com/inigo-diez/prediccion-morosidad-crediticia) | Clasificación de morosidad sobre 8.399 clientes de una entidad peruana: RL, árbol de decisión, RF y GridSearchCV | Terminado | ✅ 8.399, F1 0,90, recall 96,9 % · ❌ la web dice "SMOTE"; el README no lo menciona · ⚠️ el propio README avisa de que ~70 % de los registros son morosos y eso "puede inflar artificialmente el recall": hay que presentarlo con esa advertencia |
| D2 | [car-price-prediction-ml](https://github.com/inigo-diez/car-price-prediction-ml) | Regresión de precio con 19.237 vehículos y 18 variables: RL, árbol, RF, XGBoost, red neuronal (Keras) y K-Means | Terminado | ✅ 19.237, R² 0,7712, Keras, K-Means. Dataset de Kaggle |
| D3 | [laptop-price-prediction-egypt](https://github.com/inigo-diez/laptop-price-prediction-egypt) | Regresión de precio de portátiles (1.033 filas), feature engineering y XGBoost | Terminado | ✅ 1.033, MAE 152,32 €, R² 0,823 · ❌ la web dice "web scraping **propio**": el dataset es público en Kaggle y lo extrajo su autor · ⚠️ el "baseline" frente al que mejora 23 € es el notebook del instructor (MAE 175,31), así que es un ejercicio de curso |

### E · IA generativa y software

| ID | Repo | Qué es | Estado | Verificación |
|---|---|---|---|---|
| E1 | [Figuris](https://github.com/inigo-diez/Figuris) | Sistema local que localiza figuras en PDFs científicos, las asocia con su pie y sus citas y lee el texto (OCR). Un LLM multimodal genera explicaciones en las que cada afirmación cita su fuente, y un validador determinista comprueba las citas. Corpus propio SFI-48 | **Activo** (último push 2026-10-08) | ✅ 48 artículos, 292 figuras, F1 0,874, 7 citas inventadas detectadas en 149 explicaciones y ninguna mostrada como fiable, coste total < 1 $ (corregido: en la primera revisión lo marqué por error como no respaldado) · La web declara que se desarrolló con asistencia de Claude Code: mantener esa transparencia |
| E2 | [llm-electrolyzer-sensor-analyzer](https://github.com/inigo-diez/llm-electrolyzer-sensor-analyzer) | Mini-app académica con LangChain, Gemini 3.5 Flash-Lite y Gradio que explica sensores de electrolizadores, con 12 tests y evaluación crítica de los límites del LLM | Terminado (pequeño) | ✅ Gemini, 12 tests |

---

## 3. Material visual disponible (en el repo antiguo)

| Proyecto | Imágenes |
|---|---|
| A (metabolómica) | `metabolomica-cover.png`, `proj-metab-pca.png`, `-clustermap`, `-bubble`, `-shap` |
| B (DoE) | `05_03_rsm_surface_contour.png`, `proj-rsm-heatmap.png`, `proj-rsm-comparacion.png` |
| C (crudo) | `geopolitica-wti-cover.png`, `proj-gdelt-stress.png`, `-timeseries`, `proj-wti-fan.png`, `proj-wti-regimes.png` |
| D1 morosidad | `proj-morosidad-roc.png`, `-prob` |
| D2 coches | `proj-cars-scatter.png`, `-kmeans`, `-importance` |
| E1 Figuris | `proj-figuris-logo.svg` (sin capturas de la herramienta) |
| E2 LLM | `proj-llm-electrolyzer.svg` |
| D3 portátiles | **ninguna** |
| Huérfanas | `proj-bank-marketing-roc.png` (no hay repo de "bank marketing"), `project-ml-3/5/7.jpg` (restos de la plantilla) |

**Valoración:** son gráficos reales y sustanciales, pero con el estilo por defecto de matplotlib (fondos grises, naranja, rojo y azul saturados). En un canvas blanco y contenido chocarán con la paleta. Hay tres opciones, a decidir en E2:
1. Mostrarlos tal cual dentro de un marco neutro.
2. Mostrarlos desaturados en la tarjeta y a color en el caso de estudio.
3. **Recomendada:** volver a generar 1 gráfico clave por proyecto destacado con la paleta del sitio, a partir de los datos del propio repo (en E6).

Figuris no tiene capturas en la web antigua, pero **su repo sí**: `docs/img/fig01-visor.png` (el visor) y `docs/img/fig02-arquitectura.svg` (corregido: en la primera revisión dije que no había ninguna).

---

## 4. Enlaces

| Enlace | Estado |
|---|---|
| 13 enlaces a repos de la web antigua | ✅ Todos existen |
| Enlace dentro del README de A3 a `Analisis-Metabol-mico-Estad-stico-con-Python` | ⚠️ Nombre antiguo; GitHub redirige (301), pero conviene actualizarlo en ese repo |
| LinkedIn | ⚠️ No verificable automáticamente (LinkedIn bloquea bots); que Iñigo confirme la URL |
| Afi y EHU (enlaces de formación) | Sin comprobar; no críticos |
| Certificados (6 PDF) | ✅ Existen en el repo antiguo |
| Formulario de contacto | Formspree (`/f/xpqokykq`) |

---

## 5. Problemas del portfolio antiguo (no se tocan, solo para tu información)

- **`assets/resume/Varad_Bhogayata_Resume.pdf` es el CV de otra persona**, publicado en tu repo (resto de la plantilla). Te recomiendo borrarlo tú del repo antiguo.
- Restos de la plantilla en comentarios ("A Software Developer with a passion for Backend Development…") y CVs duplicados (`cv.pdf`, `Inigo cv.pdf`, `cv.html`, `cv_compact_v2.html`).
- La identidad gira en torno a la química: título "Química & Ciencia de Datos" y texto rotativo que empieza por "Química". Es justo lo que el brief quiere evitar.
- Cifras sin respaldo en los repos (SMOTE, esquizofrenia, scraping propio, < 1 $): marcadas arriba con ❌. **No se trasladarán a la web nueva sin confirmación.**
