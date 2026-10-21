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
