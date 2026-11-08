import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { toString } from 'mdast-util-to-string'
import sharp from 'sharp'
import { contentPathToHref } from '../lib/routing.mjs'

export const root = fileURLToPath(new URL('../', import.meta.url))
const parser = unified().use(remarkParse).use(remarkMdx)
const plain = node => toString(node).replace(/\s+/g, ' ').trim()

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesBelow(path.join(directory, entry.name))
    : path.join(directory, entry.name)))).flat()
}

async function writeChanged(filename, value) {
  const text = JSON.stringify(value, null, 2) + '\n'
  const existing = await readFile(filename, 'utf8').catch(() => '')
  if (existing === text) return
  await mkdir(path.dirname(filename), { recursive: true })
  await writeFile(filename, text)
}

export async function prepareContent({ write = true } = {}) {
  const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'))
  const resources = JSON.parse(await readFile(path.join(root, 'data/resources.json'), 'utf8'))
  const imageFiles = (await filesBelow(path.join(root, 'public/images'))).filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file)).sort()
  const dimensions = await Promise.all(imageFiles.map(async file => {
    const { width, height } = await sharp(file).metadata()
    return width && height ? ['/' + path.relative(path.join(root, 'public'), file).split(path.sep).join('/'), { width, height }] : null
  }))
  const images = Object.fromEntries(dimensions.filter(Boolean))

  const pages = {}
  const index = []
  const errors = []
  for (const page of site.pages) {
    if (contentPathToHref(page.source) !== page.href) errors.push(`Route does not match content source: ${page.href}`)
    const source = await readFile(path.join(root, 'content', page.source), 'utf8')
    const { content, data } = matter(source)
    const tree = parser.parse(content)
    const firstHeading = tree.children.find(node => node.type === 'heading' && node.depth === 1)
    const firstParagraph = tree.children.find(node => node.type === 'paragraph')
    const title = firstHeading ? plain(firstHeading) : String(data.title || page.label)
    const description = page.href === '/' ? site.introduction
      : String(data.description || (firstParagraph ? plain(firstParagraph).slice(0, 180) : page.label))
    const slugger = new GithubSlugger()
    const headings = []
    const anchors = new Set()
    const blocks = []
    let section = null

    function walk(node) {
      if (node.type === 'mdxjsEsm' || node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') return
      if (node.type === 'heading') {
        const value = plain(node)
        const id = slugger.slug(toString(node))
        headings.push({ id, value, depth: node.depth })
        anchors.add(id)
        section = node.depth === 1 ? null : { id, value, blocks: [] }
        if (section) blocks.push(section)
        return
      }
      if (node.type === 'image' && node.url.startsWith('/images/') && !images[node.url]) errors.push(`${page.source}: missing image or case mismatch ${node.url}`)
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        const id = node.attributes?.find(attr => attr.name === 'id')?.value
        if (typeof id === 'string') anchors.add(id)
        const src = node.attributes?.find(attr => attr.name === 'src')?.value
        if (typeof src === 'string' && src.startsWith('/images/') && !images[src]) errors.push(`${page.source}: missing image or case mismatch ${src}`)
        if (node.name === 'small') return
      }
      if (node.type === 'paragraph' || node.type === 'code') {
        const text = plain(node)
        if (text && section) section.blocks.push(text)
        return
      }
      if (node.children) node.children.forEach(walk)
    }
    tree.children.forEach(walk)
    const text = tree.children.filter(node => !['mdxjsEsm', 'mdxFlowExpression'].includes(node.type)).map(plain).join(' ').replace(/\s+/g, ' ').trim()
    pages[page.href] = { ...page, title, description, headings, anchors: [...anchors] }
    index.push({ href: page.href, title, label: page.label, section: '', text: text.slice(0, 1800) || description })
    for (const block of blocks) {
      index.push({ href: `${page.href}#${block.id}`, title, label: page.label, section: block.value, text: block.blocks.join(' ').slice(0, 1600) })
    }
  }
  for (const resource of resources) {
    if (!/^https?:\/\//.test(resource.href)) errors.push(`Invalid external resource URL: ${resource.href}`)
    index.push({ href: `/resources?q=${encodeURIComponent(resource.title)}`, title: resource.title, label: resource.category, section: 'Links', text: `${resource.title} ${resource.category} ${resource.section} ${new URL(resource.href).hostname}` })
  }
  if (new Set(resources.map(resource => resource.id)).size !== resources.length) errors.push('Duplicate resource IDs')
  for (const [source, destination] of Object.entries(site.redirects)) {
    if (!pages[destination]) errors.push(`Missing redirect destination: ${source} → ${destination}`)
    if (source.toLowerCase() === destination.toLowerCase()) errors.push(`Case-insensitive redirect loop: ${source}`)
  }
  if (errors.length) throw new Error(errors.join('\n'))
  if (write) await Promise.all([
    writeChanged(path.join(root, 'lib/generated/content.json'), pages),
    writeChanged(path.join(root, 'lib/generated/images.json'), images),
    writeChanged(path.join(root, 'public/search-index.json'), index),
  ])
  return { pages, index, images }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await prepareContent()
  console.log(`Prepared ${Object.keys(result.pages).length} pages, ${result.index.length} search entries, ${Object.keys(result.images).length} images.`)
}
