# E1 · Propuesta de proyectos destacados

> ⚠️ **Sustituida.** Iñigo decidió mostrar todos los proyectos con la agrupación original y destacar las 4 agrupaciones. La versión vigente es [project-map.md](project-map.md). Este documento se conserva como histórico.

## Criterios
1. **Completitud y sustancia técnica** verificadas en el repo.
2. **Variedad de tipos de problema**, no de sectores: ingeniería de software con IA, series temporales y simulación, pipeline de datos de investigación, estadística experimental y clasificación de negocio.
3. **Material visual** disponible o fácil de conseguir.
4. **No encasillar**: ninguna familia debe dominar la selección.

## Idea clave: las series son "pilas"
Ya tienes proyectos organizados en partes (metabolómica 1-2-3, crudo 1-2-3). En el canvas, cada serie sería **una pila de tarjetas que se despliega** (como en KEZ Works) y llevaría a **un único caso de estudio con capítulos**. Ventajas:
- El canvas queda limpio: 5 objetos en lugar de 14 tarjetas.
- Cuenta una progresión ("primero construí la base, luego el análisis, luego la priorización"), y eso demuestra criterio, no solo técnicas.

## Propuesta (5 destacados)

| # | Destacado | Repos | Qué demuestra | Por qué |
|---|---|---|---|---|
| 1 | **Figuris** | E1 | IA generativa con verificación, diseño de evaluación propio, ingeniería de software (FastAPI, tests, OCR) | Tu proyecto más diferencial y más actual. Con un enfoque honesto: mide cuándo se equivoca el modelo y lo detecta. Será la tarjeta más grande del canvas |
| 2 | **Geopolítica y crudo** (pila de 3) | C1 → C2 → C3 | Series temporales, ingeniería de variables sin leakage, simulación Monte Carlo, modelos de agentes, fuentes de datos heterogéneas | El más cuantitativo. Que el resultado sea modesto (AUC 0,615) y esté contado con honestidad es un punto a favor |
| 3 | **Metabolómica** (pila de 3) | A1 → A2 → A3 | Pipeline completo de datos de investigación: integración de 6 bases, estadística multivariante, ML + SHAP, sistema de priorización propio | El trabajo más largo y profundo (relacionado con el TFG). Se presenta como "de datos brutos a decisiones", no como química |
| 4 | **Diseño de experimentos y optimización** (pila de 2) | B1 → B2 | DoE, superficies de respuesta, optimización multirrespuesta, comparación de modelos estadísticos y ML con pocos datos (N=17) | Estadística experimental transferible: procesos industriales, A/B testing, I+D |
| 5 | **Riesgo de morosidad** | D1 | Clasificación y scoring, umbrales, coste de errores | El caso de negocio clásico que reconoce cualquier reclutador. Se presentará con la advertencia sobre el desbalance de clases que tú mismo documentaste |

**Archive:** D2 coches, D3 portátiles (ejercicio de curso), E2 analizador LLM (mini-app académica) y A4 GC-MS Profiler (**en curso**).

## Comprobación de equilibrio
- Química como dominio de los datos: 2 de 5 (3 y 4). Mitigación: titular por el problema ("Optimizar un proceso con 17 experimentos"), no por la técnica analítica.
- **Alternativa B**, si prefieres reducir aún más el peso de la química: fusionar 3 y 4 en una sola pila "Metabolómica y optimización" (5 tarjetas) y subir **Predicción de precio de vehículos** (D2: regresión + red neuronal + segmentación) a destacados.

## Orden en el canvas (borrador para E2)
Figuris en el centro, más grande. A su alrededor, las pilas de crudo y metabolómica. Más lejos, DoE y morosidad. El Archive, como una pila pequeña en un borde.
