'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import StepProgress from '@/components/StepProgress'
import { MONTH_THEMES, type CalendarPage } from '@/lib/types'

interface PetInfo {
  id: string
  name: string
  type: string
}

interface PageVersion {
  id: string
  calendar_page_id: string
  project_id: string
  image_url: string
  image_path: string
  custom_instructions: string | null
  is_selected: boolean
  version_number: number
  created_at: string
}

export default function PreviewPage() {
  const router = useRouter()
  const [pages, setPages] = useState<CalendarPage[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [petName, setPetName] = useState('Your Pet')
  const [pets, setPets] = useState<PetInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const buildPlaceholderPages = useCallback((): CalendarPage[] => {
    return [
      {
        id: 'placeholder-cover',
        project_id: '',
        pet_id: null,
        page_type: 'cover',
        month_number: null,
        prompt: null,
        cloudinary_url: null,
        cloudinary_public_id: null,
        status: 'pending',
        generation_attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...MONTH_THEMES.map((m) => ({
        id: `placeholder-month-${m.month}`,
        project_id: '',
        pet_id: null,
        page_type: 'month' as const,
        month_number: m.month,
        prompt: null,
        cloudinary_url: null,
        cloudinary_public_id: null,
        status: 'pending' as const,
        generation_attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ]
  }, [])

  const mergePages = useCallback((placeholders: CalendarPage[], serverPages: CalendarPage[]) => {
    return placeholders.map((ph) => {
      const match = serverPages.find(
        (sp) => sp.page_type === ph.page_type && sp.month_number === ph.month_number
      )
      return match || ph
    })
  }, [])

  const fetchPages = useCallback(async (pid: string) => {
    try {
      const res = await fetch(`/api/pages?project_id=${pid}`)
      if (!res.ok) return
      const serverPages = await res.json()
      if (Array.isArray(serverPages)) {
        const placeholders = buildPlaceholderPages()
        setPages(mergePages(placeholders, serverPages))
      }
    } catch {
      // Silently ignore polling errors
    }
  }, [buildPlaceholderPages, mergePages])

  useEffect(() => {
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      const pid = data.projectId
      if (pid) setProjectId(pid)

      const loadedPets: PetInfo[] = data.pets?.map((p: { id: string; name: string; type: string }) => ({
        id: p.id,
        name: p.name,
        type: p.type,
      })) ?? []

      if (loadedPets.length > 0) {
        setPets(loadedPets)
        setPetName(loadedPets[0].name)
      } else if (data.petName) {
        setPetName(data.petName)
      }

      setPages(buildPlaceholderPages())

      if (pid) {
        fetchPages(pid).then(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    } else {
      setPages(buildPlaceholderPages())
      setIsLoading(false)
    }
  }, [fetchPages, buildPlaceholderPages])

  useEffect(() => {
    if (!projectId) return
    const interval = setInterval(() => {
      fetchPages(projectId)
    }, 4000)
    return () => clearInterval(interval)
  }, [projectId, fetchPages])

  async function handleIterate(pageId: string, instructions: string, newReference?: File) {
    if (!projectId) return
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? { ...p, status: 'generating' as const, generation_attempts: p.generation_attempts + 1 }
          : p
      )
    )

    try {
      let res: Response
      if (newReference) {
        const formData = new FormData()
        formData.append('calendar_page_id', pageId)
        formData.append('custom_instructions', instructions)
        formData.append('new_reference', newReference)
        res = await fetch('/api/regenerate', { method: 'POST', body: formData })
      } else {
        res = await fetch('/api/regenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ calendar_page_id: pageId, custom_instructions: instructions }),
        })
      }
      if (res.ok) {
        const data = await res.json()
        setPages((prev) =>
          prev.map((p) =>
            p.id === pageId
              ? { ...p, status: 'complete', cloudinary_url: data.cloudinary_url }
              : p
          )
        )
      } else {
        setPages((prev) =>
          prev.map((p) =>
            p.id === pageId ? { ...p, status: 'failed' as const } : p
          )
        )
      }
    } catch {
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId ? { ...p, status: 'failed' as const } : p
        )
      )
    }
  }

  async function handleRegenerate(pageId: string) {
    if (!projectId) return
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? { ...p, status: 'generating' as const, generation_attempts: p.generation_attempts + 1 }
          : p
      )
    )

    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendar_page_id: pageId }),
      })
      if (res.ok) {
        const data = await res.json()
        setPages((prev) =>
          prev.map((p) =>
            p.id === pageId
              ? { ...p, status: 'complete', cloudinary_url: data.cloudinary_url }
              : p
          )
        )
      } else {
        setPages((prev) =>
          prev.map((p) =>
            p.id === pageId ? { ...p, status: 'failed' as const } : p
          )
        )
      }
    } catch {
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId ? { ...p, status: 'failed' as const } : p
        )
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--alabaster)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce-gentle mb-4">🐾</div>
          <p className="text-[var(--wenge)] font-medium">Loading your calendar...</p>
        </div>
      </div>
    )
  }

  if (!projectId) {
    return (
      <div className="min-h-screen bg-[var(--alabaster)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--wenge)] font-medium mb-4">No project found. Please start from the beginning.</p>
          <button
            onClick={() => router.push('/create')}
            className="btn-purple"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  const cover = pages.find((p) => p.page_type === 'cover')
  const monthPages = pages
    .filter((p) => p.page_type === 'month')
    .sort((a, b) => (a.month_number ?? 0) - (b.month_number ?? 0))

  const headerName = pets.length > 1
    ? pets.map((p) => p.name).join(' & ')
    : petName

  const totalPages = pages.length
  const completedPages = pages.filter((p) => p.status === 'complete').length
  const generatingPages = pages.filter((p) => p.status === 'generating').length
  const failedPages = pages.filter((p) => p.status === 'failed').length
  const pendingPages = pages.filter((p) => p.status === 'pending').length
  const progressPercent = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0
  const isAllDone = completedPages === totalPages && totalPages > 0
  const isGeneratingActive = generatingPages > 0 || pendingPages > 0

  return (
    <div className="min-h-screen bg-[var(--alabaster)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={3} />

        {/* Generation Progress Bar */}
        {isGeneratingActive && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white border-2 border-[var(--purple)]/10 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg animate-bounce-gentle">🐾</span>
                  <span className="font-bold text-[var(--ebony)] text-sm">
                    {generatingPages > 0 ? 'Creating your calendar...' : 'Waiting to start...'}
                  </span>
                </div>
                <span className="text-sm font-bold text-[var(--purple)]">
                  {completedPages} / {totalPages} pages
                </span>
              </div>

              <div className="relative h-4 rounded-full bg-[var(--purple)]/8 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--green)] transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
                {generatingPages > 0 && (
                  <div
                    className="absolute inset-y-0 rounded-full bg-[var(--purple)]/30 animate-pulse transition-all duration-700"
                    style={{
                      left: `${progressPercent}%`,
                      width: `${Math.round((generatingPages / totalPages) * 100)}%`,
                    }}
                  />
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--wenge)] font-medium">
                {completedPages > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
                    {completedPages} done
                  </span>
                )}
                {generatingPages > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--purple)] animate-pulse" />
                    {generatingPages} creating
                  </span>
                )}
                {pendingPages > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                    {pendingPages} queued
                  </span>
                )}
                {failedPages > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    {failedPages} failed
                  </span>
                )}
              </div>

              {pendingPages + generatingPages > 0 && (
                <p className="mt-2 text-xs text-[var(--wenge)]/60 font-medium">
                  ⏱ ~{Math.ceil((pendingPages + generatingPages) * 0.3)} min remaining — grab a treat for your pet!
                </p>
              )}
            </div>
          </div>
        )}

        {pages.length === 0 && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="rounded-2xl bg-white border-2 border-[var(--purple)]/10 p-5 shadow-sm text-center">
              <div className="text-4xl animate-bounce-gentle mb-3">🐾</div>
              <p className="font-bold text-[var(--ebony)] text-sm">
                Getting things ready... Your calendar will appear here shortly.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ebony)] capitalize">
            {isAllDone
              ? `${headerName}'s Calendar is Ready! 🎉`
              : `Creating ${headerName}'s Calendar... ✨`}
          </h1>
          <p className="mt-3 text-[var(--wenge)] max-w-lg mx-auto font-medium">
            Review each month below. Not happy with one? Hit regenerate!
          </p>
        </div>

        <div className="mb-10 mx-auto max-w-2xl rounded-2xl bg-[var(--purple)]/5 border border-[var(--purple)]/10 p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-sm text-[var(--wenge)] leading-relaxed font-medium">
            <strong className="text-[var(--ebony)]">How to customize:</strong> Hover any month and hit 🔄 to regenerate from scratch, or ✏️ to iterate with specific instructions (e.g. &quot;make the background brighter&quot; or &quot;add more snow&quot;). Use the arrows to browse previous versions.
          </p>
        </div>

        {cover && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--ebony)] mb-4 flex items-center gap-2">
              🌟 Cover
            </h2>
            <div className="max-w-sm">
              <PageCard
                page={cover}
                label="Cover"
                onRegenerate={() => handleRegenerate(cover.id)}
                onIterate={(instructions, newRef) => handleIterate(cover.id, instructions, newRef)}
              />
            </div>
          </div>
        )}

        {monthPages.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-[var(--ebony)] mb-4 flex items-center gap-2">
              📅 Monthly Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthPages.map((page) => {
                const theme = MONTH_THEMES.find((m) => m.month === page.month_number)
                return (
                  <PageCard
                    key={page.id}
                    page={page}
                    label={theme?.name ?? `Month ${page.month_number}`}
                    onRegenerate={() => handleRegenerate(page.id)}
                    onIterate={(instructions, newRef) => handleIterate(page.id, instructions, newRef)}
                  />
                )
              })}
            </div>
          </>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => router.push('/create/style')}
            className="text-[var(--wenge)] hover:text-[var(--purple)] font-bold transition-colors"
          >
            ← Back to Style
          </button>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push('/checkout')}
              disabled={!isAllDone}
              className={`btn-green text-lg px-10 py-4 ${!isAllDone ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Order This Calendar — $39.99 📦
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageCard({
  page,
  label,
  onRegenerate,
  onIterate,
}: {
  page: CalendarPage
  label: string
  onRegenerate: () => void
  onIterate: (instructions: string, newReference?: File) => void
}) {
  const [showIterateModal, setShowIterateModal] = useState(false)
  const [iterateText, setIterateText] = useState('')
  const [newRefFile, setNewRefFile] = useState<File | null>(null)
  const [newRefPreview, setNewRefPreview] = useState<string | null>(null)
  const [versions, setVersions] = useState<PageVersion[]>([])
  const [viewIndex, setViewIndex] = useState(0)
  const [loadedVersions, setLoadedVersions] = useState(false)
  const canRegenerate = page.status !== 'generating' && page.status !== 'pending'
  const canIterate = page.status === 'complete'

  useEffect(() => {
    if (page.status !== 'complete' || page.id.startsWith('placeholder')) return
    fetch(`/api/pages/${page.id}/versions`)
      .then((res) => res.json())
      .then((data: PageVersion[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setVersions(data)
          const selectedIdx = data.findIndex((v) => v.is_selected)
          setViewIndex(selectedIdx >= 0 ? selectedIdx : data.length - 1)
        }
        setLoadedVersions(true)
      })
      .catch(() => setLoadedVersions(true))
  }, [page.status, page.id, page.cloudinary_url])

  const hasMultipleVersions = versions.length > 1
  const displayUrl = versions.length > 0 ? versions[viewIndex]?.image_url : page.cloudinary_url

  async function selectVersion(idx: number) {
    const version = versions[idx]
    if (!version) return
    setViewIndex(idx)
    await fetch(`/api/pages/${page.id}/versions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version_id: version.id }),
    })
  }

  return (
    <>
      <div className="group rounded-2xl border-2 border-[var(--purple)]/10 overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-[3/2] bg-gradient-to-br from-[var(--alabaster)] to-[var(--purple)]/5 flex items-center justify-center">
          {page.status === 'complete' && (displayUrl || page.cloudinary_url) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl || page.cloudinary_url!}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : page.status === 'generating' ? (
            <div className="text-center">
              <div className="text-4xl animate-bounce-gentle mb-2">🐾</div>
              <p className="text-sm text-[var(--purple)] font-bold">Creating...</p>
            </div>
          ) : page.status === 'failed' ? (
            <div className="text-center">
              <span className="text-3xl">😿</span>
              <p className="mt-2 text-sm text-red-500 font-bold">Generation failed</p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-5xl opacity-40">🐾</span>
              <p className="mt-2 text-sm text-[var(--wenge)]/40 font-medium">Pending</p>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[var(--ebony)] shadow-sm">
              {label}
            </span>
          </div>

          {hasMultipleVersions && loadedVersions && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); selectVersion(viewIndex - 1) }}
                disabled={viewIndex === 0}
                className={`absolute left-2 bottom-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-sm font-bold transition-all ${
                  viewIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-[var(--ebony)]'
                }`}
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); selectVersion(viewIndex + 1) }}
                disabled={viewIndex === versions.length - 1}
                className={`absolute right-2 bottom-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-sm font-bold transition-all ${
                  viewIndex === versions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-[var(--ebony)]'
                }`}
              >
                ›
              </button>
            </>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            {canRegenerate && (
              <button
                onClick={onRegenerate}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--purple)] shadow-lg hover:bg-[var(--purple)]/5 transition-colors"
              >
                🔄 Redo
              </button>
            )}
            {canIterate && (
              <button
                onClick={() => setShowIterateModal(true)}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--green)] shadow-lg hover:bg-[var(--green)]/5 transition-colors"
              >
                ✏️ Iterate
              </button>
            )}
          </div>
        </div>

        <div className="p-3 flex items-center justify-between bg-white">
          <span className="text-sm font-bold text-[var(--ebony)]">{label}</span>
          {hasMultipleVersions && loadedVersions ? (
            <span className="text-xs text-[var(--wenge)] font-medium">
              v{viewIndex + 1} of {versions.length}
            </span>
          ) : page.generation_attempts > 1 ? (
            <span className="text-xs text-[var(--wenge)] font-medium">
              v{page.generation_attempts}
            </span>
          ) : null}
        </div>
      </div>

      {showIterateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowIterateModal(false); setIterateText(''); setNewRefFile(null); setNewRefPreview(null) }}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[var(--ebony)] mb-1">
              ✏️ Iterate on {label}
            </h3>
            <p className="text-sm text-[var(--wenge)] mb-4">
              Tell us what you&apos;d like to change. We&apos;ll use the current image as a starting point.
            </p>
            <textarea
              value={iterateText}
              onChange={(e) => setIterateText(e.target.value)}
              placeholder="e.g., Make the background brighter, add more snow, make my pet look happier, change the setting to outdoors..."
              className="input-zaipet resize-none"
              rows={3}
              autoFocus
            />

            <div className="mt-4 rounded-2xl bg-[var(--purple)]/5 border border-[var(--purple)]/10 p-4">
              <p className="text-sm font-bold text-[var(--purple)] mb-1">
                🐾 Doesn&apos;t look like your pet?
              </p>
              <p className="text-xs text-[var(--wenge)] mb-3">
                Upload a clear photo and we&apos;ll regenerate with a better reference.
              </p>
              {newRefPreview ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newRefPreview} alt="New reference" className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--purple)]/20" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[var(--ebony)]">New reference uploaded ✓</p>
                    <button
                      onClick={() => { setNewRefFile(null); setNewRefPreview(null) }}
                      className="text-xs text-red-400 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--purple)]/20 px-4 py-3 cursor-pointer hover:border-[var(--purple)]/40 hover:bg-[var(--purple)]/5 transition-all">
                  <span className="text-sm font-bold text-[var(--purple)]">📸 Upload a clearer photo</span>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setNewRefFile(file)
                        setNewRefPreview(URL.createObjectURL(file))
                      }
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setShowIterateModal(false); setIterateText(''); setNewRefFile(null); setNewRefPreview(null) }}
                className="flex-1 rounded-full border-2 border-gray-200 px-4 py-3 text-sm font-bold text-[var(--wenge)] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (iterateText.trim() || newRefFile) {
                    onIterate(iterateText.trim() || 'Make the pet look more like the new reference photo', newRefFile || undefined)
                    setShowIterateModal(false)
                    setIterateText('')
                    setNewRefFile(null)
                    setNewRefPreview(null)
                  }
                }}
                disabled={!iterateText.trim() && !newRefFile}
                className={`flex-1 btn-purple text-sm px-4 py-3 ${
                  (!iterateText.trim() && !newRefFile) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                🎨 Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
