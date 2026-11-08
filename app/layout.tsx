import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MdxPreferencesProvider } from '@/components/mdx-elements'
import './globals.css'

export const metadata: Metadata = {
  title: { default: "Dr. McNulty's Physics Lab.", template: '%s – McNulty Group' },
  description: "Dr. McNulty's Physics Lab at Idaho State University.",
  icons: { icon: '/images/bengal_logo.png', apple: '/images/bengal_logo.png' },
}

const themeScript = `(function(){try{var p=localStorage.getItem('mcnulty-theme');var d=p==='dark'||(!p&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.classList.toggle('dark',d);matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(e){if(!localStorage.getItem('mcnulty-theme')){document.documentElement.dataset.theme=e.matches?'dark':'light';document.documentElement.style.colorScheme=e.matches?'dark':'light';document.documentElement.classList.toggle('dark',e.matches)}})}catch(e){}})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a href="#main-content" className="skip-link">Skip to content</a><MdxPreferencesProvider><SiteHeader /><main id="main-content" tabIndex={-1}>{children}</main><SiteFooter /></MdxPreferencesProvider></body></html>
}
