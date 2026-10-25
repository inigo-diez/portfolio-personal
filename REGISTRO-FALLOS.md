# Registro de fallos — Portfolio personal 2026

Lecciones aprendidas de fallos reales **en este proyecto**. Claude apunta aquí cada fallo en el momento en que ocurre y avisa a Iñigo. El `CLAUDE.md` del proyecto importa esta nota, así que se carga en todas las sesiones que se abran en esta carpeta.

Cuenta como fallo: inventar o dar por cierto algo que no lo era; equivocarse de ruta, archivo, dato o cálculo; no seguir una instrucción de Iñigo o del `CLAUDE.md`; entregar algo que haya que rehacer o que él corrija.

La entrada más reciente va arriba. Formato de cada entrada:

```
## AAAA-MM-DD - Título corto
- Qué pasó:
- Por qué:
- Regla para no repetirlo:
```

## Entradas

Las tres primeras se apuntaron el 2026-10-21 y el 2026-10-23 en el registro del vault de Obsidian y se trasladaron aquí el 2026-10-23, sin cambiar su texto, al separar los registros por proyecto.

## 2026-10-25 - Dije que un enlace del CV «se rompería» sin comprobarlo
- Qué pasó: al cambiar el enlace «Visita mi portfolio» del CV, afirmé que el del certificado de LangChain (`/assets/certificates/...`) se rompería. Iñigo preguntó por qué. Al comprobarlo, hoy responde 200 con el PDF correcto; solo dejaría de funcionar cuando el portfolio antiguo deje de publicarse (E8). Además, tras dar por «publicado» el portfolio nuevo, el CV de la web seguía con el enlace antiguo porque mi cambio estaba solo en local.
- Por qué: deduje el efecto de la estructura de rutas del sitio nuevo sin hacer una petición al enlace, y presenté un riesgo futuro como un fallo actual.
- Regla para no repetirlo: antes de decir que un enlace o una URL falla, hago la petición (`curl -I`) y cuento lo que responde hoy; separo «falla ahora» de «fallará cuando cambie X». Y no doy por desplegado un cambio local: comparo con lo que sirve la web.

## 2026-10-25 - La rueda se veía a través de la trasera del dispositivo en el móvil
- Qué pasó: Iñigo, al ver la web en el móvil, avisó de que al girar el dispositivo «se queda el mando (la rueda)». En Safari/WebKit las flechas y el botón central de la rueda se ven espejadas a través de la cara trasera. Lo reproduje con WebKit de pruebas; en Edge no ocurre.
- Por qué: el giro (E2–E4) se comprobó solo en Chromium (Edge): todos los scripts de `scripts/dev/` usan `channel: 'msedge'`. WebKit no aplica `backface-visibility: hidden` a piezas con capa propia (un filtro, una transformación).
- Regla para no repetirlo: cualquier efecto 3D o de capas del dispositivo (giro, transiciones, sombras con filtro) se prueba también con WebKit (`webkit` de playwright-core, ya instalado) en tamaño de móvil, además de Edge; y no doy por verificado un efecto visual solo con Chromium.

## 2026-10-25 - Añadí Mis libros al menú y dejé una fila cortada en la pantalla inicial
- Qué pasó: al añadir la novena entrada del menú entregué Mis libros dando por bueno que pasaba `device-check`. Iñigo avisó de que, al girar hasta Mis libros, la pantalla inicial se cortaba. Con 9 entradas la lista de escritorio dejaba «Mi música» a medias (81–86 % visible) al abrir, y la fila de arriba a medias al llegar al final; en móvil quedaba un residuo por redondear alturas.
- Por qué: solo miré capturas de la pantalla del libro, no del menú ni de su última fila. Los comprobadores solo contaban entradas y no medían filas cortadas, y el CSS suponía 8 entradas («8 rows fit»).
- Regla para no repetirlo: si añado o quito una entrada de una lista del dispositivo, miro la captura de esa lista al abrir y al llegar al final, a 1280, 1366 y 1440 px y en móvil, y mido qué fracción de cada fila se ve (script de una sola vez). No doy por buena una pantalla por haber pasado `device-check`.

## 2026-10-24 - Rehice Habilidades con cápsulas cuando quería el diseño de su portfolio antiguo
- Qué pasó: Iñigo pidió revisar https://inigo-diez.github.io/, coger los logos oficiales y colocarlos en Habilidades. Solo leí las rutas de los logos y los metí en las cápsulas que ya había, con nombres de grupo propios («Análisis y ML», «Métodos»…), sin los iconos de los métodos, y además recorté el margen de cuatro logos. Respondió que lo quería como en su portfolio: tarjetas, los iconos de los métodos y los mismos títulos.
- Por qué: tomé «revisa mi portfolio» solo como fuente de los archivos, no como referencia de diseño, y no miré cómo se veía la sección antes de construir. Con una petición ambigua («los englobes en ese encapsulado blanco») elegí una lectura y la dije al final en vez de preguntar o enseñarle antes una captura de la sección antigua.
- Regla para no repetirlo: si Iñigo señala una página suya como referencia, abro su HTML/CSS y hago una captura de esa sección antes de tocar nada, y reproduzco estructura, textos y material tal cual; lo que no sepa reproducir o choque con el sistema de diseño, se lo pregunto antes.

## 2026-10-24 - Puse los enlaces donde decía «Sobre mí» en vez de donde estaban los títulos
- Qué pasó: Iñigo pidió «en Sobre mí, añade el link dentro del título Afi y del Grado en Química». Lo tomé al pie de la letra y enlacé dos frases del texto de Sobre mí, sin comprobar dónde aparecen esos títulos. Los títulos «Máster en Ciencia de Datos e Inteligencia Artificial» y «Grado en Química» están en Trayectoria y Formación, no en Sobre mí. Respondió «No, quiero que si pinchas en Grado en Química te redirija al link», tuve que preguntarle dónde y rehacerlo.
- Por qué: no busqué en el código dónde existían esas palabras exactas y la petición admitía dos lecturas (el texto de Sobre mí o los títulos de las secciones); elegí una sin preguntar.
- Regla para no repetirlo: si Iñigo nombra un texto («título X», «el botón Y»), busco primero con Grep dónde aparece esa cadena exacta; si no está en la página que nombra, o hay más de un sitio, pregunto antes de construir.

## 2026-10-24 - Fijé el umbral de la foto de Sobre mí a 1400 px suponiendo el ancho de su ventana
- Qué pasó: al poner la foto a la derecha del texto la activé solo desde 1400 px de ancho, deduciendo que su pantalla medía 1440 px por el tamaño de una captura (2880 × 1800). Iñigo dijo «aún no está en Sobre mí»: su ventana mide menos, y hubo que rehacerlo para que funcione desde 1220 px.
- Por qué: el tamaño en píxeles de una captura no es el ancho CSS de la ventana (depende de la escala de pantalla y de si el navegador está maximizado), y di por hecho el ancho en vez de pedírselo o diseñar para los anchos habituales de portátil (1280–1366).
- Regla para no repetirlo: no deduzco el ancho de la ventana de Iñigo; compruebo cada diseño de escritorio como mínimo a 1280 y 1366 px, y si algo solo funciona por encima de cierto ancho, se lo digo con ese número y le pido el suyo antes de darlo por entregado.

## 2026-10-23 - Usé git stash para un «antes» y devolví un archivo con trabajo sin commit al último commit
- Qué pasó: en E7, para comparar la maquetación antes y después de un cambio de CSS, ejecuté `git stash -- src/pages/page.css`. Eso no quitó solo mi cambio: devolvió el archivo entero a HEAD (sin el trabajo de E6 ni el de la sesión), así que la comparación medía otra cosa. Lo restauré con `git stash pop` y comprobé que el archivo estaba completo y el stash vacío; no se perdió nada, pero toqué trabajo de Iñigo sin commit y la medición no valía.
- Por qué: usé una orden de git para un fin de medición sin pensar que el archivo ya tenía cambios sin commit anteriores a la sesión.
- Regla para no repetirlo: para comparar antes y después, desactivar el cambio dentro de la página (estilo inyectado) o trabajar sobre una copia en el directorio temporal; nunca `git stash`, `checkout` ni `restore` sobre archivos con cambios sin commit, salvo que Iñigo lo pida.

## 2026-10-23 - Cambié el azul del logo de Iñigo sin preguntarle
- Qué pasó: al redibujar su monograma «iDO» en E7 sustituí su azul (`#4A78A6`, medido en su PNG) por el acento del sitio (`#4F75AD`) «por coherencia» y lo apliqué al favicon, la imagen OG y la trasera. Iñigo pidió mantener los colores originales.
- Por qué: traté su logo como un elemento más del sistema de diseño que podía ajustar, cuando era material suyo que solo había que reproducir.
- Regla para no repetirlo: el material que aporta Iñigo (logo, textos, imágenes) se reproduce tal cual. Si creo que un cambio mejora la coherencia, se lo propongo con una comparación y decide él antes de aplicarlo.

## 2026-10-23 - Escribí el caso de estudio piloto como una auditoría, no para recruiters
- Qué pasó: en el piloto de E6 (morosidad) metí en la página pública debilidades que encontré yo al revisar el notebook (un F1 de referencia calculado por mí que rebajaba el titular, el modelo ajustado que «marca a casi todos») y un resumen centrado en el coste de las falsas alarmas. Iñigo pidió corregirlo: «lo leerán recruiters, me tienes que vender lo mejor posible».
- Por qué: confundí rigor con autocrítica pública. El CLAUDE.md fija la audiencia (recruiters) y la skill `trabajo-profesional` pide conclusión primero; aun así, redacté como revisor del proyecto.
- Regla para no repetirlo: en los textos públicos, primero lo que Iñigo consiguió, con cifras verificadas y sin inflar nada. Limitaciones, solo las que él documentó. Lo que encuentre yo auditando va a `todo` del proyecto (lista interna de antes de E8) y se le comenta a él, nunca directamente a la página.

## 2026-10-23 - Convertí «recopila información sobre mí» en un informe de diseño
- Qué pasó: Iñigo pidió «recopila información sobre mí para rehacer mi logo personal». Le entregué la marca actual, las alternativas de E2, las restricciones de diseño, las consecuencias de cambiarla y dos preguntas, y apenas sus datos personales. Me corrigió: «solo quiero que me pongas por aquí la información sobre mí que hay en esta carpeta, solo eso».
- Por qué: tomé el propósito («para rehacer mi logo») como el encargo y amplié el alcance a todo lo que afecta al logo, en vez de ceñirme al objeto pedido (información sobre él).
- Regla para no repetirlo: el objeto de la petición manda sobre su finalidad. Si pide «información sobre mí», entrego solo datos suyos con su fuente; el contexto de diseño o las preguntas, solo si los pide.

## 2026-10-23 - Construí E5 entera sin enseñarle antes cómo iba a ser el lienzo
- Qué pasó: en E5 le pregunté por cuatro decisiones (proyectos, móvil, abrir un proyecto, commit), pero no por la forma del lienzo. Diseñé por mi cuenta pilas recogidas que se despliegan de una en una, lo construí todo y se lo entregué. No era lo que quería: quiere todos los proyectos a la vista en un espacio que se recorre, con imagen, y que al pinchar uno se despliegue en tarjetas con lo destacado y el README. Además tardé mucho y se impacientó.
- Por qué: di por bueno que «pila que se despliega» (mapa de E1) definía la interacción y no le mostré nada visual hasta el final. Era una decisión de diseño grande que cambiaba lo que él ya conocía del lienzo.
- Regla para no repetirlo: antes de construir una interacción o composición nueva, enseñarle una captura o un prototipo rápido (unos minutos) y esperar su visto bueno. Y en bloques largos, entregar por partes y avisar de cuánto queda.

## 2026-10-23 - Leí una sola skill cuando me pidió abrir las skills
- Qué pasó: en el proyecto del portfolio, Iñigo pidió abrir el CLAUDE.md y las skills del vault y de la carpeta global «ya que he actualizado varios puntos». Leí el CLAUDE.md global y solo una skill (`trabajo-profesional`), descarté las demás por no encajar con el proyecto y dije que no veía cambios. Me tuvo que pedir «lee todas por si acaso».
- Por qué: decidí por mi cuenta qué era relevante antes de leerlo, cuando lo que quería era que revisara qué había cambiado. La relevancia para el proyecto se juzga después de leer.
- Regla para no repetirlo: si me pide abrir o leer un conjunto de archivos, los leo todos antes de opinar. Para saber qué ha cambiado, comparo fechas de modificación (`find -mtime` o `ls -la`) en vez de suponer que no hay novedades.

## 2026-10-21 - Dije que el repo no tenía remoto sin comprobarlo
- Qué pasó: tras el primer commit del portfolio afirmé que el repositorio no tenía ningún remoto y di los pasos para añadir `origin`. Ya existía desde el 2026-10-19 con la URL correcta. Iñigo llegó a abrir el diálogo «Add Remote» en Fork, con datos erróneos rellenados.
- Por qué: lo deduje de que el resumen de git del inicio de sesión no mencionaba remotos, sin ejecutar `git remote -v`.
- Regla para no repetirlo: antes de dar instrucciones sobre remotos, ramas o configuración de git, ejecutar el comando que lo muestra (`git remote -v`, `git branch -vv`, `git config --get …`) y basarme en su salida.

## 2026-10-21 - Amplié un cambio de diseño que no se había pedido
- Qué pasó: en el portfolio, Iñigo pidió quitar las teclas ATRÁS e INICIO del dispositivo Slate (y quizá centrar el anillo). Le propuse además agrandar el anillo y cambiar lo que hace ⏮ en «Sonando». Me corrigió: «eliminar esto, no otra cosa».
- Por qué: convertí un cambio concreto en un rediseño, resolviendo de antemano consecuencias que él no había planteado.
- Regla para no repetirlo: hacer exactamente el cambio pedido. Si tiene una consecuencia (p. ej. una función que se queda sin control), señalarla en una línea sin proponer cambios añadidos, y que decida él.
