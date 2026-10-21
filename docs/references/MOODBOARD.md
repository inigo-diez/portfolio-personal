# Moodboard — qué tomar de cada referencia

Las imágenes descargadas están en `_reference/moodboard/` (ignorada por git: son de terceros y no se publican). Aquí solo van enlaces y conclusiones.

## Hardware

### iPod classic — la jerarquía
Fuente: [Wikimedia — 6G iPod](https://commons.wikimedia.org/wiki/File:6G_iPod.svg)

- Reparto ~45 % pantalla / ~55 % control. Un único material y un único control dominante.
- Las etiquetas (MENU, ⏮ ⏭ ▶‖) están impresas *en* el control: el hardware explica cómo se usa.
- **Tomar:** la claridad de un control principal y la tipografía grabada.
- **Evitar:** la proporción exacta, el círculo centrado y la pantalla vertical pequeña (copia directa y mala para la transición).

### HP/Compaq iPAQ — los detalles de hardware
Fuente: [Wikimedia — HP iPAQ hw910](https://commons.wikimedia.org/wiki/File:Hp-ipaq-hw910.jpg)

- Marco plateado que **enmarca** la pantalla, con una banda superior que lleva rejilla de altavoz, LEDs y botón de encendido.
- Separación clara de materiales: plata, pantalla negra y teclas blancas.
- Barra de estado del sistema (hora, batería, cobertura): referencia para la barra del Pocket OS.
- **Tomar:** la banda superior con altavoz/LED/serial, el marco metálico y la barra de estado.
- **Evitar:** el teclado, los iconos de colores y la densidad.

### Palm V — los dos tonos
Fuente: [Wikimedia — Palm V](https://commons.wikimedia.org/wiki/File:Palm_V_by_Andrew_Fresh_(cropped).jpg)

- Carcasa de aluminio anodizado con una **banda inferior más oscura** donde viven los botones.
- Una fila de botones físicos con iconos grabados y un LED verde como único color.
- **Tomar:** la carcasa partida en dos tonos y un único LED con el acento (`#A8D5CB` o `#4F75AD`).

### Panic Playdate — el control secundario memorable
Fuente: [Wikimedia — Playdate](https://commons.wikimedia.org/wiki/File:Playdate_front-view.png)

- Pantalla **horizontal** dominante, tornillos visibles en las esquinas y rejilla de altavoz vertical.
- La manivela lateral es un control secundario que nadie olvida.
- **Tomar:** la pantalla horizontal (encaja con la transición al canvas), los tornillos como detalle de fabricación y la idea de *un* control lateral inesperado (rueda de pulgar, slider…).
- **Evitar:** el color amarillo y el aire de consola de juegos.

### Braun T3 (Dieter Rams, 1958) — la contención
- Caja blanco roto, rejilla de puntos perforados y un solo dial. Se cita a menudo como precedente del iPod ([Core77](https://www.core77.com/posts/24768/A-History-of-Braun-Design-Part-3-Audio-Products), [Fast Company](https://www.fastcompany.com/3016910/a)).
- **Tomar:** la rejilla de puntos como textura (enlaza con la cuadrícula de puntos del canvas) y la disciplina de "menos, pero mejor".

### Teenage Engineering OP-1 Field — el premium técnico
- Aluminio y codificadores con color funcional: el color indica función, no decoración ([Wallpaper*](https://wallpaper.com/technology/teenage-engineering-op-1-field-review)).
- **Tomar:** las etiquetas monoespaciadas diminutas y el color solo con significado.

## Web

### iPodfolio (Framer) — la navegación
[Plantilla](https://www.framer.com/marketplace/templates/ipodfolio/) · [demo](https://ipodfolio.framer.website/)

- Rueda funcional: girar recorre la lista, el centro selecciona y MENU vuelve atrás. Transiciones *push* entre pantallas. Barra de estado con batería.
- **Tomar:** el modelo de entrada (girar / seleccionar / volver).
- **Evitar:** ser otra réplica de iPod: es justo lo que nos diferencia de esta plantilla.

### Infinite Canvas (KEZ Works, Framer) — el canvas
[Plantilla](https://www.framer.com/marketplace/templates/infinite-canvas/) · [demo](https://calm-innovation-625300.framer.app)

- Cada proyecto es una **pila** que se despliega en cartas con un muelle (*spring*) escalonado.
- Al abrir un proyecto, el canvas se convierte en un **pliego**: visor grande a la izquierda y miniaturas agrupadas a la derecha, sin modal ni recarga.
- Interfaz tipo archivo de diseño: cajas discontinuas, etiquetas de cota, cabeceras de zona y navegador con el % de zoom.
- En móvil (< 768 px): visor fijo arriba y lista debajo.
- La cámara no se recentra sola mientras alguien lee.
- **Tomar:** las cotas, coordenadas y el % de zoom como "HUD" (encajan con la estética de dispositivo técnico), la pila que se despliega y la regla de no mover la cámara mientras se lee.

### Infinite Canvas (Richard Segura, Webflow) — la técnica
[Página](https://webflow.com/made-in-webflow/website/inifinite-canvas)

- Profundidad con CSS puro: tamaño y opacidad según la distancia. Posiciones deterministas (con hash) y solo se renderiza lo visible. Vanilla JS, sin WebGL.
- Imagen guardada: `_reference/moodboard/segura-canvas.png`. Mucho blanco, piezas de tamaños distintos y profundidad sugerida solo con escala.
- **Tomar:** la profundidad con escala y opacidad (2–3 planos, no 3D real) y las posiciones fijas.
- **Evitar:** el desplazamiento infinito en Z y el paralaje con el ratón (el brief lo desaconseja).

### Neither/Nor (Awwwards)
[Enlace del brief](https://www.awwwards.com/inspiration/thumbnail-submission-65a4d4c774548514328131). No he podido verificar el contenido de esta página. Se mantiene como referencia de composición asimétrica y espacio negativo.

### Vídeo de Iñigo — portfolio con iPod classic (referencia principal desde E2 v2)
Fichero: `materials/video_ejemplo/7303672821249635497.mp4` (35 s, 480 × 360).

- **Fondo blanco puro**, sin rejillas ni degradados. El dispositivo, centrado, es lo único que importa.
- Dispositivo **realista**: aluminio plateado, rueda blanca, cristal negro y un **reflejo suave en el suelo**.
- Página casi vacía: un "Hi, I'm Pablo ⓘ" a la izquierda y un único botón en píldora negra a la derecha.
- Pantalla con **menú partido**: lista con selección azul a la izquierda y vista previa (foto, portadas) a la derecha. Cover-flow en libros y música.
- Detalles de objeto físico: se **inclina en 3D**, se le **da la vuelta** (trasera de acero pulido con grabados) y en Ajustes cambia de color (plata ↔ negro, y la página pasa a negro).
- **Tomar:** el blanco, el realismo del objeto, el reflejo, la página mínima con dos elementos, el menú con vista previa y la trasera grabada.
- **Evitar:** copiar el iPod (forma y rueda bajo la pantalla).

## Conclusiones para el diseño (E2 v2, tras el vídeo de referencia)

1. **Pantalla horizontal o casi cuadrada.** La lección más importante: hace que la transición pantalla → canvas sea natural. Descarta el formato iPod vertical puro.
2. **Una sola pieza de aluminio**, sin tornillos, rejillas de altavoz ni LED. El aspecto tecnológico viene del material (granallado, canto biselado brillante, cristal a ras), no de añadir detalles.
3. **Un control principal** (anillo de metal torneado) **más uno secundario** (botón lateral).
4. **La identidad va grabada en la trasera** (marca, serie, nombre). El frontal queda limpio.
5. **Un solo color "vivo"**: el elemento seleccionado. Todo lo demás, blanco, plata y gris.
6. **Monoespaciada solo en números de referencia** (01, 02.1…). Todo lo demás, en Geist.
7. **Fondo blanco puro** en la home y en el lienzo, sin rejilla de puntos ni marcos discontinuos.
