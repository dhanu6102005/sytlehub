import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for StyleHub frontend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to Express backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
