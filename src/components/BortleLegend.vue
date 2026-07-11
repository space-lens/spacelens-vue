<script setup lang="ts">
import { BORTLE_LEVELS } from '@/utils/bortle'
</script>

<template>
  <div
    class="absolute bottom-4 left-4 z-20 bg-surface/95 backdrop-blur-xl border border-line rounded-2xl shadow-xl p-3 w-48 pointer-events-auto"
  >
    <p class="font-mono text-[10px] font-medium text-dust uppercase tracking-wider pb-2">
      Pollution lumineuse
    </p>
    <ul class="flex flex-col gap-1">
      <li
        v-for="level in BORTLE_LEVELS"
        :key="level.value"
        class="flex items-center gap-2 text-xs text-ink"
      >
        <span
          class="w-3.5 h-3.5 rounded-sm border border-line shrink-0"
          :style="{ backgroundColor: level.color }"
        ></span>
        <span class="font-mono font-medium w-4">{{ level.value }}</span>
        <span class="text-dust truncate">{{ level.label }}</span>
      </li>
    </ul>
  </div>
</template>
