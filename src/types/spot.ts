export interface Coordinates {
  lat: number
  lng: number
}

// Pin affiché sur la carte pour le lieu recherché (avec nom) ou une pastille de recommandation
// (sans nom, juste des coordonnées) — score nullable : /v1/recommendations peut renvoyer un
// score indisponible pour le point d'origine (ex: date hors fiabilité météo).
export interface MapPin {
  latitude: number
  longitude: number
  score: number | null
  name?: string
  bortle?: number | null
}
