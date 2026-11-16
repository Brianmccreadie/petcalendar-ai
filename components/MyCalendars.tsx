'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus } from '@/components/icons'
import { joinPetNames } from '@/lib/calendar/layout'
import { removeProject, useSavedProjects, type SavedProject } from '@/lib/client/project-store'
import type { CalendarData } from '@/lib/client/use-calendar'
import { styleById } from '@/lib/style-meta'

interface Entry {
  saved: SavedProject
  data: CalendarData | null
}

type Loaded = Record<string, CalendarData | 'gone'>

function describe(entry: Entry): { label: string; tone: string; href: string; action: string } {
  const id = entry.saved.id
  const data = entry.data
  if (!data) return { label: 'Loading…', tone: 'bg-rule text-ink-soft', href: `/create/preview?p=${id}`, action: 'Open' }
  const done = data.pages.filter((p) => p.status === 'complete').length
  if (data.project.status === 'ordered') return { label: 'Ordered', tone: 'bg-pine text-white', href: `/create/preview?p=${id}`, action: 'View' }
  if (data.project.status === 'generating') return { label: `Creating · ${done}/13`, tone: 'bg-marigold text-ink', href: `/create/preview?p=${id}`, action: 'Watch progress' }
  if (data.pages.length === 0) return { label: 'Needs a theme', tone: 'bg-rule text-ink-soft', href: `/create/style?p=${id}`, action: 'Pick a theme' }
  if (done >= 13) return { label: 'Ready to order', tone: 'bg-persimmon text-white', href: `/create/preview?p=${id}`, action: 'Review & order' }
  return { label: `${done}/13 pages`, tone: 'bg-marigold text-ink', href: `/create/preview?p=${id}`, action: 'Continue' }
}

export default function MyCalendars() {
  const saved = useSavedProjects()
  const [loaded, setLoaded] = useState<Loaded>({})
  const ids = saved?.map((s) => s.id).join(',') ?? ''

  useEffect(() => {
    if (!ids) return
    let cancelled = false
    ids.split(',').forEach(async (id) => {
      try {
        const res = await fetch(`/api/pages?project_id=${id}`, { cache: 'no-store' })
        if (cancelled) return
        if (res.ok) {
          const data = (await res.json()) as CalendarData
          setLoaded((prev) => ({ ...prev, [id]: data }))
        } else if (res.status === 404) {
          setLoaded((prev) => ({ ...prev, [id]: 'gone' }))
        }
      } catch {
        // leave as loading; the card still links through
      }
    })
    return () => {
      cancelled = true
    }
  }, [ids])

  const entries: Entry[] | null =
    saved?.filter((s) => loaded[s.id] !== 'gone').map((s) => ({ saved: s, data: (loaded[s.id] as CalendarData | undefined) ?? null })) ?? null
  const visible = entries ?? []
  const forget = removeProject

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Saved in this browser</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">My calendars</h1>
        </div>
        <Link href="/create" className="btn btn-primary">
          <Plus size={18} /> New calendar
        </Link>
      </div>

      {entries === null ? (
        <div className="skeleton mt-10 h-64 rounded-[1.25rem]" />
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-[1.25rem] border-[1.5px] border-dashed border-ink/25 px-6 py-20 text-center">
          <h2 className="display text-3xl">Nothing here yet.</h2>
          <p className="lede mx-auto mt-3 max-w-md">
            Calendars you start on this device show up here, so you can come back and finish them. No account needed.
          </p>
          <Link href="/create" className="btn btn-primary btn-lg mt-8">
            Make my calendar <ArrowRight />
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry) => {
            const info = describe(entry)
            const cover = entry.data?.pages.find((p) => p.page_type === 'cover' && p.image_url)?.image_url
            const names = joinPetNames(entry.data?.pets.map((p) => p.name) ?? entry.saved.petNames)
            const style = styleById(entry.data?.project.style)
            return (
              <li key={entry.saved.id} className="card overflow-hidden">
                <Link href={info.href} className="group block">
                  <div className="relative aspect-[11/8.5] bg-paper-deep">
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    ) : (
                      <div className="grain grid h-full w-full place-items-center">
                        <span className="display text-5xl text-ink/15">{names.slice(0, 1)}</span>
                      </div>
                    )}
                    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${info.tone}`}>{info.label}</span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl font-bold">{names}</h2>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {entry.data && entry.data.pages.length > 0 && style ? `${style.name} · ${entry.data.project.start_year}` : 'Not started'}
                      {' · '}
                      {new Date(entry.saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-bold text-persimmon-deep">
                      {info.action} <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => forget(entry.saved.id)}
                  className="block w-full border-t border-rule py-2.5 text-xs font-bold text-muted hover:text-persimmon-deep"
                >
                  Remove from this list
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
