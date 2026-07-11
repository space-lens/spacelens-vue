<script setup lang="ts">
import { nextPlanningDays } from '@/utils/date'

const emit = defineEmits<{
  select: [date: string]
}>()

const days = nextPlanningDays()
</script>

<template>
  <div
    class="absolute top-full left-0 mt-2 z-30 bg-surface/95 backdrop-blur-xl border border-line rounded-2xl shadow-xl p-2 w-56"
  >
    <p class="font-mono text-[10px] font-medium text-dust uppercase tracking-wider px-2 pt-1 pb-2">
      Planifier une soirée
    </p>
    <button
      v-for="day in days"
      :key="day.date"
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-2 transition-colors flex items-center gap-2"
      @click="emit('select', day.date)"
    >
      <i class="far fa-calendar text-starlight text-xs"></i>
      {{ day.label }}
    </button>
    <p class="text-[9px] text-dust-dim px-3 pt-2 pb-1 leading-snug">
      Au-delà de quelques jours, la météo devient moins fiable — de quoi se faire une idée, pas une
      prévision précise.
    </p>
  </div>
</template>
