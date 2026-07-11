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
    return 'border-line text-dust-dim'
  }
  return [scoreBorderClass(props.score), scoreTextClass(props.score), scoreBgTintClass(props.score)]
})
</script>

<template>
  <div
    class="shrink-0 p-5 pb-4 border-b border-line cursor-pointer md:cursor-default relative z-20"
    @click="emit('toggle')"
  >
    <div class="w-12 h-1.5 bg-dust-dim rounded-full mx-auto mb-4 md:hidden"></div>

    <div class="flex justify-between items-start">
      <div class="flex-1 pr-4 min-w-0">
        <h2 class="font-serif italic font-medium text-2xl text-ink leading-tight truncate">
          {{ spot?.name ?? 'Lieu' }}
        </h2>

        <div
          v-if="spot?.bortle !== null && spot?.bortle !== undefined"
          class="flex items-center gap-2 mt-3"
        >
          <span
            class="font-mono text-xs bg-signal/10 text-signal border border-signal/30 px-2.5 py-1 rounded-md font-medium shadow-sm flex items-center gap-1.5"
          >
            <i class="fas fa-lightbulb"></i> Bortle {{ spot.bortle }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-3 shrink-0">
        <button
          class="hidden md:flex w-8 h-8 rounded-full bg-surface-2 text-dust hover:text-ink items-center justify-center transition-colors shadow-sm border border-line"
          @click.stop="emit('close')"
        >
          <i class="fas fa-times"></i>
        </button>
        <div
          class="w-16 h-16 rounded-full border-[3px] flex flex-col items-center justify-center shadow-sm"
          :class="scoreCircleClasses"
        >
          <span class="font-mono text-[9px] uppercase font-medium -mb-1 opacity-80">Score</span>
          <span class="font-mono font-semibold text-2xl">{{ score ?? '--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
