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
    class="bg-surface/60 hover:bg-surface-2 border border-line rounded-xl p-3 flex items-center gap-4 cursor-pointer shadow-sm"
    @click="emit('select', props.item)"
  >
    <div
      class="w-10 h-10 rounded-lg bg-signal/10 text-signal flex items-center justify-center shrink-0 border border-signal/20"
    >
      <i class="fas fa-map-marker-alt"></i>
    </div>
    <div class="flex-1">
      <p class="font-medium text-ink">{{ item.name }}</p>
      <p class="font-mono text-xs text-dust mt-0.5">
        <span v-if="item.distance_km !== null">{{ item.distance_km }} km</span>
        <span v-if="item.distance_km !== null && item.bortle !== null"> &bull; </span>
        <span v-if="item.bortle !== null">Bortle {{ item.bortle }}</span>
        <span v-if="item.distance_km === null && item.bortle === null">{{
          item.country_code
        }}</span>
      </p>
    </div>
    <i class="fas fa-chevron-right text-dust-dim text-xs"></i>
  </div>
</template>
