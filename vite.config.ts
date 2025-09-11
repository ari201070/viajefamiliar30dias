import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', ''); // Carga todas las .env, incluyendo VITE_API_KEY
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY), // Toma valor de VITE_API_KEY
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_API_KEY) // Si tu código busca GEMINI_API_KEY, que también apunte a VITE_API_KEY
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
