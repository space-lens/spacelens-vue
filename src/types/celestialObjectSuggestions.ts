// Miroir de la réponse de GET /v1/celestial-objects/{slug}/spatio-temporal-suggestions (Parcours 2,
// approche par l'objet) : paires (date, lieu candidat) classées, uniquement sur éphémérides +
// phase lunaire locale (pas de météo réelle, cf. backend SpatioTemporalSuggestionService).
export interface SpatioTemporalSuggestion {
  date: string
  latitude: number
  longitude: number
  distance_km: number
  bortle: number
  score: number
  transit_at: string | null
  max_altitude_deg: number
  is_circumpolar: boolean
  moon_illumination_percent: number
  within_weather_window: boolean
}

export interface SpatioTemporalSuggestionsResponse {
  object: {
    slug: string
    display_name: string
    apparent_magnitude: number | null
    required_bortle: number | null
  }
  days_scanned: number
  light_pollution_coverage_available: boolean
  suggestions: SpatioTemporalSuggestion[]
}
