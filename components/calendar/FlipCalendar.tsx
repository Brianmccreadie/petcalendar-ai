'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Art from './Art'
import GridPage from './GridPage'

interface FlipCalendarProps {
  pages: { month: number; src: string; name: string }[]
  year: number
  caption: string
  accent?: string
  intervalMs?: number
  /** Colour of the caption and controls: for dark or light backgrounds. */
  tone?: 'dark' | 'light'
}

const FLIP_MS = 1100

/**
 * A hanging wall calendar that turns its own pages. The bottom sheet lifts over
 * the wire exactly as a real one does: its front is this month's dates, its
 * back is next month's artwork.
 */
export default function FlipCalendar({ pages, year, caption, accent, intervalMs = 3800, tone = 'dark' }: FlipCalendarProps) {
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  const current = pages[index]
  const next = pages[(index + 1) % pages.length]

  const advance = useCallback(() => {
    if (reduced.current) {
      setIndex((i) => (i + 1) % pages.length)
      return
    }
    setFlipping((f) => {
      if (f) return f
      setTimeout(() => {
        setIndex((i) => (i + 1) % pages.length)
        setFlipping(false)
      }, FLIP_MS)
      return true
    })
  }, [pages.length])

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduced.current) return
    const id = setInterval(advance, intervalMs)
    return () => clearInterval(id)
  }, [advance, intervalMs, paused])

  return (
    <div
      className="relative mx-auto w-full max-w-[27rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden="true" className="absolute left-1/2 -top-6 z-10 -translate-x-1/2">
        <div className="mx-auto h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgb(201_164_92/0.6)]" />
        <div className={`mx-auto h-5 w-px ${tone === 'dark' ? 'bg-ivory/30' : 'bg-ink/30'}`} />
      </div>

      <div className="origin-top animate-sway" style={{ perspective: '1800px' }}>
        <div className="relative rounded-[2px] shadow-lift">
          {/* top page: this month's artwork */}
          <div className="relative aspect-[11/8.5] overflow-hidden rounded-t-[2px] bg-night-3">
            <Art src={current.src} alt={`${current.name} artwork from a sample calendar`} sizes="(max-width: 640px) 100vw, 432px" />
          </div>

          <div className="wire-o" aria-hidden="true" />

          {/* bottom slot: next month's dates wait underneath */}
          <div className="relative">
            <GridPage month={next.month} year={year} accent={accent} caption={caption} />

            {/* the turning sheet */}
            <div
              key={index}
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transition: flipping ? `transform ${FLIP_MS}ms cubic-bezier(0.6, 0, 0.2, 1)` : 'none',
                transform: flipping ? 'rotateX(180deg)' : 'rotateX(0deg)',
                zIndex: 4,
              }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                <GridPage month={current.month} year={year} accent={accent} caption={caption} />
              </div>
              <div
                className="absolute inset-0 overflow-hidden bg-night-3"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                aria-hidden="true"
              >
                <Art src={next.src} alt="" sizes="(max-width: 640px) 100vw, 432px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 flex items-center justify-between ${tone === 'dark' ? 'text-ivory/60' : 'text-ink/60'}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em]" aria-live="polite">
          <span className={tone === 'dark' ? 'text-ivory' : 'text-ink'}>{String(current.month).padStart(2, '0')}</span> / 12 · {current.name}
        </p>
        <button
          type="button"
          onClick={advance}
          className={`link-line text-xs font-medium uppercase tracking-[0.2em] ${tone === 'dark' ? 'text-ivory' : 'text-ink'}`}
          aria-label="Turn to the next month"
        >
          Turn the page
        </button>
      </div>
    </div>
  )
}
