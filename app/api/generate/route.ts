import { NextResponse } from 'next/server'
import { after } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { generateCalendarImages } from '@/lib/gemini'
import type { PetWithPhotos } from '@/lib/gemini'
import type { StyleId } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { project_id, style, startYear } = await request.json()
    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    // Update style/year if provided (called from the style page)
    if (style || startYear) {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (style) updates.style = style
      if (startYear) updates.start_year = startYear
      await supabase.from('projects').update(updates).eq('id', project_id)
    }

    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single()

    if (projError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch pets for this project
    const { data: pets } = await supabase
      .from('pets')
      .select('*')
      .eq('project_id', project_id)
      .order('sort_order', { ascending: true })

    if (!pets || pets.length === 0) {
      return NextResponse.json(
        { error: 'No pets found for this project' },
        { status: 400 }
      )
    }

    // Fetch photos for each pet
    const petsWithPhotos: PetWithPhotos[] = []
    for (const pet of pets) {
      const { data: photos } = await supabase
        .from('pet_photos')
        .select('*')
        .eq('pet_id', pet.id)
        .order('created_at', { ascending: true })

      if (photos && photos.length > 0) {
        petsWithPhotos.push({ pet, photos })
      }
    }

    if (petsWithPhotos.length === 0) {
      return NextResponse.json(
        { error: 'No photos found for any pet' },
        { status: 400 }
      )
    }

    // Use after() to keep the serverless function alive after responding.
    // This lets us return immediately so the user sees the preview page,
    // while generation continues in the background with the full 800s timeout.
    after(async () => {
      try {
        await generateCalendarImages(project, petsWithPhotos, project.style as StyleId)
      } catch (err) {
        console.error('Generation failed:', err)
      }
    })

    return NextResponse.json({ status: 'generating', project_id })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
