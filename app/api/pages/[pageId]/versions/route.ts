import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params
  const supabase = createAdminSupabaseClient()

  const { data: versions, error } = await supabase
    .from('page_versions')
    .select('*')
    .eq('calendar_page_id', pageId)
    .order('version_number', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(versions ?? [])
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params
  const { version_id } = await request.json()

  if (!version_id) {
    return NextResponse.json({ error: 'version_id is required' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()

  // Get the version to select
  const { data: version, error: verError } = await supabase
    .from('page_versions')
    .select('*')
    .eq('id', version_id)
    .eq('calendar_page_id', pageId)
    .single()

  if (verError || !version) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 })
  }

  // Deselect all versions for this page
  await supabase
    .from('page_versions')
    .update({ is_selected: false })
    .eq('calendar_page_id', pageId)

  // Select the chosen version
  await supabase
    .from('page_versions')
    .update({ is_selected: true })
    .eq('id', version_id)

  // Update parent calendar_pages to match
  await supabase
    .from('calendar_pages')
    .update({
      cloudinary_url: version.image_url,
      cloudinary_public_id: version.image_path,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  return NextResponse.json({ status: 'ok', cloudinary_url: version.image_url })
}
