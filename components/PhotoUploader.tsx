'use client'

import { useState, useCallback, useRef } from 'react'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
}

interface PhotoUploaderProps {
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  maxPhotos?: number
}

const HEIF_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']

function isHeif(file: File): boolean {
  if (HEIF_TYPES.includes(file.type.toLowerCase())) return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif'
}

async function convertHeifToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
  const jpeg = Array.isArray(blob) ? blob[0] : blob
  const name = file.name.replace(/\.(heic|heif)$/i, '.jpg')
  return new File([jpeg], name, { type: 'image/jpeg' })
}

export default function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = maxPhotos - photos.length
      const filesToProcess = Array.from(files).slice(0, remaining).filter((file) => {
        return file.type.startsWith('image/') || isHeif(file)
      })

      if (filesToProcess.length === 0) return

      setConverting(true)
      try {
        const newPhotos: UploadedPhoto[] = []

        for (const file of filesToProcess) {
          let processedFile = file

          if (isHeif(file)) {
            try {
              processedFile = await convertHeifToJpeg(file)
            } catch (err) {
              console.error('HEIF conversion failed:', err)
              continue
            }
          }

          newPhotos.push({
            id: crypto.randomUUID(),
            file: processedFile,
            preview: URL.createObjectURL(processedFile),
          })
        }

        if (newPhotos.length > 0) {
          onPhotosChange([...photos, ...newPhotos])
        }
      } finally {
        setConverting(false)
      }
    },
    [photos, onPhotosChange, maxPhotos]
  )

  const removePhoto = useCallback(
    (id: string) => {
      const photo = photos.find((p) => p.id === id)
      if (photo) URL.revokeObjectURL(photo.preview)
      onPhotosChange(photos.filter((p) => p.id !== id))
    },
    [photos, onPhotosChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-[var(--purple)] bg-[var(--purple)]/5 scale-[1.02]'
            : 'border-[var(--purple)]/25 bg-white hover:border-[var(--purple)]/50 hover:bg-[var(--purple)]/3'
        } ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <span className="text-5xl mb-4">🐾</span>
        <p className="text-[var(--ebony)] font-bold text-lg mb-1">
          Drop your pet photos here
        </p>
        <p className="text-sm text-[var(--wenge)]">
          or click to browse ({photos.length}/{maxPhotos} photos)
        </p>
        <p className="text-xs text-[var(--wenge)]/50 mt-3">
          JPG, PNG, HEIC up to 10MB each
        </p>
        {converting && (
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--purple)] font-medium">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Converting photos...
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-[var(--purple)]/15 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.preview}
                alt="Pet photo"
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePhoto(photo.id)
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
