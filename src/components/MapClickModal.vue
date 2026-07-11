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
      class="absolute inset-0 z-40 flex items-center justify-center bg-void/60 backdrop-blur-sm pointer-events-auto"
      @click.self="closeMapClickModal"
    >
      <div
        class="glass-card bg-surface/95 border border-line rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
      >
        <!-- Résolution en cours -->
        <template v-if="appState.mapClickModal.status === 'loading'">
          <div class="flex items-center gap-3">
            <i class="fas fa-spinner fa-spin text-starlight"></i>
            <span class="text-sm font-medium text-dust"> Vérification du lieu… </span>
          </div>
        </template>

        <!-- Point valide : confirmation -->
        <template v-else-if="appState.mapClickModal.status === 'valid'">
          <div>
            <h3 class="font-mono text-xs font-medium text-dust uppercase tracking-wider">
              Confirmer ce lieu ?
            </h3>
            <p class="mt-1 font-serif italic text-lg font-medium text-ink">
              {{ displayName }}
            </p>
            <p v-if="appState.mapClickModal.bortle !== null" class="mt-1 text-sm text-dust">
              Bortle {{ appState.mapClickModal.bortle }}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-dust bg-surface-2 hover:bg-line transition-colors"
              @click="closeMapClickModal"
            >
              Annuler
            </button>
            <button
              class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-void bg-starlight hover:bg-starlight-dim transition-colors"
              @click="confirmMapClickModal"
            >
              Voir le score
            </button>
          </div>
        </template>

        <!-- Point rejeté (mer / hors couverture) -->
        <template v-else-if="appState.mapClickModal.status === 'invalid'">
          <div class="flex items-start gap-3">
            <i class="fas fa-triangle-exclamation text-medium mt-0.5"></i>
            <p class="text-sm text-dust">
              {{ REJECTION_MESSAGES[appState.mapClickModal.reason] }}
            </p>
          </div>
          <button
            class="w-full px-4 py-2 rounded-xl text-sm font-semibold text-dust bg-surface-2 hover:bg-line transition-colors"
            @click="closeMapClickModal"
          >
            Fermer
          </button>
        </template>

        <!-- Échec réseau -->
        <template v-else-if="appState.mapClickModal.status === 'error'">
          <div class="flex items-start gap-3">
            <i class="fas fa-circle-exclamation text-poor mt-0.5"></i>
            <p class="text-sm text-dust">
              {{ appState.mapClickModal.message }}
            </p>
          </div>
          <button
            class="w-full px-4 py-2 rounded-xl text-sm font-semibold text-dust bg-surface-2 hover:bg-line transition-colors"
            @click="closeMapClickModal"
          >
            Fermer
          </button>
        </template>
      </div>
    </div>
  </Transition>
</template>
