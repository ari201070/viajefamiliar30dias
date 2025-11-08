import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * vite.config.js (ESM)
 * Versión .js de la configuración que ya tenés en vite.config.ts.
 * Copiá / pegá el archivo completo en la raíz del repo para evitar que procesos que
 * buscan vite.config.js encuentren un archivo vacío y fallen.
 */

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  }
});