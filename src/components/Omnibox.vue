<script setup lang="ts">
import { openSearchOverlay } from '../composables/useAppState'
</script>

<template>
  <div
    class="absolute top-0 left-0 right-0 md:left-6 md:w-[400px] md:right-auto z-20 pointer-events-none"
  >
    <div class="pt-10 md:pt-6 px-4 pb-2">
      <div
        class="pointer-events-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl flex items-center p-1 cursor-text transition-all hover:bg-white dark:hover:bg-slate-700/90"
        @click="openSearchOverlay"
      >
        <div class="pl-4 pr-2">
          <i class="fas fa-search text-indigo-500 dark:text-indigo-400"></i>
        </div>
        <div class="flex-1 py-3">
          <p class="text-slate-500 dark:text-slate-400 text-sm truncate">
            Lieu, Objet céleste (ex: M42)...
          </p>
        </div>
        <div class="pr-2 hidden md:block">
          <button
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <i class="fas fa-sliders-h text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="pointer-events-auto flex overflow-x-auto no-scrollbar gap-2 mt-3 pb-2">
        <button
          class="flex-shrink-0 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-md border border-indigo-500"
        >
          Ce soir
        </button>
        <button
          class="flex-shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-white dark:border-slate-600/50 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-white dark:hover:bg-slate-700"
        >
          Bortle ≤ 4
        </button>
      </div>
    </div>
  </div>
</template>
