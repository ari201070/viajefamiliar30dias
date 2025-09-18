import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The 'define' block has been removed. Vite's standard environment variable
  // handling (import.meta.env) is now used for a more robust setup.
})
