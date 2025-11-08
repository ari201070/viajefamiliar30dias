import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * vite.config.ts
 * Configuración unificada (TypeScript). 
 * - Carga variables de entorno con loadEnv
 * - Define process.env.GEMINI_API_KEY y process.env.API_KEY
 * - Alias '@' al root del repo
 * - Incluye plugins y opciones de servidor
 * Copiá y pegá este archivo en la raíz del repo (reemplazando el vite.config.ts existente).
 */

export default defineConfig(({ mode }) => {
  // loadEnv lee variables desde el .env correspondiente al mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Aseguramos que las variables estén definidas como strings para el build
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      // Extensiones mantenidas para evitar problemas con imports sin extensión
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    }
  };
});