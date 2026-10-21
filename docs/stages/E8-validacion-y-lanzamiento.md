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
