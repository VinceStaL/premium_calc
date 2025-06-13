import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read API URL from environment variable or use default
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
      }
    }
  }
})