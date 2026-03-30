import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateCalendarImages } from '@/lib/gemini'
import type { StyleId } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { project_id } = await request.json()
    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Verify the user owns this project
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (projError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch pet photos
    const { data: photos, error: photoError } = await supabase
      .from('pet_photos')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true })

    if (photoError || !photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos found for this project' },
        { status: 400 }
      )
    }

    // Kick off generation (runs in background-ish — we don't await completion)
    generateCalendarImages(project, photos, project.style as StyleId).catch(
      (err) => console.error('Generation failed:', err)
    )

    return NextResponse.json({ status: 'generating', project_id })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
