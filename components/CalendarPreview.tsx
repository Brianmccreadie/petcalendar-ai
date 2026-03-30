'use client'

import MonthCard from './MonthCard'
import type { CalendarPage } from '@/lib/types'

interface CalendarPreviewProps {
  pages: CalendarPage[]
  onRegenerate?: (pageId: string) => void
}

export default function CalendarPreview({
  pages,
  onRegenerate,
}: CalendarPreviewProps) {
  const coverPage = pages.find((p) => p.page_type === 'cover')
  const monthPages = pages
    .filter((p) => p.page_type === 'month')
    .sort((a, b) => (a.month_number ?? 0) - (b.month_number ?? 0))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Cover card */}
      {coverPage && (
        <MonthCard
          monthNumber={0}
          imageUrl={coverPage.cloudinary_url}
          status={coverPage.status}
          onRegenerate={
            onRegenerate ? () => onRegenerate(coverPage.id) : undefined
          }
          isCover
        />
      )}

      {/* Month cards */}
      {monthPages.map((page) => (
        <MonthCard
          key={page.id}
          monthNumber={page.month_number!}
          imageUrl={page.cloudinary_url}
          status={page.status}
          onRegenerate={
            onRegenerate ? () => onRegenerate(page.id) : undefined
          }
        />
      ))}
    </div>
  )
}
