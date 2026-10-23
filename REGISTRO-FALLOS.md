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
