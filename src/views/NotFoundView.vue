<template>
  <div class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white w-full h-screen flex flex-col items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-indigo-600 dark:text-indigo-500 mb-4">404</h1>
      <h2 class="text-3xl font-semibold mb-6">Page non trouvée</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Il semblerait que vous vous soyez perdu dans l'espace. La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <RouterLink 
        to="/planning" 
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-colors"
      >
        <i class="fas fa-home"></i> Retour à la base
      </RouterLink>
    </div>
  </div>
</template>
