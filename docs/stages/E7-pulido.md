# E7 — Pulido y detalles distintivos

**Objetivo:** que se vea cohesionado, original y terminado.

## Tareas
1. Tipografía y espaciado: revisión página por página.
2. Materiales del dispositivo: reflejos, bordes y sombras.
3. Tiempos de animación y continuidad de la transición.
4. Composición final del canvas.
5. 2–3 detalles distintivos como máximo (p. ej. logo grabado, metadatos del sistema, un easter egg discreto).
6. Sonidos opcionales (desactivados por defecto), solo si aportan.
7. Favicon e imagen Open Graph a partir de la identidad del dispositivo.

## ⏸ Aprobación
Iñigo lo da por terminado a nivel visual.

## Para arrancar
> "Empieza E7"

## Estado (2026-10-23)
En curso. Decisiones de Iñigo al empezar: [PLAN.md](../PLAN.md) (Decisiones tomadas, 2026-10-23). Capturas de antes en `_reference/e7/antes/`, de después en `_reference/e7/despues/`.

**Hecho (1.ª entrega):**
- **Logo (tarea 7 y grabado):** el monograma «iDO» de `logos/Logotipo minimalista de Iñigo Díez Osúa.png`, redibujado en SVG a partir de medidas del PNG (comparado superponiéndolo; [device/Monogram.tsx](../../src/device/Monogram.tsx)). Colores originales del PNG (medidos): azul `#4A78A6` y grafito `#252B34` (al principio se usó el acento del sitio `#4F75AD`; Iñigo pidió los originales y quedan igual de bien), degradado azul → grafito en el arco inferior como en el original. Sin el lema «Química · Ciencia de datos · IA» (regla de no encasillar en un sector). Va en:
  - `public/favicon.svg` (sobre fondo blanco redondeado) y `public/apple-touch-icon.png` (180 px);
  - `public/og.png` (1200 × 630: monograma, nombre completo, «Portfolio» y el dispositivo real), enlazada en las 21 páginas con `og:image` absoluta (`https://inigo-diez.github.io` + base) y `twitter:card`;
  - la trasera del dispositivo, en lugar de «○/».
  Las dos imágenes PNG las genera [scripts/brand.mjs](../../scripts/brand.mjs) a partir del favicon y del dispositivo de la home (con el servidor de vista previa abierto). Iñigo hará más cambios del logo; al cambiarlo, editar `Monogram.tsx` y `favicon.svg` y volver a ejecutar el script.
- **Rendimiento (pendiente de E5):** las ~70 tarjetas plegadas del lienzo llevan `content-visibility: hidden`, así que el navegador no maqueta su texto al empezar la transición. En la traza de la primera ida: maquetación forzada 22 → 16 ms, texto 12 → 7,5 ms, gestión de la pulsación 44 → 37 ms (por debajo de los 50 ms de una tarea larga). La animación sigue a 140–155 fps (objetivo del brief: 60). El «peor fotograma» de `measure-transition.mjs` varía mucho entre ejecuciones en este equipo (61–85 ms en frío), así que la comparación se hizo con trazas.
- **Lienzo (tarea 4, Iñigo eligió mantener el universo):** la etiqueta de la colección 01 ya no queda pegada a la barra superior (si el universo no cabe al 62 %, la vista inicial empieza desde arriba del área libre); la letra pequeña de las portadas sube a 12–13 px (número, estado, etiqueta de la cifra) y, para que quepa, el hueco de imagen baja de 150 a 120 px (las imágenes de portada serán ≈ 2,2 : 1). Se probó una rejilla compacta (70 % de zoom en 1440 × 900) y se descartó por parecer una rejilla de tarjetas.
- **Sonidos (tarea 6, Iñigo: sí, con interruptor):** botón «Sonido» junto a «Girar» en la home, apagado por defecto y recordado en el navegador. Clics sintetizados con la Web Audio API (sin archivos): un tic al moverse y un clic más grave al abrir, volver o ir al inicio, con cualquier entrada (teclado, anillo, rueda, tacto, teclas) y también en los dispositivos acoplados ([device/sound.ts](../../src/device/sound.ts)).
- **Comprobado:** typecheck, lint, build, `smoke.mjs`, `device-check.mjs` y `canvas-check.mjs` (34) sin errores; el sonido, contando osciladores en el navegador (0 apagado, 1 por pulsación encendido, se recuerda al recargar).

**Hecho (2.ª entrega, pedida por Iñigo tras la 1.ª):**
- **Menú sin vuelta:** la lista del dispositivo se para en la primera y en la última entrada (antes, de Sobre mí se saltaba a Mi música y al revés). `device-check.mjs` lo comprueba.
- **Nombre del dispositivo: «iDO Pocket»** (propuesta de Iñigo). La barra de estado de la pantalla muestra solo «iDO» (antes «Pocket OS»); la trasera lleva el monograma y debajo «POCKET», y la línea fina pasa a «Iñigo Díez Osúa · 2026» (sin «ID-01»). También en el nombre accesible del dispositivo y en el `alt` de la imagen OG.
- **Tipografía** (revisión que Iñigo pegó): en el lienzo, título de portada 15 → 18 px y cifra 28 → 34 px, metadatos a 12 px en gris; saludo de la home 21 → 30 px (24 px en móvil); en las páginas, 48 px antes de cada bloque y títulos largos repartidos en líneas equilibradas (`text-wrap: balance`, p. ej. Figuris). Se mantiene Geist.
- Comprobado: typecheck, lint, build, smoke, `device-check` y `canvas-check` sin errores; capturas `_reference/e7/tipo-*.png` y `trasera.png`.

**Hecho (3.ª entrega: revisión página por página, según la guía de cierre de E7 que pegó Iñigo):**
- **Revisión automática** de las 21 páginas en 390, 768, 1280 y 1440 px y en 720 × 450 (≈ 1440 × 900 con zoom del 200 %): sin desbordamiento horizontal y sin texto tapado por el dispositivo acoplado en ningún caso. Capturas en `_reference/e7/revision/`.
- **Áreas táctiles** (WCAG 2.2 AA, 24 px): los enlaces del pie, de Contacto, de la 404, de las fuentes, «← Volver a proyectos» y «Ver en GitHub ↗» medían 17–19 px. Ahora llevan una zona pulsable invisible (pseudoelemento absoluto) de 24 px o más; en las filas de Contacto y de la 404, la fila entera. Comprobado que la maquetación no cambia ni un píxel (posiciones de todos los elementos con y sin el cambio) y la zona efectiva con `elementFromPoint`.
- **Sonido solo cuando hay efecto** (AUD-01 de la auditoría): cada pantalla devuelve si la orden hizo algo; en el extremo de una lista, ATRÁS en el menú principal o INICIO ya en Proyectos no suena. Comprobado contando osciladores.
- **Comprobado sin cambios necesarios:** «Ver CV» y «Descargar PDF» se leen y distinguen en móvil sin el icono; la colección 01 del lienzo queda 37 px por debajo de la barra superior en 1024 × 768, 1280 × 680, 1440 × 900 y 1920 × 1080.
- **Detectado, sin tocar (contenido):** Trayectoria deja mucho blanco porque tiene dos entradas; en móvil, siete títulos de caso ocupan tres líneas (equilibradas) y en seis casos el último chip del stack queda solo en su línea (es el ajuste natural de la lista).

**Hecho (4.ª entrega: pasos 2–4 de la misma guía):**
- **Materiales (tarea 2):** capturas del frontal, la trasera, el acoplado y el móvil antes y después en `_reference/e7/materiales/`. En el frontal no se vio ningún defecto claro y no se ha tocado. En la trasera, el nombre «Iñigo Díez Osúa · 2026» medía ≈ 8 px en la home y casi no se leía: sube de 1,9 a 2,3 % del ancho (≈ 10 px), `POCKET` de 2,4 a 2,5 %, el grabado pasa de grafito al 50 al 58 % (los tres del mismo tono) y el barrido de luz de la trasera baja del 75 al 55 % (más volumen sin más brillo).
- **Tiempos (tarea 3):** girar, 900 → 750 ms. Al abrir un proyecto la cámara tardaba 600 ms y la última tarjeta 730–775 ms (5–6 tarjetas, 550 ms + 45 ms por tarjeta); ahora la cámara dura lo que el despliegue y terminan a la vez (medido: 843 ms Figuris, 786 ms coches, desde el clic). Se mantienen 730 ms de la pantalla al lienzo y 220 ms del sistema. **Movimiento reducido:** las tarjetas ya aparecían sin animación, pero la cámara seguía deslizándose 600 ms; ahora salta.
- **Detalles (tarea 5):** transición revisada con fotogramas congelados en los dos sentidos (`_reference/e7/transicion/`): el contorno gris se ha ido al final, el acoplado no salta entre el último fotograma y el estado final y no hay destello del cristal. Grabado: ver Materiales. Números de referencia: regla fijada en [design-system.md](../design/design-system.md#tipografía) (Geist Mono 400, `text-2`, 12–13 px, delante del título o arriba a la izquierda, uno por elemento; el número grande del hueco desaparece con la imagen).
- En la vista previa de Proyectos del dispositivo, 01–04 siguen en Geist 600 (9 px): Iñigo decidió dejarlos así y queda anotado como excepción a la regla.
- **Visto bueno visual de Iñigo (2026-10-23)** a los materiales y a la transición (capturas). Antes de cerrar E7 pide una pasada a mano de girar, abrir un proyecto y volver a la home en el navegador.
- Comprobado: typecheck, lint, build, smoke, `device-check` y `canvas-check` sin errores.

**Cerrada (2026-10-23):** Iñigo pidió pasar a E8 tras el visto bueno visual. No consta si hizo la pasada a mano de girar, abrir y volver. Lo de la tarea 1 que depende de contenido sigue con E6.
