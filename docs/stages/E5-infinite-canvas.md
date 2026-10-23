# E5 — Infinite Canvas + transición definitiva

**Objetivo:** la experiencia de exploración de proyectos, conectada al dispositivo en ambos sentidos.

## Tareas
1. Transición definitiva (sobre la técnica validada en E3) con el dispositivo real de E4.
2. Canvas: capa con `translate + scale` fuera del ciclo de render, pan con ratón, trackpad y táctil, zoom anclado al cursor o al pinch, y límites.
3. Composición inicial determinista con los destacados visibles al entrar.
4. Tarjetas editoriales: portada, título, resumen, stack, estado y acción. Despliegue o avance al seleccionarlas.
5. HUD: Zoom ±, Reset, List View, Home, coordenadas y % de zoom.
6. List View accesible, equivalente al canvas.
7. Teclado: flechas, +/−, Tab por las tarjetas en orden lógico.
8. Apertura del caso de estudio y vuelta al canvas en el mismo punto.
9. Móvil: lista o galería deslizable en lugar del canvas.

## ⏸ Aprobación
Se entra, se explora, se abre un proyecto y se vuelve sin perderse ni romper la navegación.

## Para arrancar
> "Empieza E5"

## Estado (2026-10-23)
**Aprobado el 2026-10-23.** Decisiones de Iñigo y puntos que se revisaron: [PLAN.md](../PLAN.md) (Decisiones abiertas → E5).

**Cambio de rumbo a mitad de etapa (2026-10-23).** La primera versión (pilas recogidas que se desplegaban de una en una) no era lo que Iñigo quería. Pidió que los proyectos volvieran a verse como en el lienzo de antes: un espacio que se recorre con todos los proyectos a la vista, cada uno con una tarjeta con imagen, y que al pinchar uno se despliegue en tarjetas con lo más destacado y una con el README completo y el enlace a GitHub. Le enseñé capturas antes de cerrar y dio el visto bueno («así va bien»). Imagen: hueco hasta el final. README: las copias del 19 de octubre.

| Tarea | Qué hay |
|---|---|
| 1. Transición definitiva | La de E3 y E4, con un motor común ([transition/shared.ts](../../src/transition/shared.ts)) que también usan las secciones y la portada de cada proyecto. Al volver a la home, el lienzo cierra el proyecto abierto y regresa a la composición inicial (420 ms); después, la pantalla se encoge (brief §7). |
| 2. Lienzo | Una capa con `translate + scale` fuera del ciclo de React. Se mueve arrastrando el fondo, con la rueda o el trackpad y con un dedo; zoom con Ctrl/⌘ + rueda, pellizco del trackpad o dos dedos, anclado al cursor o al pellizco. La cámara no sale de lo que está a la vista más un margen. Un clic en el fondo (sin arrastrar) cierra el proyecto abierto. |
| 3. Composición inicial | El universo: las 4 colecciones como regiones con su rótulo (número, título, etiquetas y número de proyectos), dispuestas como la vista previa de «Proyectos» (01 02 / 03 04). Dentro, las portadas de sus proyectos con ligeros desplazamientos. Las posiciones están en los datos. Al entrar se ve todo el universo si cabe a un tamaño legible (zoom ≥ 62 %); si no, su centro a ese tamaño. |
| 4. Tarjetas | **Portada** (260 × 300): hueco para la imagen con el número de referencia (`TODO(content)`, imágenes al final), referencia, estado, título y cifra destacada; toda la portada abre y cierra el proyecto. **Al abrirlo** salen de debajo de la portada, con un muelle leve y una tras otra: «De qué va» (resumen y stack), una tarjeta «Destacado» por cada dato verificado (en dos columnas) y la del **README** completo, que se lee dentro con su propio desplazamiento, con «Ver en GitHub ↗» y «Página del proyecto →». El resto del lienzo se atenúa y la cámara encuadra el proyecto. Solo uno abierto a la vez. |
| 5. HUD | Zoom − / % / +, Reset, Lista e Inicio, y las coordenadas. |
| 6. Vista Lista | Los 13 proyectos por colección, con su cifra; es el mismo componente que la lista de móvil. Desde ella, un proyecto se abre con un cambio de página normal. |
| 7. Teclado | Las flechas desplazan el lienzo, + y − hacen zoom, 0 vuelve a la composición inicial y Esc cierra el proyecto. Con Tab se recorren las portadas en orden y, dentro del proyecto abierto, sus tarjetas (las de los cerrados son `inert`). El dispositivo acoplado solo recibe el teclado cuando tiene el foco. Al llegar al lienzo, el foco queda en él, con un marco azul por dentro si se llega con el teclado. |
| 8. Caso de estudio | «Página del proyecto →» hace crecer la portada hasta la página (o la tarjeta del README, si la portada no se ve). Al volver, la página se encoge en ella, con la misma cámara y el mismo proyecto abierto, y el foco vuelve a la portada. |
| 9. Móvil | Lista por colecciones con el dispositivo acoplado arriba, como en las demás páginas; la pantalla crece hasta ella. Al volver de un proyecto, la lista sigue donde estaba. |
| Extra (PLAN, de E4) | «Mi música» desde el dispositivo acoplado (lienzo y páginas): vuelve a la home con la transición inversa y allí se abre y se conectan los auriculares (decidido el 2026-10-20). Desactivada mientras no haya canciones. |

**Contenido:**
- Los 13 proyectos tienen ficha (título, cifra, gancho, datos y stack verificados en su README) y página prerenderizada (21 rutas en total). El caso de estudio completo, las imágenes y los años siguen en E6 (`TODO(content)` en cada ficha).
- **README:** `node scripts/readmes.mjs` convierte las copias de `_reference/readmes/` (19 de octubre) en `src/content/readmes/<slug>.html`, que se cargan solo al abrir cada proyecto. Las imágenes salen como «[Figura: …]» hasta tener las definitivas, los enlaces relativos apuntan al archivo en GitHub y las ecuaciones quedan como texto. Dos README están en inglés (`biomarcadores-salud-mental` y `optimizacion-ml-vs-rsm`): se muestran con la nota «Original en inglés».

**Comprobaciones** (build de producción + `npx vite preview --port 4173`):
- `node scripts/dev/canvas-check.mjs [url] [carpeta]` (nuevo, 34 comprobaciones): entrar desde la home, el universo a la vista, flechas, zoom, abrir un proyecto (tarjetas, README, encuadre), la rueda sobre el README, Tab, Esc y clic en el fondo, el dispositivo encuadra una colección, pellizco, vista Lista (y abrir desde ella), portada → caso de estudio y vuelta al mismo punto, vuelta interrumpida, Inicio con un proyecto abierto, Mi música desde el acoplado; en móvil, transición a la lista (sin estirarse), abrir un proyecto y volver al mismo punto, INICIO. 2026-10-23: todo correcto, sin errores de consola.
- `device-check.mjs` y `smoke.mjs`: todo correcto.
- Revisión de código (`code-review`), dos pasadas: 10 hallazgos en la primera versión y 10 en la del universo; corregidos todos menos el idioma de los dos README en inglés, que decide Iñigo.

**Mediciones** (mismo equipo, build de producción):
- Peso: JS 98,5 KB gzip (E4: 91,0), dentro del presupuesto de 150 KB. Los README van aparte y se cargan al abrir cada proyecto.
- Pantalla → lienzo (universo): ida 130–135 fps, p95 10–12 ms, peor fotograma en frío 79–109 ms; vuelta 147–149 fps, p95 9–12 ms. Más pesado que con las pilas (≈ 160 fps, p95 6 ms): el lienzo tiene ahora 13 portadas a la vista y unas 70 tarjetas plegadas. Que las plegadas no se pinten (`visibility: hidden`) lo mejoró algo. Sigue por encima de 60 fps; optimizarlo queda para E7.
- Con movimiento reducido, el fundido al lienzo: p95 32–40 ms (antes, 12–18). Para E7.
- Portada → caso de estudio y vuelta: 117–153 fps, p95 6–18 ms.
