import configuration from '@/data/site.json'
import content from '@/lib/generated/content.json'
import resourceData from '@/data/resources.json'
import { canonicalHref, neighbours } from './routing.mjs'

export interface PageDefinition {
  href: string
  source: string
  label: string
  section: string
  layout: string
  legacySource?: string
}
export interface ContentPage extends PageDefinition {
  title: string
  description: string
  headings: { id: string; value: string; depth: number }[]
  anchors: string[]
}
export interface Resource { id: string; title: string; href: string; category: string; section: string }

export const site = configuration
export const pages = content as Record<string, ContentPage>
export const resources: Resource[] = resourceData
export const tutorialPaths = ['/tutorials/terminal', '/tutorials/root', '/tutorials/geant4', '/tutorials/cad', '/tutorials/3d-printing']
export const tutorialPages = tutorialPaths.map(href => pages[href])
export const researchPages = ['/research/moller', '/research/showermax'].map(href => pages[href])

export interface Track { name: string; index: string; paths: string[] }
/** Ordered reading sequences; they drive the pager and the section sidebar. */
export const tracks: Track[] = [
  { name: 'Tutorials', index: '/tutorials', paths: ['/start-here', ...tutorialPaths] },
  { name: 'Research', index: '/research', paths: ['/research/moller', '/research/showermax', '/lab/equipment'] },
]
export const sectionIndexes: Record<string, string> = { Tutorials: '/tutorials', Research: '/research', 'Lab handbook': '/lab/equipment' }
export function trackFor(href: string) { return tracks.find(track => track.paths.includes(href)) }
export function pagerFor(href: string) {
  const track = trackFor(href)
  if (!track) return null
  const { previous, next } = neighbours(track.paths, href)
  return { track, previous: previous ? pages[previous] : null, next: next ? pages[next] : null }
}
export function localHref(href: string) { return canonicalHref(href, site.redirects) }
export function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}
