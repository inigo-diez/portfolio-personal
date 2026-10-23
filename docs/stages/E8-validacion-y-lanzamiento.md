# E8 — Validación y lanzamiento

**Objetivo:** publicarlo con garantías y pasarlo a la URL principal.

## Pruebas
- Navegadores: Chrome, Firefox, Safari (si hay acceso) y Edge.
- Móvil real: iOS y Android si es posible, además del emulador.
- Solo teclado, lector de pantalla (NVDA) y movimiento reducido.
- URLs directas y refresco en cada ruta.
- Enlaces externos y CV.
- Rendimiento según el presupuesto del brief §15 (LCP, CLS, peso JS, fps).
- SEO: títulos, descripciones, OG, sitemap y robots.

## Lanzamiento (lo ejecuta Iñigo, con guía paso a paso)
1. Etiqueta de seguridad en el repo antiguo.
2. Renombrar `inigo-diez.github.io` → `portfolio-v1`.
3. Renombrar `portfolio-personal` → `inigo-diez.github.io`.
4. Cambiar `base` a `/`, quitar `noindex` y volver a desplegar.
5. Verificar la web en `https://inigo-diez.github.io/` y en `/portfolio-v1/`.

## ⏸ Aprobación final
Web publicada en la raíz y funcionando.

## Para arrancar
> "Empieza E8"

## Estado (2026-10-23)
En curso. Iñigo pidió E8 «y los cambios finales» tras el visto bueno visual de E7.

**Hecho (1.ª entrega, sin commit):**
- **SEO:** cada página lleva `canonical` y `og:url` con la base actual (la 404, no); `scripts/prerender.mjs` genera `sitemap.xml` (20 URL) y `robots.txt`. Con la base de pruebas siguen `noindex` y las URL `/portfolio-personal/`; al cambiar `base` a `/` todo pasa a la raíz sin tocar nada más.
- **Validación automática:** nuevo [scripts/dev/site-check.mjs](../../scripts/dev/site-check.mjs): las 20 páginas y la 404 cargadas directamente (como un refresco o un enlace compartido), su cabecera, un solo `h1` visible, imágenes con `alt`, errores de consola, enlaces y recursos internos, sitemap y robots. Todo ok.
- **Rendimiento (brief §15):** JS inicial 103 KB gzip (≤ 150). Móvil medio emulado (CPU ×4, red 1,6 Mbit/s, 150 ms, caché vacía): LCP 0,64–1,29 s (< 2,5 s) y CLS 0 en home, lienzo, morosidad y Sobre mí. Emulado en este equipo con el servidor local, no en un móvil real ni en GitHub Pages. El código del lienzo va en el paquete inicial (el brief pide cargarlo bajo demanda); el presupuesto se cumple igualmente.
- **Accesibilidad (axe-core 4.10, WCAG 2.2 A/AA + buenas prácticas, 11 páginas, escritorio y móvil):** corregido:
  - Los bloques de código del README se pueden desplazar con el teclado (`tabindex="0"`).
  - Los títulos del README pasan a `h5`/`h6`, bajo el `h4` «README»: antes metían un segundo `h1` en el lienzo al abrir un proyecto. Se ven igual.
  - Una cabecera de tabla vacía pasa a celda.
  - El dispositivo acoplado y la barra del lienzo están en zonas `aside` con nombre.
  
  Queda abierto: el contraste de los proyectos atenuados cuando hay uno abierto (decisión de Iñigo, ver PLAN.md). En la lista móvil de proyectos, axe-core no reconoce el enlace «saltar al contenido» como tal (buena práctica, no WCAG).
- **Seguridad:** `security-review` sin hallazgos de confianza alta. Después, por la auditoría que pegó Iñigo:
  - **SEC-01:** el HTML de los README pasa por una lista de etiquetas, atributos y protocolos permitidos (`scripts/readmes.mjs`). Salida idéntica byte a byte a la anterior, y probada con entradas maliciosas.
  - **SEC-02:** el workflow da permisos por trabajo; solo el despliegue escribe en Pages. Sin probar hasta que Iñigo lo ejecute.
  - **SEC-03:** `?musica=prueba` solo funciona con el servidor de desarrollo; los datos de prueba no llegan a la build.
- Pasan typecheck, lint, build, smoke, `site-check`, `device-check` y `canvas-check` (el paso de Mi música, con el servidor de desarrollo).

**No hecho (necesita a Iñigo):**
- Navegadores reales (Firefox, Safari), móviles reales, NVDA.
- Enlaces externos: 14 repos de GitHub, LinkedIn y correo. No los he abierto, por la regla de no conectarme a su GitHub.
- Fijar las acciones del workflow a un SHA: requiere consultar GitHub.

## Guía de lanzamiento (la ejecuta Iñigo; Claude no hace push ni toca GitHub)
0. **Versión a publicar en un commit.** Todo lo de E6–E8 está sin commit; el workflow publica lo que hay en GitHub, no lo de tu disco. Pide el commit local y haz tú el push.
1. **Etiqueta de seguridad en el repo antiguo:** en GitHub, `inigo-diez.github.io` → Releases → «Draft a new release» → etiqueta `v1-final` sobre `main`.
2. **Renombrar `inigo-diez.github.io` → `portfolio-v1`** (Settings → General → Repository name). ⚠ En la copia local del 2026-10-19 el sitio antiguo enlaza sus imágenes y estilos con rutas desde la raíz (`/assets/…`, 51 veces). Servido en `/portfolio-v1/` saldría sin imágenes ni estilos, porque `/assets/…` apuntará a la web nueva. Decide antes: dejarlo solo como repositorio archivado (Pages desactivado) o corregir sus rutas tú (Claude no modifica el repo antiguo).
3. **Renombrar `portfolio-personal` → `inigo-diez.github.io`.** En local: `git remote set-url origin https://inigo-diez@github.com/inigo-diez/inigo-diez.github.io.git` (GitHub redirige el nombre antiguo, pero así queda limpio).
4. **Base a la raíz:** en `vite.config.ts`, `const BASE = '/'`. Después `npm run build`, `npx vite preview --port 4173` y `node scripts/dev/site-check.mjs http://localhost:4173/` (comprueba que desaparece `noindex` y que `canonical` y `sitemap` apuntan a `https://inigo-diez.github.io/`). Commit, push, Settings → Pages → Source «GitHub Actions» en el repo renombrado y lanzar «Deploy to GitHub Pages» desde Actions.
5. **Verificar en `https://inigo-diez.github.io/`:** refrescar varias rutas, una URL inexistente (404), CV, imagen al compartir un enlace (OG), y `/portfolio-v1/` según lo decidido en el paso 2.
