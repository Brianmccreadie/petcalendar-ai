'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GridPage from '@/components/calendar/GridPage'
import WallCalendar from '@/components/calendar/WallCalendar'
import { ArrowRight } from '@/components/icons'
import { defaultCalendarYear } from '@/lib/config'
import { STYLE_CATEGORIES, previewSrc, styleMeta, type StyleCategory } from '@/lib/style-meta'
import { CALENDAR_STYLES, type PetType } from '@/lib/types'

const pets: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
]

/**
 * Browse all fifty themes: a typographic index on the left drives a large
 * preview on the right. On small screens it becomes a swipeable shelf.
 */
export default function ThemeExplorer() {
  const year = defaultCalendarYear()
  const [pet, setPet] = useState<PetType>('dog')
  const [category, setCategory] = useState<StyleCategory | 'all'>('all')
  const [activeId, setActiveId] = useState<string>('mythical-quest')

  const styles = useMemo(
    () => CALENDAR_STYLES.filter((s) => category === 'all' || styleMeta(s.id).category === category),
    [category]
  )
  const active = styles.find((s) => s.id === activeId) ?? styles[0]

  return (
    <div className="mt-16">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            All
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Desktop: index + stage */}
        <div className="mt-12 hidden gap-14 lg:grid lg:grid-cols-[1fr_1.25fr]">
          <ol
            className="no-scrollbar max-h-[38rem] overflow-y-auto pr-4 [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_90%,transparent)]"
            aria-label="Themes"
          >
            {styles.map((style, i) => {
              const isActive = style.id === active.id
              return (
                <li key={style.id}>
                  <Link
                    href={`/create?theme=${style.id}`}
                    onMouseEnter={() => setActiveId(style.id)}
                    onFocus={() => setActiveId(style.id)}
                    className={`group flex items-baseline gap-5 border-b border-ink/10 py-3.5 transition-colors duration-300 ${
                      isActive ? 'text-ink' : 'text-ink/35 hover:text-ink'
                    }`}
                  >
                    <span className={`w-7 text-xs font-medium tabular-nums ${isActive ? 'text-gold-deep' : ''}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display text-[2.6rem] leading-none transition-transform duration-500 ${isActive ? 'translate-x-2 italic' : ''}`}>
                      {style.name}
                    </span>
                    <ArrowRight size={20} className={`ml-auto transition-opacity ${isActive ? 'opacity-100 text-gold-deep' : 'opacity-0'}`} />
                  </Link>
                </li>
              )
            })}
          </ol>

          <div className="sticky top-24 self-start">
            <div className="mx-auto max-w-[27rem] overflow-hidden rounded-[3px] shadow-stage">
            <div className="relative aspect-[11/8.5] overflow-hidden bg-paper-deep">
              {styles.map((style) => (
                <Image
                  key={style.id}
                  src={previewSrc(style.id, pet)}
                  alt={style.id === active.id ? `${style.name} sample` : ''}
                  fill
                  sizes="(max-width: 1280px) 55vw, 720px"
                  loading={style.id === active.id ? 'eager' : 'lazy'}
                  className={`object-cover transition-all duration-700 ease-out ${
                    style.id === active.id ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                  }`}
                />
              ))}
            </div>
            <div className="wire-o" aria-hidden="true" />
            <GridPage month={(styles.indexOf(active) % 12) + 1} year={year} caption={active.name} />
            </div>
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-3xl">{active.name}</p>
                <p className="mt-1 text-ink/55">{active.description}</p>
              </div>
              <div className="flex shrink-0 rounded-full border border-ink/20 p-1" role="radiogroup" aria-label="Sample pet">
                {pets.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={pet === option.value}
                    onClick={() => setPet(option.value)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      pet === option.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <Link href={`/create?theme=${active.id}`} className="btn btn-light mt-7">
              Start with {active.name} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Mobile: swipeable shelf */}
        <div className="mt-10 lg:hidden">
          <div className="mb-5 inline-flex rounded-full border border-ink/20 p-1" role="radiogroup" aria-label="Sample pet">
            {pets.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={pet === option.value}
                onClick={() => setPet(option.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium ${pet === option.value ? 'bg-ink text-white' : 'text-ink/60'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
            {styles.map((style) => (
              <li key={style.id} className="w-[78vw] max-w-sm shrink-0 snap-center">
                <Link href={`/create?theme=${style.id}`}>
                  <WallCalendar
                    imageUrl={previewSrc(style.id, pet)}
                    imageAlt={`${style.name} sample`}
                    month={(styles.indexOf(style) % 12) + 1}
                    year={year}
                    caption={style.name}
                    hanging={false}
                  />
                  <p className="mt-5 font-display text-3xl">{style.name}</p>
                  <p className="text-sm text-ink/55">{style.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink/40">Swipe · {styles.length} themes</p>
        </div>
    </div>
  )
}
