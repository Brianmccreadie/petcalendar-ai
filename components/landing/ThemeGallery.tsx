'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { STYLE_CATEGORIES, previewSrc, styleMeta, type StyleCategory } from '@/lib/style-meta'
import { CALENDAR_STYLES, type PetType } from '@/lib/types'

const petOptions: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'other', label: 'Other pets' },
]

const INITIAL_COUNT = 12

export default function ThemeGallery() {
  const [pet, setPet] = useState<PetType>('dog')
  const [category, setCategory] = useState<StyleCategory | 'all'>('all')
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(
    () => CALENDAR_STYLES.filter((s) => category === 'all' || styleMeta(s.id).category === category),
    [category]
  )
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT)

  return (
    <section id="themes" className="bg-paper-deep py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Themes</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">Fifty ways to make your pet the main character.</h2>
            <p className="lede mt-4">These are real sample pages. Switch the pet to see how each theme adapts.</p>
          </div>
          <div className="inline-flex shrink-0 self-start rounded-full border-[1.5px] border-ink bg-card p-1" role="radiogroup" aria-label="Sample pet">
            {petOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={pet === option.value}
                onClick={() => setPet(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  pet === option.value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" className="chip shrink-0" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            All {CALENDAR_STYLES.length}
          </button>
          {STYLE_CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip shrink-0" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((style) => (
            <li key={style.id}>
              <Link href={`/create?theme=${style.id}`} className="group block">
                <div className="overflow-hidden rounded-[4px] bg-rule">
                  <Image
                    src={previewSrc(style.id, pet)}
                    alt={`${style.name} sample`}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-tight group-hover:text-persimmon-deep">
                  {style.name}
                </h3>
                <p className="mt-0.5 text-sm text-ink-soft">{style.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {filtered.length > INITIAL_COUNT && (
            <button type="button" className="btn btn-ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
              {expanded ? 'Show fewer' : `Show all ${filtered.length} themes`}
            </button>
          )}
          <Link href="/create" className="btn btn-primary">
            Start with your pet <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
