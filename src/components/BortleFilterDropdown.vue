<script setup lang="ts">
import { BORTLE_LEVELS } from '@/utils/bortle'

const emit = defineEmits<{
  select: [value: number | null]
}>()
</script>

<template>
  <div
    class="absolute top-full left-0 mt-2 z-30 bg-surface/95 backdrop-blur-xl border border-line rounded-2xl shadow-xl p-2 w-56 max-h-80 overflow-y-auto no-scrollbar"
  >
    <p class="font-mono text-[10px] font-medium text-dust uppercase tracking-wider px-2 pt-1 pb-2">
      Bortle maximum accepté
    </p>
    <button
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-2 transition-colors flex items-center gap-2"
      @click="emit('select', null)"
    >
      <i class="fas fa-infinity text-starlight text-xs w-3 text-center"></i>
      Tous les Bortle
    </button>
    <button
      v-for="level in BORTLE_LEVELS"
      :key="level.value"
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-2 transition-colors flex items-center gap-2"
      @click="emit('select', level.value)"
    >
      <i class="fas fa-lightbulb text-starlight text-xs w-3 text-center"></i>
      Bortle ≤ {{ level.value }}
      <span class="font-mono text-[10px] text-dust-dim ml-auto">{{ level.label }}</span>
    </button>
  </div>
</template>
