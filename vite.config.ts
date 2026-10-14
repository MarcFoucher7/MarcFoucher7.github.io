import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
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
