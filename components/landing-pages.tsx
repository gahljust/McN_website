import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { researchPages, site, tutorialPages, type ContentPage } from '@/lib/site'

function GuideList({ entries }: { entries: ContentPage[] }) {
  return <ul className="guide-list">{entries.map(page => <li key={page.href}><Link href={page.href}>{page.label}<ArrowRight size={17} aria-hidden="true" /></Link></li>)}</ul>
}

export function HomePage() {
  return <div className="home-page">
    <section className="home-hero page-container">
      <div className="hero-copy"><h1>{site.title}</h1><p className="hero-introduction">{site.introduction}</p><div className="hero-actions"><Link href="/start-here" className="button button-primary">Start Here <ArrowRight size={18} aria-hidden="true" /></Link></div></div>
      <figure className="hero-figure"><div className="hero-image"><Image src="/images/labs/cosmic_stand_2.jpg" alt="Cosmic ray stand in the ISU laboratory" width={405} height={540} sizes="(max-width: 760px) 100vw, 480px" preload /></div><figcaption>Cosmic Ray Stand</figcaption></figure>
    </section>
  </div>
}

export function TutorialIndex() {
  return <div className="landing-page page-container"><div className="landing-heading"><h1>Tutorials</h1></div><section className="guide-group"><h2>Basics</h2><GuideList entries={tutorialPages.slice(0, 3)} /></section><section className="guide-group"><h2>CAD</h2><GuideList entries={tutorialPages.slice(3)} /></section></div>
}

export function ResearchIndex() {
  return <div className="landing-page page-container"><div className="landing-heading"><h1>MOLLER/ShowerMax</h1></div><GuideList entries={researchPages} /></div>
}
