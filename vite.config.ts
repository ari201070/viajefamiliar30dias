import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Podés agregar más alias específicos si querés
    },
  },
  build: {
    outDir: 'dist',      // Carpeta build de salida
    emptyOutDir: true,   // Limpia dist antes de construir
    sourcemap: true,     // Opcional, para debugging
  },
  server: {
    port: 3000,          // Puerto para dev server (ajustable)
  },
});
