# Transición pantalla ↔ lienzo (E3)

Implementación: [src/transition/screenToCanvas.ts](../../src/transition/screenToCanvas.ts) (desde el 2026-10-23 también lleva la pantalla a las páginas de sección: ver más abajo). Orquestación por rutas: [src/app/Stage.tsx](../../src/app/Stage.tsx). Medición: [scripts/dev/measure-transition.mjs](../../scripts/dev/measure-transition.mjs).

## Qué se ve (ida, 730 ms)

| Tiempo | Qué pasa |
|---|---|
| 0–110 ms | El contenido del sistema se funde y, en su sitio, aparece el lienzo en miniatura con las cuatro pilas (01 02 / 03 04, como la vista previa de «Proyectos»). |
| 110–730 ms | La pantalla crece hasta ocupar la ventana mientras el cuerpo de Slate, con la pantalla apagada, se encoge y se acopla abajo a la izquierda. Un **contorno gris de 1 px** marca el borde de la pantalla mientras crece (blanco sobre blanco no se vería) y se desvanece hacia los 420–560 ms, antes del final. La portada se desvanece al principio y la barra superior y el HUD aparecen al final. |
| Al llegar | La pantalla del dispositivo acoplado se enciende con la lista de colecciones y recibe el foco del teclado. |

La vuelta es el mismo recorrido al revés, desde donde esté la cámara del usuario: el lienzo se contrae hacia la pantalla, el cuerpo vuelve a su sitio y el menú reaparece. Con movimiento reducido, todo se sustituye por un fundido de 200 ms.

## Técnica elegida: FLIP con fotogramas precalculados (Web Animations API)

1. **Medir.** Se toman el rectángulo de la pantalla (S), la ventana (V), el dispositivo en la home y el hueco del dock.
2. **Invertir.** La capa del lienzo se transforma para ocupar exactamente S. El mundo de dentro lleva la **escala compensada** (inversa en x e y), así que las tarjetas no se deforman aunque la ventana pase de 4:3 a la proporción del navegador.
3. **Reproducir.** Toda la coreografía depende de dos números: `g` (geometría: 0 = pantalla, 1 = lienzo) y `s` (contenido de la pantalla oculto). La trayectoria se muestrea una vez en JS, a 60 puntos por segundo, y se entrega a la Web Animations API como fotogramas lineales. Solo se animan `transform` y `opacity`, de modo que la anima el compositor sin pasar por el hilo principal.
4. **Interrumpir.** Si llega un «atrás» a mitad de la animación, se lee `(g, s)` en el instante actual y se planifica un recorrido nuevo desde ahí. No hay saltos.

**Contorno.** Son cuatro líneas de 1 px (`rgba(0,0,0,.16)`) que solo se estiran a lo largo y comparten la geometría de la ventana. Así la línea mide siempre 1 px: un marco escalado adelgazaría su borde. Aparece al salir del bisel y se desvanece entre `g = 0,8` y `g = 0,97`. Añadido el 2026-10-20 a petición de Iñigo, sin cambiar la duración ni el recorrido.

**Capas.** El cuerpo viaja *por encima* del lienzo, porque termina acoplado sobre él. Para que el lienzo se vea a través de la pantalla, el aluminio es una placa con un hueco detrás del cristal (máscara SVG) y el bisel negro es un borde. En reposo no cambia nada: la pantalla opaca tapa el hueco.

**Navegación.** La URL es la fuente de verdad. Las teclas del dispositivo, los enlaces y los botones atrás y adelante del navegador llegan al mismo `Stage`, que monta la home y el lienzo a la vez solo mientras dura la transición.

### Alternativas evaluadas

| | FLIP + WAAPI (elegida) | View Transitions API (`?tecnica=vt`) | `layoutId` de Motion |
|---|---|---|---|
| Continuidad visual | El lienzo es real durante toda la transición: se ve crecer con sus tarjetas nítidas y sin deformarse | Anima capturas de imagen. La miniatura del lienzo es un recorte escalado, no una vista general | Real, con corrección de escala hecha en JS |
| Interrupción (atrás a mitad) | Continua: invierte desde el punto actual | Salta al final y empieza otra transición | Continua |
| Hilo | Compositor | Compositor | Hilo principal (calcula cada fotograma en JS) |
| Peso añadido | 0 KB (≈ 250 líneas propias) | 0 KB | ≈ 30 KB gzip |
| Control del orden de capas (cuerpo sobre el lienzo) | Total | Con `z-index` en los pseudoelementos | Limitado |
| Coste | Más código propio que mantener | Muy poco código | Poco código, más peso |

Motion no hace falta para esta transición. Se decidirá en E4 o E5 si aporta algo (por ejemplo, para microinteracciones); si no, no se añade.

## Medición

Edge sin interfaz, con GPU real (Intel UHD Graphics, Direct3D 11), ventana de 1440 × 900 y pantalla de 165 Hz. Build de producción. Cinco repeticiones por escenario.

| Escenario | fps | Duración | Peor fotograma | p95 | Estado final |
|---|---|---|---|---|---|
| Ida con el dispositivo (→ en «Proyectos») | 161 | 742 ms | 48 ms (en frío) · 12–14 ms después | 6,3 ms | limpio |
| Vuelta con el botón atrás del navegador | 164 | 737 ms | 12,6 ms | 6,4 ms | limpio |
| Ida con el enlace «Ver proyectos» | 165 | 733 ms | 6,7 ms | 6,3 ms | limpio |
| Vuelta con la tecla ATRÁS (Esc) | 166 | 730 ms | 6,4 ms | 6,2 ms | limpio |
| Interrumpida con Atrás a 120 / 300 / 500 ms | 164–165 | vuelve en 364 / 552 / 697 ms | 12,2 ms | 6,4 ms | limpio |
| Ida, atrás y adelante seguidos | 163 | 558 ms | 12,3 ms | 6,4 ms | limpio |
| Movimiento reducido (ida / vuelta) | 160 / 166 | 210 / 201 ms | 23,8 / 7,4 ms | 7,6 / 6,3 ms | limpio |
| *Alternativa View Transitions (ida / vuelta)* | *162 / 164* | *754 / 746 ms* | *36 / 18 ms* | *6,3 / 6,4 ms* | *limpio* |

Medido con el contorno incluido (no cambia los resultados). Las dos técnicas son igual de fluidas en este equipo. La diferencia está en la continuidad al interrumpir y en lo que se ve durante la animación (capturas frente a lienzo real), no en los fps. Resultados completos en `_reference/e3/results.json`.

- *fps* = fotogramas pintados por segundo durante la transición (el máximo es la frecuencia de la pantalla).
- *peor* = el intervalo más largo entre dos fotogramas. Un intervalo de 16,7 ms equivale a un fotograma a 60 Hz.
- *Estado final limpio* = queda una sola página, ninguna animación pendiente, nada transformado y la URL coherente.

## Peso (build de producción)

| Recurso | Tamaño | gzip | Brotli |
|---|---|---|---|
| JS (toda la app, incluido React 19) | 265 KB | **82,6 KB** | 71,7 KB |
| CSS | 22,7 KB | 6,1 KB | 5,4 KB |
| Geist (latín, variable) | 29,4 KB woff2 | — | — |
| Geist Mono (latín, variable) | 23,1 KB woff2 | — | — |

El presupuesto del brief es de 150 KB de JS comprimido en la home: se usa algo más de la mitad. La mayor parte es React (estimación: unos 60 KB). El lienzo todavía no se carga aparte; se hará en E5 si su código crece.

## E4: el dispositivo completo (2026-10-21)

El cuerpo ahora lleva inclinación, giro y reflejo. Al empezar la transición (`[data-transitioning]`) se ponen a cero al instante, para que la pantalla se mida plana y de frente; el reflejo desaparece en ese momento. Si se sale de Mi música, los auriculares se desconectan antes (0,3 s), y solo después empieza la transición.

Medido contra E3 en el mismo equipo, con la build de producción, 5 repeticiones por escenario y alternando las versiones (E3, E4, E3, E4) para repartir el ruido del equipo:

| Escenario | E3 | E4 |
|---|---|---|
| Ida con el dispositivo: fps · peor fotograma · p95 | 154–157 · 42–48 ms · 6,9–7,6 ms | 147–156 · 36–43 ms · 8–10,7 ms |
| Vuelta con el atrás del navegador | 160 · 24–34 ms · 7–7,7 ms | 152–155 · 42 ms · 9–9,8 ms |
| Movimiento reducido, ida | 134–137 · 42–55 ms · 15–17 ms | 129–131 · 67–91 ms · 24–28 ms |

E4 cuesta unos 2–3 ms más en el p95, por el reflejo y las capas 3D de la home, y sigue por encima de 145 fps. Todas las pruebas, incluidas las interrumpidas, terminan con el estado limpio. Una primera medición aislada dio un peor fotograma de 95 ms; la comparación alternada mostró que era ruido del equipo. Resultados: `_reference/e4/ab-e3`, `_reference/e4/ab-e4`. Para medir otra build: `PREVIEW_URL=http://localhost:4174/portfolio-personal/ node scripts/dev/measure-transition.mjs <carpeta>`.

## E4: la pantalla también crece hasta las páginas de sección (2026-10-23)

Dentro de la pantalla de 4:3 el texto de las secciones quedaba en 7–10 px en portátiles y móviles. Por eso Sobre mí, Trayectoria, Habilidades, Formación y Contacto se abren ahora con la misma transición que Proyectos, pero el destino es su página real en lugar del lienzo. CV y Mi música siguen dentro del dispositivo.

- **Mismo motor.** `startScreenTransition` recibe el destino (lienzo o página) y el resto de la coreografía es idéntico: los dos números (g, s), el contorno gris, el cuerpo que se acopla, la interrupción a mitad de camino y el fundido con movimiento reducido. Lo que cambia por destino es cómo se compensa el contenido dentro de la ventana que crece. En el lienzo se interpola la cámara. En la página, esta se muestra a escala uniforme, tan ancha como la ventana (una miniatura de la página real), así que el texto nunca se estira.
- **La página como ventana.** Mientras dura la transición (`[data-transitioning]`), la capa de la página es una ventana fija sobre la home ([page.css](../../src/pages/page.css)). Su ancho es el que tendrá la página sola, sin la barra de desplazamiento si la página es más alta que la ventana, para que nada salte al terminar.
- **Al volver de una página desplazada,** la ventana enseña ese desplazamiento y lo lleva al principio mientras encoge. Si la vuelta se interrumpe y se regresa a la página, se restaura el desplazamiento. Con movimiento reducido, la página se funde sin moverse de donde estaba.
- **Dispositivo acoplado:** en escritorio, fijo abajo a la izquierda, como en el lienzo. En móvil va arriba de la página y se desplaza con ella; si se vuelve con la página desplazada, el cuerpo llega desde arriba.
- La variante `?tecnica=vt` (comparación de E3) solo se aplica al lienzo.

Medido con la build de producción, en el mismo equipo:

| Escenario | Resultado |
|---|---|
| Pantalla → página y vuelta (1440 × 900 y 390 × 844, 3 idas y 3 vueltas cada uno, la vuelta con la página desplazada 400 px) | 152–165 fps, p95 6,1–6,3 ms; peor fotograma 24–36 ms en la primera ida, 6–18 ms en el resto |
| Lienzo, antes y después del cambio, alternando versiones 4 veces (2 repeticiones por sesión) | Peor fotograma de la primera ida (en frío): antes 60,7 / 48,4 / 48,6 / 48,5 ms; después 54,3 / 48,3 / 48,4 / 48,5 ms. p95 de 6,2–6,3 ms en las dos. Sin empeoramiento. |

Todas las pruebas, también las interrumpidas, terminan con el estado limpio. Estas mediciones se guardaron en la carpeta temporal de la sesión, no en `_reference/`.

## Pendiente para E5

- El primer fotograma de la ida coincide con el montaje del lienzo en React: 36–48 ms en frío, igual en E3 que en E4. No se ha montado el lienzo por adelantado; si se nota en equipos lentos, se puede hacer (por ejemplo, al pasar el ratón por «Ver proyectos» o al seleccionar «Proyectos»).
- Con movimiento reducido, el fundido de E4 tiene un peor fotograma algo mayor (67–91 ms frente a 42–55 ms); revisar al rehacer la transición definitiva.
- En móvil la transición funciona, pero el lienzo es demasiado pequeño: en E5 se sustituye por la lista o galería móvil.
