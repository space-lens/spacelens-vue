<script setup lang="ts">
import type { HourlyWeather } from '@/types/panel'
import { scoreBgClass } from '@/utils/score'

defineProps<{
  hours: HourlyWeather[]
  selectedIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="flex overflow-x-auto no-scrollbar gap-2 pb-2">
    <div
      v-for="(hour, index) in hours"
      :key="hour.time"
      class="shrink-0 w-16 rounded-xl p-2 flex flex-col items-center relative cursor-pointer transition-all"
      :class="
        index === selectedIndex
          ? 'bg-white dark:bg-slate-800 border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-105 z-10'
          : 'glass-card border border-transparent hover:border-slate-300 dark:hover:border-slate-600 opacity-70 hover:opacity-100'
      "
      @click="emit('select', index)"
    >
      <span
        v-if="index === selectedIndex"
        class="absolute -top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-800"
      ></span>
      <span
        class="text-xs font-bold"
        :class="
          index === selectedIndex
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-700 dark:text-slate-300'
        "
      >
        {{ hour.time }}
      </span>
      <div
        class="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded mt-2 relative flex items-end overflow-hidden"
      >
        <div
          class="w-full rounded-sm transition-all duration-500"
          :class="scoreBgClass(hour.score)"
          :style="{ height: `${hour.score}%` }"
        ></div>
      </div>
      <span
        class="text-[10px] mt-2"
        :class="
          index === selectedIndex ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
        "
      >
        {{ hour.temperatureC !== null ? `${Math.round(hour.temperatureC)}°` : '--' }}
      </span>
    </div>
  </div>
</template>
