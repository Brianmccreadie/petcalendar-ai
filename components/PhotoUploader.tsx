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
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-purple-500 bg-purple-50/50 scale-[1.02]'
            : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/30'
        } ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <svg
          className="w-12 h-12 text-purple-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>
        <p className="text-gray-700 font-semibold mb-1">
          Drag & drop your pet photos here
        </p>
        <p className="text-sm text-gray-500">
          or click to browse ({photos.length}/{maxPhotos} photos)
        </p>
        <p className="text-xs text-gray-400 mt-2">
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
              className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm"
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
