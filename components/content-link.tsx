import Link, { type LinkProps } from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { localHref } from '@/lib/site'

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href?: LinkProps['href'] }

export function ContentLink({ href = '', children, ...props }: Props) {
  if (typeof href !== 'string') return <Link href={href} {...props}>{children}</Link>
  const target = localHref(href)
  if (target.startsWith('/') && !target.startsWith('//')) return <Link href={target} {...props}>{children}</Link>
  if (target.startsWith('http')) return <a href={target} target="_blank" rel="noopener noreferrer" {...props}>{children}<ArrowUpRight className="external-icon" size={14} aria-hidden="true" /><span className="sr-only"> (opens in new tab)</span></a>
  return <a href={target} {...props}>{children}</a>
}
