<script setup lang="ts">
import { computed } from 'vue'
import { appState, togglePanelExpand } from '../composables/useAppState'

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768

const scoreColorClass = computed(() => {
  if (!appState.activeSpot) return ''
  return appState.activeSpot.score > 70
    ? 'border-green-500 text-green-500 dark:text-green-400 dark:bg-green-500/10'
    : 'border-orange-500 text-orange-500 dark:text-orange-400 dark:bg-orange-500/10'
})

const panelClasses = computed(() => {
  return {
    peek: appState.panelState === 'peek',
    expanded: appState.panelState === 'expanded',
  }
})
</script>

<template>
  <div
    id="smart-panel"
    class="smart-panel glass-card absolute z-30 flex flex-col overflow-hidden border border-white/50 dark:border-slate-700/50"
    :class="panelClasses"
  >
    <!-- Header (Résumé) -->
    <div
      class="shrink-0 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 z-20 cursor-pointer"
      @click="togglePanelExpand"
    >
      <div
        class="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4 desktop-hide-handle"
      ></div>

      <div class="flex justify-between items-start">
        <div>
          <h2 id="panel-title" class="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {{ appState.activeSpot?.title || 'Spot' }}
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <span
              class="text-[10px] bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
            >
              <i class="fas fa-car mr-1"></i> Parking
            </span>
            <span
              class="text-[10px] bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 px-2 py-0.5 rounded"
            >
              Bortle <span id="panel-bortle">{{ appState.activeSpot?.bortle || 'X' }}</span>
            </span>
          </div>
        </div>
        <div
          id="panel-score-circle"
          class="w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg bg-white/80 dark:bg-transparent backdrop-blur-md"
          :class="scoreColorClass"
        >
          <span id="panel-score" class="font-bold text-lg leading-none">
            {{ appState.activeSpot?.score || '--' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Contenu Étendu -->
    <div
      id="panel-expanded-content"
      class="flex-1 overflow-y-auto no-scrollbar transition-opacity duration-300 md:desktop-content-visible"
      :class="
        appState.panelState === 'expanded'
          ? 'opacity-100 block'
          : 'opacity-0 hidden md:block md:opacity-100'
      "
    >
      <div
        class="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <span
          class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 block"
          >Évolution (Ce soir)</span
        >
        <div class="flex overflow-x-auto no-scrollbar gap-4 pb-2">
          <!-- Items Météo avec couleurs adaptatives -->
          <div class="flex flex-col items-center w-12">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 mb-2">21:00</span>
            <div class="h-10 w-2 bg-slate-200 dark:bg-slate-800 rounded relative flex items-end">
              <div class="w-full bg-green-400 h-[60%] rounded"></div>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-2">12°</span>
          </div>
          <div class="flex flex-col items-center w-12">
            <span class="text-[10px] text-slate-900 dark:text-white font-bold mb-2">22:00</span>
            <div
              class="h-10 w-2 bg-slate-200 dark:bg-slate-800 rounded relative flex items-end ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
            >
              <div class="w-full bg-green-500 h-[85%] rounded"></div>
            </div>
            <span class="text-[10px] text-slate-900 dark:text-white font-bold mt-2">11°</span>
          </div>
          <div class="flex flex-col items-center w-12">
            <span class="text-[10px] text-slate-500 dark:text-slate-400 mb-2">23:00</span>
            <div class="h-10 w-2 bg-slate-200 dark:bg-slate-800 rounded relative flex items-end">
              <div class="w-full bg-green-500 h-[95%] rounded"></div>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-2">10°</span>
          </div>
        </div>
      </div>

      <div class="p-4">
        <span
          class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block"
          >Recommandé ici</span
        >
        <div
          class="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-3 flex items-center gap-3"
        >
          <div
            class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0"
          >
            <i class="fas fa-meteor"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-slate-900 dark:text-slate-200">Andromède (M31)</p>
            <p class="text-[10px] text-indigo-600/70 dark:text-indigo-300/70">Idéal à 22h00</p>
          </div>
        </div>
      </div>
    </div>

    <div
      id="panel-cta"
      class="p-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50 transition-opacity duration-300 md:desktop-content-visible"
      :class="
        appState.panelState === 'expanded'
          ? 'opacity-100 block'
          : 'opacity-0 hidden md:block md:opacity-100'
      "
    >
      <button
        class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] flex items-center justify-center gap-2"
      >
        <i class="fas fa-rocket"></i> Créer la session
      </button>
    </div>
  </div>
</template>
