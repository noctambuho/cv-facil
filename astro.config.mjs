import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://noctambuho.github.io',
  base: process.env.NODE_ENV === 'production' ? '/practica-sdd-cv-maker' : '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
