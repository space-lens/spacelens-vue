<script setup lang="ts">
import { computed } from 'vue'
import {
  appState,
  closeMapClickModal,
  confirmMapClickModal,
  formatCoordinates,
} from '@/composables/useAppState'
import type { LocationResolveRejectionReason } from '@/types/location'

const REJECTION_MESSAGES: Record<LocationResolveRejectionReason, string> = {
  sea_point: 'Ce point est en mer — choisissez un lieu sur la terre ferme.',
  no_light_pollution_coverage:
    "Aucune donnée de pollution lumineuse n'est disponible pour cette zone (hors couverture actuelle, Europe de l'Ouest).",
}

const displayName = computed(() => {
  const modal = appState.mapClickModal
  if (modal?.status !== 'valid') return ''
  return modal.name ?? formatCoordinates(modal.latitude, modal.longitude)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200"
    leave-active-class="transition-all duration-150"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="appState.mapClickModal"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto"
      @click.self="closeMapClickModal"
    >
      <div
        class="glass-card bg-white/95 dark:bg-slate-800/95 border border-white dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
      >
        <!-- Résolution en cours -->
        <template v-if="appState.mapClickModal.status === 'loading'">
          <div class="flex items-center gap-3">
            <i class="fas fa-spinner fa-spin text-indigo-500"></i>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
              Vérification du lieu…
            </span>
          </div>
        </template>

        <!-- Point valide : confirmation -->
        <template v-else-if="appState.mapClickModal.status === 'valid'">
          <div>
            <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Confirmer ce lieu ?
            </h3>
            <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {{ displayName }}
            </p>
            <p
              v-if="appState.mapClickModal.bortle !== null"
              class="mt-1 text-sm text-slate-500 dark:text-slate-400"
            >
              Bortle {{ appState.mapClickModal.bortle }}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              @click="closeMapClickModal"
            >
              Annuler
            </button>
            <button
              class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
              @click="confirmMapClickModal"
            >
              Voir le score
            </button>
          </div>
        </template>

        <!-- Point rejeté (mer / hors couverture) -->
        <template v-else-if="appState.mapClickModal.status === 'invalid'">
          <div class="flex items-start gap-3">
            <i class="fas fa-triangle-exclamation text-amber-500 mt-0.5"></i>
            <p class="text-sm text-slate-700 dark:text-slate-200">
              {{ REJECTION_MESSAGES[appState.mapClickModal.reason] }}
            </p>
          </div>
          <button
            class="w-full px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            @click="closeMapClickModal"
          >
            Fermer
          </button>
        </template>

        <!-- Échec réseau -->
        <template v-else-if="appState.mapClickModal.status === 'error'">
          <div class="flex items-start gap-3">
            <i class="fas fa-circle-exclamation text-red-500 mt-0.5"></i>
            <p class="text-sm text-slate-700 dark:text-slate-200">
              {{ appState.mapClickModal.message }}
            </p>
          </div>
          <button
            class="w-full px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            @click="closeMapClickModal"
          >
            Fermer
          </button>
        </template>
      </div>
    </div>
  </Transition>
</template>
