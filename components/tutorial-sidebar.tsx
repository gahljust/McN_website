'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { TocItem } from './table-of-contents'

type Tutorial = { href: string; label: string }

function SidebarLinks({ entries, pageHref, headings, active, sections }: { entries: Tutorial[]; pageHref: string; headings: TocItem[]; active: string; sections: RefObject<HTMLElement | null> }) {
  return <>
    <nav className="tutorial-pages" aria-label="Tutorials"><p className="tutorial-menu-label">Tutorials</p><ul>{entries.map(entry => <li key={entry.href}><Link href={entry.href} aria-current={entry.href === pageHref ? 'page' : undefined}>{entry.label}</Link></li>)}</ul></nav>
    {headings.length > 0 && <div className="tutorial-sections"><p className="tutorial-menu-label">On this page</p><nav ref={sections} aria-label="On this page"><ul>{headings.map(heading => <li key={heading.id} data-depth={heading.depth}><a href={`#${heading.id}`} aria-current={active === heading.id ? 'location' : undefined}>{heading.value}</a></li>)}</ul></nav></div>}
  </>
}

export function TutorialSidebar({ entries, pageHref, headings }: { entries: Tutorial[]; pageHref: string; headings: TocItem[] }) {
  const [active, setActive] = useState(headings[0]?.id || '')
  const desktopSections = useRef<HTMLElement>(null)
  const mobileSections = useRef<HTMLElement>(null)
  const mobileMenu = useRef<HTMLDetailsElement>(null)
  const current = entries.find(entry => entry.href === pageHref)
  const section = headings.find(heading => heading.id === active)

  useEffect(() => {
    const elements = headings.map(heading => document.getElementById(heading.id)).filter((element): element is HTMLElement => Boolean(element))
    let frame = 0
    function update() {
      frame = 0
      const header = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0
      const mobileBar = document.querySelector('.tutorial-sidebar-mobile > summary')?.getBoundingClientRect().bottom || 0
      const offset = Math.max(header, mobileBar) + 32
      let next = elements[0]?.id || ''
      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset) break
        next = element.id
      }
      setActive(next)
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [headings])

  function revealSection() {
    for (const container of [desktopSections.current, mobileSections.current]) {
      const link = container?.querySelector<HTMLElement>('[aria-current="location"]')
      if (!container?.clientHeight || !link) continue
      const bounds = container.getBoundingClientRect()
      const item = link.getBoundingClientRect()
      if (item.bottom > bounds.bottom) container.scrollTop += item.bottom - bounds.bottom + 8
      else if (item.top < bounds.top) container.scrollTop -= bounds.top - item.top + 8
    }
  }
  useEffect(revealSection, [active])

  return <aside className="tutorial-sidebar" aria-label="Tutorial navigation">
    <div className="tutorial-sidebar-desktop"><SidebarLinks entries={entries} pageHref={pageHref} headings={headings} active={active} sections={desktopSections} /></div>
    <details ref={mobileMenu} className="tutorial-sidebar-mobile" onToggle={event => { if (event.currentTarget.open) requestAnimationFrame(revealSection) }}><summary><span>{current?.label}</span>{section && <small>{section.value}</small>}</summary><div className="tutorial-mobile-panel" onClick={event => { if ((event.target as HTMLElement).closest('a') && mobileMenu.current) mobileMenu.current.open = false }}><SidebarLinks entries={entries} pageHref={pageHref} headings={headings} active={active} sections={mobileSections} /></div></details>
  </aside>
}
