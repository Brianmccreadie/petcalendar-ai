'use client'

/* eslint-disable @next/next/no-img-element */
import { useCallback, useId, useRef, useState } from 'react'
import { Close, Upload } from '@/components/icons'
import { isSupportedPhoto, preparePhoto } from '@/lib/client/prepare-photo'

export interface LocalPhoto {
  id: string
  file: File
  preview: string
}

interface PhotoUploaderProps {
  photos: LocalPhoto[]
  onChange: (photos: LocalPhoto[]) => void
  maxPhotos: number
  petName: string
  disabled?: boolean
}

export default function PhotoUploader({ photos, onChange, maxPhotos, petName, disabled }: PhotoUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = maxPhotos - photos.length

  const addFiles = useCallback(
    async (list: FileList | File[]) => {
      const files = Array.from(list)
      if (files.length === 0) return
      setError(null)

      const supported = files.filter(isSupportedPhoto)
      const skipped = files.length - supported.length
      const accepted = supported.slice(0, remaining)

      setBusy(true)
      const added: LocalPhoto[] = []
      let failed = 0
      for (const file of accepted) {
        try {
          const prepared = await preparePhoto(file)
          added.push({ id: crypto.randomUUID(), file: prepared, preview: URL.createObjectURL(prepared) })
        } catch {
          failed++
        }
      }
      setBusy(false)

      if (added.length) onChange([...photos, ...added])
      const notes: string[] = []
      if (skipped) notes.push(`${skipped} file${skipped > 1 ? 's were' : ' was'} not a JPG, PNG, WebP or HEIC photo`)
      if (failed) notes.push(`${failed} photo${failed > 1 ? 's' : ''} could not be read`)
      if (supported.length > accepted.length) notes.push(`only ${maxPhotos} photos per pet`)
      if (notes.length) setError(notes.join(' · '))
    },
    [photos, onChange, remaining, maxPhotos]
  )

  function remove(id: string) {
    const photo = photos.find((p) => p.id === id)
    if (photo) URL.revokeObjectURL(photo.preview)
    onChange(photos.filter((p) => p.id !== id))
  }

  const name = petName || 'your pet'

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {photos.map((photo, i) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-paper-deep">
            <img src={photo.preview} alt={`Photo ${i + 1} of ${name}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-paper">
                Main
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(photo.id)}
              disabled={disabled}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-paper transition-colors hover:bg-ink"
            >
              <Close size={14} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              if (!disabled) addFiles(e.dataTransfer.files)
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed text-center transition-colors ${
              photos.length === 0 ? 'col-span-3 px-6 py-10 sm:col-span-5' : 'aspect-square p-2'
            } ${dragOver ? 'border-gold bg-gold/10' : 'border-ink/30 bg-paper hover:border-ink hover:bg-paper-deep/60'} ${
              disabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper">
              {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" /> : <Upload size={18} />}
            </span>
            {photos.length === 0 ? (
              <>
                <span className="font-display text-xl">{busy ? 'Preparing photos…' : `Add photos of ${name}`}</span>
                <span className="text-sm text-ink-soft">Drag them here or tap to choose · up to {maxPhotos} · JPG, PNG or HEIC</span>
              </>
            ) : (
              <span className="text-xs font-bold text-ink-soft">{busy ? 'Preparing…' : 'Add more'}</span>
            )}
          </label>
        )}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        multiple
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-signal">
          {error}
        </p>
      )}
    </div>
  )
}
