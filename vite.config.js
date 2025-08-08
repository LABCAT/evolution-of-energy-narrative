import { defineConfig } from 'vite';

export default defineConfig({
  base: '/evolution-of-energy-narrative/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
});