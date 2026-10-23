---
proyecto: Portfolio personal 2026
carpetas:
  - C:\Users\usuario\Documents\Portfolio_Personal_2026
---

# Pendientes y progreso — Portfolio personal 2026

Estado entre sesiones de este proyecto. Lo lee `inicio-sesion` al empezar y lo actualiza `cierre-sesion` al terminar. El estado de las etapas, las decisiones abiertas y el contenido pendiente (`TODO(content)`) están en [docs/PLAN.md](docs/PLAN.md): aquí solo se apunta el registro de sesiones y los pendientes con fecha, sin copiar lo que ya está allí. Los fallos van en [REGISTRO-FALLOS.md](REGISTRO-FALLOS.md).

## Fechas próximas

No hay fechas registradas para este proyecto.

## Pendiente

- [ ] Elegir las canciones de Mi música: Iñigo lo deja para el final, cuando haya una versión casi completa del proyecto y pueda ver el conjunto antes de decidir qué cambiar. *Anotado el 2026-10-23.*

## Registro de sesiones

### 2026-10-23
- **Hecho:** retomado el proyecto: E4 figura como hecha el 2026-10-21 y pendiente de aprobación, con todo su código sin commit (según `git status` de esta sesión). Iñigo decidió que el estado entre sesiones y el registro de fallos se dividan por proyecto (carpeta), no en el vault de Obsidian. Regla única para todos los proyectos: `PENDIENTES.md` y `REGISTRO-FALLOS.md` en la raíz de cada carpeta de proyecto. Creados los dos de este proyecto, actualizado su `CLAUDE.md`, reescrito el hook de inicio para que cargue el `PENDIENTES.md` de la carpeta, y quitado del `CLAUDE.md` global el import del registro del vault.
- **Hecho (2.º bloque):** cambio de E4 pedido por Iñigo porque la información se veía demasiado pequeña dentro del dispositivo. Sobre mí, Trayectoria, Habilidades, Formación y Contacto se abren ahora como su página, con la transición de la pantalla y el dispositivo acoplado; CV y Mi música siguen dentro, y el dispositivo de la home tiene letra mínima. Pasan typecheck, lint, build, smoke, `device-check.mjs` (actualizado) y `measure-transition.mjs` (sin empeoramiento del lienzo). `code-review` dio 9 hallazgos y se corrigieron los 5 del cambio. Actualizados PLAN.md, la ficha de E4, device-spec.md, transition.md y CLAUDE.md. Sin commit.
- **Nuevos pendientes:** el de las canciones de Mi música (el de aprobar E4 se cerró en el 3.er bloque).
- **Hecho (3.er bloque):** E4 aprobada por Iñigo; empieza E5.
