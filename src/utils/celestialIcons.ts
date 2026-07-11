export interface CelestialIconStyle {
  icon: string
  bgClass: string
  textClass: string
  borderClass: string
}

const AMBER: Pick<CelestialIconStyle, 'bgClass' | 'textClass' | 'borderClass'> = {
  bgClass: 'bg-amber-900/30',
  textClass: 'text-amber-400',
  borderClass: 'border-amber-800',
}

const PURPLE: Pick<CelestialIconStyle, 'bgClass' | 'textClass' | 'borderClass'> = {
  bgClass: 'bg-purple-900/30',
  textClass: 'text-purple-400',
  borderClass: 'border-purple-800',
}

const INDIGO: Pick<CelestialIconStyle, 'bgClass' | 'textClass' | 'borderClass'> = {
  bgClass: 'bg-indigo-900/30',
  textClass: 'text-indigo-400',
  borderClass: 'border-indigo-800',
}

const PINK: Pick<CelestialIconStyle, 'bgClass' | 'textClass' | 'borderClass'> = {
  bgClass: 'bg-pink-900/30',
  textClass: 'text-pink-400',
  borderClass: 'border-pink-800',
}

const RED: Pick<CelestialIconStyle, 'bgClass' | 'textClass' | 'borderClass'> = {
  bgClass: 'bg-red-900/30',
  textClass: 'text-red-400',
  borderClass: 'border-red-800',
}

const OTHER_ICON_STYLE: CelestialIconStyle = {
  icon: 'fa-certificate',
  bgClass: 'bg-signal/15',
  textClass: 'text-signal',
  borderClass: 'border-signal/30',
}

// Icônes FontAwesome choisies pour évoquer visuellement chaque type d'objet (spirale pour une
// galaxie, nuage pour une nébuleuse, points reliés pour un amas...) plutôt qu'une icône générique
// unique pour tout le catalogue.
const ICON_STYLES: Record<string, CelestialIconStyle> = {
  sun: {
    icon: 'fa-sun',
    bgClass: 'bg-yellow-900/30',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-800',
  },
  moon: {
    icon: 'fa-moon',
    bgClass: 'bg-surface-2',
    textClass: 'text-dust',
    borderClass: 'border-line',
  },
  planet: {
    icon: 'fa-globe',
    bgClass: 'bg-orange-900/30',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-800',
  },
  dwarf_planet: {
    icon: 'fa-globe',
    bgClass: 'bg-orange-900/30',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-800',
  },
  star: { icon: 'fa-star', ...AMBER },
  double_star: { icon: 'fa-star-of-life', ...AMBER },
  star_association: { icon: 'fa-circle-nodes', ...AMBER },
  open_cluster: { icon: 'fa-circle-nodes', ...PURPLE },
  globular_cluster: { icon: 'fa-braille', ...PURPLE },
  cluster_with_nebula: { icon: 'fa-braille', ...PURPLE },
  galaxy: { icon: 'fa-hurricane', ...INDIGO },
  galaxy_pair: { icon: 'fa-hurricane', ...INDIGO },
  galaxy_triplet: { icon: 'fa-hurricane', ...INDIGO },
  galaxy_group: { icon: 'fa-hurricane', ...INDIGO },
  nebula: { icon: 'fa-cloud', ...PINK },
  emission_nebula: { icon: 'fa-cloud', ...PINK },
  reflection_nebula: { icon: 'fa-cloud', ...PINK },
  dark_nebula: { icon: 'fa-cloud', ...PINK },
  planetary_nebula: { icon: 'fa-cloud', ...PINK },
  hii_region: { icon: 'fa-cloud', ...PINK },
  supernova_remnant: { icon: 'fa-burst', ...RED },
  nova: { icon: 'fa-burst', ...RED },
  other: OTHER_ICON_STYLE,
}

export function celestialIconStyle(objectType: string): CelestialIconStyle {
  return ICON_STYLES[objectType] ?? OTHER_ICON_STYLE
}
