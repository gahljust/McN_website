import Link from 'next/link'
import { site } from '@/lib/site'

export default function NotFound() {
  return <div className="page-container not-found"><p className="eyebrow">404</p><h1>Page not found.</h1><p className="not-found-hint">Try one of the main sections, or press Ctrl/Cmd+K to search the site.</p><nav aria-label="Main sections"><ul className="guide-list"><li><Link href="/">Home</Link></li>{site.navigation.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav></div>
}
