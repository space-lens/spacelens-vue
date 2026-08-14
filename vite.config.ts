import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Le WAF de l'hébergeur (PlanetHoster/N0C) bloque tout le chemin /assets/,
    // quel que soit son contenu — on renomme le dossier de sortie pour l'éviter.
    assetsDir: 'static',
  },
})
