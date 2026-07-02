<script setup lang="ts">
import type { WeatherHour } from '@/types/panel'

defineProps<{
  hours: WeatherHour[]
}>()
</script>

<template>
  <div class="flex overflow-x-auto no-scrollbar gap-4 pb-2">
    <div v-for="hour in hours" :key="hour.time" class="flex flex-col items-center w-12">
      <span
        class="text-[10px] mb-2"
        :class="
          hour.isHighlighted
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 dark:text-slate-400'
        "
      >
        {{ hour.time }}
      </span>
      <div
        class="h-10 w-2 bg-slate-200 dark:bg-slate-800 rounded relative flex items-end"
        :class="
          hour.isHighlighted
            ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
            : ''
        "
      >
        <div
          class="w-full rounded"
          :class="hour.isHighlighted ? 'bg-green-500' : 'bg-green-400'"
          :style="{ height: `${hour.qualityPercent}%` }"
        ></div>
      </div>
      <span
        class="text-[10px] mt-2"
        :class="
          hour.isHighlighted
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 dark:text-slate-400'
        "
      >
        {{ hour.temperatureC }}°
      </span>
    </div>
  </div>
</template>
