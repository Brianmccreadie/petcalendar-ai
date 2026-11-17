'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
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
  const [pet, setPet] = useState<PetType>('dog')
  const [category, setCategory] = useState<StyleCategory | 'all'>('all')
  const [activeId, setActiveId] = useState<string>('mythical-quest')

  const styles = useMemo(
    () => CALENDAR_STYLES.filter((s) => category === 'all' || styleMeta(s.id).category === category),
    [category]
  )
  const active = styles.find((s) => s.id === activeId) ?? styles[0]

  return (
    <section id="themes" className="on-dark grain relative">
      <div className="relative mx-auto max-w-[84rem] px-5 py-28 sm:px-8 lg:py-40">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Fifty themes</p>
            <h2 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
              Choose the world they <span className="display-italic text-gold">belong</span> in.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
              All
            </button>
            {STYLE_CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: index + stage */}
        <div className="mt-16 hidden gap-14 lg:grid lg:grid-cols-[1fr_1.25fr]">
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
                    className={`group flex items-baseline gap-5 border-b border-ivory/10 py-3.5 transition-colors duration-300 ${
                      isActive ? 'text-ivory' : 'text-ivory/35 hover:text-ivory'
                    }`}
                  >
                    <span className={`w-7 text-xs font-medium tabular-nums ${isActive ? 'text-gold' : ''}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display text-[2.6rem] leading-none transition-transform duration-500 ${isActive ? 'translate-x-2 italic' : ''}`}>
                      {style.name}
                    </span>
                    <ArrowRight size={20} className={`ml-auto transition-opacity ${isActive ? 'opacity-100 text-gold' : 'opacity-0'}`} />
                  </Link>
                </li>
              )
            })}
          </ol>

          <div className="sticky top-24 self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-night-3 shadow-stage">
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
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-3xl">{active.name}</p>
                <p className="mt-1 text-ivory/55">{active.description}</p>
              </div>
              <div className="flex shrink-0 rounded-full border border-ivory/20 p-1" role="radiogroup" aria-label="Sample pet">
                {pets.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={pet === option.value}
                    onClick={() => setPet(option.value)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      pet === option.value ? 'bg-ivory text-night' : 'text-ivory/60 hover:text-ivory'
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
          <div className="mb-5 inline-flex rounded-full border border-ivory/20 p-1" role="radiogroup" aria-label="Sample pet">
            {pets.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={pet === option.value}
                onClick={() => setPet(option.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium ${pet === option.value ? 'bg-ivory text-night' : 'text-ivory/60'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
            {styles.map((style) => (
              <li key={style.id} className="w-[78vw] max-w-sm shrink-0 snap-center">
                <Link href={`/create?theme=${style.id}`}>
                  <Image
                    src={previewSrc(style.id, pet)}
                    alt={`${style.name} sample`}
                    width={640}
                    height={480}
                    sizes="78vw"
                    className="aspect-[4/3] w-full rounded-[2px] object-cover"
                  />
                  <p className="mt-3 font-display text-3xl">{style.name}</p>
                  <p className="text-sm text-ivory/55">{style.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ivory/40">Swipe · {styles.length} themes</p>
        </div>
      </div>
    </section>
  )
}
