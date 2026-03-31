import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({

  base: '/Solucion-MPL/',

  plugins: [
    vue(),
    mode === 'development' && vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // Optimización para producción
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Reducir el tamaño del bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/vue')) return 'vue-vendor'
        }
      }
    }
  }
}))
