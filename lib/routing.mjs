/** Preserve fragments and query strings when resolving an old local URL. */
export function canonicalHref(href, redirects) {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const match = href.match(/^([^?#]*)(.*)$/)
  const pathname = match[1].replace(/\/$/, '') || '/'
  return (redirects[pathname] || pathname) + match[2]
}

export function contentPathToHref(source) {
  const path = source.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')
  return '/' + path.replace(/\/$/, '')
}

/** Previous and next hrefs around `href` in an ordered list of paths (null at either end or when absent). */
export function neighbours(paths, href) {
  const index = paths.indexOf(href)
  if (index < 0) return { previous: null, next: null }
  return { previous: paths[index - 1] ?? null, next: paths[index + 1] ?? null }
}
