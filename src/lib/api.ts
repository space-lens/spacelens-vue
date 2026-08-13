import type { SearchResults } from '@/types/search'
import type { RecommendationData } from '@/types/recommendation'
import type { WeatherResponse } from '@/types/weather'
import type { TonightTargetApiItem } from '@/types/celestialTonight'
import type { LocationResolveResult } from '@/types/location'
import type { SpatioTemporalSuggestionsResponse } from '@/types/celestialObjectSuggestions'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type SearchType = 'location' | 'celestial_object'

export interface SearchOptions {
  latitude?: number
  longitude?: number
  type?: SearchType
  signal?: AbortSignal
}

export async function searchOmnibox(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResults> {
  const params = new URLSearchParams({ q: query })
  if (options.latitude !== undefined) params.set('latitude', String(options.latitude))
  if (options.longitude !== undefined) params.set('longitude', String(options.longitude))
  if (options.type) params.set('type', options.type)

  const response = await fetch(`${API_BASE_URL}/v1/search?${params}`, { signal: options.signal })

  if (!response.ok) {
    throw new Error(`La recherche a échoué (${response.status})`)
  }

  const json: { data: SearchResults } = await response.json()
  return json.data
}

export interface RecommendationOptions {
  date?: string
  signal?: AbortSignal
}

export async function getRecommendations(
  latitude: number,
  longitude: number,
  options: RecommendationOptions = {},
): Promise<RecommendationData> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
  if (options.date) params.set('date', options.date)

  const response = await fetch(`${API_BASE_URL}/v1/recommendations?${params}`, {
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Les recommandations sont indisponibles (${response.status})`)
  }

  const json: { data: RecommendationData } = await response.json()
  return json.data
}

export interface ResolveLocationOptions {
  signal?: AbortSignal
}

export async function resolveLocation(
  latitude: number,
  longitude: number,
  options: ResolveLocationOptions = {},
): Promise<LocationResolveResult> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })

  const response = await fetch(`${API_BASE_URL}/v1/locations/resolve?${params}`, {
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`La résolution du point cliqué a échoué (${response.status})`)
  }

  const json: { data: LocationResolveResult } = await response.json()
  return json.data
}

export interface SpatioTemporalSuggestionsOptions {
  limit?: number
  signal?: AbortSignal
}

export async function getSpatioTemporalSuggestions(
  slug: string,
  latitude: number,
  longitude: number,
  options: SpatioTemporalSuggestionsOptions = {},
): Promise<SpatioTemporalSuggestionsResponse> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
  if (options.limit) params.set('limit', String(options.limit))

  const response = await fetch(
    `${API_BASE_URL}/v1/celestial-objects/${slug}/spatio-temporal-suggestions?${params}`,
    { signal: options.signal },
  )

  if (!response.ok) {
    throw new Error(`Les suggestions sont indisponibles (${response.status})`)
  }

  const json: { data: SpatioTemporalSuggestionsResponse } = await response.json()
  return json.data
}

export interface WeatherOptions {
  date?: string
  signal?: AbortSignal
}

// Pas de wrapper { data: ... } ici : contrat historique de /v1/weather, différent des autres
// endpoints — non modifié dans le cadre de ce travail.
export async function getWeather(
  latitude: number,
  longitude: number,
  options: WeatherOptions = {},
): Promise<WeatherResponse> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })

  if (options.date) {
    params.set('start_date', options.date)
  }

  const response = await fetch(`${API_BASE_URL}/v1/weather?${params}`, { signal: options.signal })

  if (!response.ok) {
    throw new Error(`La météo est indisponible (${response.status})`)
  }

  return response.json()
}

export interface TonightTargetsOptions {
  date?: string
  limit?: number
  signal?: AbortSignal
}

export async function getTonightCelestialObjects(
  latitude: number,
  longitude: number,
  options: TonightTargetsOptions = {},
): Promise<TonightTargetApiItem[]> {
  const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) })
  if (options.date) params.set('date', options.date)
  if (options.limit) params.set('limit', String(options.limit))

  const response = await fetch(`${API_BASE_URL}/v1/celestial-objects/tonight?${params}`, {
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Les cibles du soir sont indisponibles (${response.status})`)
  }

  const json: { data: TonightTargetApiItem[] } = await response.json()
  return json.data
}
