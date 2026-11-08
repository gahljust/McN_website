export type TocItem = { id: string; value: string; depth: number }

export function TableOfContents({ items }: { items: TocItem[] }) {
  return <details className="article-contents"><summary>On this page</summary><nav aria-label="On this page"><ul>{items.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.value}</a></li>)}</ul></nav></details>
}
