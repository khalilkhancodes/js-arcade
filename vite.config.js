import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        counter: resolve(__dirname, 'Counter/index.html'),
        calendar: resolve(__dirname, 'Calender/index.html'),
      },
    },
  },
})