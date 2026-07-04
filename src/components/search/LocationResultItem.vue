<script setup lang="ts">
import type { LocationResult } from '@/types/search'

const props = defineProps<{
  item: LocationResult
}>()

const emit = defineEmits<{
  select: [item: LocationResult]
}>()
</script>

<template>
  <div
    class="bg-white/60 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 flex items-center gap-4 cursor-pointer shadow-sm"
    @click="emit('select', props.item)"
  >
    <div
      class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20"
    >
      <i class="fas fa-map-marker-alt"></i>
    </div>
    <div class="flex-1">
      <p class="font-bold text-slate-900 dark:text-slate-200">{{ item.name }}</p>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        <span v-if="item.distance_km !== null">{{ item.distance_km }} km</span>
        <span v-if="item.distance_km !== null && item.bortle !== null"> &bull; </span>
        <span v-if="item.bortle !== null">Bortle {{ item.bortle }}</span>
        <span v-if="item.distance_km === null && item.bortle === null">{{
          item.country_code
        }}</span>
      </p>
    </div>
    <i class="fas fa-chevron-right text-slate-400 dark:text-slate-600 text-xs"></i>
  </div>
</template>
