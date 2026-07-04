import type { SearchResults } from '@/types/search'
import type { RecommendationData } from '@/types/recommendation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type SearchType = 'location' | 'celestial_object'

export interface SearchOptions {
  latitude?: number
  longitude?: number
  type?: SearchType
  signal?: AbortSignal
}

export async function searchOmnibox(query: string, options: SearchOptions = {}): Promise<SearchResults> {
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

  const response = await fetch(`${API_BASE_URL}/v1/recommendations?${params}`, { signal: options.signal })

  if (!response.ok) {
    throw new Error(`Les recommandations sont indisponibles (${response.status})`)
  }

  const json: { data: RecommendationData } = await response.json()
  return json.data
}
