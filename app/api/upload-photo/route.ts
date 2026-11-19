import { NextResponse } from 'next/server'
import { jsonError } from '@/lib/api'
import { LIMITS } from '@/lib/config'
import { normalisePetPhoto } from '@/lib/images'
import { uploadPetPhoto } from '@/lib/storage'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isUuid, sniffImageMime } from '@/lib/validate'

export const maxDuration = 60

// Upload a single pet photo (the client converts HEIC to JPEG first).
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const projectId = formData.get('project_id')
    const petId = formData.get('pet_id')
    const file = formData.get('photo')

    if (!isUuid(projectId) || !isUuid(petId) || !(file instanceof File)) {
      return jsonError('project_id, pet_id and photo are required.', 400)
    }
    if (file.size > LIMITS.maxPhotoBytes) return jsonError('That photo is too large (12 MB max).', 413)

    const supabase = createAdminSupabaseClient()
    const { data: pet } = await supabase.from('pets').select('id, project_id').eq('id', petId).maybeSingle()
    if (!pet || pet.project_id !== projectId) return jsonError('Pet not found.', 404)

    const { count } = await supabase.from('pet_photos').select('id', { count: 'exact', head: true }).eq('pet_id', petId)
    if ((count ?? 0) >= LIMITS.maxPhotosPerPet + LIMITS.maxRevisionsPerPage) {
      return jsonError('This pet already has the maximum number of photos.', 400)
    }

    const raw = Buffer.from(await file.arrayBuffer())
    if (!sniffImageMime(raw)) return jsonError('Please upload a JPG, PNG or WebP photo.', 415)

    let photo
    try {
      photo = await normalisePetPhoto(raw)
    } catch {
      return jsonError('We could not read that image. Try a different photo.', 415)
    }

    const { url, path } = await uploadPetPhoto(projectId, petId, photo.data, photo.mimeType)
    const { error } = await supabase.from('pet_photos').insert({
      project_id: projectId,
      pet_id: petId,
      cloudinary_url: url,
      cloudinary_public_id: path,
      original_filename: file.name.slice(0, 200),
      width: photo.width,
      height: photo.height,
    })
    if (error) {
      console.error('upload-photo: insert failed', error)
      return jsonError('Could not save that photo. Please try again.', 500)
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error('upload-photo error:', error)
    return jsonError('Upload failed. Please try again.', 500)
  }
}
