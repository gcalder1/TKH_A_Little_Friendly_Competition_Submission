import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Set up aliases for cleaner imports
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // Configuration for the development server
  server: {
    port: 3000,
    open: true, // Automatically open the app in the browser on server start
  },

  // Tell Vite to use PostCSS for processing CSS files (for Tailwind)
  css: {
    postcss: './postcss.config.js',
  },

  // Build settings
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})