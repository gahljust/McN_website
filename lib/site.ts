import configuration from '@/data/site.json'
import content from '@/lib/generated/content.json'
import resourceData from '@/data/resources.json'
import { canonicalHref } from './routing.mjs'

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
export function localHref(href: string) { return canonicalHref(href, site.redirects) }
export function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}
