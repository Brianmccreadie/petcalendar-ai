import { sniffImageMime } from './validate'

// ---------------------------------------------------------------------------
// Image processing with sharp — loaded lazily and treated as optional.
//
// sharp is a native module. If it cannot load in the deployed environment,
// importing it at the top of a route would crash the whole route with a bare
// 500. Loading it on demand means the site keeps working without it: uploads
// (already downscaled in the browser) are stored as received, and model output
// is stored in the format the model returned.
// ---------------------------------------------------------------------------

type Sharp = typeof import('sharp')

let cached: Promise<Sharp | null> | null = null
let loadError: string | null = null

export function loadSharp(): Promise<Sharp | null> {
  if (!cached) {
    cached =
      process.env.DISABLE_SHARP === '1'
        ? Promise.resolve(null)
        : import('sharp')
            .then((mod) => (mod.default ?? mod) as Sharp)
            .catch((error) => {
              loadError = error instanceof Error ? error.message : String(error)
              console.error('[images] sharp is unavailable, continuing without it:', loadError)
              return null
            })
  }
  return cached
}

/** For /api/health: whether sharp loads and can actually encode an image. */
export async function imageProcessingStatus(): Promise<{ ok: boolean; error?: string }> {
  const sharp = await loadSharp()
  if (!sharp) return { ok: false, error: (loadError ?? 'disabled').slice(0, 300) }
  try {
    await sharp({ create: { width: 2, height: 2, channels: 3, background: '#fff' } }).jpeg().toBuffer()
    return { ok: true }
  } catch (error) {
    return { ok: false, error: (error instanceof Error ? error.message : String(error)).slice(0, 300) }
  }
}

export interface NormalisedImage {
  data: Buffer
  mimeType: string
  width: number | null
  height: number | null
}

/**
 * Normalise an uploaded pet photo: apply EXIF rotation, cap the long edge and
 * re-encode as JPEG. Throws if the bytes are not a decodable image.
 */
export async function normalisePetPhoto(input: Buffer): Promise<NormalisedImage> {
  const sharp = await loadSharp()
  if (!sharp) {
    const mimeType = sniffImageMime(input)
    if (!mimeType) throw new Error('Not a supported image')
    return { data: input, mimeType, width: null, height: null }
  }
  const { data, info } = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer({ resolveWithObject: true })
  return { data, mimeType: 'image/jpeg', width: info.width, height: info.height }
}

/** Re-encode model output as a high-quality sRGB JPEG so print files stay a sane size. */
export async function normaliseGeneratedImage(input: Buffer, mimeType: string): Promise<{ data: Buffer; mimeType: string }> {
  const sharp = await loadSharp()
  if (!sharp) return { data: input, mimeType: sniffImageMime(input) ?? mimeType }
  const data = await sharp(input).toColourspace('srgb').jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toBuffer()
  return { data, mimeType: 'image/jpeg' }
}
