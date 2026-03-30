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

export default function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newPhotos: UploadedPhoto[] = []
      const remaining = maxPhotos - photos.length

      Array.from(files)
        .slice(0, remaining)
        .forEach((file) => {
          if (!file.type.startsWith('image/')) return
          newPhotos.push({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
          })
        })

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos])
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
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-3 border-dashed p-12 cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-[#FF6B35] bg-[#FFF0E8] scale-[1.02]'
            : 'border-[#FF6B35]/40 bg-white hover:border-[#FF6B35] hover:bg-[#FFF0E8]/50'
        } ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <span className="text-5xl mb-4">🐾</span>
        <p className="text-[#2D1B69] font-bold text-lg mb-1">
          Drop your pet photos here
        </p>
        <p className="text-sm text-[#2D1B69]/50">
          or click to browse ({photos.length}/{maxPhotos} photos)
        </p>
        <p className="text-xs text-[#2D1B69]/30 mt-3">
          JPG, PNG up to 10MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* Preview grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-[#FF6B35]/15 shadow-sm hover:shadow-md transition-all duration-300"
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
