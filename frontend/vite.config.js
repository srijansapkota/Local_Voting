import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.mode ==="development" ? 'http://localhost:8000' : '/',
        changeOrigin: true,
      },
      '/auth': {
        target: import.meta.env.mode === "development" ? 'http://localhost:8000' : '/',
        changeOrigin: true,
      },
    },
  },
});
