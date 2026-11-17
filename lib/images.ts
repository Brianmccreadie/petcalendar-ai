import sharp from 'sharp'

/**
 * Normalise an uploaded pet photo: apply EXIF rotation, cap the long edge and
 * re-encode as JPEG. Throws if the bytes are not a decodable image.
 */
export async function normalisePetPhoto(input: Buffer): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/** Re-encode model output as a high-quality sRGB JPEG so print files stay a sane size. */
export async function normaliseGeneratedImage(input: Buffer): Promise<{ data: Buffer; mimeType: string }> {
  const data = await sharp(input).toColourspace('srgb').jpeg({ quality: 93, chromaSubsampling: '4:4:4' }).toBuffer()
  return { data, mimeType: 'image/jpeg' }
}
