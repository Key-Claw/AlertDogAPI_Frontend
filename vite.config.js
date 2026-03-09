import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    // Keep Vite focused on the static multipage root entry.
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
});
