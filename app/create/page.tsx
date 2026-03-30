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

const petTypes: { value: PetType; label: string; emoji: string; bg: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕', bg: 'bg-[#FFF0E8] border-[#FF6B35]' },
  { value: 'cat', label: 'Cat', emoji: '🐱', bg: 'bg-[#E8FFF7] border-[#06D6A0]' },
  { value: 'other', label: 'Other Pet', emoji: '🐾', bg: 'bg-[#F3EEFF] border-[#7C3AED]' },
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
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={1} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69]">
            First, let&apos;s meet your pet! 📸
          </h1>
          <p className="mt-3 text-[#2D1B69]/60 max-w-lg mx-auto">
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
          <p className="text-center text-xs text-[#FF6B35]/70 mt-3 font-medium">
            💡 Pro tip: Front face, side profile, and a full body shot give the best results!
          </p>
        </div>

        {/* Pet info */}
        <div className="space-y-6">
          {/* Pet name */}
          <div>
            <label
              htmlFor="petName"
              className="block text-sm font-bold text-[#2D1B69] mb-2"
            >
              What&apos;s your pet&apos;s name?
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Buddy, Luna, Mr. Whiskers..."
              className="w-full rounded-2xl border-2 border-[#FF6B35]/20 bg-white px-5 py-3.5 text-[#2D1B69] placeholder:text-[#2D1B69]/30 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:bg-white outline-none transition-all text-lg"
            />
          </div>

          {/* Pet type */}
          <div>
            <label className="block text-sm font-bold text-[#2D1B69] mb-3">
              What type of pet?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {petTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPetType(type.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-3 px-4 py-6 font-bold transition-all duration-200 hover-wiggle ${
                    petType === type.value
                      ? `${type.bg} shadow-md`
                      : 'border-gray-200 bg-white text-[#2D1B69]/60 hover:border-[#FF6B35]/30 hover:bg-[#FFF0E8]/30'
                  }`}
                >
                  <span className="text-4xl">{type.emoji}</span>
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button className="text-sm text-[#2D1B69]/40 hover:text-[#FF6B35] transition-colors order-2 sm:order-1 text-center sm:text-left font-medium">
            💾 Save & Continue Later
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`rounded-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 order-1 sm:order-2 ${
              canContinue
                ? 'bg-[#FF6B35] hover:bg-[#E55A2B] shadow-lg shadow-[#FF6B35]/20 hover:shadow-xl hover:-translate-y-0.5'
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
