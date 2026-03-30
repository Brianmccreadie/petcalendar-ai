'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CalendarPreview from '@/components/CalendarPreview'
import { MONTH_THEMES, type CalendarPage } from '@/lib/types'

export default function PreviewPage() {
  const router = useRouter()
  const [pages, setPages] = useState<CalendarPage[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from Supabase using the project ID.
    // For now, create placeholder pages to demonstrate the UI.
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      setProjectId(data.projectId || 'demo')

      // Build demo pages
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
        p.id === pageId ? { ...p, status: 'generating' as const } : p
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
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/create" className="hover:text-purple-600 transition-colors">
            Upload
          </Link>
          <span>/</span>
          <Link href="/create/style" className="hover:text-purple-600 transition-colors">
            Style
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Preview</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            Step 3 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Preview Your Calendar
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Review each month. Click &quot;Regenerate&quot; on any page you&apos;d like to
            redo (up to 3 times per month).
          </p>
        </div>

        {/* Calendar grid */}
        <CalendarPreview pages={pages} onRegenerate={handleRegenerate} />

        {/* Order button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push('/checkout')}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
          >
            Order This Calendar — $39.99
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
