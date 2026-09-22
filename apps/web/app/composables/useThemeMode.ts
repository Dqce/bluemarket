const STORAGE_KEY = 'bluemarket-theme'

function readStored(): 'dark' | 'light' | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const normalized = raw.replace(/"/g, '')
    if (normalized === 'light') return 'light'
    if (normalized === 'dark') return 'dark'
  }
  catch {
    /* ignore */
  }
  return null
}

function writeStored(mode: 'dark' | 'light') {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  }
  catch {
    /* ignore */
  }
}

function applyClass(dark: boolean) {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('dark', dark)
}

/**
 * First visit → dark. After that, respect stored light/dark.
 * Single source of truth: localStorage + html.dark (no vueuse desync).
 */
export function useThemeMode() {
  const isDark = useState('bm-is-dark', () => {
    if (import.meta.client) {
      // null (first visit) → dark
      return readStored() !== 'light'
    }
    return true
  })

  function setDark(value: boolean) {
    isDark.value = value
    applyClass(value)
    writeStored(value ? 'dark' : 'light')
  }

  function toggleDark() {
    setDark(!isDark.value)
  }

  if (import.meta.client) {
    // Align class with state as soon as this runs in the browser
    applyClass(isDark.value)
    if (readStored() === null) writeStored('dark')

    onMounted(() => {
      const stored = readStored()
      const shouldDark = stored !== 'light'
      if (shouldDark !== isDark.value) {
        isDark.value = shouldDark
      }
      applyClass(isDark.value)
    })
  }

  return {
    isDark,
    setDark,
    toggleDark,
  }
}
