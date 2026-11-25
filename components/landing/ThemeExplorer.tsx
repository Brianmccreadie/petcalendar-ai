'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GridPage from '@/components/calendar/GridPage'
import { ArrowRight } from '@/components/icons'
import { defaultCalendarYear } from '@/lib/config'
import { STYLE_CATEGORIES, isNewStyle, previewSrc, styleMeta, type StyleCategory } from '@/lib/style-meta'
import { CALENDAR_STYLES, type PetType } from '@/lib/types'

const pets: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
]

/** How many cards to show before "Show all". Two full rows on a wide screen. */
const FIRST_PAGE = 8

/**
 * Browse every theme as a small hanging calendar. Filter by kind, search by
 * name, switch the sample pet; each card starts a calendar in that theme.
 */
export default function ThemeExplorer() {
  const year = defaultCalendarYear()
  const [category, setCategory] = useState<StyleCategory | 'all'>('all')
  const [pet, setPet] = useState<PetType>('dog')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const style of CALENDAR_STYLES) map.set(styleMeta(style.id).category, (map.get(styleMeta(style.id).category) ?? 0) + 1)
    return map
  }, [])

  const styles = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = CALENDAR_STYLES.filter(
      (s) =>
        (category === 'all' || styleMeta(s.id).category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    )
    if (category !== 'all' || q) return matches
    // With no filter, open on a mix: four of the new art styles, then everything else.
    const lead = matches.filter((s) => isNewStyle(s.id)).slice(0, 4)
    return [...lead, ...matches.filter((s) => !lead.includes(s))]
  }, [category, query])

  const filtering = category !== 'all' || query.trim() !== ''
  const visible = expanded || filtering ? styles : styles.slice(0, FIRST_PAGE)

  return (
    <div className="mt-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[1.5rem] bg-white/80 p-3 shadow-lift backdrop-blur-md lg:flex-row lg:items-center">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 lg:flex-1 lg:flex-wrap" role="group" aria-label="Kind of theme">
          <button type="button" className="chip shrink-0" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            All <span className="opacity-60">{CALENDAR_STYLES.length}</span>
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip shrink-0" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label} <span className="opacity-60">{counts.get(c.id) ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative block flex-1 lg:w-56">
            <span className="sr-only">Search themes</span>
            <input type="search" className="field !rounded-full !py-2.5" placeholder="Search themes…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div className="flex shrink-0 rounded-full border border-ink/15 bg-white p-1" role="radiogroup" aria-label="Sample pet">
            {pets.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={pet === option.value}
                onClick={() => setPet(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${pet === option.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {styles.length === 0 ? (
        <p className="py-24 text-center text-lg text-ink-soft">No themes match “{query}”. Try another word, or clear the filter.</p>
      ) : (
        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
          {visible.map((style, i) => (
            <li key={style.id}>
              <Link href={`/create?theme=${style.id}`} className="group block">
                {/* a small calendar: art page, wire, the top of the dates page */}
                <span className={`relative block transition-transform duration-500 ease-out group-hover:-translate-y-2 ${i % 2 ? 'group-hover:rotate-1' : 'group-hover:-rotate-1'}`}>
                  <span aria-hidden="true" className="absolute left-1/2 -top-3 z-10 -translate-x-1/2">
                    <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-ink/75" />
                  </span>
                  <span className="block overflow-hidden rounded-[3px] shadow-lift">
                    <Image
                      src={previewSrc(style.id, pet)}
                      alt={`${style.name} sample page`}
                      width={600}
                      height={464}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="aspect-[11/8.5] w-full object-cover"
                    />
                    <span className="wire-o block" aria-hidden="true" />
                    <GridPage month={(CALENDAR_STYLES.indexOf(style) % 12) + 1} year={year} caption={style.name} />
                  </span>
                  {isNewStyle(style.id) && (
                    <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink shadow-sm">New</span>
                  )}
                </span>
                <span className="mt-4 block font-display text-2xl leading-none">{style.name}</span>
                <span className="mt-1.5 flex items-start justify-between gap-3">
                  <span className="text-sm leading-snug text-ink-soft">{style.description}</span>
                  <ArrowRight size={16} className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!filtering && styles.length > FIRST_PAGE && (
        <div className="mt-12 text-center">
          <button type="button" className="btn btn-dark" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? 'Show fewer' : `Show all ${styles.length} themes`}
          </button>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-ink-soft">Pick any theme to start. You can change it before anything is made.</p>
    </div>
  )
}
