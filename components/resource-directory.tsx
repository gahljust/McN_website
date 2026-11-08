'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import resourceData from '@/data/resources.json'

const categories = [...new Set(resourceData.map(resource => resource.category))]

function ResourceBrowser({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const input = useRef<HTMLInputElement>(null)
  function clearSearch() { setQuery(''); input.current?.focus() }
  const visible = useMemo(() => {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean)
    return resourceData.filter(resource => terms.every(term => `${resource.title} ${resource.category} ${resource.section} ${resource.href}`.toLocaleLowerCase().includes(term)))
  }, [query])
  return <div className="landing-page resources-page page-container"><div className="landing-heading"><h1>Resources</h1></div>
    <div className="resource-tools"><label className="resource-search"><Search size={18} aria-hidden="true" /><input ref={input} type="search" aria-label="Search resources" placeholder="Search resources" value={query} onChange={event => setQuery(event.target.value)} />{query && <button className="icon-button" type="button" aria-label="Clear search" onClick={clearSearch}><X size={17} /></button>}</label><span className="resource-count" role="status">{visible.length} {visible.length === 1 ? 'link' : 'links'}</span></div>
    <div className="resource-directory">{categories.map(category => {
      const entries = visible.filter(resource => resource.category === category)
      if (!entries.length) return null
      const sections = [...new Set(entries.map(resource => resource.section))]
      return <details className="resource-group" key={category} open={Boolean(query.trim()) || category === categories[0]}><summary>{category}<span>{entries.length}</span></summary>{sections.map(section => <div className="resource-section" key={section}>{section && <h2>{section}</h2>}<ul className="resource-list">{entries.filter(resource => resource.section === section).map(resource => <li key={resource.id}><a href={resource.href} target="_blank" rel="noopener noreferrer"><span>{resource.title}</span><span className="resource-domain">{new URL(resource.href).hostname}</span></a></li>)}</ul></div>)}</details>
    })}</div>
    {visible.length === 0 && <div className="empty-state"><p>No results.</p><button type="button" className="button" onClick={clearSearch}>Clear search</button></div>}
  </div>
}

function DirectoryFromURL() {
  const params = useSearchParams()
  const query = params?.get('q') || ''
  return <ResourceBrowser key={query} initialQuery={query} />
}

export function ResourceDirectory() {
  return <Suspense fallback={<ResourceBrowser />}><DirectoryFromURL /></Suspense>
}
