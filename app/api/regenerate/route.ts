import { NextResponse } from 'next/server'
import { ImageGenerationError } from '@/lib/ai'
import { jsonError, readJson } from '@/lib/api'
import { LIMITS } from '@/lib/config'
import { NotFoundError, RevisionLimitError, regeneratePage } from '@/lib/generation'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { cleanInstruction, isUuid, sniffImageMime } from '@/lib/validate'

export const maxDuration = 300

// Redo a page from scratch, or revise it with instructions and/or a better photo.
export async function POST(request: Request) {
  try {
    let pageId: unknown
    let instructions = ''
    let newReference: Buffer | null = null

    if ((request.headers.get('content-type') || '').includes('multipart/form-data')) {
      const form = await request.formData()
      pageId = form.get('calendar_page_id')
      instructions = cleanInstruction(form.get('custom_instructions'), LIMITS.maxInstructionLength)
      const file = form.get('new_reference')
      if (file instanceof File && file.size > 0) {
        if (file.size > LIMITS.maxPhotoBytes) return jsonError('That photo is too large (12 MB max).', 413)
        const bytes = Buffer.from(await file.arrayBuffer())
        if (!sniffImageMime(bytes)) return jsonError('Please upload a JPG, PNG or WebP photo.', 415)
        newReference = bytes
      }
    } else {
      const body = await readJson<{ calendar_page_id?: unknown; custom_instructions?: unknown }>(request)
      pageId = body?.calendar_page_id
      instructions = cleanInstruction(body?.custom_instructions, LIMITS.maxInstructionLength)
    }

    if (!isUuid(pageId)) return jsonError('calendar_page_id is required.', 400)

    const supabase = createAdminSupabaseClient()
    const { data: page } = await supabase
      .from('calendar_pages')
      .select('id, status, updated_at, projects!inner(status)')
      .eq('id', pageId)
      .maybeSingle()
    if (!page) return jsonError('Page not found.', 404)
    const projectStatus = (page.projects as unknown as { status: string }).status
    if (projectStatus === 'ordered') return jsonError('This calendar has already been ordered.', 409)
    const busy =
      page.status === 'generating' && Date.now() - new Date(page.updated_at).getTime() < LIMITS.staleGenerationMs
    if (busy) return jsonError('This page is already being generated.', 409)

    const { url } = await regeneratePage(pageId, { instructions, newReference })
    return NextResponse.json({ status: 'complete', cloudinary_url: url })
  } catch (error) {
    if (error instanceof RevisionLimitError) return jsonError(error.message, 429)
    if (error instanceof NotFoundError) return jsonError(error.message, 404)
    if (error instanceof ImageGenerationError && error.kind === 'blocked') {
      return jsonError('That request was declined by the image model. Try rewording it.', 422)
    }
    console.error('regenerate error:', error)
    return jsonError('We could not create that image. Please try again.', 500)
  }
}
