<script setup lang="ts">
// Navigation side/bottom bar
</script>

<template>
  <nav
    class="glass-nav fixed md:static bottom-0 left-0 w-full md:w-20 h-16 md:h-screen border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 z-50 flex md:flex-col justify-around md:justify-start md:pt-6 md:pb-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-2xl transition-colors"
  >
    <div class="hidden md:flex justify-center mb-8">
      <div
        class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <i class="fas fa-telescope text-white text-xl"></i>
      </div>
    </div>

    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-indigo-600 dark:text-indigo-400 group"
    >
      <div
        class="w-10 h-10 md:bg-indigo-500/10 rounded-xl flex flex-col items-center justify-center"
      >
        <i class="fas fa-map-location-dot text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-bold mt-1 md:block hidden">Explorer</span>
    </a>
    
    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
    >
      <div
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50"
      >
        <i class="fas fa-camera text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-medium mt-1 md:block hidden">Galerie</span>
    </a>
    
    <a
      href="#"
      class="flex flex-col items-center justify-center md:mb-6 w-full md:w-auto h-full md:h-auto text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors relative group"
    >
      <div
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50"
      >
        <i class="far fa-calendar-check text-xl mb-1 md:mb-0"></i>
      </div>
      <span class="text-[10px] font-medium mt-1 md:block hidden">Sessions</span>
      <span
        class="absolute top-2 md:top-0 right-1/4 md:right-2 w-2 h-2 bg-indigo-500 rounded-full"
      ></span>
    </a>

    <div
      class="md:mt-auto flex flex-col items-center justify-center w-full md:w-auto h-full md:h-auto group cursor-pointer"
    >
      <div
        class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-600 overflow-hidden mt-1 md:mb-0 shadow-sm"
      >
        <img
          src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff"
          alt="User"
        />
      </div>
    </div>
  </nav>
</template>
