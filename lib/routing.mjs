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
