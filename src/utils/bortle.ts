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

// `color` est la teinte translucide peinte sur le fond de carte (identique au pipeline, cf.
// commentaire ci-dessus) — la classe 1 y est quasi transparente pour laisser voir le fond
// satellite en dessous, ce qui est correct sur la carte mais rend son swatch invisible dans une
// légende posée sur un panneau opaque. `swatchColor` compose la même teinte sur un fond de
// référence sombre (celui des cartes de l'UI) pour un aperçu toujours visible, sans toucher à la
// donnée `color` elle-même.
const SWATCH_BACKDROP: [number, number, number] = [21, 20, 31] // --color-surface

export function swatchColor(level: BortleLevel): string {
  const match = level.color.match(/rgba?\(([^)]+)\)/)
  if (!match) return level.color

  const [r, g, b, a] = match[1].split(',').map((part) => parseFloat(part))
  const alpha = a ?? 1
  const blend = (channel: number, backdrop: number) => Math.round(channel * alpha + backdrop * (1 - alpha))

  return `rgb(${blend(r, SWATCH_BACKDROP[0])}, ${blend(g, SWATCH_BACKDROP[1])}, ${blend(b, SWATCH_BACKDROP[2])})`
}
