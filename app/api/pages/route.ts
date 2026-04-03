import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')

  if (!projectId) {
    return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()

  // Verify project exists
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const { data: pages, error } = await supabase
    .from('calendar_pages')
    .select('*')
    .eq('project_id', projectId)
    .order('page_type', { ascending: true })
    .order('month_number', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(pages || [])
}
