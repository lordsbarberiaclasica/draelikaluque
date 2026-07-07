import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://draelikaluque.com',
  integrations: [sitemap()],
  build: { format: 'directory' }, // genera /pagina/index.html => URLs idénticas a WordPress
  vite: { plugins: [tailwindcss()] },
});
