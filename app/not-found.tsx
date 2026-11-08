import Link from 'next/link'

export default function NotFound() {
  return <div className="page-container not-found"><p className="eyebrow">404</p><h1>Page not found.</h1><Link href="/" className="button button-primary">Home</Link></div>
}
