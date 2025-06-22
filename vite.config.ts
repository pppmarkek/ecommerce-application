import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    react(),
    mode === 'production' && legacy({ targets: ['defaults', 'not IE 11'] }),
    mode === 'production' && compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ].filter(Boolean),

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material', '@mui/icons-material'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
