// Miroir de LocationResolveResult (backend, GET /v1/locations/resolve) : reverse-geocoding et
// validation de couverture (mer, pollution lumineuse) pour un point cliqué sur la carte, avant
// d'autoriser le calcul de score.
export type LocationResolveRejectionReason = 'sea_point' | 'no_light_pollution_coverage'

export interface LocationResolveResult {
  latitude: number
  longitude: number
  name: string | null
  country_code: string | null
  bortle: number | null
  valid: boolean
  reason: LocationResolveRejectionReason | null
}
