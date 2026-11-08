import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { pages, tutorialPages, type ContentPage } from '@/lib/site'
import { TableOfContents, type TocItem } from './table-of-contents'
import { TutorialSidebar } from './tutorial-sidebar'

export function DocLayout({ page, toc, children }: { page: ContentPage; toc: TocItem[]; children: ReactNode }) {
  const headings = toc.filter(item => item.depth === 2)
  const tutorial = page.section === 'Tutorials' || page.href === '/start-here'
  const entries = [pages['/start-here'], ...tutorialPages].map(entry => ({ href: entry.href, label: entry.href === '/start-here' ? 'Start Here' : entry.label }))
  return <div className={`document-layout${tutorial ? ' document-layout-tutorial' : ''}`}>
    {tutorial && <TutorialSidebar key={`sidebar-${page.href}`} entries={entries} pageHref={page.href} headings={toc.filter(item => item.depth === 2 || item.depth === 3)} />}
    <div className="document-main" key={page.href}>
      {!tutorial && headings.length >= 4 && <TableOfContents items={headings} />}
      <article className="prose" data-pagefind-body>{children}</article>
      {page.href === '/start-here' && <Link className="text-link next-step" href="/tutorials">Tutorials <ArrowRight size={17} aria-hidden="true" /></Link>}
    </div>
  </div>
}
