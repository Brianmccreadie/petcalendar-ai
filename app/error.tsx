'use client'

import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <h1 className="display text-5xl sm:text-6xl">Something went sideways.</h1>
      <p className="lede mx-auto mt-4 max-w-md">Your calendar is safe. Try that again.</p>
      <button type="button" className="btn btn-primary mt-8" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
