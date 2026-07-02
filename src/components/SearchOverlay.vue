<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { appState, closeSearchOverlay } from '../composables/useAppState'
import type { RecentSearch } from '@/types/search'
import RecentSearchItem from './search/RecentSearchItem.vue'

const searchInput = ref<HTMLInputElement | null>(null)

const recentSearches: RecentSearch[] = [
  { title: 'Plateau de Calern', bortle: 3, icon: 'fa-map-marker-alt' },
]

watch(
  () => appState.isSearchOverlayVisible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick()
      setTimeout(() => {
        searchInput.value?.focus()
      }, 300)
    }
  },
)
</script>

<template>
  <div
    class="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl transition-all duration-300 flex flex-col"
    :class="appState.isSearchOverlayVisible ? 'search-visible' : 'search-hidden'"
  >
    <div
      class="pt-10 md:pt-6 px-4 md:px-8 pb-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/80"
    >
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <button
          @click="closeSearchOverlay"
          class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div
          class="flex-1 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/50 rounded-xl flex items-center p-2 shadow-inner ring-2 ring-indigo-500/10 dark:ring-indigo-500/20"
        >
          <input
            ref="searchInput"
            type="text"
            placeholder="Que cherchez-vous ?"
            class="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full px-2"
            autocomplete="off"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 md:p-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <div>
          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Lieux récents
          </h4>
          <RecentSearchItem
            v-for="item in recentSearches"
            :key="item.title"
            :item="item"
            @select="closeSearchOverlay"
          />
        </div>
      </div>
    </div>
  </div>
</template>
