<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import { appState, openSmartPanel, closeSmartPanel } from '../composables/useAppState'

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map centered roughly on France/Calern
  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([43.75, 6.91], 9)

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
          <span class="font-bold text-white dark:text-slate-900 text-sm">85</span>
        </div>
        <span class="mt-1 text-xs font-bold bg-white/90 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md shadow-sm text-slate-900 dark:text-white">Calern</span>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30]
  })

  const marker = L.marker([43.75, 6.91], { icon: customIcon }).addTo(map)
  
  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e)
    openSmartPanel('Plateau de Calern', 85, 3)
  })

  map.on('click', () => {
    closeSmartPanel()
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div 
    ref="mapContainer" 
    class="map-bg absolute inset-0 z-0 cursor-crosshair"
  ></div>
</template>

<style>
/* Leaflet overriding to ensure it blends nicely */
.leaflet-container {
  background: transparent !important;
}
.custom-marker {
  background: transparent;
  border: none;
}
</style>
