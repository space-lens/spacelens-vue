import { reactive } from 'vue'
import type { Coordinates, MapPin } from '@/types/spot'
import type { PanelState, HourlyWeather, TonightTarget, SelectedSpotDetail } from '@/types/panel'
import type { WeatherResponse, WeatherDayEntry } from '@/types/weather'
import type { TonightTargetApiItem } from '@/types/celestialTonight'
import type { LocationResolveRejectionReason } from '@/types/location'
import type { SpatioTemporalSuggestion } from '@/types/celestialObjectSuggestions'
import {
  getRecommendations,
  getWeather,
  getTonightCelestialObjects,
  resolveLocation,
  getSpatioTemporalSuggestions,
} from '@/lib/api'

// Une soirée d'observation déborde sur le lendemain matin : on va chercher les créneaux nocturnes
// du lendemain jusqu'à cette heure plutôt que de couper la nuit à minuit.
const NEXT_DAY_HOURLY_CUTOFF = '08:00'

const TONIGHT_TARGETS_LIMIT = 5

// État de la modale de validation d'un point cliqué sur la carte (Parcours 1, clic direct) :
// 'loading' pendant l'appel à GET /v1/locations/resolve, puis 'valid' (nom/bortle éventuels,
// prêt pour confirmation) ou 'invalid' (mer/hors couverture, rejeté avant tout calcul coûteux)
// selon la réponse, ou 'error' pour un échec réseau distinct des rejets métier du backend.
export type MapClickModalState =
  | { status: 'loading'; latitude: number; longitude: number }
  | {
      status: 'valid'
      latitude: number
      longitude: number
      name: string | null
      bortle: number | null
    }
  | {
      status: 'invalid'
      latitude: number
      longitude: number
      reason: LocationResolveRejectionReason
    }
  | { status: 'error'; latitude: number; longitude: number; message: string }

// État du panneau de suggestions spatio-temporelles (Parcours 2, approche par l'objet) : 'loading'
// pendant l'appel à GET /v1/celestial-objects/{slug}/spatio-temporal-suggestions, puis 'loaded'
// (classement date+lieu) ou 'error'.
export type ObjectSuggestionsState =
  | { status: 'loading'; slug: string; displayName: string }
  | {
      status: 'loaded'
      slug: string
      displayName: string
      requiredBortle: number | null
      daysScanned: number
      lightPollutionCoverageAvailable: boolean
      suggestions: SpatioTemporalSuggestion[]
    }
  | { status: 'error'; slug: string; displayName: string; message: string }

export const appState = reactive({
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
  // Filtre Bortle de l'Omnibox : purement client, masque les pastilles de recommandation dont le
  // Bortle dépasse ce seuil (déjà connu sur chaque MapPin, aucun appel supplémentaire). null =
  // aucun filtre, toutes les pastilles affichées.
  bortleMaxFilter: null as number | null,
  // Date de planification choisie via le calendrier de l'Omnibox — null = comportement par
  // défaut du backend ("ce soir", résolu dans le fuseau du lieu, cf. TimezoneResolver).
  selectedDate: null as string | null,
  // Modale de validation d'un point cliqué sur la carte — null = aucune modale affichée.
  mapClickModal: null as MapClickModalState | null,
  // Objet céleste choisi dans l'Omnibox, en attente d'un lieu de référence (clic carte ou
  // géolocalisation) pour lancer le moteur spatio-temporel — null = pas de sélection en attente.
  pendingCelestialObject: null as { slug: string; displayName: string } | null,
  // Résultat du moteur spatio-temporel pour l'objet + lieu de référence choisis.
  objectSuggestions: null as ObjectSuggestionsState | null,
  // Layer Bortle (pollution lumineuse) sur la carte — visible par défaut (recommandation du
  // pipeline astro-light-pipeline), togglable via le bouton calque.
  bortleLayerVisible: true,
})

export function toggleBortleLayer() {
  appState.bortleLayerVisible = !appState.bortleLayerVisible
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

export function setBortleMaxFilter(value: number | null) {
  appState.bortleMaxFilter = value
}

/**
 * Change la date de planification (calendrier de l'Omnibox, 8 prochains jours) et rafraîchit le
 * lieu actuellement recherché si il y en a un — les pastilles/le pin/le panel doivent refléter la
 * nuit choisie, pas rester sur "ce soir".
 */
export function setSelectedDate(date: string | null) {
  appState.selectedDate = date

  if (appState.primarySpot) {
    void selectLocation(
      appState.primarySpot.latitude,
      appState.primarySpot.longitude,
      appState.primarySpot.name,
    )
  }
}

let mapClickAbortController: AbortController | null = null

/**
 * Clic direct sur la carte (pas une recherche/pastille) : résout d'abord le point via
 * GET /v1/locations/resolve (rapide, pas d'appel météo externe) avant d'afficher la modale de
 * validation — évite de déclencher un calcul de score coûteux pour un point en mer ou hors
 * couverture pollution lumineuse.
 */
export async function openMapClickModal(latitude: number, longitude: number) {
  mapClickAbortController?.abort()
  const controller = new AbortController()
  mapClickAbortController = controller

  appState.mapClickModal = { status: 'loading', latitude, longitude }

  try {
    const result = await resolveLocation(latitude, longitude, { signal: controller.signal })

    appState.mapClickModal =
      result.valid && result.reason === null
        ? { status: 'valid', latitude, longitude, name: result.name, bortle: result.bortle }
        : { status: 'invalid', latitude, longitude, reason: result.reason ?? 'sea_point' }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    appState.mapClickModal = {
      status: 'error',
      latitude,
      longitude,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

export function closeMapClickModal() {
  mapClickAbortController?.abort()
  appState.mapClickModal = null
}

/**
 * Validation du point par l'utilisateur : réutilise exactement le pipeline de sélection d'un
 * lieu (recommandations + détail météo/cibles), puis ouvre le SmartPanel une fois les données
 * chargées — pas avant, sinon le panel s'ouvrirait sur le spot encore sélectionné précédemment.
 */
export async function confirmMapClickModal() {
  if (appState.mapClickModal?.status !== 'valid') return

  const { latitude, longitude, name } = appState.mapClickModal
  appState.mapClickModal = null

  await selectLocation(latitude, longitude, name ?? undefined)
  openSmartPanel()
}

/**
 * Choix d'un objet céleste dans l'Omnibox (Parcours 2) : ferme l'overlay de recherche et attend
 * un lieu de référence (clic carte ou géolocalisation, cf. ReferenceLocationPrompt) avant de
 * lancer le moteur spatio-temporel — pas de calcul tant que le lieu n'est pas fixé explicitement.
 */
export function selectCelestialObjectForPlanning(slug: string, displayName: string) {
  closeSearchOverlay()
  appState.pendingCelestialObject = { slug, displayName }
}

export function cancelPendingCelestialObject() {
  appState.pendingCelestialObject = null
}

/**
 * Lieu de référence choisi (clic carte) pour l'objet en attente : lance le moteur spatio-temporel
 * et affiche le classement dans ObjectSuggestionsPanel.
 */
export async function chooseReferenceLocationForPendingObject(latitude: number, longitude: number) {
  const pending = appState.pendingCelestialObject
  if (!pending) return

  appState.pendingCelestialObject = null
  appState.objectSuggestions = { status: 'loading', slug: pending.slug, displayName: pending.displayName }

  try {
    const result = await getSpatioTemporalSuggestions(pending.slug, latitude, longitude)

    appState.objectSuggestions = {
      status: 'loaded',
      slug: pending.slug,
      displayName: pending.displayName,
      requiredBortle: result.object.required_bortle,
      daysScanned: result.days_scanned,
      lightPollutionCoverageAvailable: result.light_pollution_coverage_available,
      suggestions: result.suggestions,
    }
  } catch (error) {
    appState.objectSuggestions = {
      status: 'error',
      slug: pending.slug,
      displayName: pending.displayName,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/** Variante géolocalisation du choix de lieu de référence (bouton "Utiliser ma position"). */
export function requestGeolocationForPendingObject() {
  if (!navigator.geolocation) {
    appState.locationError = "La géolocalisation n'est pas supportée par ce navigateur."
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      appState.userPosition = { lat: position.coords.latitude, lng: position.coords.longitude }
      void chooseReferenceLocationForPendingObject(position.coords.latitude, position.coords.longitude)
    },
    (error) => {
      appState.locationError = error.message
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

export function closeObjectSuggestions() {
  appState.objectSuggestions = null
}

/**
 * Choix d'une suggestion précise (date + lieu) : fixe la date de planification et réutilise
 * exactement le pipeline de sélection existant (recommandations + détail météo/cibles), comme le
 * clic sur la carte (confirmMapClickModal) ou une pastille de recommandation.
 */
export async function selectObjectSuggestion(suggestion: SpatioTemporalSuggestion) {
  appState.objectSuggestions = null
  appState.selectedDate = suggestion.date

  await selectLocation(suggestion.latitude, suggestion.longitude)
  openSmartPanel()
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

let selectionAbortController: AbortController | null = null

/**
 * Point d'entrée unique quand un lieu est choisi (recherche, géolocalisation) : peuple en un
 * seul lot le pin principal + les pastilles (GET /v1/recommendations) et le détail du SmartPanel
 * (via loadSpotDetail). Les appels partagent le même lieu/nuit déjà synchronisé par la première
 * requête (voir CLAUDE.md backend), donc les suivants ne déclenchent pas de nouvel appel météo
 * externe.
 */
export async function selectLocation(latitude: number, longitude: number, name?: string) {
  selectionAbortController?.abort()
  const controller = new AbortController()
  selectionAbortController = controller

  appState.isLoadingSpots = true
  appState.spotsError = null

  try {
    const [recommendations, detail] = await Promise.all([
      getRecommendations(latitude, longitude, {
        date: appState.selectedDate ?? undefined,
        signal: controller.signal,
      }),
      loadSpotDetail(latitude, longitude, name, controller.signal),
    ])

    appState.primarySpot = { latitude, longitude, score: recommendations.origin.score, name }
    appState.recommendedSpots = recommendations.spots.map((spot) => ({
      latitude: spot.latitude,
      longitude: spot.longitude,
      score: spot.score,
      bortle: spot.bortle,
    }))

    appState.selectedSpot = { ...detail, bortle: recommendations.origin.bortle }
    appState.selectedHourIndex = bestScoreHourIndex(detail.hourly)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    appState.spotsError = error instanceof Error ? error.message : 'Erreur inconnue'
  } finally {
    appState.isLoadingSpots = false
  }
}

/**
 * Ouvre le SmartPanel pour une pastille de recommandation (pas le lieu principal) : ne refait pas
 * tourner /v1/recommendations (les pastilles déjà affichées restent inchangées), seulement le
 * détail (météo + cibles) pour ce point précis — même logique que le pin principal, juste sans
 * régénérer la liste de spots alternatifs.
 */
export async function selectRecommendedSpot(spot: MapPin) {
  selectionAbortController?.abort()
  const controller = new AbortController()
  selectionAbortController = controller

  appState.isLoadingSpots = true
  appState.spotsError = null

  try {
    const detail = await loadSpotDetail(spot.latitude, spot.longitude, spot.name, controller.signal)
    appState.selectedSpot = { ...detail, bortle: spot.bortle ?? null }
    appState.selectedHourIndex = bestScoreHourIndex(detail.hourly)
    openSmartPanel()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    appState.spotsError = error instanceof Error ? error.message : 'Erreur inconnue'
  } finally {
    appState.isLoadingSpots = false
  }
}

/**
 * Météo (aujourd'hui + lendemain matin jusqu'à 8h) et cibles célestes du soir pour un point précis
 * — factorisé entre selectLocation (lieu principal) et selectRecommendedSpot (pastille), seule la
 * source du bortle diffère entre les deux appelants.
 */
async function loadSpotDetail(
  latitude: number,
  longitude: number,
  name: string | undefined,
  signal: AbortSignal,
): Promise<Omit<SelectedSpotDetail, 'bortle'>> {
  const date = appState.selectedDate ?? undefined

  const [todayWeather, targets] = await Promise.all([
    getWeather(latitude, longitude, { date, signal }),
    getTonightCelestialObjects(latitude, longitude, { date, limit: TONIGHT_TARGETS_LIMIT, signal }),
  ])

  // Le lendemain matin (jusqu'à 8h) fait partie de la même soirée d'observation — deuxième appel
  // une fois qu'on connaît le jour local réellement résolu par le premier (la clé du jour dans la
  // réponse), déjà synchronisé en base par le même appel (voir CLAUDE.md backend).
  const todayDateKey = Object.keys(todayWeather)[0]
  const tomorrowWeather = todayDateKey
    ? await getWeather(latitude, longitude, { date: addDays(todayDateKey, 1), signal })
    : {}

  const hourly = buildNightlyHourly(todayWeather, tomorrowWeather)

  return {
    name: name ?? formatCoordinates(latitude, longitude),
    latitude,
    longitude,
    hourly,
    targets: targets.map(toTonightTarget),
  }
}

// Ne garde que les créneaux nocturnes (is_night, calculé côté back à partir du lever/coucher du
// soleil réel) : les créneaux de jour ont toujours un score à 0 (non pertinents pour une
// observation), les afficher ne ferait qu'encombrer la timeline de barres vides.
function buildNightlyHourly(today: WeatherResponse, tomorrow: WeatherResponse): HourlyWeather[] {
  const todayHours = extractNightHours(Object.values(today)[0], null, false)
  const tomorrowHours = extractNightHours(Object.values(tomorrow)[0], NEXT_DAY_HOURLY_CUTOFF, true)

  return [...todayHours, ...tomorrowHours]
}

function extractNightHours(
  day: WeatherDayEntry | undefined,
  maxTime: string | null,
  isNextDay: boolean,
): HourlyWeather[] {
  if (!day?.hours) {
    return []
  }

  return Object.entries(day.hours)
    .filter(([time, hour]) => hour.is_night && (maxTime === null || time <= maxTime))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, hour]) => ({
      time,
      score: hour.score,
      temperatureC: hour.temperature,
      cloudinessPercent: hour.cloudiness,
      humidityPercent: hour.humidity,
      windSpeedKmh: hour.wind_speed,
      rainProbabilityPercent: hour.rain_probability,
      isNextDay,
    }))
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
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

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`
}
