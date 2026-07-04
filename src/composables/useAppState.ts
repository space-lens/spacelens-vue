import { reactive, watchEffect } from 'vue'
import type { Spot, Coordinates, MapPin } from '@/types/spot'
import type { PanelState } from '@/types/panel'
import { getRecommendations } from '@/lib/api'

export const appState = reactive({
  isDarkMode: false,
  isSearchOverlayVisible: false,
  activeSpot: null as Spot | null,
  panelState: 'closed' as PanelState,
  userPosition: null as Coordinates | null,
  isLocating: false,
  locationError: null as string | null,
  // Lieu recherché/sélectionné (pin principal) et spots alternatifs scorés autour de lui
  // (pastilles), peuplés par selectLocation() via GET /v1/recommendations.
  primarySpot: null as MapPin | null,
  recommendedSpots: [] as MapPin[],
  isLoadingSpots: false,
  spotsError: null as string | null,
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

let recommendationsAbortController: AbortController | null = null

/**
 * Point d'entrée unique quand un lieu est choisi (recherche, géolocalisation) : un seul appel
 * à /v1/recommendations peuple à la fois le pin principal (origin.score) et les pastilles
 * alternatives (spots), cf. CLAUDE.md backend — /v1/weather aurait le même rôle pour le score
 * du point d'origine mais souffre encore du bug "score du jour qui disparaît l'après-midi".
 */
export async function selectLocation(latitude: number, longitude: number, name?: string) {
  recommendationsAbortController?.abort()
  const controller = new AbortController()
  recommendationsAbortController = controller

  appState.isLoadingSpots = true
  appState.spotsError = null

  try {
    const result = await getRecommendations(latitude, longitude, { signal: controller.signal })

    appState.primarySpot = { latitude, longitude, score: result.origin.score, name }
    appState.recommendedSpots = result.spots.map((spot) => ({
      latitude: spot.latitude,
      longitude: spot.longitude,
      score: spot.score,
    }))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    appState.spotsError = error instanceof Error ? error.message : 'Erreur inconnue'
  } finally {
    appState.isLoadingSpots = false
  }
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
