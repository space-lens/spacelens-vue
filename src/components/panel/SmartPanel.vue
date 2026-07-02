<script setup lang="ts">
import { computed } from 'vue'
import { appState, togglePanelExpand } from '@/composables/useAppState'
import type { WeatherHour, Recommendation } from '@/types/panel'
import PanelHeader from './PanelHeader.vue'
import WeatherTimeline from './WeatherTimeline.vue'
import RecommendationCard from './RecommendationCard.vue'

const weatherHours: WeatherHour[] = [
  { time: '21:00', temperatureC: 12, qualityPercent: 60 },
  { time: '22:00', temperatureC: 11, qualityPercent: 85, isHighlighted: true },
  { time: '23:00', temperatureC: 10, qualityPercent: 95 },
]

const recommendation: Recommendation = {
  name: 'Andromède (M31)',
  icon: 'fa-meteor',
  subtitle: 'Idéal à 22h00',
}

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
    <PanelHeader :spot="appState.activeSpot" @toggle="togglePanelExpand" />

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
        <WeatherTimeline :hours="weatherHours" />
      </div>

      <div class="p-4">
        <span
          class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block"
          >Recommandé ici</span
        >
        <RecommendationCard :recommendation="recommendation" />
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
