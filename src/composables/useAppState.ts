import { reactive, watchEffect } from 'vue'
import type { Spot, Coordinates } from '@/types/spot'
import type { PanelState } from '@/types/panel'

export const appState = reactive({
  isDarkMode: false,
  isSearchOverlayVisible: false,
  activeSpot: null as Spot | null,
  panelState: 'closed' as PanelState,
  userPosition: null as Coordinates | null,
  isLocating: false,
  locationError: null as string | null,
})

export function toggleTheme() {
  appState.isDarkMode = !appState.isDarkMode
}

export function openSmartPanel(title: string, score: number, bortle: number) {
  appState.activeSpot = { title, score, bortle }
  appState.panelState = 'peek'
}

export function closeSmartPanel() {
  appState.panelState = 'closed'
}

export function togglePanelExpand() {
  if (appState.panelState === 'peek') {
    appState.panelState = 'expanded'
  } else if (appState.panelState === 'expanded') {
    appState.panelState = 'peek'
  }
}

export function openSearchOverlay() {
  appState.isSearchOverlayVisible = true
}

export function closeSearchOverlay() {
  appState.isSearchOverlayVisible = false
}

export function locateUser() {
  if (!navigator.geolocation) {
    appState.locationError = "La géolocalisation n'est pas supportée par ce navigateur."
    return
  }

  appState.isLocating = true
  appState.locationError = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      appState.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      appState.isLocating = false
    },
    (error) => {
      appState.locationError = error.message
      appState.isLocating = false
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

// Watch for dark mode changes and apply to HTML tag
if (typeof window !== 'undefined') {
  // Initialize from document if already set (e.g. by index.html)
  if (document.documentElement.classList.contains('dark')) {
    appState.isDarkMode = true
  }

  watchEffect(() => {
    if (appState.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
}
