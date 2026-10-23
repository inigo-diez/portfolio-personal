# E4 — Pocket OS funcional

**Objetivo:** el dispositivo completo, convincente y usable con cualquier entrada, también en móvil.

## Tareas
1. Carcasa en SVG/CSS según `device-spec.md`: materiales, marco, sombras, reflejos contenidos y detalles grabados.
2. Controles: rueda con gesto circular real (ángulo + retenes), botón central, botón atrás y control secundario. Profundidad al pulsar.
3. Modelo de entrada único: rueda, teclado, táctil y swipe → `next / prev / select / back / home` → máquina de estados.
4. OS: barra de estado, menú de 8 entradas y pantallas de sección (Sobre mí, Trayectoria, Habilidades, Formación, Contacto, CV y, al final, Mi música + «Sonando») con transiciones push internas.
   - **Mi música** según [prototypes/musica/propuesta.html](../../prototypes/musica/propuesta.html) una vez aprobada: entrada de auriculares en el canto superior, par de auriculares de botón con cable fino solo en esta sección (a la derecha en escritorio, debajo en móvil), reproductor oficial de Spotify cargado al elegir pista (nunca autoplay) y descargado al salir, enlace directo si falla. Comprobar si la API oficial del reproductor permite reproducir y pausar con el botón central de forma fiable; si no, el centro no hace nada en «Sonando».
5. Navegación externa alrededor del dispositivo: selección de enlaces arriba (atajos del brief + Mi música); las 8 entradas en la lista móvil y en el pie de las páginas interiores.
6. **Versión móvil** del dispositivo y su navegación. El menú de 8 entradas usa filas de 6,6 solo en escritorio; en móvil mantiene filas de 7 o más y se desplaza, y la lista de enlaces bajo el dispositivo tiene áreas táctiles amplias (≥ 44 px).
7. Accesibilidad del dispositivo: roles, nombres accesibles, foco visible y lectores de pantalla.

## Entregables
Home funcional desplegable en `inigo-diez.github.io/portfolio-personal/`.

## ⏸ Aprobación
El dispositivo parece un producto real, todos los controles funcionan con ratón, teclado y táctil, y el móvil es cómodo.

## Para arrancar
> "Empieza E4"

## Estado (2026-10-21, cambiado el 2026-10-23)
Hecho y **pendiente de aprobación**. Los puntos que conviene revisar están en [PLAN.md](../PLAN.md) (Decisiones abiertas → E4).

**Cambio del 2026-10-23, pedido por Iñigo antes de aprobar.** Dentro de la pantalla de 4:3 la información se veía demasiado pequeña: unos 7–10 px en un portátil de 1366 × 768 o en un móvil. Ahora:
- Sobre mí, Trayectoria, Habilidades, Formación y Contacto se abren como su **página real**. La pantalla crece hasta ocupar la ventana, con la misma transición que Proyectos → lienzo, y el dispositivo queda acoplado: fijo abajo a la izquierda en escritorio, arriba de la página en móvil. Su lista lleva a otras secciones, y ATRÁS o INICIO hacen la transición inversa. La dirección es la de la página (`/sobre-mi/`…). Detalle técnico y mediciones en [design/transition.md](../design/transition.md#e4-la-pantalla-también-crece-hasta-las-páginas-de-sección-2026-10-23).
- **CV y Mi música siguen dentro del dispositivo** (decidido por Iñigo).
- El dispositivo de la home tiene **tamaño mínimo de letra**: 12 px las filas, 11 px los datos y la barra de estado, 13 px los títulos. Detalle en [device-spec.md](../design/device-spec.md#sistema-operativo-pantalla).
- Se quitaron las pantallas de texto y de lista que esas cinco secciones tenían dentro del dispositivo.

| Tarea | Qué hay |
|---|---|
| 1. Carcasa | Inclinación hacia el ratón (±4,5°, nunca en táctil ni con movimiento reducido) con brillo que la sigue, reflejo en el suelo, «Girar» con la trasera grabada («○/», `POCKET OS`, `ID-01 · Iñigo Díez Osúa · 2026`) y entrada de auriculares en el canto superior. Al empezar la transición al lienzo, el dispositivo vuelve de frente y plano. |
| 2. Controles | Anillo con gesto circular real (30° = 1 paso, el metal se asienta en cada retén), toque en los ejes, rueda del ratón; centro, ATRÁS, INICIO y botón lateral (rueda o arrastre vertical). Áreas táctiles de 44 px como mínimo en las teclas. |
| 3. Entrada única | Anillo, rueda, teclado, botón lateral, deslizar el dedo sobre la pantalla (vertical = moverse; a la derecha = volver; a la izquierda = abrir) y tocar una fila → `next / prev / select / back / home`. El dispositivo acoplado en una página solo escucha el teclado cuando tiene el foco, para que las flechas sigan desplazando la página. En «Sonando», ⏮ ⏭ (y ← →) cambian de pista; ATRÁS y Esc vuelven a la lista. Con el dispositivo girado, cualquier control solo lo pone de frente. |
| 4. OS | Menú de 8 entradas (filas de 6,6 en escritorio, de 7 con desplazamiento en móvil) con vista previa y letra mínima legible. Desde el 2026-10-23, Sobre mí, Trayectoria, Habilidades, Formación y Contacto abren su página con la transición de la pantalla; CV se abre dentro (filas que abren o descargan el PDF), con transición lateral de 220 ms. Todo el texto sale de `src/content/profile.ts`. |
| 4. Mi música | Lista, «Sonando» con el reproductor oficial (se carga al elegir pista, se descarga al salir, nunca suena solo), control por la iFrame API (centro = reproducir/pausa con un reintento; si no responde, los controles del dispositivo se apagan y queda el reproductor), posición real, enlace directo si Spotify falla. Auriculares v3 con su animación (conectar 0,6 s, desconectar 0,3 s); al ir de Mi música a Proyectos se desconectan antes de la transición. **No se publica sin tus canciones**: hasta entonces está desactivada en el menú y no existe la ruta. |
| 5. Navegación externa | Arriba, la selección aprobada (Mi música aparece cuando exista). Las 8 entradas en la lista móvil y en el pie de las páginas interiores. Página `/mi-musica/` prerenderizada, sin reproductores. |
| 6. Móvil | Dispositivo a lo ancho (`100vw − 48 px`, máx. 360), lista de enlaces de 52 px, auriculares por detrás y debajo (el dispositivo baja 40 px y se oculta el reflejo). |
| 7. Accesibilidad | Grupo con nombre y descripción de las teclas, listas `listbox`/`option` con `aria-selected`, anuncio de la posición («Proyectos, 3 de 8»; «Pista seleccionada: título, artista»), foco visible, `prefers-reduced-motion` (sin inclinación, giro ni desplazamientos). Auriculares decorativos (`aria-hidden`). |

**Comprobaciones** (con `npm run dev` o con `npm run build` + `npx vite preview --port 4173`):
- `node scripts/dev/device-check.mjs [url] [carpeta]`: recorre el dispositivo con teclado, ratón y táctil en escritorio y móvil (letra mínima del menú, cada sección: las cinco páginas con su dispositivo acoplado y la vuelta con Esc, CV dentro; paso de una página a otra desde el acoplado; anillo, deslizar, toque tras deslizar, girar, Mi música con datos de prueba, salida hacia Proyectos, transición desde la trasera, página `/mi-musica/`). 2026-10-21: todo correcto en desarrollo y en producción. 2026-10-23 (con el cambio): todo correcto en producción, sin errores de consola.
- `node scripts/dev/smoke.mjs`: las 9 rutas sin errores, escritorio y móvil (también el 2026-10-23).
- Revisión de código (`code-review`), 2026-10-23, sobre el cambio: 9 hallazgos. Corregidos los 5 que venían del cambio: el desplazamiento no se restauraba si la vuelta se interrumpía; Mi música quedaba fija como desactivada en el acoplado; con movimiento reducido, la página saltaba arriba al salir; quedaban etiquetas `short` sin uso; la variante `vt` de E3 se aplicaba también a las páginas. Sin tocar: el de `resume()` (ver abajo) y el de los auriculares al salir, que es código de E4 sin cambios; y dos propuestas de refactorización de tipos y de dónde vive cada sección, que no se pidieron.
- Revisión de código (`code-review`), 2026-10-21: 9 hallazgos; 8 corregidos. No se cambió el que pedía usar `play()` en lugar de `resume()`, porque la documentación de Spotify dice que `resume()` empieza la reproducción si aún no ha empezado.

**Mediciones:**
- Peso: JS 91,0 KB gzip (E3: 82,6), dentro del presupuesto de 150 KB.
- Transición pantalla ↔ lienzo, comparada con E3 en el mismo equipo y alternando versiones: ida 147–156 fps, p95 8–10,7 ms (E3: 154–157 fps, 6,9–7,6 ms); peor fotograma 36–43 ms (E3: 42–48 ms). Estado final limpio en todos los escenarios. Detalle en [design/transition.md](../design/transition.md).
- Reproductor de Spotify (medido 2026-10-21): con una canción se ve entero desde ≈ 250 px de ancho; un episodio de pódcast necesita ≈ 330 px. En «Sonando» ocupa todo el ancho de la pantalla (258 px en un teléfono de 360 px).
