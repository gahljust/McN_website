import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { pages, researchPages, site, tutorialPages, type ContentPage } from '@/lib/site'

function summary(page: ContentPage) {
  const text = page.description
  if (!text || text === page.label || text === page.title) return ''
  return text.length >= 180 ? text.replace(/\s+\S*$/, '') + '…' : text
}

function GuideList({ entries, numbered = 0 }: { entries: ContentPage[]; numbered?: number }) {
  const items = entries.map(page => <li key={page.href}><Link href={page.href}><span className="guide-copy"><span className="guide-title">{page.label}</span>{summary(page) && <small className="guide-description">{summary(page)}</small>}</span><ArrowRight size={17} aria-hidden="true" /></Link></li>)
  if (!numbered) return <ul className="guide-list">{items}</ul>
  return <ol className="guide-list guide-list-numbered" start={numbered} style={{ counterReset: `guide ${numbered - 1}` }}>{items}</ol>
}

export function HomePage() {
  return <div className="home-page">
    <section className="home-hero page-container">
      <div className="hero-copy"><h1>{site.title}</h1><p className="hero-introduction">{site.introduction}</p><div className="hero-actions"><Link href="/start-here" className="button button-primary">Start Here <ArrowRight size={18} aria-hidden="true" /></Link></div></div>
      <figure className="hero-figure"><div className="hero-image"><Image src="/images/labs/cosmic_stand_2.jpg" alt="Cosmic ray stand in the ISU laboratory" width={405} height={540} sizes="(max-width: 760px) 100vw, 480px" preload /></div><figcaption>Cosmic Ray Stand</figcaption></figure>
    </section>
    <nav className="home-areas-wrap page-container" aria-label="Main areas"><ul className="guide-list home-areas">{site.navigation.filter(item => item.href !== '/start-here').map(item => <li key={item.href}><Link href={item.href}>{item.label}<ArrowRight size={17} aria-hidden="true" /></Link></li>)}</ul></nav>
  </div>
}

export function TutorialIndex() {
  return <div className="landing-page page-container"><div className="landing-heading"><h1>Tutorials</h1></div><section className="guide-group"><h2>Basics</h2><GuideList entries={tutorialPages.slice(0, 3)} numbered={1} /></section><section className="guide-group"><h2>CAD</h2><GuideList entries={tutorialPages.slice(3)} numbered={4} /></section></div>
}

export function ResearchIndex() {
  return <div className="landing-page page-container"><div className="landing-heading"><h1>Research</h1></div><GuideList entries={[...researchPages, pages['/lab/equipment']]} /></div>
}
