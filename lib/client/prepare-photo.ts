// Client-side photo preparation: any image the browser can open (JPEG, PNG,
// WebP, AVIF, GIF, BMP, HEIC…) → JPEG, then downscale. Phone photos are
// often 5–12 MB, which is over the request-body limit of serverless functions
// and far more detail than the image model needs.

const MAX_EDGE = 2048
const HEIF_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']

export function isHeif(file: File): boolean {
  if (HEIF_TYPES.includes(file.type.toLowerCase())) return true
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif'
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'jfif', 'png', 'webp', 'avif', 'gif', 'bmp', 'tif', 'tiff', 'heic', 'heif']

/** Anything that claims to be a picture is worth a try; preparePhoto() decides whether it can be read. */
export function isSupportedPhoto(file: File): boolean {
  if (file.type.toLowerCase().startsWith('image/')) return true
  // Some phones and file managers send no type at all for newer formats.
  return IMAGE_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() ?? '')
}

/** Decode with the browser; fall back to the HEIC converter for anything it cannot open. */
async function decode(file: File): Promise<ImageBitmap> {
  if (!isHeif(file)) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Not a format this browser reads natively — it may still be HEIF with the wrong label.
    }
  } else {
    try {
      // Safari reads HEIC natively, which is faster and keeps more detail.
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Other browsers need the converter.
    }
  }
  return createImageBitmap(await heifToJpeg(file), { imageOrientation: 'from-image' })
}

async function heifToJpeg(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 })
  return Array.isArray(result) ? result[0] : result
}

export async function preparePhoto(file: File): Promise<File> {
  const bitmap = await decode(file)
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
