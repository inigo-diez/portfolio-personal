# E3 — Proyecto base + prueba de la transición

**Objetivo:** montar el proyecto real y demostrar que la transformación pantalla → canvas → pantalla funciona y se siente bien, antes de invertir en pulir.

## Tareas
1. Scaffold: Vite + React + TypeScript, estilos (Tailwind o CSS con tokens), Motion, ESLint/Prettier.
2. Estructura de `src/` según `CLAUDE.md`, con los tokens de E2.
3. `base` de Vite en un único sitio (`/portfolio-personal/`).
4. Rutas reales + script de prerender por ruta + `404.html`.
5. Modelo de contenido tipado (`src/content/`) con 2–3 proyectos reales en borrador.
6. Workflow de GitHub Actions para Pages (lo activa Iñigo).
7. **Prueba de la transición:** dispositivo simplificado (caja + pantalla), canvas con tarjetas reales mínimas, ida y vuelta, botón atrás del navegador y versión con movimiento reducido.
8. Medir fps de la transición y el peso del bundle.

## Entregables
- Proyecto que arranca con `npm run dev` y compila con `npm run build`.
- Vídeo o GIF y explicación de la técnica elegida (FLIP, View Transitions API o layout animation de Motion), con sus pros y contras.

## Estado (2026-10-20)
Hecho y pendiente de aprobación. Técnica, mediciones y pendientes: [design/transition.md](../design/transition.md). Comprobaciones: `node scripts/dev/smoke.mjs` (todas las rutas sin errores, escritorio y móvil) y `node scripts/dev/measure-transition.mjs` (fps, estado final, vídeo y tira), ambas con `npm run build` y `npx vite preview --port 4173` en marcha.

## ⏸ Aprobación
La transición se siente física y continua y la técnica es sólida. Si no lo es, se ajusta la silueta antes de E4.

## Para arrancar
> "Empieza E3"
