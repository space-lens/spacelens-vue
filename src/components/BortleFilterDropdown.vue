<script setup lang="ts">
const emit = defineEmits<{
  select: [value: number | null]
}>()

// Descriptions courtes de l'échelle Bortle (1 = ciel le plus pur, 9 = plein centre-ville) — aide
// à choisir un seuil sans connaître l'échelle par cœur.
const BORTLE_LEVELS: { value: number; label: string }[] = [
  { value: 1, label: "Ciel d'exception" },
  { value: 2, label: 'Ciel très sombre' },
  { value: 3, label: 'Ciel rural' },
  { value: 4, label: 'Rural/périurbain' },
  { value: 5, label: 'Périurbain' },
  { value: 6, label: 'Urbain clair' },
  { value: 7, label: 'Urbain' },
  { value: 8, label: 'Urbain dense' },
  { value: 9, label: 'Centre-ville' },
]
</script>

<template>
  <div
    class="absolute top-full left-0 mt-2 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl p-2 w-56 max-h-80 overflow-y-auto no-scrollbar"
  >
    <p
      class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 pt-1 pb-2"
    >
      Bortle maximum accepté
    </p>
    <button
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2"
      @click="emit('select', null)"
    >
      <i class="fas fa-infinity text-indigo-400 text-xs w-3 text-center"></i>
      Tous les Bortle
    </button>
    <button
      v-for="level in BORTLE_LEVELS"
      :key="level.value"
      class="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2"
      @click="emit('select', level.value)"
    >
      <i class="fas fa-lightbulb text-indigo-400 text-xs w-3 text-center"></i>
      Bortle ≤ {{ level.value }}
      <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">{{ level.label }}</span>
    </button>
  </div>
</template>
