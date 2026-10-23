# Sistema visual (E2 v3 · "blanco tecnológico", aprobado 2026-10-20)

Implementación de referencia: [prototypes/E2/device.css](../../prototypes/E2/device.css). En E3 estos valores pasan a `src/styles/tokens.css`.

v2 (2026-10-19): tras el vídeo de referencia de Iñigo (ver [MOODBOARD.md](../references/MOODBOARD.md)), la página pasa a blanco puro y se quitan los rasgos "de IA": tornillos, rejillas de puntos, LED con brillo, rejilla de puntos del lienzo, marcos discontinuos y monoespaciada en todas partes.

## Color

| Token | Valor | Uso | Contraste sobre blanco |
|---|---|---|---|
| `--bg` | **`#FFFFFF`** | Fondo de página y lienzo (antes `#F7F7F5`) | — |
| `--surface` | `#FFFFFF` | Tarjetas, barra de controles | — |
| `--surface-2` | `#F3F4F6` | Hover, superficies secundarias | — |
| `--metal` | `#CFD2D6` | Referencia del aluminio | — |
| `--ink` | `#252525` | Texto principal, cifras, botón principal | 15,3 : 1 ✅ |
| `--ink-2` | **`#6B6B6B`** | Texto secundario, navegación | 5,3 : 1 ✅ |
| `--accent` | `#4F75AD` | **Rellenos**: selección del dispositivo y serie principal de los gráficos | 4,7 : 1 (texto blanco encima ✅) |
| `--accent-ink` | **`#3E64A0`** | El acento como texto pequeño | 5,9 : 1 ✅ |
| `--line` | `rgba(0,0,0,.08)` | Separadores finos | — |

- `#777777` → `#6B6B6B`: el gris del brief no llega a 4,5 : 1 en texto pequeño.
- **Se retira `--mint`** (`#A8D5CB`): solo se usaba en el LED, que desaparece.
- Barras de desplazamiento y de posición en gris (`rgba(0,0,0,.32)`), no en azul.
- Regla: el blanco domina y el color **solo indica selección** (fila seleccionada en el dispositivo, serie principal de un gráfico). Las cifras de las tarjetas van en tinta, no en azul.

## Tipografía

| Rol | Fuente | Tamaño y estilo |
|---|---|---|
| Saludo de la home | Geist 500 | 21 px, −0,025 em |
| Navegación | Geist 400 | 13 px, `--ink-2` |
| Sistema del dispositivo | **Geist** 500/600 | Escala con el dispositivo (≈ 3,25 % de su ancho) |
| Títulos de tarjeta | Geist 500 | 13–18 px |
| Cifras grandes | Geist 500, `tabular-nums` | 24–56 px |
| Números de referencia (01, 02.1) | Geist Mono 400 | **Único uso de la monoespaciada.** Ver la regla debajo. |

**Regla de los números de referencia (E7, 2026-10-23).** Colección = dos cifras (`01`); proyecto = colección, punto y orden (`01.1`).
- **Color:** `text-2` (`#6B6B6B`). Nunca azul, salvo en un elemento seleccionado.
- **Tamaño:** 12 px en tarjetas, listas y páginas; 13 px en la etiqueta de colección del lienzo. En el lienzo, al 62 % de la vista inicial, salen a ≈ 10 px en pantalla.
- **Posición:** delante del título y en su misma línea (etiqueta de colección, lista móvil, antetítulo del caso de estudio) o arriba a la izquierda de la tarjeta, con el estado a la derecha.
- **Uno por elemento.** El número grande en gris (28 px, `#B9BEC5`) del hueco de la portada solo marca el sitio de la imagen: desaparece cuando llegue la imagen y queda solo el de arriba a la izquierda.
- **Excepción: la vista previa de Proyectos del dispositivo.** Sus casillas 01–04 son un mapa en miniatura, no referencias junto a un título, y se leen a ≈ 9 px: van en Geist 600, porque Geist Mono 400 las haría más débiles (decidido por Iñigo el 2026-10-23).

En producción, las fuentes se sirven desde el propio sitio (sin Google Fonts).

## Materiales del dispositivo

| Material | Cómo se construye |
|---|---|
| Aluminio granallado | Degradado vertical `#F1F2F4 → #DADDE1` + grano de ruido SVG al 9 % + brillo radial que sigue al puntero |
| Canto biselado | Línea blanca interior de 0,28 % + contorno oscuro de 0,16 % |
| Grosor | Dos sombras sólidas desplazadas hacia abajo (pared lateral clara y sombreada) |
| Cristal | Negro `#121316 → #08090A`, borde pulido y **un solo reflejo diagonal nítido** |
| Metal torneado (anillo, teclas) | `conic-gradient` claro; en el anillo, el brillo gira con el gesto |
| Ejes del anillo | Símbolos + − ⏮ ⏭ macizos en `#5E636A` (el grafito de los iconos de las teclas) con un filo de luz blanca debajo; al pulsarlos (o sus flechas) pasan un instante a `--accent` |
| Botón central | Disco satinado `#F7F8F9 → #E7E9EC`, separado del anillo por una ranura oscura con borde de luz |
| Trasera | Aluminio pulido con un barrido de luz diagonal (blanco al 55 %) y grabados en bajo relieve, todos del mismo tono (grafito al 58 %): monograma, `POCKET` (2,5 % del ancho, versalitas espaciadas) y `Iñigo Díez Osúa · 2026` (2,3 %, ≈ 10 px en la home de escritorio). E7, 2026-10-23: el nombre medía 1,9 % y casi no se leía a tamaño real |

## Espaciado y forma

- Márgenes de página: 40 px en escritorio, 16 px en móvil.
- Radios: tarjetas 14 px, botones en píldora, dispositivo 8 % de su ancho.
- Sombras: contorno de 1 px al 6–8 % + sombra ambiente amplia y suave. Nunca sombras de color.
- Pilas de proyectos: dos tarjetas asomando por debajo, centradas y escaladas (sin giros).

## Movimiento

- Microinteracciones (pulsar, seleccionar): ≤ 200 ms, `cubic-bezier(.2,.8,.2,1)`.
- Navegación interna del sistema: desplazamiento lateral del 8 % con fundido, 220 ms.
- **Inclinación del dispositivo en la home**: máximo ±4,5° según la posición del ratón, 600 ms de suavizado. Solo con ratón, nunca en táctil.
- **Girar el dispositivo**: 750 ms (900 ms hasta E7). Cualquier control lo vuelve a poner de frente.
- Cámara del lienzo: 600 ms. Al abrir un proyecto, lo que tarda el despliegue de sus tarjetas (550 ms + 45 ms por tarjeta, 730–775 ms), para que la cámara y la última tarjeta terminen a la vez.
- `prefers-reduced-motion`: sin inclinación, sin desplazamientos, giro instantáneo y cámara del lienzo sin deslizamiento.

## Gráficos

Fondo blanco, ejes al 25 % de la tinta, serie principal en `--accent`, comparativas en gris `#C9CCD1` y bandas en el acento al 10–16 %. Sin rejilla de fondo. Los gráficos se rehacen con datos reales en E6.
