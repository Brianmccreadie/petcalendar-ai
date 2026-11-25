'use client'

import { useMemo, useSyncExternalStore } from 'react'
import type { PetType } from '@/lib/types'

// Calendars are created without an account, so the browser remembers which
// ones belong to this visitor. Project ids are unguessable UUIDs.

export interface SavedProject {
  id: string
  petNames: string[]
  petType: PetType
  createdAt: string
}

const KEY = 'petcalendar:projects'
const CHANGE_EVENT = 'petcalendar:projects-changed'

function parse(raw: string | null): SavedProject[] {
  try {
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed.filter((p) => p && typeof p.id === 'string') : []
  } catch {
    return []
  }
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) || '[]'
  } catch {
    return '[]'
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

/** Saved calendars, kept in sync with localStorage. `null` until hydrated. */
export function useSavedProjects(): SavedProject[] | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null)
  return useMemo(() => (raw === null ? null : parse(raw)), [raw])
}

export function getSavedProjects(): SavedProject[] {
  return typeof window === 'undefined' ? [] : parse(readRaw())
}

function write(projects: SavedProject[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(projects.slice(0, 20)))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    // Storage unavailable (private mode) — the URL still carries the project id.
  }
}

export function saveProject(project: SavedProject): void {
  write([project, ...getSavedProjects().filter((p) => p.id !== project.id)])
}

/**
 * Remember a calendar this browser has opened, if it is not already listed.
 * Covers calendars reached by link, or made before this browser kept a list.
 */
export function rememberProject(project: SavedProject): void {
  if (!getSavedProjects().some((p) => p.id === project.id)) write([project, ...getSavedProjects()])
}

export function removeProject(id: string): void {
  write(getSavedProjects().filter((p) => p.id !== id))
}
