<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import { appState } from '../composables/useAppState'
import { scoreBgClass } from '@/utils/score'
import { escapeHtml } from '@/utils/html'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let userMarker: L.Marker | null = null
let primaryMarker: L.Marker | null = null
const recommendationMarkers = L.layerGroup()

// Vue par défaut (France) tant qu'aucun lieu n'a été recherché/géolocalisé.
const DEFAULT_CENTER: L.LatLngExpression = [46.6, 2.5]
const DEFAULT_ZOOM = 6
const SELECTED_LOCATION_ZOOM = 11

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative flex items-center justify-center w-5 h-5">
      <div class="absolute w-5 h-5 bg-indigo-500/30 rounded-full user-location-pulse"></div>
      <div class="w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white shadow-md"></div>
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
  const bgClass = score === null ? 'bg-slate-400' : scoreBgClass(score)
  const label = name
    ? `<span class="mt-1 text-xs font-bold bg-white/90 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md shadow-sm text-slate-900 dark:text-white">${escapeHtml(name)}</span>`
    : ''

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex flex-col items-center cursor-pointer group">
        <div class="w-10 h-10 ${bgClass} rounded-full border-[3px] border-white dark:border-slate-900 shadow-lg pin-pulse flex items-center justify-center z-10">
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
      <div class="w-8 h-8 ${scoreBgClass(score)} rounded-full border-2 border-white dark:border-slate-900 shadow-md flex items-center justify-center cursor-pointer">
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

  recommendationMarkers.addTo(map)
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
    primaryMarker = L.marker(latLng, { icon: createPrimaryIcon(spot.score, spot.name), zIndexOffset: 500 }).addTo(map)
    primaryMarker.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      centerOn(latLng)
    })

    map.flyTo(latLng, SELECTED_LOCATION_ZOOM)
  },
)

watch(
  () => appState.recommendedSpots,
  (spots) => {
    recommendationMarkers.clearLayers()

    for (const spot of spots) {
      const latLng: L.LatLngExpression = [spot.latitude, spot.longitude]
      if (spot.score === null) continue

      const marker = L.marker(latLng, { icon: createRecommendationIcon(spot.score) })
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        centerOn(latLng)
      })
      recommendationMarkers.addLayer(marker)
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
