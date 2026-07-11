<script setup lang="ts">
import { BORTLE_LEVELS } from '@/utils/bortle'
</script>

<template>
  <div
    class="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl p-3 w-48 pointer-events-auto"
  >
    <p
      class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2"
    >
      Pollution lumineuse
    </p>
    <ul class="flex flex-col gap-1">
      <li
        v-for="level in BORTLE_LEVELS"
        :key="level.value"
        class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200"
      >
        <span
          class="w-3.5 h-3.5 rounded-sm border border-slate-300 dark:border-slate-600 shrink-0"
          :style="{ backgroundColor: level.color }"
        ></span>
        <span class="font-semibold w-4">{{ level.value }}</span>
        <span class="text-slate-500 dark:text-slate-400 truncate">{{ level.label }}</span>
      </li>
    </ul>
  </div>
</template>
