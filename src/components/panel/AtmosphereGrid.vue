<script setup lang="ts">
import { computed } from 'vue'
import type { HourlyWeather } from '@/types/panel'

const props = defineProps<{
  hour: HourlyWeather | null
}>()

interface Metric {
  icon: string
  label: string
  value: string
  description: string
  descriptionClass: string
}

type Threshold = [max: number, label: string, colorClass: string]

// Seuils indicatifs (pas des seuils scientifiques) juste pour donner une lecture qualitative
// rapide à côté de la valeur brute — cohérent avec le fait qu'on n'a pas de véritable indice
// d'observation astro (seeing/transparence) fourni par le fournisseur météo actuel.
function describe(
  value: number | null,
  thresholds: Threshold[],
): { label: string; colorClass: string } {
  if (value === null) {
    return { label: '—', colorClass: 'text-slate-500' }
  }
  const match = thresholds.find(([max]) => value <= max) ?? thresholds.at(-1)
  if (!match) {
    return { label: '—', colorClass: 'text-slate-500' }
  }
  const [, label, colorClass] = match
  return { label, colorClass }
}

const metrics = computed<Metric[]>(() => {
  const h = props.hour

  const cloud = describe(h?.cloudinessPercent ?? null, [
    [10, 'Ciel dégagé', 'text-emerald-500'],
    [40, 'Quelques nuages', 'text-blue-500'],
    [70, 'Voilé', 'text-orange-500'],
    [100, 'Couvert', 'text-red-500'],
  ])
  const humidity = describe(h?.humidityPercent ?? null, [
    [60, 'Sec', 'text-emerald-500'],
    [80, 'Modérée', 'text-blue-500'],
    [100, 'Risque de buée', 'text-orange-500'],
  ])
  const wind = describe(h?.windSpeedKmh ?? null, [
    [10, 'Calme', 'text-emerald-500'],
    [25, 'Léger', 'text-blue-500'],
    [Infinity, 'Fort', 'text-orange-500'],
  ])
  const rain = describe(h?.rainProbabilityPercent ?? null, [
    [0, 'Aucun risque', 'text-emerald-500'],
    [30, 'Faible risque', 'text-blue-500'],
    [100, 'Risque élevé', 'text-orange-500'],
  ])

  return [
    {
      icon: 'fa-cloud',
      label: 'Couverture nuageuse',
      value: h?.cloudinessPercent != null ? `${h.cloudinessPercent}%` : '--',
      description: cloud.label,
      descriptionClass: cloud.colorClass,
    },
    {
      icon: 'fa-droplet',
      label: 'Humidité',
      value: h?.humidityPercent != null ? `${h.humidityPercent}%` : '--',
      description: humidity.label,
      descriptionClass: humidity.colorClass,
    },
    {
      icon: 'fa-wind',
      label: 'Vent',
      value: h?.windSpeedKmh != null ? `${Math.round(h.windSpeedKmh)} km/h` : '--',
      description: wind.label,
      descriptionClass: wind.colorClass,
    },
    {
      icon: 'fa-cloud-rain',
      label: 'Risque de pluie',
      value: h?.rainProbabilityPercent != null ? `${h.rainProbabilityPercent}%` : '--',
      description: rain.label,
      descriptionClass: rain.colorClass,
    },
  ]
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="metric in metrics"
      :key="metric.label"
      class="glass-card p-3 rounded-xl flex items-center gap-3"
    >
      <div
        class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0"
      >
        <i class="fas text-slate-600 dark:text-slate-300" :class="metric.icon"></i>
      </div>
      <div class="min-w-0">
        <p class="text-[10px] text-slate-500 font-medium leading-tight">{{ metric.label }}</p>
        <p class="text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {{ metric.value }}
          <span class="text-[10px] font-normal block" :class="metric.descriptionClass">{{
            metric.description
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
