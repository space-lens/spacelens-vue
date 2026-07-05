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
  server: {
    watch: {
      // Symlink local vers les tuiles Bortle (astro-light-pipeline, cf. .gitignore) : des
      // dizaines de milliers de PNG statiques qui ne changent jamais en dev — les watcher fait
      // dépasser la limite système d'inotify (ENOSPC) et plante tout le serveur Vite.
      ignored: ['**/public/tiles-bortle/**'],
    },
  },
})
