import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Allows access from external network (Live Share tunnel)
    port: 5173 ,        // Optional but recommended for consistency
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   '/login': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //   },
    //   '/signup': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //   },
    //   '/logout': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //   },
    // },
  }
})
