import { reactive, watchEffect } from 'vue'

export const appState = reactive({
  isDarkMode: false,
  isSearchOverlayVisible: false,
  activeSpot: null as null | {
    title: string
    score: number
    bortle: number
  },
  panelState: 'closed' as 'closed' | 'peek' | 'expanded'
})

export function toggleTheme() {
  appState.isDarkMode = !appState.isDarkMode
}

export function openSmartPanel(title: string, score: number, bortle: number) {
  appState.activeSpot = { title, score, bortle }
  appState.panelState = 'peek'
}

export function closeSmartPanel() {
  appState.panelState = 'closed'
}

export function togglePanelExpand() {
  if (appState.panelState === 'peek') {
    appState.panelState = 'expanded'
  } else if (appState.panelState === 'expanded') {
    appState.panelState = 'peek'
  }
}

export function openSearchOverlay() {
  appState.isSearchOverlayVisible = true
}

export function closeSearchOverlay() {
  appState.isSearchOverlayVisible = false
}

// Watch for dark mode changes and apply to HTML tag
if (typeof window !== 'undefined') {
  // Initialize from document if already set (e.g. by index.html)
  if (document.documentElement.classList.contains('dark')) {
    appState.isDarkMode = true
  }

  watchEffect(() => {
    if (appState.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
}
