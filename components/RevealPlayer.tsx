'use client'

import { createElement, useEffect, useState } from 'react'

interface RevealPlayerProps {
  src: string
  width: number
  height: number
}

/** Wraps the <hyperframes-player> web component, which plays a composition in a sandboxed iframe. */
export default function RevealPlayer({ src, width, height }: RevealPlayerProps) {
  const [state, setState] = useState<'checking' | 'ready' | 'unavailable'>('checking')

  useEffect(() => {
    let cancelled = false
    Promise.all([fetch(src, { method: 'GET', cache: 'no-store' }), import('@hyperframes/player')])
      .then(([res]) => !cancelled && setState(res.ok ? 'ready' : 'unavailable'))
      .catch(() => !cancelled && setState('unavailable'))
    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <div style={{ aspectRatio: `${width} / ${height}` }} className="relative w-full">
      {state === 'ready' ? (
        createElement('hyperframes-player', {
          src,
          width,
          height,
          controls: '',
          autoplay: '',
          muted: '',
          style: { display: 'block', width: '100%', height: '100%' },
        })
      ) : (
        <div className="grid h-full w-full place-items-center px-6 text-center text-paper/80">
          {state === 'checking' ? (
            <p role="status">Loading the reveal…</p>
          ) : (
            <p>The reveal is available once all thirteen pages of the calendar are finished.</p>
          )}
        </div>
      )}
    </div>
  )
}
