import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { DocLayout } from '@/components/doc-layout'
import { pages } from '@/lib/site'
import type { TocItem } from '@/components/table-of-contents'

type Props = { params: Promise<{ mdxPath?: string[] }> }
export const generateStaticParams = generateStaticParamsFor('mdxPath')
export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mdxPath = [] } = await params
  const page = pages['/' + mdxPath.join('/')]
  return page ? { title: page.title, description: page.description } : { title: '404' }
}

export default async function Page({ params }: Props) {
  const resolved = await params
  const segments = resolved.mdxPath || []
  const page = pages['/' + segments.join('/')]
  if (!page) notFound()
  const { default: MDXContent, toc } = await importPage(segments)
  const body = <MDXContent params={resolved} />
  if (page.layout === 'landing') return body
  return <DocLayout page={page} toc={toc as TocItem[]}>{body}</DocLayout>
}
