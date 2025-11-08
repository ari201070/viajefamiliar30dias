import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config mínimo y seguro para despliegue en Vercel:
 * - export default defineConfig(...) -> Vite espera una exportación ESM que retorne un objeto.
 * - base './' -> evita URLs absolutas en producción (útil en entornos embebidos).
 * - plugin react -> soporte JSX/TSX.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    // opcional: host: true si necesitás acceso desde otra máquina
  },
  build: {
    outDir: 'dist',
    // Opciones adicionales de build si las necesitás:
    // target: 'es2018',
    // minify: 'esbuild'
  },
});
