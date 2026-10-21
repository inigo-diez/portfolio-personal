# Especificación del dispositivo (E2 v3)

Silueta aprobada: **"Slate"** (2026-10-20). **E2 cerrada el 2026-10-20**: v3 aprobada como dirección visual. Implementación: [prototypes/E2/device.css](../../prototypes/E2/device.css) y [device.js](../../prototypes/E2/device.js).

Todas las medidas están en **% del ancho del dispositivo** (unidades `cqw`), así que el mismo dispositivo escala de ~430 px (home) a 200 px (acoplado en el lienzo) sin cambiar nada.

- v2 (2026-10-19): una sola pieza de aluminio. Fuera tornillos, rejilla del altavoz, LED, banda inferior de otro tono, rueda moleteada y grabados del frontal. Dentro la trasera grabada, el reflejo y la inclinación.
- v3 (2026-10-20): proporción **100 × 124** (antes 100 × 114, se percibía cuadrado). Misma anchura y misma pantalla 4:3; la altura extra va a la zona de controles. Anillo más grande con los **cuatro ejes** del vídeo y un botón central bien definido. Menú de 7 entradas. Nombre completo en el grabado. Se descarta "Wheel".

## Geometría (ancho = 100)

| Parte | Posición / tamaño | Notas |
|---|---|---|
| Cuerpo | **100 × 124**, radio 8 | Una pieza: aluminio granallado y canto biselado brillante |
| Grosor | Pared lateral visible abajo (≈ 1 %) | Da sensación de objeto |
| Cristal | x 6, y 6, 88 × 67,3, radio 3,6 | Negro, a ras, con un único reflejo diagonal. Sin cambios desde v2 |
| Pantalla | Dentro del cristal con margen de 2,6 → **4:3** | Se expande al lienzo sin deformarse |
| Anillo | x 7, y 79,6, **Ø 37** (centro en y 98,1) | Metal torneado; el brillo gira con el gesto. Margen inferior 7,4 ≈ margen lateral |
| Ejes del anillo | 4 símbolos macizos `#5E636A`, el mismo grafito suave que los iconos de las teclas (Ø 7,6) a media banda (15 % desde el borde), elegidos por Iñigo de su foto de referencia (2026-10-20) | **+** subir · **−** bajar · **⏮** atrás · **⏭** abrir. No giran con el metal. Son etiquetas: no controlan el volumen |
| Botón central | Ø 38 % del anillo | Disco satinado separado por una ranura oscura con borde de luz |
| ATRÁS / INICIO | Ø 10,5, x 68,5 y 83,5, centrados en el eje del anillo | Solo icono (nombre accesible en `aria-label`) |
| Botón lateral | 1,3 × 13 en el canto derecho | Pulido |
| Trasera | Aluminio pulido | Grabado: marca **"○/"**, `POCKET OS`, `ID-01 · Iñigo Díez Osúa · 2026` |

## Modelo de entrada

Toda entrada física se convierte en uno de **5 comandos**, que alimentan una única máquina de estados:

| Entrada | → Comando |
|---|---|
| Girar el anillo (gesto circular real: 30° = 1 paso, horario = siguiente) | `next` / `prev` |
| Tocar un eje del anillo sin girar | + `prev` · − `next` · ⏮ `back` · ⏭ `select` |
| Rueda del ratón con el puntero sobre el anillo (1 muesca = 1 paso; el trackpad acumula) | abajo `next` · arriba `prev`; el brillo del metal gira 30° por paso |
| Botón central · Intro · Espacio · tocar una fila de la pantalla | `select` |
| ATRÁS · Esc · Retroceso | `back` |
| INICIO · tecla Inicio | `home` |
| Botón lateral: rueda del ratón o arrastre vertical | `next` / `prev` (en el lienzo: zoom, en E5) |
| Flechas del teclado: igual que los ejes del anillo | ↑ `prev` · ↓ `next` · ← `back` · → `select` |

- Las flechas ← → siguen la lógica de un explorador por columnas: izquierda sube un nivel, derecha entra. Al pulsarlas se ilumina el eje correspondiente del anillo.
- **En «Sonando» (Mi música), ⏮ y ⏭ cambian a la pista anterior o siguiente**, como indican sus símbolos (decidido 2026-10-20). + y − también pasan de pista, igual que en las listas. Se vuelve a la lista con ATRÁS o Esc. Ningún eje controla el volumen.
- ◀ y la tecla ATRÁS hacen lo mismo. **ATRÁS se mantiene (decidido 2026-10-20)**: hace más evidente cómo volver y equilibra el frontal.
- Si el dispositivo está girado (se ve la trasera), cualquier comando solo lo vuelve a poner de frente.

## Sistema operativo (pantalla)

- Barra de estado: hora real, título (`Pocket OS` en el menú, el nombre de la sección dentro) y batería.
- Tipografía: Geist, no monoespaciada.
- **Menú de 7 entradas, en el orden de la web antigua:** Sobre mí · Trayectoria · Proyectos · Habilidades · Formación · Contacto · CV.
  - Al abrirse (y al pulsar INICIO) la selección empieza en **Proyectos**, el destino principal, aunque no sea la primera entrada (decidido 2026-10-20).
- **Menú partido**: lista a la izquierda (52 %) y vista previa de la entrada seleccionada a la derecha, solo con contenido real:

| Entrada | Vista previa | Fuente |
|---|---|---|
| Sobre mí | Monograma "ID" (hasta tener foto: `TODO(content)`), "Iñigo Díez Osúa", "Química · Ciencia de datos · IA" | CV |
| Trayectoria | Ficha del TFG: "Datos metabolómicos" con PCA, PLS-DA, DoE · RSM | CV, web antigua |
| Proyectos | Las 4 colecciones (01–04) y "13 proyectos en 4 colecciones" | project-map |
| Habilidades | Etiquetas: Python, SQL, scikit-learn, XGBoost, TensorFlow, LLMs | CV |
| Formación | Línea de tiempo: Máster CD e IA (Afi, 2026–27) y Grado en Química (EHU) + "7 cursos complementarios" | web antigua |
| Contacto | Correo y "LinkedIn · GitHub" | web antigua |
| CV | Miniatura de documento y "Currículum · PDF" | — |

- Secciones: listas a ancho completo o texto desplazable (Sobre mí).
  - **Trayectoria** = lo que la web antigua llamaba "Experiencia": TFG y Grado en Química.
  - **Formación** = lo que la web antigua llamaba "Formación": Máster, Grado y los 7 cursos complementarios con sus fechas.
  - Las listas largas (Formación, 9 filas) se desplazan para mantener visible la selección y muestran una barra de posición gris.
- La selección es una barra azul con un degradado leve hacia abajo; el texto blanco cumple 4,7 : 1. El azul solo marca la selección.

## En la home

- Reflejo suave en el suelo (`-webkit-box-reflect`; en Firefox no aparece y no pasa nada).
- Inclinación de hasta ±4,5° hacia el ratón, con un brillo que acompaña. Desactivada en táctil y con `prefers-reduced-motion`. **Aprobada.**
- Botón "Girar" para ver la trasera.

## En el lienzo

El dispositivo **se acopla abajo a la izquierda** (200 × 248 px, sin reflejo ni inclinación) y sigue funcionando: su lista de colecciones mueve la cámara del lienzo y su botón INICIO devuelve a la home. Es la base de la transición de E3: la pantalla crece hasta ser el lienzo mientras el cuerpo se encoge hacia la esquina, y al volver se invierte. **Aprobado.**

## Marca de la trasera: "○/" (decidida 2026-10-20)

Elegida **"○/"**: remite al anillo sin recuperar el punto sólido. Las propuestas que se compararon (siguen en `prototypes/E2/devices.html`):

| Id | Marca | Idea |
|---|---|---|
| `anillo` | ○/ | La marca anterior sin el punto: el círculo pasa a ser el anillo de control. **Elegida** |
| `ido` | IDO | Iniciales de Iñigo Díez Osúa con trazos geométricos |
| `ejes` | Círculo con 4 ejes | El anillo visto de frente (riesgo: puede leerse como una diana) |
| `silueta` | Pictograma | El dispositivo reducido a cuerpo, pantalla y anillo |

## Descartado

**Concepto A "Wheel"** (100 × 164, rueda grande centrada): se parecía más al vídeo, pero se leía como un iPod y encajaba peor acoplado en el lienzo. Descartado el 2026-10-20.
