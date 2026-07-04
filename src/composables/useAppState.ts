import { reactive, watchEffect } from 'vue'
import type { Coordinates, MapPin } from '@/types/spot'
import type { PanelState, HourlyWeather, TonightTarget, SelectedSpotDetail } from '@/types/panel'
import type { WeatherResponse } from '@/types/weather'
import type { TonightTargetApiItem } from '@/types/celestialTonight'
import { getRecommendations, getWeather, getTonightCelestialObjects } from '@/lib/api'

const TONIGHT_TARGETS_LIMIT = 5

export const appState = reactive({
  isDarkMode: false,
  isSearchOverlayVisible: false,
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
  // Détail affiché dans le SmartPanel pour le lieu sélectionné (distinct de primarySpot, qui ne
  // sert qu'au placement du marqueur sur la carte).
  selectedSpot: null as SelectedSpotDetail | null,
  selectedHourIndex: 0,
})

export function toggleTheme() {
  appState.isDarkMode = !appState.isDarkMode
}

export function openSmartPanel() {
  if (appState.selectedSpot) {
    appState.panelState = 'peek'
  }
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

export function selectHour(index: number) {
  if (appState.selectedSpot && index >= 0 && index < appState.selectedSpot.hourly.length) {
    appState.selectedHourIndex = index
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
 * Point d'entrée unique quand un lieu est choisi (recherche, géolocalisation) : peuple en un
 * seul lot le pin principal + les pastilles (GET /v1/recommendations) et le détail du SmartPanel
 * (GET /v1/weather + GET /v1/celestial-objects/tonight). Les trois appels partagent le même
 * lieu/nuit déjà synchronisé par la première requête (voir CLAUDE.md backend), donc les deux
 * suivants ne déclenchent pas de nouvel appel météo externe.
 */
export async function selectLocation(latitude: number, longitude: number, name?: string) {
  recommendationsAbortController?.abort()
  const controller = new AbortController()
  recommendationsAbortController = controller

  appState.isLoadingSpots = true
  appState.spotsError = null

  try {
    const [recommendations, weather, targets] = await Promise.all([
      getRecommendations(latitude, longitude, { signal: controller.signal }),
      getWeather(latitude, longitude, { signal: controller.signal }),
      getTonightCelestialObjects(latitude, longitude, {
        limit: TONIGHT_TARGETS_LIMIT,
        signal: controller.signal,
      }),
    ])

    appState.primarySpot = { latitude, longitude, score: recommendations.origin.score, name }
    appState.recommendedSpots = recommendations.spots.map((spot) => ({
      latitude: spot.latitude,
      longitude: spot.longitude,
      score: spot.score,
    }))

    const hourly = buildHourlyWeather(weather)

    appState.selectedSpot = {
      name: name ?? formatCoordinates(latitude, longitude),
      latitude,
      longitude,
      bortle: recommendations.origin.bortle,
      hourly,
      targets: targets.map(toTonightTarget),
    }
    appState.selectedHourIndex = bestScoreHourIndex(hourly)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    appState.spotsError = error instanceof Error ? error.message : 'Erreur inconnue'
  } finally {
    appState.isLoadingSpots = false
  }
}

function buildHourlyWeather(weather: WeatherResponse): HourlyWeather[] {
  const day = Object.values(weather)[0]
  if (!day?.hours) {
    return []
  }

  return Object.entries(day.hours)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, hour]) => ({
      time,
      score: hour.score,
      temperatureC: hour.temperature,
      cloudinessPercent: hour.cloudiness,
      humidityPercent: hour.humidity,
      windSpeedKmh: hour.wind_speed,
      rainProbabilityPercent: hour.rain_probability,
    }))
}

// "Meilleur score par défaut, première occurrence en cas d'égalité" : ">" strict ne remplace
// jamais l'index déjà retenu pour un score simplement égal.
function bestScoreHourIndex(hourly: HourlyWeather[]): number {
  let bestIndex = 0
  let bestScore = hourly[0]?.score ?? -Infinity

  for (let i = 1; i < hourly.length; i++) {
    const score = hourly[i]?.score
    if (score !== undefined && score > bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  return bestIndex
}

function toTonightTarget(item: TonightTargetApiItem): TonightTarget {
  return {
    slug: item.slug,
    displayName: item.display_name,
    objectType: item.object_type,
    objectTypeLabel: item.object_type_label,
    apparentMagnitude: item.apparent_magnitude,
    transitAt: item.transit_at,
    maxAltitudeDeg: item.max_altitude_deg,
  }
}

function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`
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
