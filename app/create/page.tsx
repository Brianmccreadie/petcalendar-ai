'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhotoUploader from '@/components/PhotoUploader'
import type { PetType } from '@/lib/types'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
}

const petTypes: { value: PetType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐈' },
  { value: 'other', label: 'Other', emoji: '🐾' },
]

export default function CreatePage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState<PetType>('dog')

  const canContinue = photos.length >= 1 && petName.trim().length > 0

  function handleContinue() {
    // Store in sessionStorage for the next step
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Upload Photos</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            Step 1 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Upload Your Pet Photos
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Share 3–5 clear photos of your pet. Different angles help the AI
            capture their unique look.
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
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Pet name */}
          <div>
            <label
              htmlFor="petName"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Pet&apos;s Name
            </label>
            <input
              id="petName"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Buddy, Luna, Whiskers..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Pet type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Pet Type
            </label>
            <div className="flex gap-3">
              {petTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPetType(type.value)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-all duration-200 ${
                    petType === type.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <span className="text-xl">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`inline-flex items-center rounded-full px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 ${
              canContinue
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            Continue to Styles
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
