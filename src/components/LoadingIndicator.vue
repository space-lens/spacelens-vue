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
      class="absolute inset-0 z-40 flex items-center justify-center bg-white/40 dark:bg-slate-950/50 backdrop-blur-sm pointer-events-auto cursor-wait"
    >
      <div
        class="bg-white/95 dark:bg-slate-800/95 border border-white dark:border-slate-700/50 rounded-2xl shadow-2xl px-6 py-5 flex flex-col items-center gap-3 max-w-[80%]"
      >
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="w-3 h-3 rounded-full bg-indigo-500 loading-dot"></span>
          <span class="w-3 h-3 rounded-full bg-indigo-500 loading-dot loading-dot-2"></span>
          <span class="w-3 h-3 rounded-full bg-indigo-500 loading-dot loading-dot-3"></span>
        </div>
        <span class="text-sm font-medium text-slate-700 dark:text-slate-200 text-center">{{
          MESSAGES[messageIndex]
        }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-dot {
  animation: loading-bounce 1s ease-in-out infinite;
}
.loading-dot-2 {
  animation-delay: 0.15s;
}
.loading-dot-3 {
  animation-delay: 0.3s;
}
@keyframes loading-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
