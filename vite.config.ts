import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/overpass-de': {
          target: 'https://overpass-api.de',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/overpass-de/, '/api/interpreter'),
        },
        '/api/overpass-lz4': {
          target: 'https://lz4.overpass-api.de',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/overpass-lz4/, '/api/interpreter'),
        },
        '/api/overpass-z': {
          target: 'https://z.overpass-api.de',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/overpass-z/, '/api/interpreter'),
        },
        '/api/overpass-kumi': {
          target: 'https://overpass.kumi.systems',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/overpass-kumi/, '/api/interpreter'),
        }
      }
    },
  };
});
