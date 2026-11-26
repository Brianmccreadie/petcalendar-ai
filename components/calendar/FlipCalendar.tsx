'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '@/components/icons'
import Art from './Art'
import GridPage from './GridPage'

interface FlipCalendarProps {
  pages: { month: number; src: string; name: string }[]
  year: number
  caption: string
  accent?: string
  /** Colour of the caption and controls: for dark or light backgrounds. */
  tone?: 'dark' | 'light'
}

const FLIP_MS = 900

/**
 * A hanging wall calendar you can leaf through. One sheet turns over the wire
 * exactly as a real one does: its front is one month's dates, its back the
 * next month's artwork. Big arrows, a month strip, swipes, taps and arrow keys
 * all turn it, forwards and back.
 */
export default function FlipCalendar({ pages, year, caption, accent, tone = 'dark' }: FlipCalendarProps) {
  const [index, setIndex] = useState(0)
  // While a sheet turns: the earlier and later page of the pair, and which way it is going.
  const [turn, setTurn] = useState<{ a: number; b: number; forward: boolean; started: boolean } | null>(null)
  const [nudged, setNudged] = useState(false)
  const reduced = useRef(false)
  const touchX = useRef<number | null>(null)
  const count = pages.length

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const goTo = useCallback(
    (target: number) => {
      const to = ((target % count) + count) % count
      if (to === index || turn) return
      setNudged(true)
      const forward = to === (index + 1) % count
      const backward = to === (index - 1 + count) % count
      // Only neighbouring months share a sheet; a jump simply swaps.
      if ((!forward && !backward) || reduced.current) return setIndex(to)
      setTurn({ a: forward ? index : to, b: forward ? to : index, forward, started: false })
      requestAnimationFrame(() => requestAnimationFrame(() => setTurn((t) => (t ? { ...t, started: true } : t))))
      setTimeout(() => {
        setIndex(to)
        setTurn(null)
      }, FLIP_MS)
    },
    [count, index, turn]
  )

  const shown = turn ? pages[turn.forward ? turn.b : turn.a] : pages[index]
  const top = pages[turn ? turn.a : index]
  const bottom = pages[turn ? turn.b : index]
  // Forward: the sheet lifts from flat to turned. Back: it starts turned and comes down.
  const turned = turn ? (turn.forward ? turn.started : !turn.started) : false
  const soft = tone === 'dark' ? 'text-ivory/70' : 'text-ink/70'
  const strong = tone === 'dark' ? 'text-ivory' : 'text-ink'

  return (
    <div
      className="relative mx-auto w-full max-w-[27rem]"
      role="group"
      aria-roledescription="carousel"
      aria-label="Sample calendar, month by month"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goTo(index + 1)
        if (e.key === 'ArrowLeft') goTo(index - 1)
      }}
    >
      <div aria-hidden="true" className="absolute left-1/2 -top-6 z-10 -translate-x-1/2">
        <div className="mx-auto h-2.5 w-2.5 rounded-full bg-gold" />
        <div className={`mx-auto h-5 w-px ${tone === 'dark' ? 'bg-ivory/30' : 'bg-ink/30'}`} />
      </div>

      <div
        className="relative"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1))
        }}
      >
        <button type="button" onClick={() => goTo(index + 1)} className="block w-full cursor-pointer text-left" aria-label={`Turn to ${pages[(index + 1) % count].name}`} style={{ perspective: '1800px' }}>
          <span className="relative block rounded-[2px] shadow-lift">
            <span className="relative block aspect-[11/8.5] overflow-hidden rounded-t-[2px] bg-paper-deep">
              <Art src={top.src} alt={`${top.name} artwork from a sample calendar`} sizes="(max-width: 640px) 100vw, 432px" />
            </span>
            <span className="wire-o block" aria-hidden="true" />
            <span className="relative block">
              <GridPage month={bottom.month} year={year} accent={accent} caption={caption} />
              {turn && (
                <span
                  className="absolute inset-0 block"
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top center',
                    transition: `transform ${FLIP_MS}ms cubic-bezier(0.6, 0, 0.2, 1)`,
                    transform: turned ? 'rotateX(180deg)' : 'rotateX(0deg)',
                    zIndex: 4,
                  }}
                >
                  <span className="absolute inset-0 block" style={{ backfaceVisibility: 'hidden' }}>
                    <GridPage month={pages[turn.a].month} year={year} accent={accent} caption={caption} />
                  </span>
                  <span className="absolute inset-0 block overflow-hidden bg-paper-deep" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} aria-hidden="true">
                    <Art src={pages[turn.b].src} alt="" sizes="(max-width: 640px) 100vw, 432px" />
                  </span>
                </span>
              )}
            </span>
          </span>
        </button>

        {/* until someone turns a page, say that they can */}
        {!nudged && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 animate-bounce whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lift">
            Tap to turn the page
          </span>
        )}
      </div>

      {/* the controls: two big arrows either side of the month */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" className={`btn btn-ghost h-14 w-14 shrink-0 !rounded-full !p-0 ${strong}`} onClick={() => goTo(index - 1)} disabled={Boolean(turn)} aria-label="Previous month">
          <ArrowLeft size={22} />
        </button>
        <p className="text-center" aria-live="polite">
          <span className={`block font-display text-3xl leading-none ${strong}`}>
            {shown.name} <span className="opacity-50">{year}</span>
          </span>
          <span className={`mt-1.5 block text-xs font-semibold uppercase tracking-[0.18em] ${soft}`}>
            Month {shown.month} of {count}
          </span>
        </p>
        <button type="button" className="btn btn-primary h-14 w-14 shrink-0 !rounded-full !p-0" onClick={() => goTo(index + 1)} disabled={Boolean(turn)} aria-label="Next month">
          <ArrowRight size={22} />
        </button>
      </div>

      {/* jump straight to any month */}
      <ol className="mt-5 grid grid-cols-12 gap-1" aria-label="Jump to a month">
        {pages.map((page, i) => (
          <li key={page.month}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={page.name}
              aria-current={i === index}
              className={`flex h-11 w-full items-center justify-center rounded-lg text-xs font-bold uppercase transition-colors ${
                i === index ? 'bg-ink text-white' : `${soft} hover:bg-ink/10`
              }`}
            >
              {page.name.slice(0, 1)}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
