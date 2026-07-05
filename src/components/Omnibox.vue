<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  appState,
  openSearchOverlay,
  setSelectedDate,
  setBortleMaxFilter,
} from '../composables/useAppState'
import { planningDateLabel } from '@/utils/date'
import { useClickOutside } from '@/composables/useClickOutside'
import DateFilterDropdown from './DateFilterDropdown.vue'
import BortleFilterDropdown from './BortleFilterDropdown.vue'

const isDatePickerOpen = ref(false)
const isBortlePickerOpen = ref(false)
const datePickerContainer = ref<HTMLElement | null>(null)
const bortlePickerContainer = ref<HTMLElement | null>(null)

const dateLabel = computed(() => planningDateLabel(appState.selectedDate))
const bortleLabel = computed(() =>
  appState.bortleMaxFilter === null ? 'Bortle' : `Bortle ≤ ${appState.bortleMaxFilter}`,
)

function toggleDatePicker() {
  isBortlePickerOpen.value = false
  isDatePickerOpen.value = !isDatePickerOpen.value
}

function toggleBortlePicker() {
  isDatePickerOpen.value = false
  isBortlePickerOpen.value = !isBortlePickerOpen.value
}

function handleDateSelect(date: string) {
  isDatePickerOpen.value = false
  setSelectedDate(date)
}

function handleBortleSelect(value: number | null) {
  isBortlePickerOpen.value = false
  setBortleMaxFilter(value)
}

useClickOutside(datePickerContainer, () => {
  isDatePickerOpen.value = false
})
useClickOutside(bortlePickerContainer, () => {
  isBortlePickerOpen.value = false
})
</script>

<template>
  <div
    class="absolute top-0 left-0 right-0 md:left-6 md:w-100 md:right-auto z-20 pointer-events-none"
  >
    <div class="pt-10 md:pt-6 px-4 pb-2">
      <div
        class="pointer-events-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white dark:border-slate-700/50 rounded-2xl shadow-xl flex items-center p-1 cursor-text transition-all hover:bg-white dark:hover:bg-slate-700/90"
        @click="openSearchOverlay"
      >
        <div class="pl-4 pr-2">
          <i class="fas fa-search text-indigo-500 dark:text-indigo-400"></i>
        </div>
        <div class="flex-1 py-3">
          <p class="text-slate-500 dark:text-slate-400 text-sm truncate">
            Lieu, Objet céleste (ex: M42)...
          </p>
        </div>
        <div class="pr-2 hidden md:block">
          <button
            class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <i class="fas fa-sliders-h text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Filtres : flex-wrap plutôt que overflow-x-auto — avec ce dernier, CSS calcule
           automatiquement overflow-y en "auto" aussi (une seule règle "auto" par axe non permise
           quand l'autre n'est pas "visible"), ce qui coupait les menus déroulants qui dépassent
           sous les pastilles. Seulement 2 filtres pour l'instant, le défilement horizontal n'est
           pas nécessaire. -->
      <div class="pointer-events-auto flex flex-wrap gap-2 mt-3 pb-2">
        <div ref="datePickerContainer" class="relative shrink-0">
          <button
            class="shrink-0 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-md border border-indigo-500 flex items-center gap-1.5"
            @click="toggleDatePicker"
          >
            <i class="far fa-calendar"></i>{{ dateLabel }}
          </button>
          <DateFilterDropdown v-if="isDatePickerOpen" @select="handleDateSelect" />
        </div>

        <div ref="bortlePickerContainer" class="relative shrink-0">
          <button
            class="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm border transition-colors flex items-center gap-1.5"
            :class="
              appState.bortleMaxFilter !== null
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border-white dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-700'
            "
            @click="toggleBortlePicker"
          >
            <i class="fas fa-lightbulb"></i>{{ bortleLabel }}
          </button>
          <BortleFilterDropdown v-if="isBortlePickerOpen" @select="handleBortleSelect" />
        </div>
      </div>
    </div>
  </div>
</template>
