'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="page-container not-found"><h1>Unable to load this page.</h1><button type="button" className="button button-primary" onClick={reset}>Try again</button></div>
}
