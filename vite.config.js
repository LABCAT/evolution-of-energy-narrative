import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/evolution-of-energy-narrative/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'agent1.js', dest: '.' },
        { src: 'agent2.js', dest: '.' },
        { src: 'agent3.js', dest: '.' },
        { src: 'sketch.js', dest: '.' },
        { src: '.purview_helper.js', dest: '.' },
        { src: 'z_background.jpg', dest: '.' },
        { src: 'preview.jpg', dest: '.' },
        { src: 'thumbnail.png', dest: '.' },
        { src: '.nojekyll', dest: '.' }
      ]
    })
  ]
});