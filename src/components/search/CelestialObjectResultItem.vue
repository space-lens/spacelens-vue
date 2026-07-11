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
    class="bg-surface/60 hover:bg-surface-2 border border-line rounded-xl p-3 flex items-center gap-4 cursor-pointer shadow-sm"
    @click="emit('select', props.item)"
  >
    <div
      class="w-10 h-10 rounded-lg bg-starlight/10 text-starlight flex items-center justify-center shrink-0 border border-starlight/20"
    >
      <i class="fas fa-meteor"></i>
    </div>
    <div class="flex-1">
      <p class="font-serif italic font-medium text-ink">{{ item.display_name }}</p>
      <p class="font-mono text-xs text-dust mt-0.5">
        <span v-if="item.required_bortle !== null"
          >Visible jusqu'à Bortle {{ item.required_bortle }}</span
        >
        <span v-else>Nécessite un instrument</span>
      </p>
    </div>
    <span
      v-if="item.visible_tonight"
      class="font-mono text-[10px] bg-starlight/10 text-starlight border border-starlight/30 px-2 py-0.5 rounded shrink-0"
    >
      Idéal ce soir
    </span>
  </div>
</template>
