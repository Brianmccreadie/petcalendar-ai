import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

export { cloudinary }

/**
 * Generate a signed upload signature for client-side Cloudinary uploads.
 */
export function getUploadSignature(folder: string): {
  timestamp: number
  signature: string
  apiKey: string
  cloudName: string
  folder: string
} {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

/**
 * Upload an image buffer or base64 string to Cloudinary.
 * Returns the upload result with url, public_id, width, height.
 */
export async function uploadImage(
  file: string | Buffer,
  folder: string
): Promise<{
  url: string
  public_id: string
  width: number
  height: number
  secure_url: string
}> {
  const dataUri =
    typeof file === 'string'
      ? file.startsWith('data:')
        ? file
        : `data:image/png;base64,${file}`
      : `data:image/png;base64,${file.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    quality: 'auto:best',
    format: 'png',
  })

  return {
    url: result.url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    secure_url: result.secure_url,
  }
}

/**
 * Get an optimized delivery URL for web display.
 */
export function getOptimizedUrl(
  publicId: string,
  width: number = 800,
  height: number = 600
): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill', gravity: 'auto', quality: 'auto', fetch_format: 'auto' },
    ],
    secure: true,
  })
}

/**
 * Get a high-resolution URL suitable for print (calendar page).
 * Uses minimal compression for print-quality output.
 */
export function getCalendarPageUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: 3600,
        height: 5400,
        crop: 'fill',
        gravity: 'auto',
        quality: 100,
        fetch_format: 'png',
      },
    ],
    secure: true,
  })
}
