import Link from 'next/link'
import type { ReactNode } from 'react'
import { pagerFor, sectionIndexes, trackFor, pages, type ContentPage } from '@/lib/site'
import { TableOfContents, type TocItem } from './table-of-contents'
import { TutorialSidebar } from './tutorial-sidebar'

function Breadcrumb({ page }: { page: ContentPage }) {
  const section = page.section
  const sectionHref = section ? sectionIndexes[section] : '/'
  const parent = section || 'Home'
  return <nav className="breadcrumb" aria-label="Breadcrumb"><ol>
    <li>{sectionHref && sectionHref !== page.href ? <Link href={sectionHref}>{parent}</Link> : parent}</li>
    <li aria-current="page">{page.label}</li>
  </ol></nav>
}

function Pager({ href }: { href: string }) {
  const pager = pagerFor(href)
  if (!pager) return <div className="back-to-top"><a className="text-link" href="#main-content">↑ Back to top</a></div>
  const { track, previous, next } = pager
  return <>
    <nav className="pager" aria-label="Pages in this section">
      {previous ? <Link className="pager-link pager-previous" href={previous.href} rel="prev"><small>← Previous</small><span>{previous.label}</span></Link> : <span />}
      {next ? <Link className="pager-link pager-next" href={next.href} rel="next"><small>Next →</small><span>{next.label}</span></Link>
        : <Link className="pager-link pager-next" href={track.index}><small>Back to {track.name}</small><span>{track.name}</span></Link>}
    </nav>
    <div className="back-to-top"><a className="text-link" href="#main-content">↑ Back to top</a></div>
  </>
}

export function DocLayout({ page, toc, children }: { page: ContentPage; toc: TocItem[]; children: ReactNode }) {
  const track = trackFor(page.href)
  const headings = toc.filter(item => item.depth === 2)
  const entries = track?.paths.map(href => ({ href, label: pages[href].label }))
  return <div className={`document-layout${track ? ' document-layout-tutorial' : ''}`}>
    {track && entries && <TutorialSidebar key={`sidebar-${page.href}`} group={track.name} entries={entries} pageHref={page.href} headings={toc.filter(item => item.depth === 2 || item.depth === 3)} />}
    <div className="document-main" key={page.href}>
      <Breadcrumb page={page} />
      {!track && headings.length >= 4 && <TableOfContents items={headings} />}
      <article className="prose" data-pagefind-body>{children}</article>
      <Pager href={page.href} />
    </div>
  </div>
}
