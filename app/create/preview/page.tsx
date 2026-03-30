'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StepProgress from '@/components/StepProgress'
import { MONTH_THEMES, type CalendarPage } from '@/lib/types'

const MAX_REGENERATIONS = 3

export default function PreviewPage() {
  const router = useRouter()
  const [pages, setPages] = useState<CalendarPage[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [petName, setPetName] = useState('Your Pet')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      setProjectId(data.projectId || 'demo')
      if (data.petName) setPetName(data.petName)

      const demoPages: CalendarPage[] = [
        {
          id: 'cover',
          project_id: 'demo',
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
          id: `month-${m.month}`,
          project_id: 'demo',
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
      setPages(demoPages)
    }
    setIsLoading(false)
  }, [])

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
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce-gentle mb-4">🐾</div>
          <p className="text-[#2D1B69]/60 font-medium">Loading your calendar...</p>
        </div>
      </div>
    )
  }

  const cover = pages.find((p) => p.page_type === 'cover')
  const monthPages = pages
    .filter((p) => p.page_type === 'month')
    .sort((a, b) => (a.month_number ?? 0) - (b.month_number ?? 0))

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={3} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69]">
            {petName}&apos;s Calendar is Ready! 🎉
          </h1>
          <p className="mt-3 text-[#2D1B69]/60 max-w-lg mx-auto">
            Review each month below. Not happy with one? Hit regenerate!
          </p>
        </div>

        {/* Instructions callout */}
        <div className="mb-10 mx-auto max-w-2xl rounded-2xl bg-[#FFF0E8] border border-[#FF6B35]/15 p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-sm text-[#FF6B35]/80 leading-relaxed font-medium">
            <strong>How to customize:</strong> Tap any month to see it bigger. Not quite right? Hit 🔄 to regenerate it (3 tries per month). Love it? Hit Order below!
          </p>
        </div>

        {/* Cover */}
        {cover && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-[#2D1B69] mb-4 flex items-center gap-2">
              🌟 Cover
            </h2>
            <div className="max-w-sm">
              <PageCard
                page={cover}
                label="Cover"
                onRegenerate={() => handleRegenerate(cover.id)}
              />
            </div>
          </div>
        )}

        {/* Month grid */}
        <h2 className="text-lg font-extrabold text-[#2D1B69] mb-4 flex items-center gap-2">
          📅 Monthly Pages
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthPages.map((page) => {
            const theme = MONTH_THEMES.find((m) => m.month === page.month_number)
            return (
              <PageCard
                key={page.id}
                page={page}
                label={theme?.name ?? `Month ${page.month_number}`}
                onRegenerate={() => handleRegenerate(page.id)}
              />
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => router.push('/create/style')}
            className="text-[#2D1B69]/50 hover:text-[#FF6B35] font-bold transition-colors"
          >
            ← Back to Style
          </button>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push('/checkout')}
              className="rounded-full bg-[#FF6B35] px-10 py-4 text-lg font-bold text-white shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E55A2B] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Order This Calendar — $39.99 📦
            </button>
            <button className="text-sm text-[#2D1B69]/40 hover:text-[#FF6B35] transition-colors font-medium">
              💾 Save & Come Back Later
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
}: {
  page: CalendarPage
  label: string
  onRegenerate: () => void
}) {
  const attemptsLeft = MAX_REGENERATIONS - page.generation_attempts
  const canRegenerate = attemptsLeft > 0 && page.status !== 'generating'

  return (
    <div className="group rounded-3xl border-2 border-[#FF6B35]/8 overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FFF0E8] to-[#FFF8E8] flex items-center justify-center">
        {page.status === 'complete' && page.cloudinary_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.cloudinary_url}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : page.status === 'generating' ? (
          <div className="text-center">
            <div className="text-4xl animate-bounce-gentle mb-2">🐾</div>
            <p className="text-sm text-[#FF6B35] font-bold">Creating...</p>
          </div>
        ) : page.status === 'failed' ? (
          <div className="text-center">
            <span className="text-3xl">😿</span>
            <p className="mt-2 text-sm text-red-500 font-bold">Generation failed</p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-5xl opacity-40">🐾</span>
            <p className="mt-2 text-sm text-[#2D1B69]/30 font-medium">Pending</p>
          </div>
        )}

        {/* Month pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#2D1B69] shadow-sm">
            {label}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {canRegenerate && (
            <button
              onClick={onRegenerate}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#FF6B35] shadow-lg hover:bg-[#FFF0E8] transition-colors"
            >
              🔄 Redo
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex items-center justify-between bg-white">
        <span className="text-sm font-bold text-[#2D1B69]">{label}</span>
        {page.generation_attempts > 0 && (
          <span className="text-xs text-[#2D1B69]/40 font-medium">
            {attemptsLeft} {attemptsLeft === 1 ? 'redo' : 'redos'} left
          </span>
        )}
      </div>
    </div>
  )
}
