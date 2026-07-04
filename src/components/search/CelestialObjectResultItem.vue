<script setup lang="ts">
import type { CelestialObjectResult } from '@/types/search'

const props = defineProps<{
  item: CelestialObjectResult
}>()

const emit = defineEmits<{
  select: [item: CelestialObjectResult]
}>()
</script>

<template>
  <div
    class="bg-white/60 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 flex items-center gap-4 cursor-pointer shadow-sm"
    @click="emit('select', props.item)"
  >
    <div
      class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0 border border-pink-200 dark:border-pink-500/20"
    >
      <i class="fas fa-meteor"></i>
    </div>
    <div class="flex-1">
      <p class="font-bold text-slate-900 dark:text-slate-200">{{ item.display_name }}</p>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        <span v-if="item.required_bortle !== null"
          >Visible jusqu'à Bortle {{ item.required_bortle }}</span
        >
        <span v-else>Nécessite un instrument</span>
      </p>
    </div>
    <span
      v-if="item.visible_tonight"
      class="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 px-2 py-0.5 rounded shrink-0"
    >
      Idéal ce soir
    </span>
  </div>
</template>
