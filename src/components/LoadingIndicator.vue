<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { appState } from '@/composables/useAppState'

const MESSAGES = [
  'Recherche des ciels les plus sombres…',
  'Consultation de la météo locale…',
  'Calcul du score de visibilité…',
  'Repérage des meilleurs spots…',
  'Analyse de la pollution lumineuse…',
  'Vérification des prévisions à venir…',
]

const MESSAGE_INTERVAL_MS = 2500

const messageIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

watch(
  () => appState.isLoadingSpots,
  (isLoading) => {
    if (isLoading) {
      messageIndex.value = Math.floor(Math.random() * MESSAGES.length)
      intervalId = setInterval(() => {
        messageIndex.value = (messageIndex.value + 1) % MESSAGES.length
      }, MESSAGE_INTERVAL_MS)
    } else if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  },
)

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    leave-active-class="transition-all duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <!-- pointer-events-auto sur tout l'overlay : bloque volontairement toute interaction avec
         la carte/omnibox/contrôles pendant le chargement (la Navigation reste cliquable, c'est
         un sibling en dehors de <main>, pas un enfant de cet overlay). -->
    <div
      v-if="appState.isLoadingSpots"
      class="absolute inset-0 z-40 flex items-center justify-center bg-void/50 backdrop-blur-sm pointer-events-auto cursor-wait"
    >
      <div
        class="bg-surface/95 border border-line rounded-2xl shadow-2xl px-6 py-5 flex flex-col items-center gap-3 max-w-[80%]"
      >
        <svg viewBox="0 0 40 40" class="w-9 h-9 loading-aperture" aria-hidden="true">
          <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-dust-dim)" stroke-width="1" opacity="0.35" />
          <circle cx="20" cy="20" r="11" fill="none" stroke="var(--color-signal)" stroke-width="1" opacity="0.5" />
          <circle cx="20" cy="20" r="6" fill="none" stroke="var(--color-starlight)" stroke-width="1.2" opacity="0.9" />
          <circle cx="20" cy="20" r="2" fill="var(--color-starlight)" />
        </svg>
        <span class="text-sm font-medium text-dust text-center">{{ MESSAGES[messageIndex] }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-aperture {
  animation: loading-breathe 1.6s ease-in-out infinite;
}
@keyframes loading-breathe {
  0%,
  100% {
    transform: scale(0.92);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
