export type PanelState = 'closed' | 'peek' | 'expanded'

export interface WeatherHour {
  time: string
  temperatureC: number
  qualityPercent: number
  isHighlighted?: boolean
}

export interface Recommendation {
  name: string
  icon: string
  subtitle: string
}
