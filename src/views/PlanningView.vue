<script setup lang="ts">
import Navigation from '../components/Navigation.vue'
import Omnibox from '../components/Omnibox.vue'
import MapBackground from '../components/MapBackground.vue'
import SmartPanel from '../components/panel/SmartPanel.vue'
import SearchOverlay from '../components/SearchOverlay.vue'
import { toggleTheme } from '../composables/useAppState'
</script>

<template>
  <div
    class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden w-full h-screen relative flex transition-colors duration-500"
  >
    <Navigation />

    <main class="flex-1 relative overflow-hidden h-full">
      <!-- LAYER 0 : LA CARTE -->
      <MapBackground />

      <!-- LAYER 1 : OMNIBOX -->
      <Omnibox />

      <!-- Contrôles Carte -->
      <div class="absolute top-[40%] right-4 z-20 flex flex-col gap-3 pointer-events-auto">
        <button
          class="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white dark:border-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-lg"
        >
          <i class="fas fa-location-crosshairs"></i>
        </button>
        <button
          class="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white dark:border-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-lg"
        >
          <i class="fas fa-layer-group"></i>
        </button>
      </div>

      <!-- LAYER 2 : SMART PANEL -->
      <SmartPanel />

      <!-- LAYER 3 : SEARCH OVERLAY -->
      <SearchOverlay />
    </main>

    <!-- Toggle Theme Flottant -->
    <button
      @click="toggleTheme"
      class="fixed bottom-20 md:bottom-4 right-4 w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center text-slate-700 dark:text-yellow-400 z-50 hover:scale-110 transition-transform"
    >
      <i class="fas fa-moon dark:hidden"></i>
      <i class="fas fa-sun hidden dark:block"></i>
    </button>
  </div>
</template>
