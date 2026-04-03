import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabase
}

/**
 * Upload a pet photo (from File/Buffer) to Supabase Storage.
 * Returns { url, path } where url is the public URL.
 */
export async function uploadPetPhoto(
  projectId: string,
  petId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string = 'image/jpeg'
): Promise<{ url: string; path: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const path = `${projectId}/${petId}/${Date.now()}-${fileName}`

  const { error } = await getSupabase().storage
    .from('pet-photos')
    .upload(path, fileBuffer, {
      contentType,
      upsert: false,
    })

  if (error) throw new Error(`Failed to upload pet photo: ${error.message}`)

  const url = `${supabaseUrl}/storage/v1/object/public/pet-photos/${path}`
  return { url, path }
}

/**
 * Upload a generated calendar image (from base64) to Supabase Storage.
 * Returns { url, path } where url is the public URL.
 */
export async function uploadGeneratedImage(
  projectId: string,
  pageType: string,
  monthNumber: number | null,
  base64Data: string
): Promise<{ url: string; path: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const buffer = Buffer.from(base64Data, 'base64')
  const filename = monthNumber
    ? `month-${monthNumber}.png`
    : `${pageType}.png`
  const path = `${projectId}/${Date.now()}-${filename}`

  const { error } = await getSupabase().storage
    .from('generated-images')
    .upload(path, buffer, {
      contentType: 'image/png',
      upsert: false,
    })

  if (error) throw new Error(`Failed to upload generated image: ${error.message}`)

  const url = `${supabaseUrl}/storage/v1/object/public/generated-images/${path}`
  return { url, path }
}
