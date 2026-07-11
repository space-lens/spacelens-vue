<template>
  <div class="bg-void text-ink w-full h-screen flex flex-col items-center justify-center">
    <div class="text-center px-6">
      <h1 class="font-serif text-9xl font-semibold italic text-starlight mb-4">404</h1>
      <h2 class="font-serif text-3xl font-semibold mb-6">Page non trouvée</h2>
      <p class="text-dust mb-8 max-w-md mx-auto">
        Il semblerait que vous vous soyez perdu dans l'espace. La page que vous recherchez n'existe
        pas ou a été déplacée.
      </p>
      <RouterLink
        to="/planning"
        class="inline-flex items-center gap-2 bg-starlight hover:bg-starlight-dim text-void font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(232,182,91,0.25)] transition-colors"
      >
        <i class="fas fa-home"></i> Retour à la base
      </RouterLink>
    </div>
  </div>
</template>
