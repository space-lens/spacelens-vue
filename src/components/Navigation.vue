<script setup lang="ts">
// Navigation side/bottom bar
</script>

<template>
  <nav
    class="glass-nav fixed md:static bottom-0 left-0 w-full md:w-20 h-16 md:h-screen border-t md:border-t-0 md:border-r border-line z-50 flex md:flex-col justify-around md:justify-start md:pt-6 md:pb-4 shrink-0 shadow-2xl"
  >
    <div class="hidden md:flex justify-center mb-8">
      <div
        class="w-10 h-10 bg-void border border-line rounded-xl flex items-center justify-center shadow-lg"
        title="SpaceLens"
      >
        <svg viewBox="0 0 40 40" class="w-7 h-7" aria-hidden="true">
          <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-dust-dim)" stroke-width="1" opacity="0.4" />
          <circle cx="20" cy="20" r="11" fill="none" stroke="var(--color-signal)" stroke-width="1" opacity="0.55" />
          <circle cx="20" cy="20" r="6" fill="none" stroke="var(--color-starlight)" stroke-width="1.2" opacity="0.9" />
          <circle cx="20" cy="20" r="2" fill="var(--color-starlight)" />
        </svg>
      </div>
    </div>

    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-starlight group"
    >
      <div
        class="w-10 h-10 md:bg-starlight/10 rounded-xl flex flex-col items-center justify-center"
      >
        <i class="fas fa-map-location-dot text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-bold mt-1 md:block hidden">Explorer</span>
    </a>

    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-dust hover:text-ink transition-colors group"
    >
      <div
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center group-hover:bg-surface-2"
      >
        <i class="fas fa-camera text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-medium mt-1 md:block hidden">Galerie</span>
    </a>

    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-dust hover:text-ink transition-colors relative group"
    >
      <div
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center group-hover:bg-surface-2"
      >
        <i class="far fa-calendar-check text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-medium mt-1 md:block hidden">Sessions</span>
      <span
        class="absolute top-2 md:top-0 right-1/4 md:right-2 w-2 h-2 bg-starlight rounded-full"
      ></span>
    </a>

    <div
      class="md:mt-auto flex flex-col items-center justify-center w-full md:w-auto h-full md:h-auto group cursor-pointer"
    >
      <div
        class="w-8 h-8 rounded-full bg-surface-2 border-2 border-line overflow-hidden mt-1 md:mb-0 shadow-sm"
      >
        <img src="https://ui-avatars.com/api/?name=User&background=e8b65b&color=0b0b12" alt="User" />
      </div>
    </div>
  </nav>
</template>
