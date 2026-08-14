<script setup lang="ts">
const waitlistMailto =
  "mailto:contact@spacelens.fr?subject=Liste%20d'attente%20SpaceLens&body=Bonjour%2C%0A%0AJe%20souhaite%20rejoindre%20la%20liste%20d'attente%20de%20SpaceLens.%0A%0AMon%20email%C2%A0%3A%20"
</script>

<template>
  <div
    class="bg-landing min-h-screen flex flex-col relative overflow-x-hidden selection:bg-starlight selection:text-void"
  >
    <div class="absolute inset-0 bg-void/70 z-0"></div>

    <!-- HEADER -->
    <header
      class="relative z-10 w-full py-6 px-4 md:px-8 max-w-6xl mx-auto flex justify-between items-center"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 bg-void border border-line rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg viewBox="0 0 40 40" class="w-6 h-6" aria-hidden="true">
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="var(--color-dust-dim)"
              stroke-width="1"
              opacity="0.4"
            />
            <circle
              cx="20"
              cy="20"
              r="11"
              fill="none"
              stroke="var(--color-signal)"
              stroke-width="1"
              opacity="0.55"
            />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="none"
              stroke="var(--color-starlight)"
              stroke-width="1.2"
              opacity="0.9"
            />
            <circle cx="20" cy="20" r="2" fill="var(--color-starlight)" />
          </svg>
        </div>
        <span class="text-xl font-serif font-semibold tracking-tight text-ink">SpaceLens</span>
      </div>
      <span
        class="landing-panel px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-starlight border border-starlight/30"
      >
        Lancement prévu en 2026
      </span>
    </header>

    <!-- MAIN -->
    <main
      class="relative z-10 flex-1 flex flex-col items-center max-w-6xl mx-auto px-4 md:px-8 w-full pt-12 md:pt-16 pb-24 gap-24 md:gap-32"
    >
      <!-- HERO -->
      <section class="text-center max-w-3xl mx-auto">
        <p class="font-mono text-xs uppercase tracking-widest text-signal mb-5">
          Astronomie amateur & clubs
        </p>
        <h1 class="text-4xl md:text-6xl font-extrabold text-ink tracking-tight leading-tight mb-6">
          Ne ratez plus jamais
          <span class="font-serif italic text-starlight glow-text">une nuit claire.</span>
        </h1>
        <p class="text-lg md:text-xl text-dust font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          SpaceLens croise la météo, la pollution lumineuse (échelle de Bortle) et les éphémérides
          pour vous dire précisément <strong class="text-ink">où</strong> et
          <strong class="text-ink">quand</strong> observer.
        </p>

        <form
          class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          :action="waitlistMailto"
          method="get"
        >
          <a
            :href="waitlistMailto"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-starlight hover:bg-starlight-dim text-void font-semibold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(232,182,91,0.25)] transition-colors"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
            Rejoindre la liste d'attente
          </a>
          <a
            href="#pourquoi"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 landing-panel border border-line hover:border-dust text-dust hover:text-ink font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Découvrir le projet
          </a>
        </form>
        <p class="text-xs text-dust-dim mt-4">
          Aucun spam : un email quand SpaceLens ouvre ses portes, rien d'autre.
        </p>
      </section>

      <!-- APERÇU DE L'INTERFACE -->
      <section class="w-full max-w-4xl mx-auto float-animation hidden md:block" aria-hidden="true">
        <div class="landing-panel rounded-3xl p-2 border border-line/50 relative overflow-hidden">
          <div class="flex items-center gap-2 px-4 pt-2 pb-3 border-b border-line/50">
            <div class="w-3 h-3 rounded-full bg-line"></div>
            <div class="w-3 h-3 rounded-full bg-line"></div>
            <div class="w-3 h-3 rounded-full bg-line"></div>
            <span class="ml-2 font-mono text-[10px] text-dust-dim tracking-wide"
              >spacelens.fr/planning</span
            >
          </div>
          <div
            class="map-bg h-64 md:h-96 w-full rounded-b-2xl relative overflow-hidden flex items-center justify-center"
          >
            <div class="relative z-10 landing-card p-6 rounded-2xl w-100">
              <div class="flex justify-between items-center mb-4">
                <h2 class="font-bold text-xl text-ink">Plateau de Calern</h2>
                <div
                  class="w-12 h-12 rounded-full border-2 border-good bg-good/10 text-good flex items-center justify-center font-bold"
                >
                  85
                </div>
              </div>
              <div class="space-y-3">
                <div class="h-2 w-full bg-line rounded overflow-hidden">
                  <div class="h-full bg-good w-[85%]"></div>
                </div>
                <p class="text-xs text-dust">
                  Conditions optimales pour le ciel profond. Bortle 3.
                </p>
                <div class="flex gap-2 mt-4">
                  <div class="flex-1 bg-surface-2 py-2 rounded text-center text-xs text-dust">
                    <i class="fas fa-meteor mb-1 block"></i> M42 visible
                  </div>
                  <div class="flex-1 bg-surface-2 py-2 rounded text-center text-xs text-dust">
                    <i class="fas fa-wind mb-1 block"></i> 10 km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- POURQUOI -->
      <section id="pourquoi" class="w-full scroll-mt-24">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-ink mb-3">
          Pourquoi utiliser SpaceLens ?
        </h2>
        <p class="text-dust text-center max-w-xl mx-auto mb-12">
          Trois sources de données éparpillées, un seul score pour décider en une minute.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-signal/20 text-signal rounded-xl flex items-center justify-center mb-6 border border-signal/30 text-xl"
            >
              <i class="fas fa-map-location-dot" aria-hidden="true"></i>
            </div>
            <h3 class="text-xl font-bold text-ink mb-3">Cartographie & météo astro</h3>
            <p class="text-sm text-dust leading-relaxed">
              Trouvez les meilleurs <strong>spots d'observation</strong> près de chez vous. Le
              moteur croise la <strong>carte de pollution lumineuse (Bortle)</strong> avec les
              données météo (seeing, nuages, vent) pour un score de visibilité par lieu et par nuit.
            </p>
          </article>

          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-signal/20 text-signal rounded-xl flex items-center justify-center mb-6 border border-signal/30 text-xl"
            >
              <i class="fas fa-book-journal-whills" aria-hidden="true"></i>
            </div>
            <h3 class="text-xl font-bold text-ink mb-3">Planificateur & éphémérides</h3>
            <p class="text-sm text-dust leading-relaxed">
              Ne laissez rien au hasard pour vos sessions d'<strong>astrophotographie</strong>.
              Recherchez une cible du <strong>ciel profond</strong> ou du système solaire, et
              laissez l'algorithme indiquer la date, l'heure et le lieu optimaux.
            </p>
          </article>

          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-starlight/20 text-starlight rounded-xl flex items-center justify-center mb-6 border border-starlight/30 text-xl"
            >
              <i class="fas fa-users" aria-hidden="true"></i>
            </div>
            <h3 class="text-xl font-bold text-ink mb-3">Pensé pour les clubs</h3>
            <p class="text-sm text-dust leading-relaxed">
              Fini les groupes de messagerie désorganisés. Partagez vos soirées, coordonnez le
              covoiturage et le matériel partagé, et communiquez facilement avec les membres de
              votre <strong>club d'astronomie</strong>.
            </p>
          </article>
        </div>
      </section>

      <!-- COMMENT CA MARCHE -->
      <section id="comment-ca-marche" class="w-full max-w-3xl mx-auto scroll-mt-24">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-ink mb-12">Comment ça marche</h2>
        <ol class="flex flex-col gap-6">
          <li class="landing-card rounded-2xl p-5 flex items-start gap-4">
            <span
              class="shrink-0 w-9 h-9 rounded-full bg-starlight text-void font-mono text-sm font-bold flex items-center justify-center"
              >1</span
            >
            <p class="text-sm md:text-base text-dust leading-relaxed pt-1.5">
              <strong class="text-ink">Indiquez votre position</strong> — un lieu précis, ou laissez
              SpaceLens détecter le vôtre.
            </p>
          </li>
          <li class="landing-card rounded-2xl p-5 flex items-start gap-4">
            <span
              class="shrink-0 w-9 h-9 rounded-full bg-starlight text-void font-mono text-sm font-bold flex items-center justify-center"
              >2</span
            >
            <p class="text-sm md:text-base text-dust leading-relaxed pt-1.5">
              <strong class="text-ink">Le moteur croise les données</strong> — météo, pollution
              lumineuse et éphémérides, pour chaque créneau des prochains jours.
            </p>
          </li>
          <li class="landing-card rounded-2xl p-5 flex items-start gap-4">
            <span
              class="shrink-0 w-9 h-9 rounded-full bg-starlight text-void font-mono text-sm font-bold flex items-center justify-center"
              >3</span
            >
            <p class="text-sm md:text-base text-dust leading-relaxed pt-1.5">
              <strong class="text-ink">Recevez le meilleur créneau</strong> — un score de visibilité
              vous indique quand et où pointer votre instrument.
            </p>
          </li>
        </ol>
      </section>

      <!-- FAQ -->
      <section id="faq" class="w-full max-w-3xl mx-auto scroll-mt-24">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-ink mb-12">
          Questions fréquentes
        </h2>
        <div class="flex flex-col gap-3">
          <details class="landing-card rounded-2xl p-5">
            <summary
              class="font-semibold text-ink cursor-pointer list-none flex justify-between items-center gap-4"
            >
              Qu'est-ce que l'échelle de Bortle ?
              <i class="faq-chevron fas fa-chevron-down text-dust text-xs" aria-hidden="true"></i>
            </summary>
            <p class="text-sm text-dust leading-relaxed mt-3">
              C'est une échelle de 1 à 9 qui mesure la pollution lumineuse d'un ciel nocturne : 1
              correspond à un ciel totalement noir, 9 à un centre-ville très éclairé. Plus la classe
              est basse, plus vous verrez d'étoiles et d'objets du ciel profond.
            </p>
          </details>
          <details class="landing-card rounded-2xl p-5">
            <summary
              class="font-semibold text-ink cursor-pointer list-none flex justify-between items-center gap-4"
            >
              Quand SpaceLens sera-t-il disponible ?
              <i class="faq-chevron fas fa-chevron-down text-dust text-xs" aria-hidden="true"></i>
            </summary>
            <p class="text-sm text-dust leading-relaxed mt-3">
              Le lancement est prévu en 2026. Inscrivez-vous à la liste d'attente pour être informé
              dès l'ouverture.
            </p>
          </details>
          <details class="landing-card rounded-2xl p-5">
            <summary
              class="font-semibold text-ink cursor-pointer list-none flex justify-between items-center gap-4"
            >
              Ai-je besoin d'un télescope pour utiliser SpaceLens ?
              <i class="faq-chevron fas fa-chevron-down text-dust text-xs" aria-hidden="true"></i>
            </summary>
            <p class="text-sm text-dust leading-relaxed mt-3">
              Non. SpaceLens s'adresse aussi bien à l'observation à l'œil nu et aux jumelles qu'à
              l'astrophotographie avec instrument.
            </p>
          </details>
          <details class="landing-card rounded-2xl p-5">
            <summary
              class="font-semibold text-ink cursor-pointer list-none flex justify-between items-center gap-4"
            >
              SpaceLens fonctionne-t-il pour les clubs d'astronomie ?
              <i class="faq-chevron fas fa-chevron-down text-dust text-xs" aria-hidden="true"></i>
            </summary>
            <p class="text-sm text-dust leading-relaxed mt-3">
              Oui, c'est l'un des cas d'usage prévus : partage de soirées, coordination du
              covoiturage et du matériel partagé entre membres.
            </p>
          </details>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer
      class="relative z-10 border-t border-line bg-void/50 backdrop-blur-md py-8 text-center mt-12"
    >
      <div
        class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-xs text-dust-dim">© 2026 SpaceLens. Fait avec passion sous les étoiles.</p>
        <a
          href="mailto:contact@spacelens.fr"
          class="text-xs text-dust hover:text-starlight transition-colors"
          >contact@spacelens.fr</a
        >
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Fond de la landing page — reprend le motif de halos Starlight/Signal de .map-bg
   (assets/main.css), spécifique à cette page. */
.bg-landing {
  background-color: var(--color-void);
  background-image:
    radial-gradient(
      circle at 15% 50%,
      color-mix(in srgb, var(--color-starlight) 12%, transparent) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 85% 30%,
      color-mix(in srgb, var(--color-signal) 10%, transparent) 0%,
      transparent 50%
    );
  background-attachment: fixed;
}

.landing-panel {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.landing-card {
  background: color-mix(in srgb, var(--color-surface-2) 50%, transparent);
  backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--color-ink) 5%, transparent);
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
}
.landing-card:hover {
  transform: translateY(-3px);
  background: color-mix(in srgb, var(--color-surface-2) 70%, transparent);
  border-color: color-mix(in srgb, var(--color-starlight) 30%, transparent);
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.glow-text {
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-starlight) 50%, transparent);
}

details > summary::-webkit-details-marker {
  display: none;
}
/* Le transform: rotate() est étrangement ignoré sur ce <i> (icône FA en ::before) dans
   certains contextes de rendu — on bascule directement le glyphe via la variable FA. */
details[open] .faq-chevron {
  --fa: '\f077'; /* chevron-up */
}
</style>
