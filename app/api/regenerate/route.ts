import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generatePetImage } from '@/lib/gemini'
import { uploadImage } from '@/lib/cloudinary'
import type { StyleId } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { calendar_page_id } = await request.json()
    if (!calendar_page_id) {
      return NextResponse.json(
        { error: 'calendar_page_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the calendar page
    const { data: page, error: pageError } = await supabase
      .from('calendar_pages')
      .select('*, projects!inner(user_id, pet_name, pet_type, style)')
      .eq('id', calendar_page_id)
      .single()

    if (pageError || !page) {
      return NextResponse.json(
        { error: 'Calendar page not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (page.projects.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (page.generation_attempts >= 3) {
      return NextResponse.json(
        { error: 'Maximum regeneration attempts reached' },
        { status: 400 }
      )
    }

    // Fetch a reference photo
    const { data: photos } = await supabase
      .from('pet_photos')
      .select('*')
      .eq('project_id', page.project_id)
      .limit(1)

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No reference photos found' },
        { status: 400 }
      )
    }

    // Update status to generating
    await supabase
      .from('calendar_pages')
      .update({
        status: 'generating',
        generation_attempts: page.generation_attempts + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', calendar_page_id)

    try {
      const base64Image = await generatePetImage(
        photos[0].cloudinary_url,
        page.prompt
      )

      const folder = `petcalendar/${page.project_id}/${page.projects.style}`
      const uploadResult = await uploadImage(base64Image, folder)

      await supabase
        .from('calendar_pages')
        .update({
          cloudinary_url: uploadResult.secure_url,
          cloudinary_public_id: uploadResult.public_id,
          status: 'complete',
          updated_at: new Date().toISOString(),
        })
        .eq('id', calendar_page_id)

      return NextResponse.json({
        status: 'complete',
        cloudinary_url: uploadResult.secure_url,
      })
    } catch (genError) {
      console.error('Regeneration failed:', genError)
      await supabase
        .from('calendar_pages')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', calendar_page_id)

      return NextResponse.json(
        { error: 'Image generation failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Regenerate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
