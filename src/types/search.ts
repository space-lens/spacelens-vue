export interface RecentSearch {
  title: string
  bortle: number
  icon: string
}

export interface LocationResult {
  name: string
  country_code: string
  latitude: number
  longitude: number
  distance_km: number | null
  bortle: number | null
}

export interface CelestialObjectResult {
  slug: string
  display_name: string
  apparent_magnitude: number | null
  required_bortle: number | null
  visible_tonight: boolean | null
}

export interface SearchResults {
  locations: LocationResult[]
  celestial_objects: CelestialObjectResult[]
}
