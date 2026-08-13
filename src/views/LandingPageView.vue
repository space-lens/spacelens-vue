<template>
  <div
    class="bg-landing min-h-screen flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white"
  >
    <!-- Overlay sombre global -->
    <div class="absolute inset-0 bg-slate-900/70 z-0"></div>

    <!-- HEADER -->
    <header
      class="relative z-10 w-full py-6 px-4 md:px-8 max-w-7xl mx-auto flex justify-between items-center"
    >
      <div class="flex items-center gap-3">
        <span class="text-2xl font-bold tracking-tight text-white glow-text">SpaceLens</span>
      </div>
      <div>
        <span
          class="landing-panel px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-indigo-300 border-indigo-500/30"
        >
          Lancement Prévu en 2026
        </span>
      </div>
    </header>

    <!-- MAIN CONTENT (Optimisé SEO) -->
    <main
      class="relative z-10 flex-1 flex flex-col items-center max-w-7xl mx-auto px-4 md:px-8 w-full pt-12 md:pt-20 pb-20"
    >
      <!-- HERO SECTION -->
      <section class="text-center max-w-4xl mx-auto mb-20">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
        >
          La planification astronomique, <br class="hidden md:block" />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 glow-text"
            >totalement réinventée.</span
          >
        </h1>

        <h2
          class="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Le premier outil web pensé par des astronomes pour les amateurs et les clubs. Croisez la
          météo, la pollution lumineuse (Bortle) et les éphémérides pour vos soirées
          d'astrophotographie.
        </h2>
      </section>

      <!-- SNEAK PEEK VISUAL (Simulation UI) -->
      <section
        class="w-full max-w-5xl mx-auto mb-32 float-animation hidden md:block"
        aria-hidden="true"
      >
        <div
          class="landing-panel rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 relative overflow-hidden"
        >
          <!-- Header macOS style -->
          <div class="flex items-center gap-2 px-4 pt-2 pb-3 border-b border-slate-700/50">
            <div class="w-3 h-3 rounded-full bg-slate-600"></div>
            <div class="w-3 h-3 rounded-full bg-slate-600"></div>
            <div class="w-3 h-3 rounded-full bg-slate-600"></div>
          </div>
          <!-- Fausse UI -->
          <div
            class="h-64 md:h-96 w-full bg-slate-900/80 rounded-b-2xl relative overflow-hidden flex items-center justify-center"
          >
            <div
              class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30"
            ></div>
            <div class="relative z-10 landing-card p-6 rounded-2xl w-[400px]">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-xl text-white">Plateau de Calern</h3>
                <div
                  class="w-12 h-12 rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold"
                >
                  85
                </div>
              </div>
              <div class="space-y-3">
                <div class="h-2 w-full bg-slate-700 rounded overflow-hidden">
                  <div class="h-full bg-emerald-500 w-[85%]"></div>
                </div>
                <p class="text-xs text-slate-400">
                  Conditions optimales pour le ciel profond. Bortle 3.
                </p>
                <div class="flex gap-2 mt-4">
                  <div class="flex-1 bg-slate-800 py-2 rounded text-center text-xs text-slate-300">
                    <i class="fas fa-meteor mb-1 block"></i> M42 Visible
                  </div>
                  <div class="flex-1 bg-slate-800 py-2 rounded text-center text-xs text-slate-300">
                    <i class="fas fa-wind mb-1 block"></i> 10 km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LES PILIERS (SEO TEXT SECTION) -->
      <section class="w-full max-w-6xl mx-auto">
        <h3 class="text-2xl font-bold text-center text-white mb-12">
          Pourquoi utiliser SpaceLens ?
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- Article 1 -->
          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30 text-xl"
            >
              <i class="fas fa-map-location-dot"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Cartographie & Météo Astro</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Trouvez les meilleurs <strong>spots d'observation</strong> près de chez vous. Notre
              moteur croise la <strong>carte de pollution lumineuse (Bortle)</strong> avec les
              données météorologiques (seeing, nuages, vent) pour vous générer un Score Astro
              prédictif en temps réel.
            </p>
          </article>

          <!-- Article 2 -->
          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30 text-xl"
            >
              <i class="fas fa-book-journal-whills"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Planificateur & Éphémérides</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Ne laissez rien au hasard pour vos sessions d'<strong>astrophotographie</strong>.
              Recherchez une cible du <strong>ciel profond</strong> ou du système solaire, et
              laissez l'algorithme vous indiquer la date, l'heure et le lieu optimaux pour
              déclencher votre appareil.
            </p>
          </article>

          <!-- Article 3 -->
          <article class="landing-card p-6 md:p-8 rounded-3xl">
            <div
              class="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-6 border border-orange-500/30 text-xl"
            >
              <i class="fas fa-users"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">L'Outil pour les Clubs Astro</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Fini les groupes de messagerie désorganisés. Partagez vos soirées via un
              <strong>tableau de bord interactif</strong>. Gérez le covoiturage, l'inventaire
              matériel partagé (télescopes, montures) et communiquez facilement avec les membres de
              votre <strong>club d'astronomie</strong>.
            </p>
          </article>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer
      class="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md py-8 text-center mt-12"
    >
      <div
        class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-xs text-slate-500">© 2026 SpaceLens. Fait avec passion sous les étoiles.</p>
        <div class="flex gap-4">
          <a
            href="mailto:contact@spacelens.fr"
            class="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
            >contact@spacelens.fr</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Fond de la landing page — les polices/couleurs de marque viennent de assets/main.css,
   ce bloc ne couvre que ce qui est spécifique à cette page (non réutilisé ailleurs). */
.bg-landing {
  background-image:
    radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-blend-mode: overlay;
}

.landing-panel {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.landing-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}
.landing-card:hover {
  transform: translateY(-5px);
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(99, 102, 241, 0.3);
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
  text-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
}
</style>
