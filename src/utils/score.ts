export type ScoreTier = 'good' | 'medium' | 'poor'

// Mêmes seuils que le mockup d'origine (bottom sheet) : >=80 vert, >=50 orange, sinon rouge.
export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return 'good'
  if (score >= 50) return 'medium'
  return 'poor'
}

const TIER_BG_CLASSES: Record<ScoreTier, string> = {
  good: 'bg-green-500',
  medium: 'bg-orange-500',
  poor: 'bg-red-500',
}

export function scoreBgClass(score: number): string {
  return TIER_BG_CLASSES[scoreTier(score)]
}
