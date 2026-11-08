import { useMDXComponents as getNextraComponents, type MDXComponents } from 'nextra/mdx-components'
import ContentImage from '@/components/content-image'
import { ContentLink } from '@/components/content-link'
import { CodeBlock } from '@/components/mdx-elements'

const defaults = getNextraComponents({ a: ContentLink, img: ContentImage, pre: CodeBlock })
export function useMDXComponents(components: MDXComponents = {}) {
  return { ...defaults, ...components }
}
