<script setup lang="ts">
import { computed } from 'vue'
import type { SelectedSpotDetail } from '@/types/panel'
import { scoreBorderClass, scoreTextClass, scoreBgTintClass } from '@/utils/score'

const props = defineProps<{
  spot: SelectedSpotDetail | null
  score: number | null
}>()

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const scoreCircleClasses = computed(() => {
  if (props.score === null) {
    return 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
  }
  return [scoreBorderClass(props.score), scoreTextClass(props.score), scoreBgTintClass(props.score)]
})
</script>

<template>
  <div
    class="shrink-0 p-5 pb-4 border-b border-slate-200/50 dark:border-slate-700/50 cursor-pointer md:cursor-default relative z-20"
    @click="emit('toggle')"
  >
    <div
      class="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-4 md:hidden"
    ></div>

    <div class="flex justify-between items-start">
      <div class="flex-1 pr-4 min-w-0">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight truncate">
          {{ spot?.name ?? 'Lieu' }}
        </h2>

        <div
          v-if="spot?.bortle !== null && spot?.bortle !== undefined"
          class="flex items-center gap-2 mt-3"
        >
          <span
            class="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 px-2.5 py-1 rounded-md font-semibold shadow-sm flex items-center gap-1.5"
          >
            <i class="fas fa-lightbulb text-indigo-500"></i> Bortle {{ spot.bortle }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-3 shrink-0">
        <button
          class="hidden md:flex w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white items-center justify-center transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          @click.stop="emit('close')"
        >
          <i class="fas fa-times"></i>
        </button>
        <div
          class="w-16 h-16 rounded-full border-[3px] flex flex-col items-center justify-center shadow-sm"
          :class="scoreCircleClasses"
        >
          <span class="text-[9px] uppercase font-bold -mb-1 opacity-80">Score</span>
          <span class="font-extrabold text-2xl">{{ score ?? '--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
