import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// HMR (Hot Module Replacement) has been disabled to prevent WebSocket connection issues.
// This means you will need to manually reload the page to see changes.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 9003,
      host: '0.0.0.0',
      hmr: false, // HMR disabled
      open: false, // Explicitly disable auto-open
    },
    plugins: [react()],
    envPrefix: 'VITE_', // Expose all VITE_ prefixed env vars
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'import.meta.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },
    build: {
      sourcemap: false, // Critical: Disable source maps to save memory
      minify: 'esbuild', // Faster minification
      reportCompressedSize: false, // Turn off gzip reporting to save time/memory
      chunkSizeWarningLimit: 1000, 
    }
  };
});
