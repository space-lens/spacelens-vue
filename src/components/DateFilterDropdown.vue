<script setup lang="ts">
import { nextPlanningDays } from '@/utils/date'

const emit = defineEmits<{
  select: [date: string]
}>()

const days = nextPlanningDays()
</script>

<template>
  <div
    class="absolute top-full left-0 mt-2 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl p-2 w-56"
  >
    <p
      class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 pt-1 pb-2"
    >
      Planifier une soirée
    </p>
    <button
      v-for="day in days"
      :key="day.date"
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2"
      @click="emit('select', day.date)"
    >
      <i class="far fa-calendar text-indigo-400 text-xs"></i>
      {{ day.label }}
    </button>
    <p class="text-[9px] text-slate-400 dark:text-slate-500 px-3 pt-2 pb-1 leading-snug">
      Au-delà de quelques jours, la météo devient moins fiable — de quoi se faire une idée, pas une
      prévision précise.
    </p>
  </div>
</template>
