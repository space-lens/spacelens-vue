<script setup lang="ts">
import { computed } from 'vue'
import { appState, togglePanelExpand, closeSmartPanel, selectHour } from '@/composables/useAppState'
import PanelHeader from './PanelHeader.vue'
import WeatherTimeline from './WeatherTimeline.vue'
import AtmosphereGrid from './AtmosphereGrid.vue'
import TonightTargetItem from './TonightTargetItem.vue'

const panelClasses = computed(() => ({
  peek: appState.panelState === 'peek',
  expanded: appState.panelState === 'expanded',
}))

const selectedHour = computed(
  () => appState.selectedSpot?.hourly[appState.selectedHourIndex] ?? null,
)
</script>

<template>
  <div
    id="smart-panel"
    class="smart-panel glass-card absolute z-30 flex flex-col overflow-hidden border border-white/50 dark:border-slate-700/50"
    :class="panelClasses"
  >
    <PanelHeader
      :spot="appState.selectedSpot"
      :score="selectedHour?.score ?? null"
      @toggle="togglePanelExpand"
      @close="closeSmartPanel"
    />

    <!-- Contenu Étendu -->
    <div
      class="flex-1 overflow-y-auto no-scrollbar transition-opacity duration-300"
      :class="
        appState.panelState === 'expanded'
          ? 'opacity-100 block'
          : 'opacity-0 hidden md:block md:opacity-100'
      "
    >
      <!-- SECTION 1 : Évolution de la nuit (créneaux réels du fournisseur météo, pas de l'horaire complet) -->
      <div
        v-if="appState.selectedSpot && appState.selectedSpot.hourly.length > 0"
        class="p-5 border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Évolution de la nuit
          </h3>
          <span
            class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded"
            >Cliquez pour le détail</span
          >
        </div>
        <WeatherTimeline
          :hours="appState.selectedSpot.hourly"
          :selected-index="appState.selectedHourIndex"
          @select="selectHour"
        />
      </div>

      <!-- SECTION 2 : Atmosphère au créneau sélectionné -->
      <div
        v-if="selectedHour"
        class="p-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Atmosphère à
            <span class="text-indigo-600 dark:text-indigo-400 font-extrabold">{{
              selectedHour.time
            }}</span>
          </h3>
        </div>
        <AtmosphereGrid :hour="selectedHour" />
      </div>

      <!-- SECTION 3 : Cibles célestes recommandées ici -->
      <div v-if="appState.selectedSpot && appState.selectedSpot.targets.length > 0" class="p-5">
        <h3
          class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4"
        >
          Cibles recommandées ici
        </h3>
        <div class="space-y-3">
          <TonightTargetItem
            v-for="target in appState.selectedSpot.targets"
            :key="target.slug"
            :target="target"
          />
        </div>
      </div>
    </div>
  </div>
</template>
