<script setup lang="ts">
import Navigation from '../components/Navigation.vue'
import Omnibox from '../components/Omnibox.vue'
import MapBackground from '../components/MapBackground.vue'
import BortleLegend from '../components/BortleLegend.vue'
import SmartPanel from '../components/panel/SmartPanel.vue'
import SearchOverlay from '../components/SearchOverlay.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import MapClickModal from '../components/MapClickModal.vue'
import ReferenceLocationPrompt from '../components/ReferenceLocationPrompt.vue'
import ObjectSuggestionsPanel from '../components/ObjectSuggestionsPanel.vue'
import { appState, locateUser, toggleBortleLayer } from '../composables/useAppState'
</script>

<template>
  <div class="bg-void text-ink overflow-hidden w-full h-screen relative flex">
    <Navigation />

    <main class="flex-1 relative overflow-hidden h-full">
      <!-- LAYER 0 : LA CARTE -->
      <MapBackground />

      <!-- LAYER 1 : OMNIBOX -->
      <Omnibox />

      <!-- Contrôles Carte -->
      <div class="absolute top-[40%] right-4 z-20 flex flex-col gap-3 pointer-events-auto">
        <button
          @click="locateUser"
          :disabled="appState.isLocating"
          class="w-10 h-10 bg-surface/90 backdrop-blur-md border border-line rounded-full flex items-center justify-center text-dust hover:text-ink shadow-lg disabled:opacity-60"
        >
          <i
            class="fas"
            :class="appState.isLocating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'"
          ></i>
        </button>
        <button
          @click="toggleBortleLayer"
          class="w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center shadow-lg transition-colors"
          :class="
            appState.bortleLayerVisible
              ? 'bg-starlight border-starlight-dim text-void'
              : 'bg-surface/90 border-line text-dust hover:text-ink'
          "
          title="Pollution lumineuse (Bortle)"
        >
          <i class="fas fa-layer-group"></i>
        </button>
      </div>

      <!-- Légende des couleurs du layer Bortle : affichée seulement quand il est actif, et
           masquée dès qu'un lieu est sélectionné (le SmartPanel — z-index supérieur — la
           recouvre partiellement en desktop comme en mobile ; un seul niveau d'information à la
           fois, cf. principe de divulgation progressive de l'identité). -->
      <BortleLegend v-if="appState.bortleLayerVisible && !appState.selectedSpot" />

      <!-- LAYER 2 : SMART PANEL -->
      <SmartPanel />

      <!-- Indicateur de chargement (sélection d'un lieu : /v1/recommendations peut prendre
           plusieurs secondes, plusieurs appels météo réels enchaînés) -->
      <LoadingIndicator />

      <!-- Modale de validation d'un point cliqué sur la carte -->
      <MapClickModal />

      <!-- Parcours 2 : demande de lieu de référence après choix d'un objet céleste -->
      <ReferenceLocationPrompt />

      <!-- Parcours 2 : classement des suggestions spatio-temporelles -->
      <ObjectSuggestionsPanel />

      <!-- LAYER 3 : SEARCH OVERLAY -->
      <SearchOverlay />
    </main>

  </div>
</template>
