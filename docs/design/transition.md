# Transición pantalla ↔ lienzo (E3)

Implementación: [src/transition/screenToCanvas.ts](../../src/transition/screenToCanvas.ts). Orquestación por rutas: [src/app/Stage.tsx](../../src/app/Stage.tsx). Medición: [scripts/dev/measure-transition.mjs](../../scripts/dev/measure-transition.mjs).

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

## Pendiente para E4 y E5

- (Comprobación de E4) El primer fotograma de la ida coincide con el montaje del lienzo en React: unos 12 ms, y 48 ms la primera vez en frío. Si se nota en equipos lentos, se puede montar el lienzo por adelantado (por ejemplo, al pasar el ratón por «Ver proyectos» o al seleccionar «Proyectos»).
- (Comprobación de E5) En móvil la transición funciona, pero el lienzo es demasiado pequeño: en E5 se sustituye por la lista o galería móvil.
