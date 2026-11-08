/** @typedef {{href:string,title:string,label:string,section:string,text:string}} SearchEntry */

export function searchTerms(query) {
  return query.toLocaleLowerCase().match(/[\p{L}\p{N}_]+/gu) || []
}

/** @param {SearchEntry[]} entries @param {string} query @param {number} limit */
export function searchEntries(entries, query, limit = 12) {
  const terms = searchTerms(query)
  if (!terms.length) {
    const defaults = ['/start-here', '/tutorials/terminal', '/tutorials/root', '/tutorials/geant4', '/lab/equipment', '/resources']
    return defaults.flatMap(href => entries.find(entry => entry.href === href) || []).slice(0, limit)
  }
  return entries.map(entry => {
    const title = `${entry.title} ${entry.label}`.toLocaleLowerCase()
    const section = entry.section.toLocaleLowerCase()
    const text = entry.text.toLocaleLowerCase()
    const haystack = `${title} ${section} ${text}`
    if (!terms.every(term => haystack.includes(term))) return { entry, score: 0 }
    const pageBonus = entry.href.includes('#') || entry.href.includes('?') ? 0 : 10
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 80 : 0) + (section.includes(term) ? 35 : 0) + (text.includes(term) ? 5 : 0), 1 + pageBonus)
    return { entry, score }
  }).filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.href.localeCompare(b.entry.href))
    .slice(0, limit).map(result => result.entry)
}
