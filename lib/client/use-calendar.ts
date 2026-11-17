'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MultiPetMode, PetType, ProjectStatus } from '@/lib/types'

export interface CalendarPageView {
  id: string
  page_type: 'cover' | 'month' | 'back'
  month_number: number | null
  pet_id: string | null
  image_url: string | null
  status: 'pending' | 'generating' | 'complete' | 'failed'
  version_count: number
  revisions_left: number
}

export interface CalendarData {
  project: {
    id: string
    style: string
    status: ProjectStatus
    start_year: number
    multi_pet_mode: MultiPetMode
    pet_name: string | null
    pet_type: PetType
    created_at: string
  }
  pets: { id: string; name: string; pet_type: PetType }[]
  pages: CalendarPageView[]
}

export type CalendarSlot = CalendarPageView | { id: null; page_type: 'cover' | 'month'; month_number: number | null; status: 'pending'; image_url: null; version_count: 0; revisions_left: 0; pet_id: null }

/** Cover + 12 months in order, with placeholders for pages the server has not created yet. */
export function calendarSlots(data: CalendarData | null): CalendarSlot[] {
  const find = (type: 'cover' | 'month', month: number | null) =>
    data?.pages.find((p) => p.page_type === type && p.month_number === month) ??
    ({ id: null, page_type: type, month_number: month, status: 'pending', image_url: null, version_count: 0, revisions_left: 0, pet_id: null } as const)
  return [find('cover', null), ...Array.from({ length: 12 }, (_, i) => find('month', i + 1))]
}

export function isCalendarComplete(data: CalendarData | null): boolean {
  return calendarSlots(data).every((s) => s.status === 'complete' && s.image_url)
}

/** Loads a calendar and keeps polling while anything is still being generated. */
export function useCalendar(projectId: string | null, pollMs = 3000) {
  const [data, setData] = useState<CalendarData | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const alive = useRef(true)

  const load = useCallback(async (): Promise<CalendarData | null> => {
    if (!projectId) {
      setState('missing')
      return null
    }
    try {
      const res = await fetch(`/api/pages?project_id=${projectId}`, { cache: 'no-store' })
      if (res.status === 404 || res.status === 400) {
        if (alive.current) setState('missing')
        return null
      }
      if (!res.ok) throw new Error(String(res.status))
      const next = (await res.json()) as CalendarData
      if (alive.current) {
        setData(next)
        setState('ready')
      }
      return next
    } catch {
      if (alive.current) setState((s) => (s === 'loading' ? 'error' : s))
      return null
    }
  }, [projectId])

  useEffect(() => {
    alive.current = true
    const tick = async () => {
      const next = await load()
      if (!alive.current) return
      const active =
        !next ||
        next.project.status === 'generating' ||
        next.pages.some((p) => p.status === 'pending' || p.status === 'generating')
      // Keep a slow heartbeat even when idle so retries elsewhere show up.
      timer.current = setTimeout(tick, active ? pollMs : pollMs * 5)
    }
    tick()
    return () => {
      alive.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [load, pollMs])

  return { data, state, reload: load }
}
