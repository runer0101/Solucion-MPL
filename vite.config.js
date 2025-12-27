import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  base: '/Solucion-MPL/',

  plugins: [
    vue(),
     vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // Configuración del servidor de desarrollo
  server: {
    overlay: true  // Desactiva el overlay de errores y warnings para todos
  },

  // Optimización para producción
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Reducir el tamaño del bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue']
        }
      }
    }
  }
})
