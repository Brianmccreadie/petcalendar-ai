import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { uploadPetPhoto } from '@/lib/storage'

export const maxDuration = 60

// Upload a single pet photo
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const projectId = formData.get('project_id') as string
    const petId = formData.get('pet_id') as string
    const photoFile = formData.get('photo') as File

    if (!projectId || !petId || !photoFile) {
      return NextResponse.json({ error: 'project_id, pet_id, and photo are required' }, { status: 400 })
    }

    const buffer = Buffer.from(await photoFile.arrayBuffer())
    const { url, path } = await uploadPetPhoto(
      projectId,
      petId,
      photoFile.name,
      buffer,
      photoFile.type || 'image/jpeg'
    )

    const supabase = createAdminSupabaseClient()
    await supabase.from('pet_photos').insert({
      project_id: projectId,
      pet_id: petId,
      cloudinary_url: url,
      cloudinary_public_id: path,
      original_filename: photoFile.name,
    })

    return NextResponse.json({ url, path })
  } catch (error) {
    console.error('Upload photo error:', error)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}
