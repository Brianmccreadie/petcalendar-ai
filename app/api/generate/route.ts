import { NextResponse, after } from 'next/server'
import { jsonError, readJson } from '@/lib/api'
import { calendarYearOptions } from '@/lib/config'
import { generateCalendar } from '@/lib/generation'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isStyleId, isUuid } from '@/lib/validate'

// Generation continues in after() once the response is sent, so give it room.
export const maxDuration = 800

const ACTIVE_WINDOW_MS = 12 * 60 * 1000

export async function POST(request: Request) {
  try {
    const body = await readJson<{ project_id?: unknown; style?: unknown; startYear?: unknown; retryFailed?: unknown }>(request)
    const projectId = body?.project_id
    if (!isUuid(projectId)) return jsonError('project_id is required.', 400)
    if (body?.style !== undefined && !isStyleId(body.style)) return jsonError('Unknown theme.', 400)

    const supabase = createAdminSupabaseClient()
    const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).maybeSingle()
    if (!project) return jsonError('Calendar not found.', 404)
    if (project.status === 'ordered') return jsonError('This calendar has already been ordered.', 409)

    // A run is already in flight — don't start (and pay for) a second one.
    const recentlyActive = Date.now() - new Date(project.updated_at).getTime() < ACTIVE_WINDOW_MS
    if (project.status === 'generating' && recentlyActive) {
      return NextResponse.json({ status: 'generating', project_id: projectId })
    }

    const { count: photoCount } = await supabase
      .from('pet_photos')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
    if (!photoCount) return jsonError('Upload at least one photo first.', 400)

    const year = Number(body?.startYear)
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    const styleChanged = isStyleId(body?.style) && body.style !== project.style
    if (isStyleId(body?.style)) updates.style = body.style
    if (calendarYearOptions().includes(year)) updates.start_year = year

    const { count: pageCount } = await supabase
      .from('calendar_pages')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)

    // Same theme and pages already exist → only fill in what's missing or failed.
    const onlyIncomplete = !styleChanged && (pageCount ?? 0) > 0
    if (onlyIncomplete && !body?.retryFailed) {
      const { count: unfinished } = await supabase
        .from('calendar_pages')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .neq('status', 'complete')
      if (!unfinished && (pageCount ?? 0) >= 13) {
        await supabase.from('projects').update(updates).eq('id', projectId)
        return NextResponse.json({ status: 'preview', project_id: projectId })
      }
    }

    await supabase.from('projects').update({ ...updates, status: 'generating' }).eq('id', projectId)

    after(async () => {
      try {
        await generateCalendar(projectId, { onlyIncomplete })
      } catch (error) {
        console.error('[generate] run failed:', error)
        await supabase.from('projects').update({ status: 'preview', updated_at: new Date().toISOString() }).eq('id', projectId)
      }
    })

    return NextResponse.json({ status: 'generating', project_id: projectId })
  } catch (error) {
    console.error('generate error:', error)
    return jsonError('Could not start generation. Please try again.', 500)
  }
}
