import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-native'],
  },
  build: {
    rollupOptions: {
      external: ['react-native'],
    },
  },
});
