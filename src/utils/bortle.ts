export interface BortleLevel {
  value: number
  label: string
  color: string
}

// Couleurs et alpha identiques à scripts/color_relief_bortle.txt (astro-light-pipeline), pour que
// la légende corresponde exactement à ce qui est peint sur le layer de la carte. Alpha croissant
// avec la pollution (classe 1 quasi transparente pour laisser voir le fond de carte).
export const BORTLE_LEVELS: BortleLevel[] = [
  { value: 1, label: "Ciel d'exception", color: 'rgba(0, 0, 0, 0)' },
  { value: 2, label: 'Ciel très sombre', color: 'rgba(70, 70, 70, 0.35)' },
  { value: 3, label: 'Ciel rural', color: 'rgba(0, 82, 165, 0.51)' },
  { value: 4, label: 'Rural/périurbain', color: 'rgba(0, 158, 96, 0.59)' },
  { value: 5, label: 'Périurbain', color: 'rgba(158, 206, 0, 0.67)' },
  { value: 6, label: 'Urbain clair', color: 'rgba(255, 191, 0, 0.75)' },
  { value: 7, label: 'Urbain', color: 'rgba(255, 102, 0, 0.82)' },
  { value: 8, label: 'Urbain dense', color: 'rgba(255, 0, 0, 0.9)' },
  { value: 9, label: 'Centre-ville', color: 'rgba(255, 255, 255, 1)' },
]
