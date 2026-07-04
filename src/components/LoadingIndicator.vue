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
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="appState.isLoadingSpots"
      class="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
    >
      <div
        class="pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-3 whitespace-nowrap"
      >
        <div class="flex items-center gap-1 shrink-0">
          <span class="w-2 h-2 rounded-full bg-indigo-500 loading-dot"></span>
          <span class="w-2 h-2 rounded-full bg-indigo-500 loading-dot loading-dot-2"></span>
          <span class="w-2 h-2 rounded-full bg-indigo-500 loading-dot loading-dot-3"></span>
        </div>
        <span class="text-sm text-slate-600 dark:text-slate-300">{{ MESSAGES[messageIndex] }}</span>
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
