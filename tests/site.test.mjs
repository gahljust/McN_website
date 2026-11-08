import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { canonicalHref, contentPathToHref } from '../lib/routing.mjs'
import { searchEntries } from '../lib/search.mjs'
import { prepareContent } from '../scripts/prepare-content.mjs'

const site = JSON.parse(await readFile(new URL('../data/site.json', import.meta.url), 'utf8'))

test('legacy paths retain query strings and hand-written section anchors', () => {
  assert.equal(canonicalHref('/Tutorials/Basics/Terminal/?mode=copy#scp_2', site.redirects), '/tutorials/terminal?mode=copy#scp_2')
  assert.equal(canonicalHref('/MOLLER/MOLLER/#parity', site.redirects), '/research/moller#parity')
  assert.equal(canonicalHref('https://root.cern.ch/manual/', site.redirects), 'https://root.cern.ch/manual/')
  assert.equal(canonicalHref('#parity', site.redirects), '#parity')
})

test('every configured content route and redirect maps to a source page', () => {
  const routes = new Set(site.pages.map(page => page.href))
  assert.equal(routes.size, site.pages.length)
  for (const page of site.pages) assert.equal(contentPathToHref(page.source), page.href)
  for (const [source, destination] of Object.entries(site.redirects)) {
    assert.ok(routes.has(destination))
    assert.notEqual(source.toLowerCase(), destination.toLowerCase())
  }
})

test('search ranks a page title above a body-only mention and requires all terms', () => {
  const entries = [
    { href: '/a', title: 'Geant4', label: 'Simulation', section: '', text: 'Use ROOT to analyze the data.' },
    { href: '/b', title: 'ROOT', label: 'Analysis', section: '', text: 'Make a histogram.' },
  ]
  assert.deepEqual(searchEntries(entries, 'root').map(entry => entry.href), ['/b', '/a'])
  assert.deepEqual(searchEntries(entries, 'root histogram').map(entry => entry.href), ['/b'])
  assert.equal(searchEntries(entries, 'unmatched').length, 0)
  assert.deepEqual(entries.map(entry => entry.href), ['/a', '/b'])
})

test('search supports code identifiers, duplicate sections, and empty queries', () => {
  const entries = [
    { href: '/start-here', title: 'Getting Started', label: 'Getting Started', section: '', text: '' },
    { href: '/tutorials/terminal#scp', title: 'Terminal', label: 'Terminal', section: 'SCP', text: 'scp daq@server:file .' },
    { href: '/tutorials/root#rec', title: 'ROOT', label: 'ROOT', section: 'Rec', text: 'det1_qdc_hr' },
  ]
  assert.equal(searchEntries(entries, 'det1_qdc_hr')[0].href, '/tutorials/root#rec')
  assert.equal(searchEntries(entries, 'scp')[0].href, '/tutorials/terminal#scp')
  assert.deepEqual(searchEntries(entries, '   ').map(entry => entry.href), ['/start-here'])
})

test('the migrated content keeps legacy anchors and distinguishes ROOT from Geant4', async () => {
  const { pages, index, images } = await prepareContent({ write: false })
  assert.ok(pages['/tutorials/terminal'].anchors.includes('scp_2'))
  assert.ok(pages['/research/moller'].anchors.includes('parity'))
  assert.match(pages['/tutorials/geant4'].title, /GEANT4/i)
  assert.notEqual(pages['/tutorials/root'].title, pages['/tutorials/geant4'].title)
  assert.ok(images['/images/Showermax_6.png'].width > 0)
  assert.equal(new Set(index.map(entry => entry.href)).size, index.length)
  assert.equal(searchEntries(index, 'Geant4')[0].href, '/tutorials/geant4')
  assert.ok(index.some(entry => entry.href === '/tutorials/terminal#ssh--secure-shell'))
  assert.ok(index.some(entry => entry.href === '/tutorials/3d-printing#print-head--extruder-nozzle-fan'))
  assert.deepEqual(Object.keys(images), Object.keys(images).sort())
})
