// Nombre de jours sélectionnables dans le calendrier de planification — même limite que le
// backend (fiabilité des prévisions OpenWeatherMap), cf. RecommendationController::MAX_DAYS_AHEAD.
export const PLANNING_DAYS_COUNT = 8

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export interface PlanningDayOption {
  date: string
  label: string
}

export function nextPlanningDays(count: number = PLANNING_DAYS_COUNT): PlanningDayOption[] {
  const now = new Date()
  const options: PlanningDayOption[] = []

  for (let i = 0; i < count; i++) {
    const day = addLocalDays(now, i)
    let label: string

    if (i === 0) {
      label = "Aujourd'hui"
    } else if (i === 1) {
      label = 'Demain'
    } else {
      label = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(day)
    }
    options.push({ date: formatDateKey(day), label })
  }

  return options
}

// Libellé de la pastille "Ce soir"/"Demain soir"/date — reflète la date de planification
// actuellement choisie (null = pas de choix explicite, comportement par défaut du backend).
export function planningDateLabel(dateKey: string | null): string {
  if (!dateKey) {
    return 'Ce soir'
  }

  const today = formatDateKey(new Date())
  if (dateKey === today) {
    return 'Ce soir'
  }

  const tomorrow = formatDateKey(addLocalDays(new Date(), 1))
  if (dateKey === tomorrow) {
    return 'Demain soir'
  }

  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(
    new Date(`${dateKey}T00:00:00`),
  )
}
