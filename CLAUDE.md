# Spacelens — frontend

Interface Vue 3 de Spacelens. **Dépôt git indépendant** (remote `space-lens/spacelens-vue`) —
ne pas supposer un historique ou des commits partagés avec le backend Laravel qui vit dans le
dépôt parent (`../../CLAUDE.md`, un ou deux niveaux au-dessus selon où ce dossier est cloné).

## Pour toute nouvelle fonctionnalité

Le processus de clarification et de découpage backend/frontend est documenté dans le dépôt
backend : `.claude/skills/feature-request/SKILL.md`. Le point clé : le contrat API doit être
figé avant d'implémenter, et ce dépôt s'implémente/se committe indépendamment du backend.

## État actuel

**Tout est mocké.** Aucun `fetch`/`axios`/appel réseau vers l'API backend n'existe dans `src/` —
c'est une coquille UI avec données codées en dur :
- `MapBackground.vue` affiche un unique spot fixe (`Plateau de Calern`, lat/lon en dur).
- `useAppState.ts` est le seul store (reactive Vue, pas de Pinia) — pas de couche API.
- `SmartPanel.vue` / `SearchOverlay.vue` ont leurs données d'exemple en dur dans le `<script setup>`.
- Le routeur ne mappe que `/planning` (vue principale, malgré son nom c'est l'écran carte+recherche)
  et un catch-all 404 — la racine `/` n'est pas routée.
- L'UI anticipe déjà des concepts absents du backend : échelle **Bortle** (pollution lumineuse,
  `Spot.bortle`, filtre "Bortle ≤ 4"), recherche d'**objets célestes** (placeholder "M42"),
  "Sessions"/"Galerie" dans la nav (liens `#`, pas de vue derrière). La donnée Bortle existe déjà
  côté pipeline (`../../../astro-light-pipeline`, repo séparé) mais n'est pas encore branchée —
  voir le [CLAUDE.md backend](../../CLAUDE.md). Ce pipeline produit aussi deux pyramides de tuiles
  Leaflet prêtes à l'emploi (`data/tiles/` radiance continue, `data/tiles_bortle/` classes Bortle
  discrètes) — utilisables comme `L.tileLayer(...)` additionnel dans `MapBackground.vue`, en plus
  du fond OpenStreetMap actuel.

## Stack

Vue 3 (`<script setup>` + TypeScript) + Vite + Tailwind CSS 4 + Leaflet (carte) + vue-router.
Lint : oxlint + eslint, format : Prettier. Pas de state manager dédié, pas de client HTTP installé.

## Structure

- `components/` — UI transverse (`Navigation`, `Omnibox`, `MapBackground`, `SearchOverlay`)
- `components/panel/` — détail du panneau spot (`SmartPanel`, `PanelHeader`, `WeatherTimeline`,
  `RecommendationCard`)
- `components/search/` — `RecentSearchItem`
- `composables/useAppState.ts` — état global unique (reactive), actions co-localisées
  (`openSmartPanel`, `toggleTheme`, `locateUser`, etc.)
- `types/` — `spot.ts`, `panel.ts`, `search.ts` (interfaces TS, source de vérité des formes de données)
- `views/` — `PlanningView` (écran principal), `NotFoundView`

## Conventions

- `<script setup lang="ts">` partout, types explicites via `types/`.
- Tailwind utilitaire inline, pas de CSS scoped/modules (exception : styles Leaflet globaux dans
  `MapBackground.vue`).
- Dark mode : classe `dark` sur `<html>`, pilotée par `appState.isDarkMode` (persistance non gérée
  pour l'instant).
