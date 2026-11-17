'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from '@/components/icons'
import { possessive, joinPetNames } from '@/lib/calendar/layout'
import { useSavedProjects } from '@/lib/client/project-store'
import { calendarYearOptions, defaultCalendarYear } from '@/lib/config'
import { STYLE_CATEGORIES, previewSrc, styleById, styleMeta, type StyleCategory } from '@/lib/style-meta'
import { CALENDAR_STYLES, type PetType } from '@/lib/types'
import { isStyleId } from '@/lib/validate'
import MissingProject from './MissingProject'
import StepHeader from './StepHeader'

export default function ThemeStep() {
  const router = useRouter()
  const params = useSearchParams()
  const projectId = params.get('p')
  const presetTheme = params.get('theme')

  const [selected, setSelected] = useState<string>(isStyleId(presetTheme) ? presetTheme : '')
  const [category, setCategory] = useState<StyleCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [year, setYear] = useState(defaultCalendarYear())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saved = useSavedProjects()?.find((p) => p.id === projectId)
  const petType: PetType = saved?.petType ?? 'dog'
  const names = saved?.petNames ?? []

  const styles = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CALENDAR_STYLES.filter(
      (s) =>
        (category === 'all' || styleMeta(s.id).category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    )
  }, [category, query])

  if (!projectId) return <MissingProject message="Let’s start with your pet." />

  const who = names.length ? joinPetNames(names) : 'your pet'
  const selectedStyle = styleById(selected)

  async function handleGenerate() {
    if (!selected || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, style: selected, startYear: year }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not start your calendar. Please try again.')
      }
      router.push(`/create/preview?p=${projectId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-44 pt-8 sm:px-8 sm:pt-12">
      <StepHeader current={2} />

      <header className="text-center">
        <h1 className="display text-4xl sm:text-5xl">Pick {possessive(who)} theme.</h1>
        <p className="lede mx-auto mt-4 max-w-xl">One theme, twelve different scenes — one for each month, plus a cover.</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" className="chip shrink-0" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            All {CALENDAR_STYLES.length}
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip shrink-0" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search themes</span>
          <input type="search" className="field !rounded-full !py-2.5" placeholder="Search themes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {styles.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">No themes match “{query}”.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4" role="radiogroup" aria-label="Theme">
          {styles.map((style) => {
            const active = selected === style.id
            return (
              <li key={style.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelected(style.id)}
                  className="group block w-full text-left"
                >
                  <span
                    className={`relative block overflow-hidden rounded-[6px] bg-rule transition-shadow ${
                      active ? 'shadow-[0_0_0_3px_var(--color-paper),0_0_0_6px_var(--color-persimmon)]' : ''
                    }`}
                  >
                    <Image
                      src={previewSrc(style.id, petType)}
                      alt=""
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {active && (
                      <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-persimmon text-white">
                        <Check size={18} strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="mt-2.5 block font-display text-lg font-bold leading-tight">{style.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{style.description}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/create" className="btn btn-quiet btn-sm hidden sm:inline-flex" aria-label="Back to photos">
              <ArrowLeft size={18} />
            </Link>
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Calendar year</legend>
              <span className="text-sm font-bold" aria-hidden="true">
                Year
              </span>
              {calendarYearOptions().map((y) => (
                <button key={y} type="button" className="chip !px-3 !py-1.5" aria-pressed={year === y} onClick={() => setYear(y)}>
                  {y}
                </button>
              ))}
            </fieldset>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-ink-soft" aria-live="polite">
              {error ? <span className="text-persimmon-deep">{error}</span> : selectedStyle ? selectedStyle.name : 'Choose a theme to continue'}
            </p>
            <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={!selected || submitting}>
              {submitting ? 'Starting…' : 'Create my calendar'} {!submitting && <ArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
