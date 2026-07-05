import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Ferme un menu/dropdown au clic en dehors d'un conteneur donné. Préféré à un fond cliquable
 * superposé (`position: fixed` + z-index) : ce dernier peut se retrouver visuellement au-dessus
 * du contenu qu'il est censé laisser passer dès que les contextes d'empilement CSS s'imbriquent
 * (rencontré avec le calendrier de l'Omnibox — le fond finissait par masquer le menu malgré un
 * z-index plus bas, un `position: fixed` imbriqué échappe au contexte d'empilement local).
 */
export function useClickOutside(containerRef: Ref<HTMLElement | null>, onOutsideClick: () => void) {
  function handleClick(event: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
      onOutsideClick()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClick, true)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick, true)
  })
}
