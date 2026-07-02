<script setup lang="ts">
import type { Recommendation } from '@/types/panel'

defineProps<{
  recommendation: Recommendation
}>()
</script>

<template>
  <div
    class="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-3 flex items-center gap-3"
  >
    <div
      class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0"
    >
      <i class="fas" :class="recommendation.icon"></i>
    </div>
    <div class="flex-1">
      <p class="text-sm font-bold text-slate-900 dark:text-slate-200">{{ recommendation.name }}</p>
      <p class="text-[10px] text-indigo-600/70 dark:text-indigo-300/70">
        {{ recommendation.subtitle }}
      </p>
    </div>
  </div>
</template>
