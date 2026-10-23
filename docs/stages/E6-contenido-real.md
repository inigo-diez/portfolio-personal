# E6 — Contenido real y casos de estudio

**Objetivo:** que funcione como portfolio profesional completo, no como demo.

## Tareas
1. Casos de estudio de los destacados con la estructura del brief §9. Cada cifra con su fuente.
2. Archive con el resto de proyectos.
3. About (sin tópicos), Experience (cronología verificada), Skills (por capacidades, enlazadas a proyectos).
4. Contact y CV (descarga o visor).
5. Imágenes: capturas y gráficos reales optimizados (AVIF/WebP, dimensiones explícitas, alt).
5b. **Rehacer 1 gráfico por proyecto** con la paleta del sitio (lista en `docs/audit/project-map.md`), a partir de los datos y resultados de cada repo. Dos vías, a elegir por gráfico: SVG generado con Python (disponible como `py`, 3.14) o un gráfico SVG nativo del sitio a partir de un CSV pequeño (mejor nitidez y coherencia con los tokens).
6. Metadatos por ruta: título, descripción y Open Graph.
7. Revisión de que no se ha perdido contenido técnico respecto al portfolio antiguo.

## ⏸ Aprobación
Iñigo revisa y aprueba los textos de cada proyecto y sección. Solo quedan `TODO(content)` listados explícitamente.

## Para arrancar
> "Empieza E6"

## Estado (2026-10-23)
En curso. Decisiones de Iñigo al empezar: [PLAN.md](../PLAN.md) (Decisiones tomadas, 2026-10-23).

**Piloto, pendiente de visto bueno:** el caso de estudio de `morosidad-crediticia` (http://localhost:4173/portfolio-personal/proyectos/morosidad-crediticia/ con `npx vite preview --port 4173`; capturas en `_reference/e6/`). Cuando Iñigo apruebe estructura, tono y gráfico, se escriben los otros 12 por tandas (una colección cada vez).

- **Estructura** (brief §9; se omite el bloque que no tiene contenido real): El problema · Los datos · Cómo lo abordé · Resultados (tabla) · bloque con el gráfico · Limitaciones · Stack · enlace a GitHub · Fuentes. Cada bloque guarda su fuente en `source` (no se muestra).
- **Gráficos:** SVG dibujado por el sitio ([pages/LineChart.tsx](../../src/pages/LineChart.tsx)) con datos de [content/charts/](../../src/content/charts/). Cada JSON lo escribe un script de [scripts/charts/](../../scripts/charts/) que vuelve a ejecutar el notebook desde la copia local de Iñigo y **para si no reproduce las cifras del README**. Se ejecuta con `uv run --no-project --with pandas --with scikit-learn scripts/charts/<slug>.py` (el Python 3.14 del equipo no tiene pandas; `uv` lo resuelve sin instalar nada). Azul `accent` para la serie principal y gris `--chart-2` `#B3B8BF` para la comparativa (validado con la skill `dataviz`: ΔE 22–24 también con daltonismo; el gris no llega a 3:1, así que siempre lleva etiqueta directa y tabla de datos). Cursor y lectura con teclado (flechas, Inicio, Fin).
- **Redacción (Iñigo, 2026-10-23):** los leen recruiters, así que cada caso tiene que vender lo mejor posible sin inventar ni inflar: primero lo conseguido, con sus cifras; las limitaciones, las que documenta el propio proyecto. Lo que salga de mi revisión de los notebooks va a `todo` del proyecto (lista de antes de E8) y se le comenta a Iñigo.
- **Comprobado:** typecheck, lint, build y `smoke.mjs` sin errores; en móvil la página no se desborda.
