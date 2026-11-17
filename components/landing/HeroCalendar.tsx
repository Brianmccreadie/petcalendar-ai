'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import GridPage from '@/components/calendar/GridPage'
import { CALENDAR_STYLES } from '@/lib/types'

const slides = [
  { src: '/previews/space-explorer-dog.jpg', styleId: 'space-explorer', month: 1, alt: 'A labrador in an astronaut suit' },
  { src: '/previews/royal-portrait-cat.jpg', styleId: 'royal-portrait', month: 2, alt: 'A grey cat in royal dress on a throne' },
  { src: '/previews/hero-1.jpg', styleId: 'wizarding-world', month: 3, alt: 'A golden retriever dressed as a wizard' },
  { src: '/previews/cozy-vibes-dog.jpg', styleId: 'cozy-vibes', month: 12, alt: 'A samoyed curled up on knitted blankets' },
] as const

/** The hero's hanging calendar. Cycles themes; the dates below are live SVG. */
export default function HeroCalendar({ year }: { year: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200)
    return () => clearInterval(id)
  }, [])

  const current = slides[index]
  const style = CALENDAR_STYLES.find((s) => s.id === current.styleId)

  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-[26.5rem]">
      {/* loose prints tucked behind the calendar */}
      <img
        src="/previews/pirate-life-other.jpg"
        alt=""
        aria-hidden="true"
        className="absolute -left-10 top-10 hidden w-40 -rotate-[9deg] rounded-[3px] border-[6px] border-card shadow-page sm:block"
      />
      <img
        src="/previews/snow-day-dog.jpg"
        alt=""
        aria-hidden="true"
        className="absolute -right-8 bottom-24 hidden w-44 rotate-[7deg] rounded-[3px] border-[6px] border-card shadow-page sm:block"
      />

      <div className="relative origin-top animate-sway">
        <div aria-hidden="true" className="absolute left-1/2 -top-5 z-10 -translate-x-1/2">
          <div className="mx-auto h-3 w-3 rounded-full bg-ink/80" />
          <div className="mx-auto -mt-0.5 h-4 w-px bg-ink/50" />
        </div>
        <div className="overflow-hidden rounded-[3px] shadow-lift">
          <div className="relative aspect-[11/8.5] bg-paper-deep">
            {slides.map((slide, i) => (
              <img
                key={slide.src}
                src={slide.src}
                alt={i === index ? slide.alt : ''}
                aria-hidden={i !== index}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="wire-o" aria-hidden="true" />
          <GridPage month={current.month} year={year} accent="#c4411c" caption={`Luna · ${style?.name ?? ''}`} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Sample themes">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={CALENDAR_STYLES.find((s) => s.id === slide.styleId)?.name}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-7 bg-ink' : 'w-2 bg-ink/25 hover:bg-ink/50'}`}
          />
        ))}
      </div>
    </div>
  )
}
