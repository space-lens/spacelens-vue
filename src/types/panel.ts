export type PanelState = 'closed' | 'peek' | 'expanded'

// Un créneau horaire réel (GET /v1/weather) : le fournisseur météo ne renvoie qu'un pas de 3h
// (pas un vrai "horaire"), donc le nombre de créneaux disponibles pour une nuit varie. Seuls les
// créneaux nocturnes sont retenus (isNight décidé côté back) — une soirée déborde sur le
// lendemain matin, d'où isNextDay pour les créneaux venant du jour calendaire suivant.
export interface HourlyWeather {
  time: string
  score: number
  temperatureC: number | null
  cloudinessPercent: number | null
  humidityPercent: number | null
  windSpeedKmh: number | null
  rainProbabilityPercent: number | null
  isNextDay: boolean
}

// Cible céleste recommandée pour ce lieu/cette nuit (GET /v1/celestial-objects/tonight).
export interface TonightTarget {
  slug: string
  displayName: string
  objectType: string
  objectTypeLabel: string
  apparentMagnitude: number | null
  transitAt: string | null
  maxAltitudeDeg: number
}

// Détail complet du lieu affiché dans le SmartPanel — distinct de MapPin (src/types/spot.ts),
// qui ne sert qu'au placement des marqueurs sur la carte.
export interface SelectedSpotDetail {
  name: string
  latitude: number
  longitude: number
  bortle: number | null
  hourly: HourlyWeather[]
  targets: TonightTarget[]
}
