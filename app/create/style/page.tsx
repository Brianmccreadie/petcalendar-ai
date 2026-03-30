'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StylePicker from '@/components/StylePicker'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 3 }, (_, i) => currentYear + i)

export default function StylePage() {
  const router = useRouter()
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [startMonth, setStartMonth] = useState(1)
  const [startYear, setStartYear] = useState(currentYear)

  const canGenerate = selectedStyle.length > 0

  function handleGenerate() {
    const existing = sessionStorage.getItem('petcalendar_create')
    if (existing) {
      const data = JSON.parse(existing)
      data.style = selectedStyle
      data.startMonth = startMonth
      data.startYear = startYear
      sessionStorage.setItem('petcalendar_create', JSON.stringify(data))
    }
    router.push('/create/preview')
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
          <span className="text-gray-900 font-medium">Choose Style</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            Step 2 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Choose Your Art Style
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Each month will be a unique masterpiece in your chosen style.
          </p>
        </div>

        {/* Style picker */}
        <StylePicker
          selectedStyle={selectedStyle}
          onSelect={setSelectedStyle}
        />

        {/* Start month/year */}
        <div className="mt-12 mx-auto max-w-md rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="font-semibold text-gray-900 mb-4">
            Calendar Start Date
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="startMonth"
                className="block text-sm text-gray-600 mb-1"
              >
                Month
              </label>
              <select
                id="startMonth"
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
              >
                {months.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="startYear"
                className="block text-sm text-gray-600 mb-1"
              >
                Year
              </label>
              <select
                id="startYear"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`inline-flex items-center rounded-full px-10 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 ${
              canGenerate
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            <svg
              className="mr-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
              />
            </svg>
            Generate My Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
