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
      class="shrink-0 w-16 rounded-xl p-2 flex flex-col items-center relative cursor-pointer transition-all font-mono"
      :class="
        index === selectedIndex
          ? 'bg-surface-2 border border-starlight shadow-[0_0_15px_rgba(232,182,91,0.2)] scale-105 z-10'
          : 'glass-card border border-transparent hover:border-line opacity-70 hover:opacity-100'
      "
      @click="emit('select', index)"
    >
      <span
        v-if="index === selectedIndex"
        class="absolute -top-1.5 w-3 h-3 bg-starlight rounded-full border-2 border-surface"
      ></span>
      <span
        class="text-xs font-medium whitespace-nowrap"
        :class="index === selectedIndex ? 'text-starlight' : 'text-dust'"
      >
        {{ hour.time }}<sup v-if="hour.isNextDay">+1</sup>
      </span>
      <div
        class="w-full h-12 bg-void/50 rounded mt-2 relative flex items-end overflow-hidden"
      >
        <div
          class="w-full rounded-sm transition-all duration-500"
          :class="scoreBgClass(hour.score)"
          :style="{ height: `${hour.score}%` }"
        ></div>
      </div>
      <span
        class="text-[10px] mt-2"
        :class="index === selectedIndex ? 'text-ink font-semibold' : 'text-dust-dim'"
      >
        {{ hour.temperatureC !== null ? `${Math.round(hour.temperatureC)}°` : '--' }}
      </span>
    </div>
  </div>
</template>
