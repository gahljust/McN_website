'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { searchEntries } from '@/lib/search.mjs'

type SearchEntry = { href: string; title: string; label: string; section: string; text: string }

export function SiteSearch() {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(0)
  const results = useMemo(() => searchEntries(entries || [], query), [entries, query])
  const show = useCallback(() => { dialog.current?.showModal(); setOpen(true); requestAnimationFrame(() => input.current?.focus()) }, [])
  const close = useCallback(() => { dialog.current?.close(); setOpen(false) }, [])
  useEffect(() => {
    function keyboard(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (dialog.current?.open) close(); else show() }
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  }, [show, close])
  useEffect(() => {
    if (!open || entries) return
    const controller = new AbortController()
    setFailed(false)
    fetch('/search-index.json', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Search index unavailable')
      return response.json()
    }).then((data: SearchEntry[]) => setEntries(data)).catch(error => { if (error.name !== 'AbortError') setFailed(true) })
    return () => controller.abort()
  }, [open, entries])
  function keyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setActive(previous => (previous + 1) % results.length) }
    if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActive(previous => (previous + results.length - 1) % results.length) }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); router.push(results[active].href); close() }
  }
  useEffect(() => { document.getElementById(`${id}-result-${active}`)?.scrollIntoView({ block: 'nearest' }) }, [active, id, query, open])
  return <>
    <button className="search-trigger" type="button" onClick={show} aria-label="Search the site" aria-keyshortcuts="Meta+K Control+K"><Search size={18} aria-hidden="true" /></button>
    <dialog ref={dialog} className="search-dialog" aria-labelledby={`${id}-title`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) close() }}>
      <div className="search-dialog-inner">
        <div className="search-dialog-header"><h2 id={`${id}-title`}>Search</h2><button type="button" className="icon-button" onClick={close} aria-label="Close search"><X size={19} /></button></div>
        <div className="search-field"><Search size={19} /><input ref={input} type="search" placeholder="Search tutorials and resources" value={query} onChange={event => { setQuery(event.target.value); setActive(0) }} onKeyDown={keyboard} role="combobox" aria-label="Search tutorials and resources" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-results`} aria-activedescendant={results[active] ? `${id}-result-${active}` : undefined} autoComplete="off" /></div>
        <div className="search-results" id={`${id}-results`} role="listbox" aria-label="Search results">
          {results.map((entry, index) => {
            const resource = entry.href.startsWith('/resources?')
            return <Link prefetch={false} className={`search-result ${active === index ? 'is-active' : ''}`} href={entry.href} key={entry.href} id={`${id}-result-${index}`} role="option" aria-selected={active === index} onClick={close} onMouseMove={() => setActive(index)}><span><strong>{resource ? entry.title : entry.section || entry.label}</strong><small>{resource ? `${entry.label} · Resources` : entry.section ? entry.title : entry.title !== entry.label ? entry.title : entry.href}</small></span><ArrowUpRight size={16} /></Link>
          })}
        </div>
        <p className="search-status" role="status">{failed ? 'Search is unavailable. Try again.' : !entries ? 'Loading…' : results.length === 0 ? 'No results.' : `${results.length} results`}</p>
      </div>
    </dialog>
  </>
}
