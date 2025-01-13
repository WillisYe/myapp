import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import lim from 'vue-lim/vite'

export default defineConfig({
  plugins: [
    lim(),
    vue()
  ],
})