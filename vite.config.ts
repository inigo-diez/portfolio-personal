import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The ONLY place where the public base path is defined.
// Project site while in development: '/portfolio-personal/'. When it replaces the root site (E8): '/'.
// The app reads it through import.meta.env.BASE_URL and the prerender script reads it from the SSR bundle.
const BASE = '/portfolio-personal/';

export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: { target: 'es2022' },
});
