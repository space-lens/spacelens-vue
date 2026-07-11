<script setup lang="ts">
import type { RecentSearch } from '@/types/search'

const props = defineProps<{
  item: RecentSearch
}>()

const emit = defineEmits<{
  select: [item: RecentSearch]
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
      <i class="fas" :class="item.icon"></i>
    </div>
    <div class="flex-1">
      <p class="font-medium text-ink">{{ item.title }}</p>
      <p class="font-mono text-xs text-dust mt-0.5">Bortle {{ item.bortle }}</p>
    </div>
  </div>
</template>
