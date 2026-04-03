'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import StylePicker from '@/components/StylePicker'
import StepProgress from '@/components/StepProgress'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 3 }, (_, i) => currentYear + i)

export default function StylePage() {
  const router = useRouter()
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [startYear, setStartYear] = useState(currentYear)
  const [petName, setPetName] = useState('your pet')
  const [petType, setPetType] = useState<'dog' | 'cat' | 'other'>('dog')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('petcalendar_create')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.pets?.[0]?.name) setPetName(data.pets[0].name)
      else if (data.petName) setPetName(data.petName)
      if (data.pets?.[0]?.type) setPetType(data.pets[0].type)
      else if (data.petType) setPetType(data.petType)
      if (data.projectId) setProjectId(data.projectId)
    }
  }, [])

  const canGenerate = selectedStyle.length > 0 && !isGenerating

  async function handleGenerate() {
    if (!projectId) {
      setError('No project found. Please go back and upload photos first.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Update sessionStorage with style/year
      const existing = sessionStorage.getItem('petcalendar_create')
      if (existing) {
        const data = JSON.parse(existing)
        data.style = selectedStyle
        data.startYear = startYear
        sessionStorage.setItem('petcalendar_create', JSON.stringify(data))
      }

      // Update the project style/year in Supabase, then navigate to preview.
      // The preview page will trigger generation so the user sees live progress.
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          style: selectedStyle,
          startYear,
        }),
      })

      // Navigate immediately — don't wait for generation to finish.
      // The preview page polls for updates.
      router.push('/create/preview')
    } catch (err) {
      console.error('Generation start failed:', err)
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={2} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69]">
            Now pick a style for {petName}! 🎨
          </h1>
          <p className="mt-3 text-[#2D1B69]/60 max-w-lg mx-auto">
            Each style transforms your pet photos into a unique art form. You can always change this later.
          </p>
        </div>

        {/* Style picker */}
        <StylePicker
          selectedStyle={selectedStyle}
          petType={petType}
          onSelect={(style) => {
            setSelectedStyle(style)
            // Auto-scroll to the bottom section after selection
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 150)
          }}
        />

        {/* Year picker */}
        <div ref={bottomRef} className="mt-12 mx-auto max-w-md rounded-3xl bg-white border-2 border-[#FF6B35]/10 p-6 sm:p-8 shadow-sm">
          <h2 className="font-bold text-[#2D1B69] mb-4 flex items-center gap-2">
            📅 What year is this calendar for?
          </h2>
          <div>
            <label htmlFor="startYear" className="block text-sm text-[#2D1B69]/60 mb-1 font-medium">
              Year
            </label>
            <select
              id="startYear"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-[#FF6B35]/15 bg-white px-4 py-3 text-[#2D1B69] focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 mx-auto max-w-md rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => router.push('/create')}
            className="text-[#2D1B69]/50 hover:text-[#FF6B35] font-bold transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`rounded-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 ${
              canGenerate
                ? 'bg-[#FF6B35] hover:bg-[#E55A2B] shadow-lg shadow-[#FF6B35]/20 hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🐾</span>
                Starting generation...
              </span>
            ) : (
              '✨ Create My Calendar!'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
