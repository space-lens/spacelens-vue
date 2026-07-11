<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import { PMTiles, leafletRasterLayer } from 'pmtiles'
import {
  appState,
  openSmartPanel,
  selectRecommendedSpot,
  openMapClickModal,
  chooseReferenceLocationForPendingObject,
} from '../composables/useAppState'
import { scoreBgClass } from '@/utils/score'
import { escapeHtml } from '@/utils/html'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let userMarker: L.Marker | null = null
let primaryMarker: L.Marker | null = null
const recommendationMarkers = L.layerGroup()

// Classes Bortle 1-9 (pollution lumineuse), archive PMTiles unique produite par
// ../astro-light-pipeline (voir son CLAUDE.md) à partir de l'ancienne pyramide de tuiles PNG.
// Un seul fichier fetché en HTTP range-requests par le navigateur, cross-origin en prod (CDN) —
// le CDN doit donc renvoyer des en-têtes CORS (Access-Control-Allow-Origin + Range autorisé en
// requête/réponse), sans quoi le fetch échoue silencieusement (tuiles absentes, pas d'erreur
// réseau visible côté onglet). En local, symlink same-origin (public/tiles_bortle.pmtiles →
// ../../astro-light-pipeline/data/exports, cf. .gitignore) pour éviter la question CORS en dev.
const BORTLE_PMTILES_URL = import.meta.env.VITE_BORTLE_PMTILES_URL as string | undefined
const BORTLE_TILES_MIN_ZOOM = 3
// L'archive ne contient des tuiles natives que jusqu'à z11 (cf. astro-light-pipeline). Passer
// ça en `maxZoom` (comme avant) plafonne le zoom de TOUTE la carte à 11 tant que ce layer est
// affiché — Leaflet prend le minimum des `maxZoom` des layers actifs comme limite globale
// (getMaxZoom()/_layersMaxZoom), ce n'est pas propre à ce layer. `maxNativeZoom` évite ça : au-delà
// de z11, Leaflet réaffiche les tuiles z11 zoomées (légèrement floues) au lieu de faire disparaître
// le layer et bloquer le zoom.
const BORTLE_TILES_MAX_NATIVE_ZOOM = 15
const bortleLayer = BORTLE_PMTILES_URL
  ? leafletRasterLayer(new PMTiles(BORTLE_PMTILES_URL), {
      minZoom: BORTLE_TILES_MIN_ZOOM,
      maxNativeZoom: BORTLE_TILES_MAX_NATIVE_ZOOM,
      opacity: 0.5,
      attribution: 'Pollution lumineuse : VIIRS/NASA (via astro-light-pipeline)',
    })
  : null

// Vue par défaut (France) tant qu'aucun lieu n'a été recherché/géolocalisé.
const DEFAULT_CENTER: L.LatLngExpression = [46.6, 2.5]
const DEFAULT_ZOOM = 6
const SELECTED_LOCATION_ZOOM = 11

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative flex items-center justify-center w-5 h-5">
      <div class="absolute w-5 h-5 bg-starlight/30 rounded-full user-location-pulse"></div>
      <div class="w-3.5 h-3.5 bg-starlight rounded-full border-2 border-ink shadow-md"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function scoreLabel(score: number | null): string {
  return score === null ? '--' : String(score)
}

// Pin principal (lieu recherché) : cercle avec le score et un label sous le pin, même design
// que l'ancien marker Calern codé en dur.
function createPrimaryIcon(score: number | null, name?: string): L.DivIcon {
  const bgClass = score === null ? 'bg-dust-dim' : scoreBgClass(score)
  const label = name
    ? `<span class="mt-1 text-xs font-serif italic font-medium bg-surface/90 px-2 py-0.5 rounded backdrop-blur-md shadow-sm text-ink">${escapeHtml(name)}</span>`
    : ''

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex flex-col items-center cursor-pointer group">
        <div class="w-10 h-10 ${bgClass} rounded-full border-[3px] border-void shadow-lg pin-pulse flex items-center justify-center z-10">
          <span class="font-bold text-white text-sm">${scoreLabel(score)}</span>
        </div>
        ${label}
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  })
}

// Pastille de recommandation : plus petite, pas de label, pas de pulse (réservé au pin
// principal pour ne pas avoir 10 pastilles clignotantes en même temps).
function createRecommendationIcon(score: number): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="w-8 h-8 ${scoreBgClass(score)} rounded-full border-2 border-void shadow-md flex items-center justify-center cursor-pointer">
        <span class="font-bold text-white text-xs">${score}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Centre la carte sur le pin cliqué, sans changer le zoom (contrairement à la sélection d'un
// nouveau lieu, qui fait un flyTo avec zoom, cf. watch sur primarySpot).
function centerOn(latLng: L.LatLngExpression) {
  map?.panTo(latLng, { animate: true })
}

onMounted(() => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  if (bortleLayer && appState.bortleLayerVisible) {
    bortleLayer.addTo(map)
  }

  recommendationMarkers.addTo(map)

  // Clic direct sur la carte (pas un marker, cf. stopPropagation sur leurs handlers) : si un objet
  // céleste est en attente d'un lieu de référence (Parcours 2, sélection dans l'Omnibox), le clic
  // lance le moteur spatio-temporel pour ce lieu ; sinon comportement habituel (Parcours 1, modale
  // de validation avant calcul de score).
  map.on('click', (e: L.LeafletMouseEvent) => {
    if (appState.pendingCelestialObject) {
      void chooseReferenceLocationForPendingObject(e.latlng.lat, e.latlng.lng)
    } else {
      void openMapClickModal(e.latlng.lat, e.latlng.lng)
    }
  })
})

watch(
  () => appState.primarySpot,
  (spot) => {
    if (!map) return

    if (primaryMarker) {
      primaryMarker.remove()
      primaryMarker = null
    }

    if (!spot) return

    const latLng: L.LatLngExpression = [spot.latitude, spot.longitude]
    primaryMarker = L.marker(latLng, {
      icon: createPrimaryIcon(spot.score, spot.name),
      zIndexOffset: 500,
    }).addTo(map)
    primaryMarker.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      centerOn(latLng)
      openSmartPanel()
    })

    map.flyTo(latLng, SELECTED_LOCATION_ZOOM)
  },
)

watch(
  [() => appState.recommendedSpots, () => appState.bortleMaxFilter],
  ([spots, bortleMaxFilter]) => {
    recommendationMarkers.clearLayers()

    for (const spot of spots) {
      if (spot.score === null) continue
      if (bortleMaxFilter !== null && spot.bortle != null && spot.bortle > bortleMaxFilter) continue

      const latLng: L.LatLngExpression = [spot.latitude, spot.longitude]
      const marker = L.marker(latLng, { icon: createRecommendationIcon(spot.score) })
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        centerOn(latLng)
        void selectRecommendedSpot(spot)
      })
      recommendationMarkers.addLayer(marker)
    }
  },
)

watch(
  () => appState.bortleLayerVisible,
  (visible) => {
    if (!map || !bortleLayer) return

    if (visible) {
      bortleLayer.addTo(map)
    } else {
      bortleLayer.remove()
    }
  },
)

watch(
  () => appState.userPosition,
  (position) => {
    if (!map || !position) {
      return
    }

    const latLng: L.LatLngExpression = [position.lat, position.lng]

    if (userMarker) {
      userMarker.setLatLng(latLng)
    } else {
      userMarker = L.marker(latLng, { icon: userLocationIcon, zIndexOffset: 1000 }).addTo(map)
    }

    // Ne recentre sur la position utilisateur que s'il n'y a pas déjà un lieu sélectionné —
    // sinon "Me localiser" écraserait le lieu qu'on vient de rechercher.
    if (!appState.primarySpot) {
      map.flyTo(latLng, 12)
    }
  },
)

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div ref="mapContainer" class="map-bg absolute inset-0 z-0 cursor-crosshair"></div>
</template>

<style>
/* Leaflet overriding to ensure it blends nicely */
.leaflet-container {
  background: transparent !important;
}
.custom-marker,
.user-location-marker {
  background: transparent;
  border: none;
}
.user-location-pulse {
  animation: user-location-pulse 2s ease-out infinite;
}
@keyframes user-location-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>
