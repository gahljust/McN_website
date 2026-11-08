'use client'

import { Children, createContext, isValidElement, useContext, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

type Preferences = { selections: Record<string, string>; select: (group: string, value: string) => void }
const PreferencesContext = createContext<Preferences | null>(null)

export function MdxPreferencesProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<Record<string, string>>({})
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mcnulty-tabs') || '{}')
      if (saved && typeof saved === 'object') setSelections(Object.fromEntries(Object.entries(saved).filter((entry): entry is [string, string] => typeof entry[1] === 'string')))
    } catch { /* Storage is optional. */ }
  }, [])
  function select(group: string, value: string) {
    setSelections(previous => {
      const updated = { ...previous, [group]: value }
      try { localStorage.setItem('mcnulty-tabs', JSON.stringify(updated)) } catch { /* Storage is optional. */ }
      return updated
    })
  }
  return <PreferencesContext.Provider value={{ selections, select }}>{children}</PreferencesContext.Provider>
}

export function Tab({ children }: { children?: ReactNode }) { return <>{children}</> }

export function Tabs({ items, children }: { items: string[]; children: ReactNode }) {
  const id = useId()
  const preferences = useContext(PreferencesContext)
  const [local, setLocal] = useState(items[0])
  const group = items.join('|')
  const selected = preferences?.selections[group] || local
  const active = items.includes(selected) ? items.indexOf(selected) : 0
  const panels = Children.toArray(children).filter(isValidElement<{ children?: ReactNode }>)
  function select(index: number) { setLocal(items[index]); preferences?.select(group, items[index]) }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index + items.length - 1) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    select(next)
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[next]?.focus()
  }
  return <div className="mdx-tabs">
    <div className="tab-list" role="tablist" aria-label="Platform">
      {items.map((item, index) => <button key={item} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => onKeyDown(event, index)}>{item}</button>)}
    </div>
    {panels.map((panel, index) => <div key={index} className="tab-panel" role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index}>{panel.props.children}</div>)}
  </div>
}

export function Callout({ children, type = 'info', emoji }: { children: ReactNode; type?: string; emoji?: string }) {
  return <aside className="callout" data-type={type}>{emoji && <span className="callout-icon" aria-hidden="true">{emoji}</span>}<div>{children}</div></aside>
}

export function CodeBlock({ children, className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const code = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  async function copy() {
    try {
      await navigator.clipboard.writeText(code.current?.textContent || '')
      setCopied(true); setMessage('Copied')
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => { setCopied(false); setMessage('') }, 2000)
    } catch { setMessage('Select the code to copy.') }
  }
  return <div className="code-shell"><pre {...props} ref={code} className={className}>{children}</pre><button className="copy-code icon-button" type="button" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>{copied ? <Check size={16} /> : <Copy size={16} />}</button><span className="sr-only" role="status">{message}</span></div>
}
