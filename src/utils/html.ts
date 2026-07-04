// Échappement minimal pour du texte injecté dans du HTML brut (ex: L.divIcon), qui peut
// contenir un nom de lieu venant de données externes (GeoNames) — évite l'injection HTML/XSS.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
