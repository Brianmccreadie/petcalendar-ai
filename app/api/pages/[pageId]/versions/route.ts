import { NextResponse } from 'next/server'
import { jsonError, readJson } from '@/lib/api'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { isUuid } from '@/lib/validate'

export async function GET(_request: Request, ctx: RouteContext<'/api/pages/[pageId]/versions'>) {
  const { pageId } = await ctx.params
  if (!isUuid(pageId)) return jsonError('Invalid page id.', 400)

  const { data, error } = await createAdminSupabaseClient()
    .from('page_versions')
    .select('id, image_url, custom_instructions, is_selected, version_number, created_at')
    .eq('calendar_page_id', pageId)
    .order('version_number', { ascending: true })
  if (error) return jsonError('Could not load versions.', 500)

  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } })
}

// Choose which version of a page goes to print.
export async function PATCH(request: Request, ctx: RouteContext<'/api/pages/[pageId]/versions'>) {
  const { pageId } = await ctx.params
  const body = await readJson<{ version_id?: unknown }>(request)
  if (!isUuid(pageId) || !isUuid(body?.version_id)) return jsonError('version_id is required.', 400)

  const supabase = createAdminSupabaseClient()
  const { data: version } = await supabase
    .from('page_versions')
    .select('id, image_url, image_path, project_id, projects!inner(status)')
    .eq('id', body.version_id)
    .eq('calendar_page_id', pageId)
    .maybeSingle()
  if (!version) return jsonError('Version not found.', 404)
  if ((version.projects as unknown as { status: string }).status === 'ordered') {
    return jsonError('This calendar has already been ordered.', 409)
  }

  await supabase.from('page_versions').update({ is_selected: false }).eq('calendar_page_id', pageId)
  await supabase.from('page_versions').update({ is_selected: true }).eq('id', version.id)
  await supabase
    .from('calendar_pages')
    .update({
      cloudinary_url: version.image_url,
      cloudinary_public_id: version.image_path,
      status: 'complete',
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  return NextResponse.json({ status: 'ok', image_url: version.image_url })
}
