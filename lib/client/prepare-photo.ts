// Client-side photo preparation: HEIC → JPEG, then downscale. Phone photos are
// often 5–12 MB, which is over the request-body limit of serverless functions
// and far more detail than the image model needs.

const MAX_EDGE = 2048
const HEIF_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']

export function isHeif(file: File): boolean {
  if (HEIF_TYPES.includes(file.type.toLowerCase())) return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif'
}

export function isSupportedPhoto(file: File): boolean {
  return /^image\/(jpeg|png|webp)$/i.test(file.type) || isHeif(file)
}

async function heifToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
  return Array.isArray(result) ? result[0] : result
}

export async function preparePhoto(file: File): Promise<File> {
  const source: Blob = isHeif(file) ? await heifToJpeg(file) : file
  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    if (Math.min(width, height) < 300) throw new Error('That photo is too small — use one at least 300px wide.')

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not process the photo.')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    if (!blob) throw new Error('Could not process the photo.')
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } finally {
    bitmap.close()
  }
}
