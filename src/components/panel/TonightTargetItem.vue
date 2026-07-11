<script setup lang="ts">
import { computed } from 'vue'
import type { TonightTarget } from '@/types/panel'
import { celestialIconStyle } from '@/utils/celestialIcons'

const props = defineProps<{
  target: TonightTarget
}>()

const iconStyle = computed(() => celestialIconStyle(props.target.objectType))

// En dessous, l'objet rase l'horizon (turbulence/extinction atmosphérique bien plus fortes) —
// seuil indicatif, pas une limite scientifique stricte.
const isWellPlaced = computed(() => props.target.maxAltitudeDeg >= 30)

const transitLabel = computed(() => {
  if (!props.target.transitAt) {
    return null
  }
  return new Date(props.target.transitAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div
    class="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex gap-4 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
  >
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border"
      :class="[iconStyle.bgClass, iconStyle.borderClass]"
    >
      <i class="fas text-xl" :class="[iconStyle.icon, iconStyle.textClass]"></i>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">
            {{ target.displayName }}
          </h4>
          <p class="text-[10px] text-slate-500 mt-0.5">
            {{ target.objectTypeLabel }}
            <span v-if="target.apparentMagnitude !== null">
              &bull; Mag {{ target.apparentMagnitude }}</span
            >
          </p>
        </div>
        <span
          class="w-2 h-2 rounded-full mt-1 shrink-0"
          :class="
            isWellPlaced ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-orange-400'
          "
        ></span>
      </div>
      <div
        class="mt-2 flex gap-3 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded flex-wrap"
      >
        <span v-if="transitLabel"
          ><i class="fas fa-arrow-up text-indigo-400 mr-1"></i> Transit {{ transitLabel }}</span
        >
        <span
          ><i class="fas fa-angle-up text-indigo-400 mr-1"></i> Alt
          {{ Math.round(target.maxAltitudeDeg) }}°</span
        >
      </div>
      <p
        v-if="!isWellPlaced"
        class="mt-1.5 text-[10px] font-medium text-orange-600 dark:text-orange-400"
      >
        Bas sur l'horizon, observation moins favorable.
      </p>
    </div>
  </div>
</template>
