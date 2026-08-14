<script setup lang="ts">
import { appState, closeObjectSuggestions, selectObjectSuggestion } from '@/composables/useAppState'
import type { SpatioTemporalSuggestion } from '@/types/celestialObjectSuggestions'
import { planningDateLabel } from '@/utils/date'
import { scoreBgClass, scoreTextClass } from '@/utils/score'

function pick(suggestion: SpatioTemporalSuggestion) {
  void selectObjectSuggestion(suggestion)
}
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-300"
    leave-active-class="transition-transform duration-200"
    enter-from-class="translate-x-full"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="appState.objectSuggestions"
      class="absolute inset-y-0 right-0 z-40 w-full max-w-sm bg-void/95 backdrop-blur-xl border-l border-line shadow-2xl flex flex-col pointer-events-auto"
    >
      <div class="p-4 border-b border-line flex items-center justify-between shrink-0">
        <div>
          <h3 class="font-mono text-xs font-medium text-dust uppercase tracking-wider">
            Meilleures nuits pour
          </h3>
          <p class="font-serif italic text-lg font-medium text-ink">
            {{ appState.objectSuggestions.displayName }}
          </p>
        </div>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-full text-dust-dim hover:text-dust hover:bg-surface-2"
          @click="closeObjectSuggestions"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <p
          v-if="appState.objectSuggestions.status === 'loading'"
          class="text-sm text-dust-dim text-center mt-8"
        >
          <i class="fas fa-spinner fa-spin mr-2"></i>Calcul en cours…
        </p>

        <p
          v-else-if="appState.objectSuggestions.status === 'error'"
          class="text-sm text-poor text-center mt-8"
        >
          {{ appState.objectSuggestions.message }}
        </p>

        <template v-else>
          <p
            v-if="!appState.objectSuggestions.lightPollutionCoverageAvailable"
            class="text-sm text-dust-dim text-center mt-8"
          >
            Aucun lieu sombre trouvé à proximité de ce point de référence.
          </p>
          <p
            v-else-if="appState.objectSuggestions.suggestions.length === 0"
            class="text-sm text-dust-dim text-center mt-8"
          >
            Aucune date favorable trouvée sur les {{ appState.objectSuggestions.daysScanned }}
            prochains jours depuis ce lieu.
          </p>

          <div v-else class="space-y-2">
            <button
              v-for="(suggestion, index) in appState.objectSuggestions.suggestions"
              :key="index"
              class="w-full text-left p-3 rounded-xl border border-line bg-surface/60 hover:bg-surface-2 transition-colors flex items-center gap-3"
              @click="pick(suggestion)"
            >
              <div
                class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-mono font-semibold text-sm"
                :class="scoreBgClass(suggestion.score)"
              >
                {{ suggestion.score }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-ink">
                  {{ planningDateLabel(suggestion.date) }}
                </p>
                <p class="font-mono text-xs text-dust">
                  Bortle {{ suggestion.bortle }} · {{ suggestion.distance_km }}km ·
                  <span :class="scoreTextClass(suggestion.score)">{{ suggestion.score }}/100</span>
                </p>
                <p
                  v-if="!suggestion.within_weather_window"
                  class="text-[10px] text-dust-dim mt-0.5"
                >
                  Météo pas encore fiable pour cette date (éphémérides + lune seulement)
                </p>
              </div>
            </button>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>
