// Formes correspondant à GET /v1/weather — contrairement aux autres endpoints, celui-ci ne
// s'enveloppe pas dans { data: ... } (contrat historique, pas modifié ici).
export interface WeatherHourEntry {
  score: number
  temperature: number | null
  cloudiness: number | null
  humidity: number | null
  wind_speed: number | null
  rain_probability: number | null
  is_night: boolean
}

export interface WeatherDayEntry {
  score: number
  cloudiness: number | null
  humidity: number | null
  wind_speed: number | null
  rain_probability: number | null
  hours?: Record<string, WeatherHourEntry>
}

export type WeatherResponse = Record<string, WeatherDayEntry>
