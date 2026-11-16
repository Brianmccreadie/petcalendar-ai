'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Plus } from '@/components/icons'
import { saveProject } from '@/lib/client/project-store'
import { LIMITS } from '@/lib/config'
import type { MultiPetMode, PetType } from '@/lib/types'
import PhotoUploader, { type LocalPhoto } from './PhotoUploader'
import StepHeader from './StepHeader'

interface PetDraft {
  id: string
  name: string
  type: PetType
  photos: LocalPhoto[]
}

const petTypes: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'other', label: 'Other' },
]

const tips = [
  ['A clear face', 'Looking at the camera, eyes visible.'],
  ['A full-body shot', 'So we get their size and markings right.'],
  ['Good light', 'Daylight beats flash. Avoid heavy filters.'],
]

const newPet = (): PetDraft => ({ id: crypto.randomUUID(), name: '', type: 'dog', photos: [] })

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export default function UploadStep() {
  const router = useRouter()
  const theme = useSearchParams().get('theme')
  const [pets, setPets] = useState<PetDraft[]>(() => [newPet()])
  const [mode, setMode] = useState<MultiPetMode>('alternate')
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = progress !== null
  const ready = pets.every((p) => p.name.trim() && p.photos.length >= LIMITS.minPhotosPerPet)
  const missing = pets.find((p) => !p.name.trim()) ? 'Give every pet a name' : pets.find((p) => p.photos.length === 0) ? 'Add at least one photo per pet' : null

  const update = (id: string, patch: Partial<PetDraft>) =>
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  async function handleContinue() {
    if (!ready || busy) return
    setError(null)
    const uploads = pets.flatMap((pet, petIndex) => pet.photos.map((photo) => ({ petIndex, photo })))
    setProgress({ done: 0, total: uploads.length })

    try {
      const { projectId, petIds } = await postJson('/api/create-project', {
        pets: pets.map((p) => ({ name: p.name.trim(), type: p.type })),
        multiPetMode: mode,
      })

      // Three uploads at a time; every photo must land before we move on.
      let cursor = 0
      let failure: string | null = null
      const worker = async () => {
        while (cursor < uploads.length && !failure) {
          const { petIndex, photo } = uploads[cursor++]
          const form = new FormData()
          form.append('project_id', projectId)
          form.append('pet_id', petIds[petIndex])
          form.append('photo', photo.file)
          const res = await fetch('/api/upload-photo', { method: 'POST', body: form })
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            failure = data.error || 'A photo failed to upload. Please try again.'
            return
          }
          setProgress((p) => (p ? { ...p, done: p.done + 1 } : p))
        }
      }
      await Promise.all(Array.from({ length: Math.min(3, uploads.length) }, worker))
      if (failure) throw new Error(failure)

      saveProject({
        id: projectId,
        petNames: pets.map((p) => p.name.trim()),
        petType: pets[0].type,
        createdAt: new Date().toISOString(),
      })
      router.push(`/create/style?p=${projectId}${theme ? `&theme=${encodeURIComponent(theme)}` : ''}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setProgress(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-40 pt-8 sm:px-8 sm:pt-12">
      <StepHeader current={1} />

      <header className="text-center">
        <h1 className="display text-4xl sm:text-5xl">First, who’s the star?</h1>
        <p className="lede mx-auto mt-4 max-w-xl">
          Add three to five photos per pet. The clearer the photos, the more the calendar looks like them.
        </p>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {tips.map(([title, body]) => (
          <li key={title} className="rounded-2xl bg-paper-deep px-4 py-3">
            <p className="text-sm font-bold">{title}</p>
            <p className="text-sm text-ink-soft">{body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-6">
        {pets.map((pet, index) => (
          <section key={pet.id} className="card p-5 sm:p-7" aria-label={pet.name || `Pet ${index + 1}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{pets.length > 1 ? `Pet ${index + 1}` : 'Your pet'}</h2>
              {pets.length > 1 && (
                <button
                  type="button"
                  className="text-sm font-bold text-ink-soft underline underline-offset-4 hover:text-persimmon-deep"
                  onClick={() => setPets((prev) => prev.filter((p) => p.id !== pet.id))}
                  disabled={busy}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="label" htmlFor={`name-${pet.id}`}>
                  Name
                </label>
                <input
                  id={`name-${pet.id}`}
                  className="field"
                  value={pet.name}
                  maxLength={LIMITS.maxPetNameLength}
                  onChange={(e) => update(pet.id, { name: e.target.value })}
                  placeholder="e.g. Luna"
                  autoComplete="off"
                  disabled={busy}
                />
                <p className="mt-1.5 text-xs text-muted">Printed on the cover, so check the spelling.</p>
              </div>
              <fieldset>
                <legend className="label">Kind of pet</legend>
                <div className="flex gap-2">
                  {petTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      className="chip !py-[0.72rem]"
                      aria-pressed={pet.type === type.value}
                      onClick={() => update(pet.id, { type: type.value })}
                      disabled={busy}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-6">
              <p className="label">
                Photos <span className="font-normal text-muted">({pet.photos.length}/{LIMITS.maxPhotosPerPet})</span>
              </p>
              <PhotoUploader
                photos={pet.photos}
                onChange={(photos) => update(pet.id, { photos })}
                maxPhotos={LIMITS.maxPhotosPerPet}
                petName={pet.name.trim()}
                disabled={busy}
              />
            </div>
          </section>
        ))}
      </div>

      {pets.length < LIMITS.maxPets && (
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-ink/30 py-4 font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          onClick={() => setPets((prev) => [...prev, newPet()])}
          disabled={busy}
        >
          <Plus size={18} /> Add another pet
        </button>
      )}

      {pets.length > 1 && (
        <fieldset className="card mt-6 p-5 sm:p-7">
          <legend className="sr-only">How should your pets appear?</legend>
          <p className="font-display text-xl font-bold">How should they share the calendar?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ['alternate', 'Take turns', 'Each pet gets their own months. Everyone is on the cover.'],
                ['together', 'Together', 'All of them in every scene, every month.'],
              ] as const
            ).map(([value, title, body]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
                disabled={busy}
                className={`rounded-2xl border-[1.5px] p-4 text-left transition-colors ${
                  mode === value ? 'border-ink bg-ink text-paper' : 'border-rule bg-card hover:border-ink'
                }`}
              >
                <span className="block font-bold">{title}</span>
                <span className={`mt-1 block text-sm ${mode === value ? 'text-paper/75' : 'text-ink-soft'}`}>{body}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-2xl border border-persimmon/40 bg-persimmon/10 px-4 py-3 font-semibold text-persimmon-deep">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <p className="text-sm font-semibold text-ink-soft" aria-live="polite">
            {busy
              ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…`
              : (missing ?? 'Looking good. Next: pick a theme.')}
          </p>
          <button type="button" className="btn btn-primary" onClick={handleContinue} disabled={!ready || busy}>
            {busy ? 'Uploading…' : 'Choose a theme'} {!busy && <ArrowRight />}
          </button>
        </div>
      </div>
    </div>
  )
}
