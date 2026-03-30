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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      setProjectId(data.projectId || 'demo')

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-[#7C3AED] animate-spin" />
      </div>
    )
  }

  const cover = pages.find((p) => p.page_type === 'cover')
  const monthPages = pages
    .filter((p) => p.page_type === 'month')
    .sort((a, b) => (a.month_number ?? 0) - (b.month_number ?? 0))

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={3} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your calendar is ready! 🎉
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Review each month below. Not happy with one? Click the refresh button to regenerate it (up to 3 times per month).
          </p>
        </div>

        {/* Instructions callout */}
        <div className="mb-10 mx-auto max-w-2xl rounded-xl bg-purple-50 border border-purple-100 p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-sm text-purple-700 leading-relaxed">
            Click any month to see it larger. Use the 🔄 button to regenerate months you want to change. When you&apos;re happy, hit Order!
          </p>
        </div>

        {/* Cover */}
        {cover && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cover</h2>
            <PageCard
              page={cover}
              label="Cover"
              onRegenerate={() => handleRegenerate(cover.id)}
            />
          </div>
        )}

        {/* Month grid */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Pages</h2>
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
            className="text-gray-500 hover:text-[#7C3AED] font-medium transition-colors"
          >
            ← Back to Style
          </button>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => router.push('/checkout')}
              className="rounded-full bg-[#7C3AED] px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-[#6D28D9] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Order This Calendar — $39.99
            </button>
            <button className="text-sm text-gray-400 hover:text-[#7C3AED] transition-colors">
              Save for Later
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
    <div className="group rounded-2xl border border-gray-100 overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
        {page.status === 'complete' && page.cloudinary_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.cloudinary_url}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : page.status === 'generating' ? (
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-3 border-purple-200 border-t-[#7C3AED] animate-spin mx-auto" />
            <p className="mt-3 text-sm text-purple-500 font-medium">Creating...</p>
          </div>
        ) : page.status === 'failed' ? (
          <div className="text-center">
            <span className="text-3xl">❌</span>
            <p className="mt-2 text-sm text-red-500 font-medium">Generation failed</p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-4xl">🐾</span>
            <p className="mt-2 text-sm text-purple-400">Pending</p>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          {canRegenerate && (
            <button
              onClick={onRegenerate}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#7C3AED] shadow-lg hover:bg-purple-50 transition-colors"
            >
              🔄 Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {page.generation_attempts > 0 && (
          <span className="text-xs text-gray-400">{attemptsLeft} left</span>
        )}
      </div>
    </div>
  )
}
