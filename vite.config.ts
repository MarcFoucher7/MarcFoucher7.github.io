import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  base: '/',
  plugins: [react(), glsl({ compress: true })],
  build: {
    target: 'es2020',
    // Le chunk 3D (three + R3F) est chargé en différé : on accepte sa taille.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        dossier: fileURLToPath(new URL('dossier/index.html', import.meta.url)),
      },
    },
  },
});
