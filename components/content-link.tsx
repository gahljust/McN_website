import Link, { type LinkProps } from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { localHref } from '@/lib/site'

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href?: LinkProps['href'] }

export function ContentLink({ href = '', children, ...props }: Props) {
  if (typeof href !== 'string') return <Link href={href} {...props}>{children}</Link>
  const target = localHref(href)
  if (target.startsWith('/') && !target.startsWith('//')) return <Link href={target} {...props}>{children}</Link>
  return <a href={target} {...(target.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{children}</a>
}
