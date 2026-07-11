<script setup lang="ts">
import {
  appState,
  cancelPendingCelestialObject,
  requestGeolocationForPendingObject,
} from '@/composables/useAppState'
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200"
    leave-active-class="transition-all duration-150"
    enter-from-class="opacity-0 -translate-y-2"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="appState.pendingCelestialObject"
      class="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md pointer-events-auto"
    >
      <div
        class="glass-card bg-surface/95 border border-line rounded-2xl shadow-xl p-4 flex flex-col gap-3"
      >
        <div>
          <p class="text-sm font-medium text-ink">
            Choisissez un lieu de référence pour observer
            <span class="font-serif italic text-starlight">{{
              appState.pendingCelestialObject.displayName
            }}</span>
          </p>
          <p class="text-xs text-dust mt-1">
            Cliquez sur la carte, ou utilisez votre position actuelle.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 rounded-xl text-sm font-semibold text-void bg-starlight hover:bg-starlight-dim transition-colors"
            @click="requestGeolocationForPendingObject"
          >
            <i class="fas fa-location-crosshairs mr-1.5"></i>Utiliser ma position
          </button>
          <button
            class="px-3 py-2 rounded-xl text-sm font-semibold text-dust bg-surface-2 hover:bg-line transition-colors"
            @click="cancelPendingCelestialObject"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
