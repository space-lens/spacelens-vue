<script setup lang="ts">
import { computed } from 'vue'
import type { Spot } from '@/types/spot'

const props = defineProps<{
  spot: Spot | null
}>()

const emit = defineEmits<{
  toggle: []
}>()

const scoreColorClass = computed(() => {
  if (!props.spot) return ''
  return props.spot.score > 70
    ? 'border-green-500 text-green-500 dark:text-green-400 dark:bg-green-500/10'
    : 'border-orange-500 text-orange-500 dark:text-orange-400 dark:bg-orange-500/10'
})
</script>

<template>
  <div
    class="shrink-0 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 z-20 cursor-pointer"
    @click="emit('toggle')"
  >
    <div
      class="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4 desktop-hide-handle"
    ></div>

    <div class="flex justify-between items-start">
      <div>
        <h2 id="panel-title" class="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {{ spot?.title || 'Spot' }}
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
            Bortle <span id="panel-bortle">{{ spot?.bortle || 'X' }}</span>
          </span>
        </div>
      </div>
      <div
        id="panel-score-circle"
        class="w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg bg-white/80 dark:bg-transparent backdrop-blur-md"
        :class="scoreColorClass"
      >
        <span id="panel-score" class="font-bold text-lg leading-none">
          {{ spot?.score || '--' }}
        </span>
      </div>
    </div>
  </div>
</template>
