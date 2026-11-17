import { randomUUID } from 'crypto'
import { createAdminSupabaseClient } from './supabase-admin'
import { extensionForMime } from './validate'

export const BUCKETS = {
  petPhotos: 'pet-photos',
  generated: 'generated-images',
  printFiles: 'print-files',
} as const

function publicUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

async function upload(
  bucket: string,
  path: string,
  data: Buffer | Uint8Array,
  contentType: string
): Promise<{ url: string; path: string }> {
  const { error } = await createAdminSupabaseClient()
    .storage.from(bucket)
    .upload(path, data, { contentType, upsert: false, cacheControl: '31536000' })
  if (error) throw new Error(`Upload to ${bucket} failed: ${error.message}`)
  return { url: publicUrl(bucket, path), path }
}

/** Store a normalised pet reference photo. */
export function uploadPetPhoto(projectId: string, petId: string, data: Buffer, mimeType: string) {
  return upload(BUCKETS.petPhotos, `${projectId}/${petId}/${randomUUID()}.${extensionForMime(mimeType)}`, data, mimeType)
}

/** Store a generated calendar image. Paths are random so parallel pages never collide. */
export function uploadGeneratedImage(projectId: string, label: string, data: Buffer, mimeType: string) {
  return upload(BUCKETS.generated, `${projectId}/${label}-${randomUUID()}.${extensionForMime(mimeType)}`, data, mimeType)
}

/** Store a print-ready PDF for the printer to fetch. */
export function uploadPrintFile(orderId: string, name: string, data: Uint8Array) {
  return upload(BUCKETS.printFiles, `${orderId}/${name}-${randomUUID()}.pdf`, data, 'application/pdf')
}

/** Only fetch images that live in our own storage (blocks SSRF via stored URLs). */
export async function fetchStoredImage(url: string): Promise<{ data: Buffer; mimeType: string }> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base || !url.startsWith(`${base}/storage/v1/object/public/`)) {
    throw new Error('Refusing to fetch image outside project storage')
  }
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch stored image (${response.status})`)
  return {
    data: Buffer.from(await response.arrayBuffer()),
    mimeType: response.headers.get('content-type')?.split(';')[0] || 'image/jpeg',
  }
}
