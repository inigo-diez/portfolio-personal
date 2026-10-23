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
