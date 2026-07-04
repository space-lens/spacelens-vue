export interface RecommendedSpot {
  latitude: number
  longitude: number
  distance_km: number
  bortle: number
  score: number
}

export interface RecommendationOrigin {
  latitude: number
  longitude: number
  score: number | null
  bortle: number | null
}

export interface RecommendationData {
  date: string
  origin: RecommendationOrigin
  spots: RecommendedSpot[]
  light_pollution_coverage_available: boolean
}
