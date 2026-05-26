import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // All requests starting with /api will be forwarded to your backend
      '/api': {
        target: 'https://play-route-back.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')   // optional: removes /api prefix
      }
    }
  }
})
