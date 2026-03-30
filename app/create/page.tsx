'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUploader from '@/components/PhotoUploader'
import StepProgress from '@/components/StepProgress'
import type { PetType } from '@/lib/types'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
}

const petTypes: { value: PetType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'other', label: 'Other', emoji: '🐾' },
]

export default function CreatePage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState<PetType>('dog')

  const canContinue = photos.length >= 1 && petName.trim().length > 0

  function handleContinue() {
    const photoData = photos.map((p) => ({
      id: p.id,
      name: p.file.name,
      size: p.file.size,
      preview: p.preview,
    }))
    sessionStorage.setItem(
      'petcalendar_create',
      JSON.stringify({ photos: photoData, petName: petName.trim(), petType })
    )
    router.push('/create/style')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={1} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Let&apos;s start with your pet! 📸
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Upload 3-5 photos of your pet. Different angles work best — front,
            side, and full body shots help our AI capture their unique look.
          </p>
        </div>

        {/* Photo uploader */}
        <div className="mb-10">
          <PhotoUploader
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={5}
          />
        </div>

        {/* Pet info */}
        <div className="space-y-6">
          {/* Pet name */}
          <div>
            <label
              htmlFor="petName"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              What&apos;s your pet&apos;s name?
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Buddy, Luna, Whiskers..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Pet type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              What type of pet?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {petTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPetType(type.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 font-medium transition-all duration-200 ${
                    petType === type.value
                      ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <span className="text-3xl">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button className="text-sm text-gray-400 hover:text-[#7C3AED] transition-colors order-2 sm:order-1 text-center sm:text-left">
            Save & Continue Later
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 order-1 sm:order-2 ${
              canContinue
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continue to Style →
          </button>
        </div>
      </div>
    </div>
  )
}
