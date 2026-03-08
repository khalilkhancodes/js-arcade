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
        counter: resolve(__dirname, 'projects/counter/index.html'),
        calendar: resolve(__dirname, 'projects/calendar/index.html'),
        clock: resolve(__dirname, 'projects/clock-timer/index.html'),
        calculator: resolve(__dirname, 'projects/calculator/index.html'),
      },
    },
  },
})