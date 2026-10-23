# Plan de trabajo

Estado: ✅ hecho · 🔄 en curso · ⏸ pendiente de aprobación · ⬜ por hacer

Cada etapa tiene su ficha en [stages/](stages/), con tareas, entregables y punto de aprobación. Para empezar una, basta con decir **"Empieza E1"**, **"Empieza E2"**…

| Etapa | Qué | Estado | Aprobación |
|---|---|---|---|
| [E0](stages/E0-preparacion.md) | Preparación | ✅ (faltan 2 tareas de Iñigo) | — |
| [E1](stages/E1-inventario-contenido.md) | Inventario de contenido → [audit/](audit/), mapa final en [project-map.md](audit/project-map.md) | ✅ aprobado 2026-10-19 | — |
| [E2](stages/E2-direccion-artistica.md) | Dirección artística → [prototypes/E2/](../prototypes/E2/), [design/](design/) | ✅ aprobado 2026-10-20 (v3) | — |
| [E3](stages/E3-base-y-prueba-transicion.md) | Proyecto base + prueba de la transición → [design/transition.md](design/transition.md) | ✅ aprobado 2026-10-21 (la transición puede revisarse más adelante, con el proyecto más completo) | — |
| [E4](stages/E4-pocket-os.md) | Pocket OS funcional (+ móvil) | ✅ aprobado 2026-10-23 (con el cambio de las secciones como página) | — |
| [E5](stages/E5-infinite-canvas.md) | Infinite Canvas + transición definitiva | 🔄 empezada 2026-10-23 | Navegación sin perderse |
| [E6](stages/E6-contenido-real.md) | Contenido real y casos de estudio | ⬜ | Textos aprobados |
| [E7](stages/E7-pulido.md) | Pulido y detalles distintivos | ⬜ | Visto bueno visual |
| [E8](stages/E8-validacion-y-lanzamiento.md) | Validación y lanzamiento a la raíz | ⬜ | Web publicada |

Correspondencia con las 6 fases del brief original: E1+E2 = Fase 1 · E3 = nueva (riesgo técnico) · E4 = Fase 2 · E5 = Fase 3 · E6 = Fase 4 · E7 = Fase 5 · E8 = Fase 6.

---

## Pendiente de Iñigo

- [ ] `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` en PowerShell (solo si quieres usar npm desde PowerShell; desde Bash ya funciona)
- [x] Primer commit + push (2026-10-21: `452bc9a` en `origin/main`). Este repo firma con «Iñigo Díez Osúa <idiezosua@gmail.com>» (config local) y su remoto lleva el usuario `inigo-diez@` para usar la cuenta personal; el resto de repos sigue con el correo de Afi.
- [ ] Cuando quieras publicar la versión de prueba: Settings → Pages → Source «GitHub Actions» y lanzar el workflow `Deploy to GitHub Pages` (manual) desde Actions
- [x] CV en `materials/cv/`
- [ ] Responder a [audit/missing.md](audit/missing.md) (datos y cifras por confirmar)
- [ ] (Recomendado) Borrar del repo antiguo `assets/resume/Varad_Bhogayata_Resume.pdf`, que es el CV de otra persona

## Decisiones abiertas

- **E4 · pendiente de aprobación (2026-10-21; cambio del 2026-10-23).** Qué hay, cómo probarlo y mediciones: [stages/E4-pocket-os.md](stages/E4-pocket-os.md#estado-2026-10-21). Para probar: `npm run dev` y abrir http://localhost:5173/portfolio-personal/; Mi música con datos de prueba: añadir `?musica=prueba` (se queda para la sesión; `?musica=no` lo quita). Puntos que conviene que veas (no he cambiado nada de lo acordado por ellos):
  - ⏮ y ⏭ en «Sonando» **cargan** la pista, como se acordó: si sonaba música, la nueva queda en pausa hasta pulsar el centro.
  - ATRÁS desde «Sonando» descarga el reproductor y la música se para al volver a la lista, no solo al salir de Mi música: en la lista no hay ningún control visible del reproductor.
  - En móvil, arrastrar el dedo sobre la pantalla del dispositivo mueve la selección, así que no desplaza la página si el gesto empieza ahí.
  - Al empezar la transición al lienzo, el reflejo del suelo desaparece de golpe (no puede viajar con el cuerpo hasta la esquina).
  - **(Nuevo, 2026-10-23)** Sobre mí, Trayectoria, Habilidades, Formación y Contacto se abren como su página: la pantalla crece y el dispositivo queda acoplado (abajo a la izquierda en escritorio, arriba de la página en móvil). CV y Mi música siguen dentro. Conviene que lo veas en tu portátil y en el móvil: `?musica=prueba` para Mi música.
  - En el acoplado de las páginas, las áreas táctiles de 44 px de ATRÁS e INICIO se solapan por su tamaño (como en el lienzo): pulsar ATRÁS puede activar INICIO, pero las dos llevan a la home.
  - Tras la transición, el foco del teclado queda en el dispositivo acoplado, como en el lienzo: ↑ ↓ mueven su lista y Esc vuelve. Para desplazar la página con flechas hay que salir de él (Tab o clic en la página).
  - El dispositivo acoplado en el lienzo no tiene menú, así que «Mi música desde el dock» (decidido el 2026-10-20) aún no se puede alcanzar: queda para E5.
  - Portadas de Mi música: hueco con una nota musical hasta tener tus canciones.

- **E3 · cerrada (aprobada el 2026-10-21).** Contexto original: visto bueno visual (vídeo y tira de fotogramas en `_reference/e3/`, explicación en [design/transition.md](design/transition.md)). Iñigo aprobó la técnica y pidió un único ajuste: un contorno gris fino alrededor de la pantalla mientras crece, que se desvanezca antes del final, con los mismos 730 ms y el mismo recorrido del cuerpo. **Hecho el 2026-10-20; falta que lo vea en la grabación.** Si lo da por bueno, E3 queda cerrada. Para probarla: `npm run dev` y abrir http://localhost:5173/portfolio-personal/ (con `?medir`, panel de fps; con `?tecnica=vt`, la alternativa). Decisiones técnicas de E3, **aprobadas el 2026-10-20**:
  - CSS con tokens (sin Tailwind): el dispositivo ya estaba hecho en CSS y así no hay que traducirlo.
  - Sin Motion por ahora: la transición usa la Web Animations API del navegador (0 KB). Se reconsidera en E4 y E5.
  - Router propio mínimo (sin react-router): la URL alimenta la misma máquina de estados que el dispositivo, así que el botón atrás del navegador ejecuta la misma transición.
  - URLs con barra final (`/proyectos/figuris/`): cada ruta es una carpeta con su `index.html`, que es lo que GitHub Pages sirve sin redirecciones.
  - Comprobaciones aplazadas: el primer fotograma en frío (48 ms) pasa a E4 y el lienzo en móvil, a E5. **E4 (2026-10-21):** medido junto a E3 en las mismas condiciones, sigue en 36–48 ms en las dos versiones; no se ha montado el lienzo por adelantado (ver [design/transition.md](design/transition.md#pendiente-para-e5)).
  - (Hecho en E4) El dispositivo de E3 estaba simplificado: menú con vista previa, lista de Proyectos en el lienzo, anillo (giro, ejes, rueda del ratón), teclas y teclado. El resto de entradas del menú abren su página convencional. Girar, inclinación, reflejo y botón lateral vuelven en E4. «Mi música» aparece en el menú, desactivada.

- **«Mi música»: propuesta v3 implementada en E4 (se aprueba con E4)** → [prototypes/musica/propuesta.html](../prototypes/musica/propuesta.html). Requisitos acordados (2026-10-20): sección personal **al final del menú (8.ª, después de CV)**; vista previa con portada, artista y pista seleccionada; canciones elegidas por Iñigo (las irá añadiendo al final), con una frase suya cada una y el reproductor oficial de Spotify; sin reproducción automática; si Spotify no carga, se mantienen el título y el enlace directo; entrada de auriculares discreta en el canto superior; los auriculares solo aparecen dentro de Mi música; «Sonando» sin controles de reproducción propios.
  - Decidido 2026-10-20:
    - La música se para al salir de Mi música; nunca sigue sonando sin un control visible.
    - El botón central en «Sonando» se prueba en E4 y solo reproduce o pausa si la API de Spotify es fiable. Hasta entonces, la reproducción queda en el reproductor oficial.
    - Ruta `/mi-musica`. Arriba solo una selección de enlaces, no las 8 entradas; las 8 están en el menú del dispositivo y en la lista móvil.
    - La entrada del canto superior se mantiene.
    - Enlaces de arriba aprobados: Proyectos · Sobre mí · Contacto · CV · GitHub ↗ · Mi música (se implementan al final). Trayectoria, Habilidades y Formación, desde el dispositivo, la lista móvil y el pie de las páginas interiores.
    - Filas del menú: 6,6 en escritorio. En móvil no bajan: el menú se desplaza y la lista de enlaces tiene áreas táctiles amplias.
    - Desde el dispositivo acoplado en el lienzo, Mi música vuelve a la home con la transición inversa y allí se conectan los auriculares.
  - Decidido 2026-10-21 (sustituye lo del botón central de arriba). **Comprobado en E4:** con el centro la posición avanza, se para y sigue; ⏮ ⏭ cargan la pista correcta, también si se pulsan antes de que cargue el reproductor; en 8 alternancias seguidas los controles no se desactivaron nunca:
    - El dispositivo controla el reproductor oficial de Spotify con su iFrame API: el centro reproduce o pausa, ⏮ y ⏭ cargan la canción anterior o siguiente, y «Sonando» muestra la posición real (evento `playback_update`). El reproductor oficial sigue visible. Si la API no responde, los controles del dispositivo se desactivan y queda el reproductor con su enlace.
    - Sin control de volumen: la iFrame API no lo ofrece. + y − no cambian el volumen.
    - Límites asumidos: sin sesión de Spotify en el navegador, el visitante oye 30 s por canción; se carga el script de Spotify en la página. En E8, revisar el aviso de cookies de terceros.
    - Sin Web API de Spotify (exigiría una clave secreta, que en una web estática quedaría expuesta).
- **Dispositivo, decidido 2026-10-21:** se mantienen ATRÁS e INICIO y el anillo a la izquierda. Se valoró quitar las teclas y centrar el anillo, y también una consola tipo PSP; se descartaron (ATRÁS es la única forma visible de volver desde «Sonando» en móvil, y el anillo centrado acerca el diseño al iPod).
  - Por aprobar:
    1. [x] **Auriculares v3** (aprobados 2026-10-21, con la cara en cúpula) (más realistas): volumen, cara acústica inclinada y sombra de contacto. Cable blanco, redondo y liso como en la foto de referencia de Iñigo (2026-10-20), con clavija y uniones blancas cilíndricas; sin mando ni letras. A la derecha en escritorio y debajo en móvil (cable por detrás del aparato). 2026-10-21: a petición de Iñigo, la parte que va en la oreja deja de ser plana: borde redondeado iluminado arriba a la izquierda, cara en cúpula que sobresale y se oscurece hacia el borde, y tapa central hundida con una ranura grabada (sin perforaciones, por la prohibición de rejillas).
    - Ejes de la rueda: **C, los símbolos de la foto (+ − ⏮ ⏭)**, elegidos por Iñigo y aplicados al dispositivo. El anillo sigue plateado. Comparación en [prototypes/E2/ejes.html](../prototypes/E2/ejes.html).
    - En «Sonando», ⏮ y ⏭ = pista anterior y siguiente (decidido 2026-10-20); + y − también pasan de pista; ATRÁS o Esc vuelven a la lista. Ningún eje controla el volumen. Los símbolos van en grafito suave `#5E636A`, como los iconos de las teclas.
  - Idea opcional (no hecha): cambio de color plata ↔ negro desde un menú "Ajustes". Ahora sería una 9.ª entrada.
  - Capturas de los prototipos: `scripts/dev/shot.ps1` (salen en `_reference/shots/`; para la propuesta, `-Dir prototypes/musica`). Pruebas del modelo de entrada: `prototypes/E2/_selftest.html` (30 comprobaciones).
- **Para E6 (contenido):** Trayectoria (= "Experiencia" de la web antigua: Grado + TFG) y Formación (Máster, Grado y 7 cursos) repiten el Grado, igual que en la web antigua. Decidir si Trayectoria se queda solo con el TFG o se reorienta cuando haya experiencia profesional.
- Foto personal, formulario de contacto (Formspree), enlazar PDFs de certificados → ver audit/missing.md (no bloquean)

## Decisiones tomadas

- 2026-10-23 · **E4 aprobada** (Iñigo: «Vale, pasamos a la E5», tras el cambio de las secciones como página). Siguiente: E5.

- 2026-10-23 · **Secciones como página (cambio de E4 antes de aprobarla).** Iñigo vio la información demasiado pequeña dentro del dispositivo. Elegido: la pantalla crece hasta la página real de Sobre mí, Trayectoria, Habilidades, Formación y Contacto, con el dispositivo acoplado (no el lienzo infinito, que sigue siendo solo para Proyectos); **CV y Mi música, dentro del dispositivo**; letra mínima en el dispositivo de la home. Se hace en E4, antes de aprobarla; luego, E5.

- 2026-10-21 · **E4 hecha, pendiente de aprobación.** Sin Motion también en E4: las transiciones internas del sistema son CSS (220 ms) y la de la pantalla al lienzo sigue con la Web Animations API. Se vuelve a valorar en E5.

- 2026-10-21 · **E3 aprobada.** Iñigo prefiere ver el proyecto más completo antes de volver a la transición: queda abierta a ajustes en E5 (transición definitiva) o E7 (pulido). Siguiente: E4, en una conversación nueva.

- 2026-10-20 · **E3 hecha, pendiente de aprobación.** Proyecto Vite 8 + React 19 + TypeScript; 11 páginas prerenderizadas (home, lienzo, 3 casos de estudio en borrador, 5 secciones, 404) con título, descripción, Open Graph y `noindex` mientras la base sea `/portfolio-personal/`. Contenido tipado en `src/content` con fuentes; 3 proyectos en borrador: `analisis-metabolomico-gcms`, `estres-petroleo-gdelt` y `figuris` (en curso). CV publicado como `public/cv.pdf`. Favicon provisional con la marca «○/» (el definitivo, en E7).

- 2026-10-20 · **E2 cerrada: v3 aprobada como dirección visual.** Marca de la trasera **"○/"** (remite al anillo sin recuperar el punto sólido). Se mantiene la tecla **ATRÁS** (hace más evidente cómo volver y equilibra el frontal). El menú se abre con **Proyectos** seleccionado aunque no sea la primera entrada. **«Mi música»** y la **entrada de auriculares** quedan como requisitos acordados para la siguiente implementación; no cambian la elección de Slate.
- 2026-10-20 · **E2 v2 aprobada con cambios → v3.** Aprobado: silueta **Slate** (Wheel descartado), dispositivo acoplado en la esquina del lienzo como base de la transición, dirección **"blanco tecnológico"** (fondo `#FFFFFF`, sin verde menta, monoespaciada solo en números de referencia; CLAUDE.md actualizado) e inclinación leve hacia el ratón en la home. Cambios pedidos por Iñigo y ya hechos:
  - Slate pasa de 100 × 114 a **100 × 124**, con la misma anchura y pantalla 4:3; la altura extra va a la zona de controles.
  - El anillo se rellena **con los 4 ejes como en el vídeo** y un **círculo central** bien marcado.
  - **Menú de 7 entradas, las de la web antigua y en su orden:** Sobre mí, Trayectoria, Proyectos, Habilidades, Formación, Contacto, CV.
  - **Siempre el nombre completo "Iñigo Díez Osúa"** (saludo, títulos, grabado). Serie `POCKET OS / ID-01` en la trasera.

- 2026-10-19 · **E2 v2: "más blanco y más tecnológico", sin rasgos típicos de IA.** Referencia principal: el vídeo de `materials/video_ejemplo/` (ver MOODBOARD). Se rehacen los tres prototipos: dispositivo de aluminio de una pieza con cristal a ras, reflejo, inclinación y trasera grabada; home con solo saludo, dispositivo y un botón; lienzo blanco sin rejilla. Fuera: tornillos, rejilla de altavoz, LED, rejilla de puntos, marcos discontinuos y monoespaciada generalizada.
- 2026-10-19 · **Idioma: solo español.** Se mantienen los textos en ficheros de contenido por si algún día se añade otro idioma, pero no se planifica.
- 2026-10-19 · **Aparecen los 13 proyectos de la web antigua con sus 4 agrupaciones originales, y las 4 son destacadas** (pilas en el canvas). Ver [audit/project-map.md](audit/project-map.md).
- 2026-10-19 · Las cifras sin respaldo se corrigen; la cifra destacada de cada tarjeta es el dato verificado más atractivo.
- 2026-10-19 · **Los gráficos se rehacen** con la paleta del sitio (1 por proyecto, en E6).
- 2026-10-19 · La sección "Experience" se llama **"Trayectoria"**.
- 2026-10-19 · El GC-MS Compound Profiler **no aparece** en la web.
- 2026-10-19 · Figuris: cifra principal **"0 citas inventadas llegaron al lector"** (verificada).
- 2026-10-19 · Repo nuevo `portfolio-personal`; el antiguo no se toca y se renombrará a `portfolio-v1` en E8.
- 2026-10-19 · Stack: React + TS + Vite, desplegado en GitHub Pages.
- 2026-10-19 · Brief v2: rutas reales prerenderizadas, prueba de la transición en E3 y móvil desde E4.

## Placeholders de contenido pendientes

Cifras retiradas o sin confirmar (no se publican hasta que Iñigo las confirme):
- `priorizacion-metabolitos`: ¿orientado a alguna patología concreta (la web antigua decía esquizofrenia)?
- `optimizacion-ml-vs-rsm`: ¿x₁ = tiempo de extracción?
- `simulacion-wti-montecarlo`: ¿4 tipos de agentes (tendencial, contrarian, hedger, especulador)?
- `morosidad-crediticia`: ¿se usó SMOTE?
- Años del Grado en Química y del TFG; alcance del TFG (¿toda la serie de metabolómica?)
- Año de cada proyecto (campo `year` en `src/content/projects/`, ahora `null` en los 3 borradores)
- Fecha del curso Machine Learning Specialization (sin fecha en la web antigua)
- **Mi música** (no se publica hasta tenerlo): las canciones que elija Iñigo (las añade al final de la lista), cada una con enlace de Spotify a la pista, título, artista y una frase personal (≤ 140 caracteres); frase de entrada opcional.
