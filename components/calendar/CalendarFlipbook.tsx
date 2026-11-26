'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '@/components/icons'
import { MONTH_NAMES } from '@/lib/calendar/layout'
import BackCover from './BackCover'
import CoverTitle from './CoverTitle'
import GridPage from './GridPage'

interface CalendarFlipbookProps {
  petNames: string[]
  petType: string
  styleName: string
  year: number
  accent?: string
  caption: string
  cover: string
  /** Twelve month images, January first. */
  months: string[]
}

const FLIP_MS = 900
/** 0 = cover, 1–12 = months, 13 = back cover. */
const LAST = 13

const label = (view: number) => (view === 0 ? 'Cover' : view === LAST ? 'Back cover' : MONTH_NAMES[view - 1])

/**
 * The whole calendar as something you can pick up and leaf through: the cover,
 * twelve open spreads that turn over the wire like the real thing, and the back.
 * Arrow keys, swipes, the side buttons and the month strip all turn pages.
 */
export default function CalendarFlipbook({ petNames, petType, styleName, year, accent, caption, cover, months }: CalendarFlipbookProps) {
  const [view, setView] = useState(0)
  // While a sheet is turning: the two months involved and which way it is going.
  const [turn, setTurn] = useState<{ from: number; to: number; started: boolean } | null>(null)
  const reduced = useRef(false)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const goTo = useCallback(
    (target: number) => {
      const to = Math.max(0, Math.min(LAST, target))
      if (to === view || turn) return
      const bothMonths = view >= 1 && view <= 12 && to >= 1 && to <= 12
      // Only neighbouring months share a sheet; everything else simply swaps.
      if (!bothMonths || Math.abs(to - view) !== 1 || reduced.current) return setView(to)
      setTurn({ from: view, to, started: false })
      requestAnimationFrame(() => requestAnimationFrame(() => setTurn((t) => (t ? { ...t, started: true } : t))))
      setTimeout(() => {
        setView(to)
        setTurn(null)
      }, FLIP_MS)
    },
    [turn, view]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(view + 1)
      if (e.key === 'ArrowLeft') goTo(view - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, view])

  // During a turn the spread is drawn for the lower of the two months: its art
  // on top, the higher month's dates underneath, and one sheet between them.
  const lower = turn ? Math.min(turn.from, turn.to) : view
  const forward = turn ? turn.to > turn.from : true
  const sheetTurned = turn ? (forward ? turn.started : !turn.started) : false

  return (
    <div className="mx-auto w-full max-w-[28rem]">
      <div
        className="relative"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 40) goTo(view + (dx < 0 ? 1 : -1))
        }}
      >
        {/* the nail it hangs from */}
        <div aria-hidden="true" className="absolute left-1/2 -top-6 z-10 -translate-x-1/2">
          <div className="mx-auto h-3 w-3 rounded-full bg-ink/80" />
          <div className="mx-auto -mt-0.5 h-5 w-px bg-ink/40" />
        </div>

        <div className="origin-top animate-sway" style={{ perspective: '2000px' }}>
          {view === 0 && !turn ? (
            <button type="button" onClick={() => goTo(1)} className="relative block aspect-[11/8.5] w-full overflow-hidden rounded-[3px] shadow-lift" aria-label="Open the calendar">
              <img src={cover} alt={`Cover of the calendar: ${caption}`} className="h-full w-full object-cover" />
              <CoverTitle petNames={petNames} year={year} styleName={styleName} petType={petType} />
            </button>
          ) : view === LAST && !turn ? (
            <BackCover petNames={petNames} months={months} />
          ) : (
            <div className="relative rounded-[3px] shadow-lift">
              <div className="relative aspect-[11/8.5] overflow-hidden rounded-t-[3px] bg-paper-deep">
                <img src={months[lower - 1]} alt={`${MONTH_NAMES[lower - 1]} artwork`} className="h-full w-full object-cover" />
              </div>
              <div className="wire-o" aria-hidden="true" />
              <div className="relative">
                <GridPage month={turn ? lower + 1 : lower} year={year} accent={accent} caption={caption} />
                {turn && (
                  <div
                    className="absolute inset-0"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'top center',
                      transition: `transform ${FLIP_MS}ms cubic-bezier(0.6, 0, 0.2, 1)`,
                      transform: sheetTurned ? 'rotateX(180deg)' : 'rotateX(0deg)',
                      zIndex: 4,
                    }}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                      <GridPage month={lower} year={year} accent={accent} caption={caption} />
                    </div>
                    <div className="absolute inset-0 overflow-hidden bg-paper-deep" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} aria-hidden="true">
                      <img src={months[lower]} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => goTo(view - 1)} disabled={view === 0 || Boolean(turn)} aria-label="Previous page">
          <ArrowLeft size={18} />
        </button>
        <p className="text-center font-display text-3xl" aria-live="polite">
          {label(turn ? turn.to : view)} {(turn ? turn.to : view) >= 1 && (turn ? turn.to : view) <= 12 && <span className="text-muted">{year}</span>}
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => goTo(view + 1)} disabled={view === LAST || Boolean(turn)} aria-label="Next page">
          <ArrowRight size={18} />
        </button>
      </div>

      <ol className="no-scrollbar mt-6 flex gap-1.5 overflow-x-auto pb-1" aria-label="Pages">
        {[cover, ...months].map((src, i) => (
          <li key={i} className="shrink-0">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={label(i)}
              aria-current={view === i}
              className={`block h-11 w-14 overflow-hidden rounded-[3px] transition-opacity ${view === i ? 'shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink)]' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          </li>
        ))}
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => goTo(LAST)}
            aria-label="Back cover"
            aria-current={view === LAST}
            className={`grid h-11 w-14 place-items-center rounded-[3px] bg-[#fdfbf6] text-[0.6rem] font-bold uppercase tracking-wide text-ink-soft ${view === LAST ? 'shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink)]' : 'opacity-70 hover:opacity-100'}`}
          >
            Back
          </button>
        </li>
      </ol>
      <p className="mt-3 text-center text-xs text-muted">Tap the arrows, swipe, or use your arrow keys to turn the pages.</p>
    </div>
  )
}
