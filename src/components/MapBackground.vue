<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import { appState, openSmartPanel, closeSmartPanel } from '../composables/useAppState'
import type { Spot } from '@/types/spot'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let userMarker: L.Marker | null = null

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

const calernSpot: Spot = { title: 'Plateau de Calern', score: 85, bortle: 3 }
const calernCoordinates: L.LatLngExpression = [43.75, 6.91]

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map centered roughly on France/Calern
  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView(calernCoordinates, 9)

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  // Add a custom HTML marker for Plateau de Calern
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex flex-col items-center cursor-pointer group">
        <div class="w-10 h-10 bg-green-500 rounded-full border-[3px] border-white dark:border-slate-900 shadow-lg pin-pulse flex items-center justify-center z-10">
          <span class="font-bold text-white dark:text-slate-900 text-sm">${calernSpot.score}</span>
        </div>
        <span class="mt-1 text-xs font-bold bg-white/90 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md shadow-sm text-slate-900 dark:text-white">Calern</span>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  })

  const marker = L.marker(calernCoordinates, { icon: customIcon }).addTo(map)

  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e)
    openSmartPanel(calernSpot.title, calernSpot.score, calernSpot.bortle)
  })

  map.on('click', () => {
    closeSmartPanel()
  })
})

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

    map.flyTo(latLng, 12)
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
