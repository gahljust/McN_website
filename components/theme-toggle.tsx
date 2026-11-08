'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

function subscribe(notify: () => void) {
  window.addEventListener('mcnulty-theme', notify)
  const observer = new MutationObserver(notify)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => { observer.disconnect(); window.removeEventListener('mcnulty-theme', notify) }
}
function snapshot() { return document.documentElement.dataset.theme || 'light' }
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => 'light')
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    document.documentElement.classList.toggle('dark', next === 'dark')
    try { localStorage.setItem('mcnulty-theme', next) } catch { /* Storage is optional. */ }
    window.dispatchEvent(new Event('mcnulty-theme'))
  }
  return <button type="button" className="icon-button theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
}
