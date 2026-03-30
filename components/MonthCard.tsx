'use client'

import { MONTH_THEMES } from '@/lib/types'

interface MonthCardProps {
  monthNumber: number
  imageUrl: string | null
  status: 'pending' | 'generating' | 'complete' | 'failed'
  onRegenerate?: () => void
  isCover?: boolean
}

export default function MonthCard({
  monthNumber,
  imageUrl,
  status,
  onRegenerate,
  isCover = false,
}: MonthCardProps) {
  const monthTheme = MONTH_THEMES.find((m) => m.month === monthNumber)
  const label = isCover ? 'Cover' : monthTheme?.name ?? `Month ${monthNumber}`

  return (
    <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50">
        {status === 'complete' && imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : status === 'generating' ? (
          <div className="flex flex-col items-center justify-center h-full animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
            <p className="mt-4 text-sm text-purple-500 font-medium">Generating...</p>
          </div>
        ) : status === 'failed' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p className="mt-2 text-sm text-red-500 font-medium">Generation failed</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl">🐾</span>
            <p className="mt-2 text-sm text-gray-400">Pending</p>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        {onRegenerate && status !== 'generating' && (
          <button
            onClick={onRegenerate}
            className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Regenerate
          </button>
        )}
      </div>
    </div>
  )
}
