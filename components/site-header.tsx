'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import configuration from '@/data/site.json'
import { SiteSearch } from './site-search'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  const pathname = usePathname() || '/'
  const navigation = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = navigation.current
    const current = bar?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!bar || !current || bar.scrollWidth <= bar.clientWidth) return
    const item = current.getBoundingClientRect()
    const bounds = bar.getBoundingClientRect()
    if (item.right > bounds.right) bar.scrollLeft += item.right - bounds.right + 4
    else if (item.left < bounds.left) bar.scrollLeft -= bounds.left - item.left + 4
  }, [pathname])
  function active(href: string) { return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/') }
  return <header className="site-header">
    <div className="header-container">
      <Link className="wordmark" href="/" aria-label="McNulty Lab home"><Image className="brand-tiger" src="/images/bengal_logo.png" alt="Idaho State Bengals tiger" width={50} height={50} preload /><span className="wordmark-copy"><span>McNulty <span className="wordmark-accent">Lab</span></span><small>{configuration.university}</small></span></Link>
      <nav ref={navigation} className="site-navigation" aria-label="Main navigation">{configuration.navigation.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? 'page' : undefined}>{item.label}</Link>)}</nav>
      <div className="header-controls">
        <SiteSearch /><ThemeToggle />
      </div>
    </div>
  </header>
}
