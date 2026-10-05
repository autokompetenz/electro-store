import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/electro-products': 'https://br-rapid-silence-aevow0sn.storage.c-2.us-east-2.aws.neon.tech',
    },
  },
})
