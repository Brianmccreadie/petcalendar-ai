import { NextRequest, NextResponse } from 'next/server'
import { jsonError } from '@/lib/api'
import { LIMITS } from '@/lib/config'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import type { CalendarPage } from '@/lib/types'
import { isUuid } from '@/lib/validate'

// Everything the preview, checkout and "my calendars" screens need for one project.
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('project_id')
  if (!isUuid(projectId)) return jsonError('project_id is required.', 400)

  const supabase = createAdminSupabaseClient()
  const [{ data: project }, { data: pets }, { data: pageRows, error }, { data: versions }, { data: photoRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, style, status, start_year, multi_pet_mode, pet_name, pet_type, created_at, updated_at')
      .eq('id', projectId)
      .maybeSingle(),
    supabase.from('pets').select('id, name, pet_type, sort_order').eq('project_id', projectId).order('sort_order'),
    supabase.from('calendar_pages').select('*').eq('project_id', projectId),
    supabase.from('page_versions').select('calendar_page_id').eq('project_id', projectId),
    supabase.from('pet_photos').select('id, pet_id, cloudinary_url, created_at').eq('project_id', projectId).order('created_at'),
  ])

  if (!project) return jsonError('Calendar not found.', 404)
  if (error) return jsonError('Could not load pages.', 500)

  const now = Date.now()
  const stale: string[] = []
  const versionCounts = new Map<string, number>()
  for (const v of versions ?? []) versionCounts.set(v.calendar_page_id, (versionCounts.get(v.calendar_page_id) ?? 0) + 1)

  const pages = ((pageRows ?? []) as CalendarPage[]).map((page) => {
    // A serverless function that timed out leaves rows stuck in "generating".
    const stuck =
      (page.status === 'generating' || (page.status === 'pending' && project.status !== 'generating')) &&
      now - new Date(page.updated_at).getTime() > LIMITS.staleGenerationMs
    if (stuck) stale.push(page.id)
    const versionCount = versionCounts.get(page.id) ?? 0
    return {
      id: page.id,
      page_type: page.page_type,
      month_number: page.month_number,
      pet_id: page.pet_id,
      image_url: page.cloudinary_url,
      status: stuck ? (page.cloudinary_url ? 'complete' : 'failed') : page.status,
      version_count: versionCount,
      revisions_left: Math.max(0, 1 + LIMITS.maxRevisionsPerPage - Math.max(1, versionCount)),
    }
  })

  if (stale.length > 0) {
    await supabase
      .from('calendar_pages')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .in('id', stale)
      .is('cloudinary_url', null)
    await supabase
      .from('calendar_pages')
      .update({ status: 'complete', updated_at: new Date().toISOString() })
      .in('id', stale)
      .not('cloudinary_url', 'is', null)
  }

  pages.sort((a, b) => (a.month_number ?? 0) - (b.month_number ?? 0))
  const photos = (photoRows ?? []).map((p) => ({ id: p.id, pet_id: p.pet_id, url: p.cloudinary_url }))
  return NextResponse.json({ project, pets: pets ?? [], pages, photos }, { headers: { 'Cache-Control': 'no-store' } })
}
