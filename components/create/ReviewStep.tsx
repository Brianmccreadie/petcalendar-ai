'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import BackCover from '@/components/calendar/BackCover'
import ProductDetails from '@/components/calendar/ProductDetails'
import CoverTitle from '@/components/calendar/CoverTitle'
import WallCalendar from '@/components/calendar/WallCalendar'
import { ArrowLeft, ArrowRight, Check, Play, Refresh } from '@/components/icons'
import { MONTH_NAMES, joinPetNames, possessive } from '@/lib/calendar/layout'
import { preparePhoto } from '@/lib/client/prepare-photo'
import { rememberProject } from '@/lib/client/project-store'
import { calendarSlots, useCalendar, type CalendarSlot } from '@/lib/client/use-calendar'
import { LIMITS, PRICING, formatPrice } from '@/lib/config'
import { styleById } from '@/lib/style-meta'
import MissingProject from './MissingProject'
import StepHeader from './StepHeader'

interface Version {
  id: string
  image_url: string
  version_number: number
  is_selected: boolean
  custom_instructions: string | null
}

/**
 * The corrections people ask for most. The label is what the customer taps;
 * the instruction is what the artist is told, written to actually fix it.
 */
const QUICK_FIXES: { id: string; label: string; instruction: string }[] = [
  { id: 'hands', label: 'Paws used as hands', instruction: 'The pet is using its front paws like human hands or arms. Redraw it so nothing is held, gripped or worn on the front paws; any object goes in its mouth or beside it, and it moves on four legs.' },
  { id: 'limbs', label: 'Too many legs', instruction: 'The pet has extra or missing limbs. Redraw its body with exactly four legs and one tail, and no arms.' },
  { id: 'likeness', label: 'Doesn’t look like my pet', instruction: 'The pet does not look like the reference photos. Redraw its face, coat colour, markings, ears and build to match the reference photos exactly; do not copy the likeness from the current version.' },
  { id: 'upright', label: 'Standing like a person', instruction: 'The pet is posed upright like a person. Redraw it in a natural animal posture on four legs, sitting or lying down.' },
  { id: 'face', label: 'Face is hidden', instruction: 'The pet’s face is covered or turned away. Show its whole face clearly, with nothing over the eyes.' },
  { id: 'text', label: 'Words or a logo in it', instruction: 'Remove all lettering, numbers, signs and logos from the picture.' },
]

const slotLabel = (slot: CalendarSlot) => (slot.page_type === 'cover' ? 'Cover' : MONTH_NAMES[(slot.month_number ?? 1) - 1])

function StatusArt({ slot, working }: { slot: CalendarSlot; working: boolean }) {
  const generating = working || slot.status === 'generating'
  if (slot.status === 'failed' && !working) {
    return (
      <div className="grid h-full w-full place-items-center bg-paper-deep p-6 text-center">
        <div>
          <p className="font-display text-2xl">This page didn’t finish.</p>
          <p className="mt-1 text-sm text-ink-soft">Use “Just redo this page” to try it again.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="skeleton grid h-full w-full place-items-center">
      <p className="rounded-full bg-paper/85 px-4 py-2 text-sm font-bold" aria-live="polite">
        {generating ? `Painting ${slotLabel(slot)}…` : 'In the queue'}
      </p>
    </div>
  )
}

export default function ReviewStep() {
  const projectId = useSearchParams().get('p')
  const { data, state, reload } = useCalendar(projectId)
  const [index, setIndex] = useState(0)
  const [working, setWorking] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState<string | null>(null)
  const [scope, setScope] = useState<'page' | 'all'>('page')
  const [showBack, setShowBack] = useState(false)
  // Changes are optional, so the form stays folded away until someone asks for it.
  const [editing, setEditing] = useState(false)
  const [batch, setBatch] = useState<{ done: number; total: number } | null>(null)
  const [instructions, setInstructions] = useState('')
  const [fixes, setFixes] = useState<string[]>([])
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [versionState, setVersionState] = useState<{ pageId: string; list: Version[] } | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [copied, setCopied] = useState(false)

  const slots = useMemo(() => calendarSlots(data), [data])

  // Opening a calendar puts it in "My calendars" for this browser, however it was reached.
  useEffect(() => {
    if (!data) return
    rememberProject({
      id: data.project.id,
      petNames: data.pets.map((p) => p.name),
      petType: data.project.pet_type,
      createdAt: data.project.created_at,
    })
  }, [data])
  const slot = slots[index]
  const petNames = data?.pets.map((p) => p.name) ?? []
  const names = joinPetNames(petNames.length ? petNames : [data?.project.pet_name ?? ''])
  const style = styleById(data?.project.style)
  const year = data?.project.start_year ?? new Date().getFullYear()

  const done = slots.filter((s) => s.status === 'complete' && s.image_url).length
  const failed = slots.filter((s) => s.status === 'failed').length
  const running = data?.project.status === 'generating' || slots.some((s) => s.status === 'pending' || s.status === 'generating')
  const allDone = done === slots.length
  const ordered = data?.project.status === 'ordered'
  const isWorking = Boolean(slot.id && working.has(slot.id))

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + 13) % 13)
    setShowBack(false)
    setNotice(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Version history for the selected page.
  useEffect(() => {
    const pageId = slot.id
    if (!pageId || slot.version_count < 2) return
    let cancelled = false
    fetch(`/api/pages/${pageId}/versions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Version[]) => !cancelled && Array.isArray(list) && setVersionState({ pageId, list }))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slot.id, slot.version_count, slot.image_url])
  const versions = versionState && versionState.pageId === slot.id && slot.version_count >= 2 ? versionState.list : []

  const setBusy = (id: string, busy: boolean) =>
    setWorking((w) => {
      const next = new Set(w)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })

  /** One page: redo it, or revise it with a note and/or a clearer photo. Returns an error message, or null. */
  async function revisePage(id: string, note: string, photo: File | null): Promise<string | null> {
    setBusy(id, true)
    try {
      let res: Response
      if (photo) {
        const form = new FormData()
        form.append('calendar_page_id', id)
        form.append('custom_instructions', note)
        form.append('new_reference', photo)
        res = await fetch('/api/regenerate', { method: 'POST', body: form })
      } else {
        res = await fetch('/api/regenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ calendar_page_id: id, custom_instructions: note }),
        })
      }
      if (res.ok) return null
      const body = await res.json().catch(() => ({}))
      return body.error || 'That didn’t work. Please try again.'
    } catch {
      return 'Connection lost. Please try again.'
    } finally {
      await reload()
      setBusy(id, false)
    }
  }

  /** "Try again" on the selected page: a fresh take with no note. */
  async function redoPage() {
    if (!slot.id) return
    setNotice(null)
    const error = await revisePage(slot.id, '', null)
    if (error) setNotice(error)
  }

  /** Apply the note to the selected page, or to every page that still has a revision left. */
  async function applyChange() {
    // Ticked fixes first, then anything typed.
    const note = [...QUICK_FIXES.filter((f) => fixes.includes(f.id)).map((f) => f.instruction), instructions.trim()].filter(Boolean).join(' ')
    const photo = newPhoto
    if (!note && !photo) return
    setNotice(null)

    if (scope === 'page') {
      if (!slot.id) return
      const error = await revisePage(slot.id, note, photo)
      if (error) return setNotice(error)
      setInstructions('')
      setFixes([])
      setNewPhoto(null)
      return
    }

    const ids = slots.filter((s) => s.id && s.status === 'complete' && s.revisions_left > 0).map((s) => s.id as string)
    if (ids.length === 0) return
    setBatch({ done: 0, total: ids.length })
    let failures = 0
    const settle = (error: string | null) => {
      if (error) failures++
      setBatch((b) => (b ? { ...b, done: b.done + 1 } : b))
    }
    // A new photo is stored with the first page; every later page then draws on it too.
    const queue = [...ids]
    if (photo) settle(await revisePage(queue.shift() as string, note, photo))
    const worker = async () => {
      while (queue.length) settle(await revisePage(queue.shift() as string, note, null))
    }
    await Promise.all(Array.from({ length: 3 }, worker))
    setBatch(null)
    if (failures) {
      setNotice(`${failures} page${failures > 1 ? 's' : ''} could not be updated. Select ${failures > 1 ? 'them' : 'it'} and try again.`)
    } else {
      setInstructions('')
      setFixes([])
      setNewPhoto(null)
    }
  }

  async function chooseVersion(version: Version) {
    if (!slot.id || version.is_selected) return
    setVersionState((vs) => (vs ? { ...vs, list: vs.list.map((v) => ({ ...v, is_selected: v.id === version.id })) } : vs))
    await fetch(`/api/pages/${slot.id}/versions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version_id: version.id }),
    })
    await reload()
  }

  /** Phones get the native share sheet; everything else copies the link. */
  async function shareLink() {
    const url = `${window.location.origin}/share/${data?.share_token ?? projectId}`
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title: `${possessive(names)} ${year} calendar`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Sharing was cancelled or the clipboard is blocked: open the page so the address bar has the link.
      window.open(url, '_blank')
    }
  }

  async function retryFailed() {
    setRetrying(true)
    await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, retryFailed: true }),
    }).catch(() => {})
    await reload()
    setRetrying(false)
  }

  if (state === 'missing') return <MissingProject />
  if (state === 'loading' || !data) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <StepHeader current={3} />
        <div className="skeleton mx-auto aspect-[11/8.5] max-w-xl rounded-[4px]" />
        {state === 'error' && <p className="mt-6 text-center font-semibold text-signal">We’re having trouble loading your calendar. Retrying…</p>}
      </div>
    )
  }

  const canRevise = !ordered && slot.id && slot.status === 'complete' && !isWorking
  const canRetry = !ordered && slot.id && slot.status === 'failed' && !isWorking
  const outOfRevisions = slot.status === 'complete' && slot.revisions_left <= 0
  const revisable = slots.filter((s) => s.id && s.status === 'complete' && s.revisions_left > 0).length
  const anyBusy = working.size > 0 || batch !== null
  const hasInput = Boolean(instructions.trim() || newPhoto || fixes.length)
  const pageName = slot.page_type === 'cover' ? 'the cover' : slotLabel(slot)
  // A page that failed, or one being worked on, always shows its controls.
  const formOpen = editing || slot.status === 'failed' || anyBusy || Boolean(notice)
  const canApply = hasInput && !anyBusy && (scope === 'all' ? revisable > 0 : Boolean(canRevise) && !outOfRevisions)

  return (
    <div className="mx-auto max-w-6xl px-5 pb-40 pt-8 sm:px-8 sm:pt-12">
      <StepHeader current={3} />

      <header className="text-center">
        <h1 className="display text-5xl sm:text-6xl">
          {allDone ? `${possessive(names)} calendar is ready.` : running ? `Making ${possessive(names)} calendar…` : `${possessive(names)} calendar`}
        </h1>
        <p className="lede mx-auto mt-4 max-w-xl">
          {allDone
            ? 'Flip through every page. Love it? Order it. Want something different? Any page can be changed for free.'
            : running
              ? 'Pages appear as they finish — usually a few minutes for all thirteen. You can leave this tab open or come back later.'
              : 'Some pages still need attention before you can order.'}
        </p>
      </header>

      {!allDone && (
        <div className="mx-auto mt-8 max-w-xl" role="status">
          <div className="flex justify-between text-sm font-bold">
            <span>{done} of 13 pages ready</span>
            {failed > 0 && <span className="text-signal">{failed} didn’t finish</span>}
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-rule">
            <div className="h-full rounded-full bg-ink transition-[width] duration-700" style={{ width: `${(done / 13) * 100}%` }} />
          </div>
          {failed > 0 && !running && !ordered && (
            <button type="button" className="btn btn-dark btn-sm mt-4" onClick={retryFailed} disabled={retrying}>
              <Refresh size={16} /> {retrying ? 'Restarting…' : `Retry ${failed} unfinished page${failed > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {/* Viewer */}
        <section aria-label={`${slotLabel(slot)} preview`} className="lg:sticky lg:top-24">
          <div className="mx-auto max-w-[34rem]">
            {showBack ? (
              <BackCover
                petNames={petNames}
                months={slots.slice(1).map((m) => (m.status === 'complete' ? m.image_url : null))}
              />
            ) : slot.page_type === 'cover' ? (
              <div className="relative aspect-[11/8.5] overflow-hidden rounded-[3px] shadow-lift">
                {slot.status === 'complete' && slot.image_url && !isWorking ? (
                  <>
                    <img src={slot.image_url} alt={`Cover artwork for ${names}`} className="h-full w-full object-cover" />
                    <CoverTitle petNames={petNames} year={year} styleName={style?.name ?? ''} petType={data.project.pet_type} />
                  </>
                ) : (
                  <StatusArt slot={slot} working={isWorking} />
                )}
              </div>
            ) : (
              <WallCalendar
                className="mt-5"
                month={slot.month_number ?? 1}
                year={year}
                accent={style?.accentColor}
                caption={`${names} · ${style?.name ?? ''}`}
                imageUrl={slot.image_url}
                imageAlt={`${slotLabel(slot)} artwork for ${names}`}
                art={slot.status === 'complete' && slot.image_url && !isWorking ? undefined : <StatusArt slot={slot} working={isWorking} />}
              />
            )}

            <div className="mt-6 flex items-center justify-between">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(-1)} aria-label="Previous page">
                <ArrowLeft size={18} />
              </button>
              <p className="font-display text-2xl" aria-live="polite">
                {showBack ? 'Back cover' : slotLabel(slot)} {!showBack && slot.page_type === 'month' && <span className="text-muted">{year}</span>}
              </p>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => go(1)} aria-label="Next page">
                <ArrowRight size={18} />
              </button>
            </div>

            {!showBack && slot.page_type === 'month' && (
              <p className="mt-4 text-center text-sm text-ink-soft">
                This is the printed page as it hangs: your artwork on top, {slotLabel(slot)}’s dates underneath. 11 × 17 in open.
              </p>
            )}
            {!showBack && slot.page_type === 'cover' && (
              <p className="mt-4 text-center text-sm text-ink-soft">The front cover, 11 × 8.5 in. Pick a month to see its dated page.</p>
            )}

            <ProductDetails className="mt-8" />

            {(data.photos?.length ?? 0) > 0 && (
              <div className="mt-8 border-t border-rule pt-5">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  Made from your photo{data.photos!.length === 1 ? '' : 's'}
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.photos!.map((photo) => {
                    const pet = data.pets.find((p) => p.id === photo.pet_id)
                    return (
                      <li key={photo.id} className="w-16">
                        <img
                          src={photo.url}
                          alt={`Reference photo${pet ? ` of ${pet.name}` : ''}`}
                          className="aspect-square w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                        {data.pets.length > 1 && pet && <p className="mt-1 truncate text-center text-[0.65rem] font-semibold text-ink-soft">{pet.name}</p>}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-2 text-xs text-ink-soft">Every page is drawn from these. Not a good likeness? Add a clearer photo with your change.</p>
              </div>
            )}
          </div>
        </section>

        {/* Pages + actions */}
        <aside className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Your pages</h2>
            <ol className="mt-3 grid grid-cols-6 gap-2 lg:grid-cols-4">
              {slots.map((s, i) => {
                const busy = Boolean(s.id && working.has(s.id)) || s.status === 'generating'
                return (
                  <li key={i} className={i === 0 ? 'col-span-full' : ''}>
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(i)
                        setShowBack(false)
                        setNotice(null)
                      }}
                      aria-label={`${slotLabel(s)} — ${busy ? 'in progress' : s.status}`}
                      aria-current={i === index && !showBack}
                      className={`relative block overflow-hidden rounded-[4px] bg-paper-deep transition-shadow ${
                        i === 0 ? 'aspect-[11/8.5] w-1/3 lg:w-1/2' : 'aspect-[11/8.5] w-full'
                      } ${
                        i === index && !showBack ? 'shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink)]' : 'hover:opacity-85'
                      }`}
                    >
                      {s.image_url && s.status === 'complete' && !busy ? (
                        <img src={s.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : s.status === 'failed' && !busy ? (
                        <span className="grid h-full w-full place-items-center bg-signal/15 text-lg font-bold text-signal">!</span>
                      ) : (
                        <span className={`block h-full w-full ${busy ? 'skeleton' : ''}`} />
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-0.5 text-center text-[0.6rem] font-bold uppercase tracking-wide text-paper">
                        {s.page_type === 'cover' ? 'Cover' : slotLabel(s).slice(0, 3)}
                      </span>
                    </button>
                  </li>
                )
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setShowBack(true)
                    setNotice(null)
                  }}
                  aria-label="Back cover"
                  aria-current={showBack}
                  className={`relative block aspect-[11/8.5] w-full overflow-hidden rounded-[4px] bg-[#fdfbf6] transition-shadow ${
                    showBack ? 'shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink)]' : 'hover:opacity-85'
                  }`}
                >
                  <span className="absolute inset-x-1.5 top-1.5 grid grid-cols-4 gap-0.5" aria-hidden="true">
                    {Array.from({ length: 12 }, (_, k) => (
                      <span key={k} className="aspect-[11/8.5] bg-ink/15" />
                    ))}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-0.5 text-center text-[0.6rem] font-bold uppercase tracking-wide text-paper">
                    Back
                  </span>
                </button>
              </li>
            </ol>
          </div>

          {!ordered && showBack && (
            <div className="card p-5">
              <h2 className="font-display text-2xl">Back cover</h2>
              <p className="mt-2 text-sm text-ink-soft">
                The back is an index of all twelve months. It’s built from your pages, so it updates by itself whenever you change one.
              </p>
            </div>
          )}

          {!ordered && !showBack && (
            <div className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl leading-tight">{formOpen ? `Change ${pageName}` : 'Want to change anything?'}</h2>
                <span className="mt-1 shrink-0 rounded-full bg-paper-deep px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">Optional</span>
              </div>
              {!formOpen && (
                <>
                  <p className="mt-2 text-sm text-ink-soft">
                    You don’t have to. If a page isn’t quite right, you can redo it or describe what to fix, free and as often as you like.
                  </p>
                  <button type="button" className="btn btn-ghost btn-sm mt-4 w-full" onClick={() => setEditing(true)} disabled={!slot.id}>
                    Change {pageName}
                  </button>
                  <p className="mt-2 text-center text-xs text-ink-soft">Tap another page above to change that one instead.</p>
                </>
              )}

              {outOfRevisions && <p className="mt-1 text-sm text-ink-soft">This page has been changed a great many times. Pick your favourite version below.</p>}

              {versions.length > 1 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Versions — tap to choose</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {versions.slice(-8).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => chooseVersion(v)}
                        aria-pressed={v.is_selected}
                        aria-label={`Version ${v.version_number}${v.is_selected ? ' (selected)' : ''}`}
                        className={`relative aspect-[11/8.5] w-16 overflow-hidden rounded-[3px] ${
                          v.is_selected ? 'shadow-[0_0_0_2px_var(--color-card),0_0_0_4px_var(--color-ink)]' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={v.image_url} alt="" className="h-full w-full object-cover" />
                        {v.is_selected && (
                          <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-ink text-ivory">
                            <Check size={10} strokeWidth={4} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formOpen && (
                <>
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canApply) applyChange()
                }}
              >
                <fieldset>
                  <legend className="label">What’s wrong? Tap any that apply.</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_FIXES.map((fix) => {
                      const on = fixes.includes(fix.id)
                      return (
                        <button
                          key={fix.id}
                          type="button"
                          className="chip"
                          aria-pressed={on}
                          disabled={anyBusy}
                          onClick={() => setFixes((list) => (on ? list.filter((id) => id !== fix.id) : [...list, fix.id]))}
                        >
                          {fix.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
                <label className="label" htmlFor="changes">
                  Or describe it yourself
                </label>
                <textarea
                  id="changes"
                  className="field resize-none"
                  rows={2}
                  maxLength={LIMITS.maxNoteLength}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Brighter background, remove the hat, make the ears floppier"
                  disabled={anyBusy}
                />

                <fieldset>
                  <legend className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Apply to</legend>
                  <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-paper-deep p-1" role="radiogroup">
                    {(
                      [
                        ['page', `Just ${slot.page_type === 'cover' ? 'the cover' : slotLabel(slot)}`],
                        ['all', 'All pages'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={scope === value}
                        onClick={() => setScope(value)}
                        disabled={anyBusy}
                        className={`rounded-lg px-2 py-2 text-sm font-semibold transition-colors ${
                          scope === value ? 'bg-card text-ink shadow-sm' : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {scope === 'all' && (
                    <p className="mt-2 text-xs text-ink-soft">
                      {revisable > 0
                        ? `Updates ${revisable === 13 ? 'all 13 pages' : `${revisable} page${revisable === 1 ? '' : 's'}`}. Takes a few minutes; earlier versions are kept.`
                        : 'No finished pages to update yet.'}
                    </p>
                  )}
                </fieldset>

                <label className="block cursor-pointer rounded-xl border-[1.5px] border-dashed border-ink/30 px-3 py-2.5 text-sm font-semibold text-ink-soft hover:border-ink">
                  {newPhoto ? `Using new photo: ${newPhoto.name}` : 'Doesn’t look like them? Add a clearer photo (optional)'}
                  <input
                    type="file"
                    accept="image/*,.heic,.heif,.avif"
                    className="sr-only"
                    disabled={anyBusy}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return setNewPhoto(null)
                      try {
                        setNewPhoto(await preparePhoto(file))
                      } catch {
                        setNewPhoto(null)
                        setNotice('That photo could not be opened. Try saving it as a JPG.')
                      }
                    }}
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-sm w-full" disabled={!canApply}>
                  {batch
                    ? `Updating ${Math.min(batch.done + 1, batch.total)} of ${batch.total}…`
                    : scope === 'all'
                      ? 'Apply to all pages'
                      : `Apply to ${slot.page_type === 'cover' ? 'the cover' : slotLabel(slot)}`}
                </button>
              </form>

              <div className="mt-4 border-t border-rule pt-4">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm w-full"
                  onClick={redoPage}
                  disabled={anyBusy || !(canRetry || (canRevise && !outOfRevisions))}
                >
                  <Refresh size={16} /> Just redo this page
                </button>
                <p className="mt-2 text-center text-xs text-ink-soft">A fresh take on the same scene, no note needed.</p>
              </div>

                  <button type="button" className="mt-3 w-full text-center text-sm font-semibold text-ink-soft underline-offset-4 hover:underline" onClick={() => setEditing(false)} disabled={anyBusy}>
                    No changes, it’s perfect
                  </button>
                </>
              )}

              {isWorking && !batch && <p className="mt-3 text-sm font-semibold text-ink-soft">Working on it — about a minute.</p>}
              {notice && (
                <p role="alert" className="mt-3 text-sm font-semibold text-signal">
                  {notice}
                </p>
              )}
            </div>
          )}

          {allDone && (
            <div className="card p-4">
              <p className="font-bold">Share this calendar</p>
              <p className="mt-0.5 text-sm text-ink-soft">A link anyone can open to flip through the whole year.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="btn btn-dark btn-sm flex-1" onClick={shareLink}>
                  {copied ? 'Link copied' : 'Copy share link'}
                </button>
                <Link href={`/share/${data.share_token ?? projectId}`} target="_blank" className="btn btn-ghost btn-sm">
                  Open
                </Link>
              </div>
            </div>
          )}

          {allDone && (
            <Link href={`/reveal/${data.share_token ?? projectId}`} className="card flex items-center gap-4 p-4 transition-colors hover:border-ink">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold">
                <Play size={18} />
              </span>
              <span>
                <span className="block font-bold">Watch the film</span>
                <span className="block text-sm text-ink-soft">A short film: your photos, then the whole year.</span>
              </span>
            </Link>
          )}
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          {ordered ? (
            <>
              <p className="text-sm font-semibold text-ink-soft">This calendar has been ordered.</p>
              <Link href="/dashboard" className="btn btn-dark">
                My calendars
              </Link>
            </>
          ) : (
            <>
              <Link href={`/create/style?p=${projectId}`} className="btn btn-quiet btn-sm">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Change theme</span>
              </Link>
              <div className="flex items-center gap-4">
                <p className="hidden text-sm font-semibold text-ink-soft sm:block">
                  {allDone ? 'Free shipping · printed in 3–5 days' : 'Ordering unlocks when all 13 pages are ready'}
                </p>
                {allDone ? (
                  <Link href={`/checkout?p=${projectId}`} className="btn btn-primary">
                    Order — {formatPrice(PRICING.firstCopyCents)} <ArrowRight />
                  </Link>
                ) : (
                  <button type="button" className="btn btn-primary" disabled>
                    Order — {formatPrice(PRICING.firstCopyCents)}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
