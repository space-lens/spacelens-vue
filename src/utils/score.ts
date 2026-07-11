export type ScoreTier = 'good' | 'medium' | 'poor'

// Mêmes seuils que le mockup d'origine (bottom sheet) : >=80 vert, >=50 orange, sinon rouge.
export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return 'good'
  if (score >= 50) return 'medium'
  return 'poor'
}

const TIER_BG_CLASSES: Record<ScoreTier, string> = {
  good: 'bg-good',
  medium: 'bg-medium',
  poor: 'bg-poor',
}

export function scoreBgClass(score: number): string {
  return TIER_BG_CLASSES[scoreTier(score)]
}

const TIER_BORDER_CLASSES: Record<ScoreTier, string> = {
  good: 'border-good',
  medium: 'border-medium',
  poor: 'border-poor',
}

export function scoreBorderClass(score: number): string {
  return TIER_BORDER_CLASSES[scoreTier(score)]
}

const TIER_TEXT_CLASSES: Record<ScoreTier, string> = {
  good: 'text-good',
  medium: 'text-medium',
  poor: 'text-poor',
}

export function scoreTextClass(score: number): string {
  return TIER_TEXT_CLASSES[scoreTier(score)]
}

const TIER_BG_TINT_CLASSES: Record<ScoreTier, string> = {
  good: 'bg-good/10',
  medium: 'bg-medium/10',
  poor: 'bg-poor/10',
}

export function scoreBgTintClass(score: number): string {
  return TIER_BG_TINT_CLASSES[scoreTier(score)]
}
