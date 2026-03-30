'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StylePicker from '@/components/StylePicker'
import StepProgress from '@/components/StepProgress'

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
  const [petName, setPetName] = useState('your pet')

  useEffect(() => {
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.petName) setPetName(data.petName)
    }
  }, [])

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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={2} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Pick a style for {petName}&apos;s calendar 🎨
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Each style transforms your pet photos into a unique art form. You can always change this later.
          </p>
        </div>

        {/* Style picker */}
        <StylePicker
          selectedStyle={selectedStyle}
          onSelect={setSelectedStyle}
        />

        {/* Start month/year */}
        <div className="mt-12 mx-auto max-w-md rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8">
          <h2 className="font-semibold text-gray-900 mb-4">
            When should your calendar start?
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="startMonth" className="block text-sm text-gray-600 mb-1">
                Month
              </label>
              <select
                id="startMonth"
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
              >
                {months.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="startYear" className="block text-sm text-gray-600 mb-1">
                Year
              </label>
              <select
                id="startYear"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Warning callout */}
        <div className="mt-6 mx-auto max-w-md rounded-xl bg-purple-50 border border-purple-100 p-4 flex items-start gap-3">
          <span className="text-lg shrink-0">⏱</span>
          <p className="text-sm text-purple-700">
            Generation takes about 2 minutes. We&apos;ll create all 12 months plus a cover.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => router.push('/create')}
            className="text-gray-500 hover:text-[#7C3AED] font-medium transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ${
              canGenerate
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Generate My Calendar ✨
          </button>
        </div>
      </div>
    </div>
  )
}
