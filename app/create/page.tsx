'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoUploader from '@/components/PhotoUploader'
import StepProgress from '@/components/StepProgress'
import type { PetType, MultiPetMode } from '@/lib/types'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
}

interface PetEntry {
  id: string
  name: string
  type: PetType
  photos: UploadedPhoto[]
}

const petTypes: { value: PetType; label: string; emoji: string; bg: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕', bg: 'bg-[#FFF0E8] border-[#FF6B35]' },
  { value: 'cat', label: 'Cat', emoji: '🐱', bg: 'bg-[#E8FFF7] border-[#06D6A0]' },
  { value: 'other', label: 'Other Pet', emoji: '🐾', bg: 'bg-[#F3EEFF] border-[#7C3AED]' },
]

function createEmptyPet(): PetEntry {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: 'dog',
    photos: [],
  }
}

export default function CreatePage() {
  const router = useRouter()
  const [pets, setPets] = useState<PetEntry[]>([createEmptyPet()])
  const [multiPetMode, setMultiPetMode] = useState<MultiPetMode>('alternate')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const canContinue = pets.every(
    (pet) => pet.photos.length >= 1 && pet.name.trim().length > 0
  )

  function updatePet(petId: string, updates: Partial<PetEntry>) {
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, ...updates } : p))
    )
  }

  function removePet(petId: string) {
    if (pets.length <= 1) return
    setPets((prev) => prev.filter((p) => p.id !== petId))
  }

  async function handleContinue() {
    setIsUploading(true)
    setUploadError(null)

    try {
      // Step 1: Create project + pets (small JSON, no photos)
      const createRes = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pets: pets.map((pet) => ({
            name: pet.name.trim(),
            type: pet.type,
          })),
          multiPetMode,
        }),
      })

      const createResult = await createRes.json()
      if (!createRes.ok) {
        throw new Error(createResult.error || 'Failed to create project')
      }

      const projectId = createResult.projectId
      const petIds: string[] = createResult.petIds

      // Step 2: Upload photos one at a time (avoids body size limits)
      for (let petIndex = 0; petIndex < pets.length; petIndex++) {
        const pet = pets[petIndex]
        const petId = petIds[petIndex]
        if (!petId) continue

        for (const photo of pet.photos) {
          const formData = new FormData()
          formData.append('project_id', projectId)
          formData.append('pet_id', petId)
          formData.append('photo', photo.file)

          const uploadRes = await fetch('/api/upload-photo', {
            method: 'POST',
            body: formData,
          })

          if (!uploadRes.ok) {
            console.error('Photo upload failed:', await uploadRes.text())
          }
        }
      }

      // Store project data in sessionStorage for the style + preview pages
      const petsData = pets.map((pet) => ({
        id: pet.id,
        name: pet.name.trim(),
        type: pet.type,
      }))
      sessionStorage.setItem(
        'petcalendar_create',
        JSON.stringify({ pets: petsData, multiPetMode, projectId })
      )

      router.push('/create/style')
    } catch (err) {
      console.error('Upload failed:', err)
      setUploadError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={1} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69]">
            First, let&apos;s meet your pet{pets.length > 1 ? 's' : ''}! 📸
          </h1>
          <p className="mt-3 text-[#2D1B69]/60 max-w-lg mx-auto">
            Upload 3-5 photos per pet. Different angles work best — front,
            side, and full body shots help our AI capture their unique look.
          </p>
        </div>

        {/* Pet sections */}
        <div className="space-y-8">
          {pets.map((pet, index) => (
            <div
              key={pet.id}
              className="rounded-3xl border-2 border-[#FF6B35]/10 bg-white p-6 sm:p-8 shadow-sm"
            >
              {/* Pet header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-extrabold text-[#2D1B69] text-lg">
                  {pets.length > 1 ? `Pet #${index + 1}` : 'Your Pet'}
                </h2>
                {pets.length > 1 && (
                  <button
                    onClick={() => removePet(pet.id)}
                    className="text-sm text-red-400 hover:text-red-600 font-bold transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Pet name */}
              <div className="mb-6">
                <label
                  htmlFor={`petName-${pet.id}`}
                  className="block text-sm font-bold text-[#2D1B69] mb-2"
                >
                  What&apos;s your pet&apos;s name?
                </label>
                <input
                  id={`petName-${pet.id}`}
                  type="text"
                  value={pet.name}
                  onChange={(e) => updatePet(pet.id, { name: e.target.value })}
                  placeholder="e.g., Buddy, Luna, Mr. Whiskers..."
                  className="w-full rounded-2xl border-2 border-[#FF6B35]/20 bg-white px-5 py-3.5 text-[#2D1B69] placeholder:text-[#2D1B69]/30 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:bg-white outline-none transition-all text-lg"
                />
              </div>

              {/* Pet type */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#2D1B69] mb-3">
                  What type of pet?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {petTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updatePet(pet.id, { type: type.value })}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-3 px-4 py-6 font-bold transition-all duration-200 hover-wiggle ${
                        pet.type === type.value
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

              {/* Photo uploader */}
              <div>
                <label className="block text-sm font-bold text-[#2D1B69] mb-3">
                  Photos of {pet.name || 'your pet'}
                </label>
                <PhotoUploader
                  photos={pet.photos}
                  onPhotosChange={(photos) => updatePet(pet.id, { photos })}
                  maxPhotos={5}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add another pet */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setPets((prev) => [...prev, createEmptyPet()])}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[#FF6B35]/30 px-6 py-3 text-sm font-bold text-[#FF6B35] hover:border-[#FF6B35] hover:bg-[#FFF0E8] transition-all"
          >
            + Add Another Pet
          </button>
        </div>

        {/* Multi-pet mode selector — only shows with 2+ pets */}
        {pets.length > 1 && (
          <div className="mt-8 mx-auto max-w-md rounded-3xl bg-white border-2 border-[#FF6B35]/10 p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-[#2D1B69] mb-2 flex items-center gap-2">
              🐾 How should your pets appear?
            </h2>
            <p className="text-sm text-[#2D1B69]/50 mb-4">
              Choose how your pets show up in the calendar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMultiPetMode('alternate')}
                className={`text-left rounded-2xl border-3 p-4 transition-all duration-200 ${
                  multiPetMode === 'alternate'
                    ? 'border-[#FF6B35] bg-[#FFF0E8] shadow-md'
                    : 'border-gray-200 bg-white hover:border-[#FF6B35]/30'
                }`}
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-bold text-[#2D1B69] text-sm">Take Turns</div>
                <p className="text-xs text-[#2D1B69]/50 mt-1">
                  Each pet gets their own months, alternating through the calendar
                </p>
              </button>
              <button
                onClick={() => setMultiPetMode('together')}
                className={`text-left rounded-2xl border-3 p-4 transition-all duration-200 ${
                  multiPetMode === 'together'
                    ? 'border-[#FF6B35] bg-[#FFF0E8] shadow-md'
                    : 'border-gray-200 bg-white hover:border-[#FF6B35]/30'
                }`}
              >
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-bold text-[#2D1B69] text-sm">Together</div>
                <p className="text-xs text-[#2D1B69]/50 mt-1">
                  All your pets appear together in every single month&apos;s image
                </p>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[#FF6B35]/70 mt-4 font-medium">
          💡 Pro tip: Front face, side profile, and a full body shot give the best results!
        </p>

        {/* Upload error */}
        {uploadError && (
          <div className="mt-4 mx-auto max-w-md rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-sm text-red-600 font-medium">{uploadError}</p>
          </div>
        )}

        {/* Continue button */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <button
            onClick={handleContinue}
            disabled={!canContinue || isUploading}
            className={`rounded-full px-8 py-4 text-lg font-bold text-white transition-all duration-300 order-1 sm:order-2 ${
              canContinue && !isUploading
                ? 'bg-[#FF6B35] hover:bg-[#E55A2B] shadow-lg shadow-[#FF6B35]/20 hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🐾</span>
                Uploading photos...
              </span>
            ) : (
              'Continue to Style →'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
