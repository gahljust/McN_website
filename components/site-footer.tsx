import Link from 'next/link'
import { site } from '@/lib/site'

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-container">
    <div className="footer-bottom"><span>ISU {new Date().getFullYear()} © Dr. McNulty</span><nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/maintainers">Website Maintenance</Link><a href={site.repository} target="_blank" rel="noopener noreferrer">GitHub</a></nav></div>
  </div></footer>
}
