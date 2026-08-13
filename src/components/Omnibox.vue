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
        class="pointer-events-auto bg-surface/85 backdrop-blur-xl border border-line rounded-2xl shadow-xl flex items-center p-1 cursor-text transition-all hover:bg-surface-2/90"
        @click="openSearchOverlay"
      >
        <div class="pl-4 pr-2">
          <i class="fas fa-search text-starlight"></i>
        </div>
        <div class="flex-1 py-3">
          <p class="text-dust text-sm truncate">Lieu, Objet céleste (ex: M42)...</p>
        </div>
        <div class="pr-2 hidden md:block">
          <button
            class="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center hover:bg-line text-dust transition-colors"
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
            class="shrink-0 bg-starlight text-void px-4 py-1.5 rounded-full text-xs font-medium shadow-md border border-starlight-dim flex items-center gap-1.5"
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
                ? 'bg-starlight text-void border-starlight-dim shadow-md'
                : 'bg-surface/85 backdrop-blur-md text-dust border-line hover:bg-surface-2'
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
