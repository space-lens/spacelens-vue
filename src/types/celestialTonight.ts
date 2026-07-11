// Forme correspondant à un item de GET /v1/celestial-objects/tonight.
export interface TonightTargetApiItem {
  slug: string
  display_name: string
  object_type: string
  object_type_label: string
  apparent_magnitude: number | null
  rise_at: string | null
  transit_at: string | null
  set_at: string | null
  max_altitude_deg: number
  is_circumpolar: boolean
}
