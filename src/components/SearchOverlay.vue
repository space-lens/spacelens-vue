<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import {
  appState,
  closeSearchOverlay,
  selectLocation,
  selectCelestialObjectForPlanning,
} from '../composables/useAppState'
import type { RecentSearch, LocationResult, CelestialObjectResult } from '@/types/search'
import RecentSearchItem from './search/RecentSearchItem.vue'
import LocationResultItem from './search/LocationResultItem.vue'
import CelestialObjectResultItem from './search/CelestialObjectResultItem.vue'
import { searchOmnibox } from '@/lib/api'

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 300

type TabValue = 'all' | 'locations' | 'objects'

const tabs: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'locations', label: 'Lieux' },
  { value: 'objects', label: 'Objets Célestes' },
]

const searchInput = ref<HTMLInputElement | null>(null)
const query = ref('')
const activeTab = ref<TabValue>('all')

const locations = ref<LocationResult[]>([])
const celestialObjects = ref<CelestialObjectResult[]>([])
const isSearching = ref(false)
const searchError = ref<string | null>(null)

const recentSearches: RecentSearch[] = [
  { title: 'Plateau de Calern', bortle: 3, icon: 'fa-map-marker-alt' },
]

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let abortController: AbortController | null = null

watch(query, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  const trimmed = value.trim()
  if (trimmed.length < MIN_QUERY_LENGTH) {
    abortController?.abort()
    locations.value = []
    celestialObjects.value = []
    searchError.value = null
    isSearching.value = false
    return
  }

  debounceTimer = setTimeout(() => runSearch(trimmed), DEBOUNCE_MS)
})

watch(activeTab, () => {
  const trimmed = query.value.trim()
  if (trimmed.length >= MIN_QUERY_LENGTH) {
    runSearch(trimmed)
  }
})

async function runSearch(term: string) {
  abortController?.abort()
  const controller = new AbortController()
  abortController = controller

  isSearching.value = true
  searchError.value = null

  const type =
    activeTab.value === 'locations'
      ? 'location'
      : activeTab.value === 'objects'
        ? 'celestial_object'
        : undefined

  try {
    const result = await searchOmnibox(term, {
      latitude: appState.userPosition?.lat,
      longitude: appState.userPosition?.lng,
      type,
      signal: controller.signal,
    })
    locations.value = result.locations
    celestialObjects.value = result.celestial_objects
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    searchError.value = error instanceof Error ? error.message : 'Recherche indisponible'
  } finally {
    isSearching.value = false
  }
}

function selectLocationResult(item: LocationResult) {
  closeSearchOverlay()
  selectLocation(item.latitude, item.longitude, item.name)
}

function selectCelestialObjectResult(item: CelestialObjectResult) {
  selectCelestialObjectForPlanning(item.slug, item.display_name)
}

watch(
  () => appState.isSearchOverlayVisible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick()
      setTimeout(() => {
        searchInput.value?.focus()
      }, 300)
    } else {
      query.value = ''
      activeTab.value = 'all'
    }
  },
)
</script>

<template>
  <div
    class="absolute inset-0 z-50 bg-void/95 backdrop-blur-xl transition-all duration-300 flex flex-col"
    :class="appState.isSearchOverlayVisible ? 'search-visible' : 'search-hidden'"
  >
    <div class="pt-10 md:pt-6 px-4 md:px-8 pb-0 border-b border-line bg-surface/70">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <button
          @click="closeSearchOverlay"
          class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-2 text-dust"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div
          class="flex-1 bg-surface border border-starlight-dim/50 rounded-xl flex items-center p-2 shadow-inner ring-2 ring-starlight/10"
        >
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            placeholder="Lieu, objet céleste (ex: M42)..."
            class="bg-transparent border-none outline-none text-ink w-full px-2"
            autocomplete="off"
          />
          <button
            v-if="query"
            class="w-8 h-8 flex items-center justify-center text-dust-dim hover:text-dust"
            @click="query = ''"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="max-w-3xl mx-auto flex gap-6 mt-4 px-2 overflow-x-auto no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="pb-3 whitespace-nowrap font-semibold border-b-2 transition-colors"
          :class="
            activeTab === tab.value
              ? 'text-starlight border-starlight'
              : 'text-dust-dim border-transparent hover:text-dust'
          "
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 md:p-8">
      <div class="max-w-3xl mx-auto space-y-8 pb-20 mt-2">
        <div v-if="query.trim().length < MIN_QUERY_LENGTH">
          <h4 class="font-mono text-xs font-medium text-dust uppercase tracking-wider mb-3">
            Lieux récents
          </h4>
          <RecentSearchItem
            v-for="item in recentSearches"
            :key="item.title"
            :item="item"
            @select="closeSearchOverlay"
          />
        </div>

        <template v-else>
          <p v-if="isSearching" class="text-sm text-dust-dim text-center">Recherche…</p>
          <p v-else-if="searchError" class="text-sm text-poor text-center">{{ searchError }}</p>
          <template v-else>
            <div v-if="activeTab !== 'objects' && locations.length > 0">
              <h4 class="font-mono text-xs font-medium text-dust uppercase tracking-wider mb-3">
                Lieux
              </h4>
              <div class="space-y-2">
                <LocationResultItem
                  v-for="item in locations"
                  :key="`${item.latitude}-${item.longitude}`"
                  :item="item"
                  @select="selectLocationResult"
                />
              </div>
            </div>

            <div v-if="activeTab !== 'locations' && celestialObjects.length > 0">
              <h4 class="font-mono text-xs font-medium text-dust uppercase tracking-wider mb-3">
                Objets célestes
              </h4>
              <div class="space-y-2">
                <CelestialObjectResultItem
                  v-for="item in celestialObjects"
                  :key="item.slug"
                  :item="item"
                  @select="selectCelestialObjectResult"
                />
              </div>
            </div>

            <p
              v-if="locations.length === 0 && celestialObjects.length === 0"
              class="text-sm text-dust-dim text-center"
            >
              Aucun résultat pour « {{ query }} »
            </p>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
