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

const TIER_BORDER_CLASSES: Record<ScoreTier, string> = {
  good: 'border-emerald-500',
  medium: 'border-orange-500',
  poor: 'border-red-500',
}

export function scoreBorderClass(score: number): string {
  return TIER_BORDER_CLASSES[scoreTier(score)]
}

const TIER_TEXT_CLASSES: Record<ScoreTier, string> = {
  good: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-orange-600 dark:text-orange-400',
  poor: 'text-red-600 dark:text-red-400',
}

export function scoreTextClass(score: number): string {
  return TIER_TEXT_CLASSES[scoreTier(score)]
}

const TIER_BG_TINT_CLASSES: Record<ScoreTier, string> = {
  good: 'bg-emerald-50 dark:bg-emerald-500/10',
  medium: 'bg-orange-50 dark:bg-orange-500/10',
  poor: 'bg-red-50 dark:bg-red-500/10',
}

export function scoreBgTintClass(score: number): string {
  return TIER_BG_TINT_CLASSES[scoreTier(score)]
}
