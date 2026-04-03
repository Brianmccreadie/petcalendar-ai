import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { generatePetImage, iteratePetImage } from '@/lib/gemini'
import { uploadGeneratedImage, uploadPetPhoto } from '@/lib/storage'

export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    let calendarPageId: string
    let customInstructions: string | null = null
    let newReferenceBase64: string | undefined
    let newReferenceFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Iterate with optional new reference image
      const formData = await request.formData()
      calendarPageId = formData.get('calendar_page_id') as string
      customInstructions = formData.get('custom_instructions') as string | null
      const refFile = formData.get('new_reference')
      if (refFile && refFile instanceof File) {
        newReferenceFile = refFile
        const buffer = Buffer.from(await refFile.arrayBuffer())
        newReferenceBase64 = buffer.toString('base64')
      }
    } else {
      // Simple redo (JSON body)
      const body = await request.json()
      calendarPageId = body.calendar_page_id
      customInstructions = body.custom_instructions || null
    }

    if (!calendarPageId) {
      return NextResponse.json({ error: 'calendar_page_id is required' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()

    // Fetch the calendar page with project info
    const { data: page, error: pageError } = await supabase
      .from('calendar_pages')
      .select('*, projects!inner(style)')
      .eq('id', calendarPageId)
      .single()

    if (pageError || !page) {
      return NextResponse.json({ error: 'Calendar page not found' }, { status: 404 })
    }

    // Fetch original pet reference photo
    const { data: photos } = await supabase
      .from('pet_photos')
      .select('*')
      .eq('project_id', page.project_id)
      .limit(1)

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: 'No reference photos found' }, { status: 400 })
    }

    // If a new reference photo was uploaded, save it as a pet photo too
    if (newReferenceFile && newReferenceBase64) {
      try {
        const buffer = Buffer.from(newReferenceBase64, 'base64')
        const { url, path } = await uploadPetPhoto(
          page.project_id,
          photos[0].pet_id || page.project_id,
          newReferenceFile.name,
          buffer,
          newReferenceFile.type || 'image/jpeg'
        )
        // Save as a new pet photo so future generations use it too
        await supabase.from('pet_photos').insert({
          project_id: page.project_id,
          pet_id: photos[0].pet_id,
          cloudinary_url: url,
          cloudinary_public_id: path,
          original_filename: newReferenceFile.name,
        })
      } catch (e) {
        console.error('Failed to save new reference photo:', e)
      }
    }

    // Update status to generating
    await supabase
      .from('calendar_pages')
      .update({
        status: 'generating',
        generation_attempts: page.generation_attempts + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', calendarPageId)

    try {
      let base64Image: string

      if (customInstructions && page.cloudinary_url) {
        // ITERATE: use previous generation + pet photo + optional new reference
        base64Image = await iteratePetImage(
          photos[0].cloudinary_url,
          page.cloudinary_url,
          page.prompt,
          customInstructions,
          newReferenceBase64,
        )
      } else {
        // REDO: fresh generation from pet photo
        base64Image = await generatePetImage(
          newReferenceBase64
            ? `data:image/jpeg;base64,${newReferenceBase64}`
            : photos[0].cloudinary_url,
          page.prompt
        )
      }

      const { url, path } = await uploadGeneratedImage(
        page.project_id,
        page.page_type,
        page.month_number,
        base64Image
      )

      await supabase
        .from('calendar_pages')
        .update({
          cloudinary_url: url,
          cloudinary_public_id: path,
          status: 'complete',
          updated_at: new Date().toISOString(),
        })
        .eq('id', calendarPageId)

      // Save version history
      await supabase
        .from('page_versions')
        .update({ is_selected: false })
        .eq('calendar_page_id', calendarPageId)

      const { data: maxVer } = await supabase
        .from('page_versions')
        .select('version_number')
        .eq('calendar_page_id', calendarPageId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()

      await supabase.from('page_versions').insert({
        calendar_page_id: calendarPageId,
        project_id: page.project_id,
        image_url: url,
        image_path: path,
        custom_instructions: customInstructions || null,
        is_selected: true,
        version_number: (maxVer?.version_number ?? 0) + 1,
      })

      return NextResponse.json({ status: 'complete', cloudinary_url: url })
    } catch (genError) {
      console.error('Regeneration failed:', genError)
      await supabase
        .from('calendar_pages')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', calendarPageId)

      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Regenerate API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
