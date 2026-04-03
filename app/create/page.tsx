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

const petTypes: { value: PetType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'other', label: 'Other Pet', emoji: '🐾' },
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
    <div className="min-h-screen bg-[var(--alabaster)]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <StepProgress currentStep={1} />

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ebony)] capitalize">
            First, let&apos;s meet your pet{pets.length > 1 ? 's' : ''}! 📸
          </h1>
          <p className="mt-3 text-[var(--wenge)] max-w-lg mx-auto font-medium">
            Upload 3-5 photos per pet. Different angles work best — front,
            side, and full body shots help our AI capture their unique look.
          </p>
        </div>

        <div className="space-y-8">
          {pets.map((pet, index) => (
            <div
              key={pet.id}
              className="rounded-2xl border-2 border-[var(--purple)]/10 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[var(--ebony)] text-lg">
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

              <div className="mb-6">
                <label
                  htmlFor={`petName-${pet.id}`}
                  className="block text-sm font-bold text-[var(--ebony)] mb-2"
                >
                  What&apos;s your pet&apos;s name?
                </label>
                <input
                  id={`petName-${pet.id}`}
                  type="text"
                  value={pet.name}
                  onChange={(e) => updatePet(pet.id, { name: e.target.value })}
                  placeholder="e.g., Buddy, Luna, Mr. Whiskers..."
                  className="input-zaipet"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[var(--ebony)] mb-3">
                  What type of pet?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {petTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updatePet(pet.id, { type: type.value })}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-6 font-bold transition-all duration-200 ${
                        pet.type === type.value
                          ? 'border-[var(--purple)] bg-[var(--purple)]/5 shadow-md text-[var(--ebony)]'
                          : 'border-gray-200 bg-white text-[var(--wenge)] hover:border-[var(--purple)]/30'
                      }`}
                    >
                      <span className="text-4xl">{type.emoji}</span>
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ebony)] mb-3">
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

        <div className="mt-6 text-center">
          <button
            onClick={() => setPets((prev) => [...prev, createEmptyPet()])}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[var(--purple)]/25 px-6 py-3 text-sm font-bold text-[var(--purple)] hover:border-[var(--purple)]/50 hover:bg-[var(--purple)]/5 transition-all"
          >
            + Add Another Pet
          </button>
        </div>

        {pets.length > 1 && (
          <div className="mt-8 mx-auto max-w-md rounded-2xl bg-white border-2 border-[var(--purple)]/10 p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-[var(--ebony)] mb-2 flex items-center gap-2">
              🐾 How should your pets appear?
            </h2>
            <p className="text-sm text-[var(--wenge)] mb-4">
              Choose how your pets show up in the calendar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMultiPetMode('alternate')}
                className={`text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                  multiPetMode === 'alternate'
                    ? 'border-[var(--purple)] bg-[var(--purple)]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-[var(--purple)]/30'
                }`}
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-bold text-[var(--ebony)] text-sm">Take Turns</div>
                <p className="text-xs text-[var(--wenge)] mt-1">
                  Each pet gets their own months, alternating through the calendar
                </p>
              </button>
              <button
                onClick={() => setMultiPetMode('together')}
                className={`text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                  multiPetMode === 'together'
                    ? 'border-[var(--purple)] bg-[var(--purple)]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-[var(--purple)]/30'
                }`}
              >
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-bold text-[var(--ebony)] text-sm">Together</div>
                <p className="text-xs text-[var(--wenge)] mt-1">
                  All your pets appear together in every single month&apos;s image
                </p>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[var(--wenge)] mt-4 font-medium">
          💡 Pro tip: Front face, side profile, and a full body shot give the best results!
        </p>

        {uploadError && (
          <div className="mt-4 mx-auto max-w-md rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-sm text-red-600 font-medium">{uploadError}</p>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={handleContinue}
            disabled={!canContinue || isUploading}
            className={`btn-purple text-lg px-8 py-4 order-1 sm:order-2 ${
              !canContinue || isUploading ? 'opacity-50 cursor-not-allowed' : ''
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
