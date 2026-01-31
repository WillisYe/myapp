import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          cannon: ['cannon-es']
        }
      }
    }
  }
})