import { NextRequest } from 'next/server'
import { jsonError } from '@/lib/api'
import { coverSubtitle, coverTitle } from '@/lib/calendar/layout'
import { SITE } from '@/lib/config'
import { buildRevealComposition } from '@/lib/reveal/composition'
import { styleById } from '@/lib/style-meta'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { resolveSharedProject } from '@/lib/share'

// Serves the HyperFrames composition (plain HTML + GSAP timeline) for a calendar.
// Played in-page by <hyperframes-player>, or rendered to MP4 by scripts/render-reveal.mjs.
export async function GET(request: NextRequest, ctx: RouteContext<'/reveal/[projectId]/composition'>) {
  const projectId = resolveSharedProject((await ctx.params).projectId)
  if (!projectId) return jsonError('Calendar not found.', 404)

  const supabase = createAdminSupabaseClient()
  const [{ data: project }, { data: pets }, { data: pages }, { data: photos }] = await Promise.all([
    supabase.from('projects').select('id, style, start_year, pet_name').eq('id', projectId).maybeSingle(),
    supabase.from('pets').select('name').eq('project_id', projectId).order('sort_order'),
    supabase.from('calendar_pages').select('page_type, month_number, cloudinary_url, status').eq('project_id', projectId).eq('status', 'complete'),
    supabase.from('pet_photos').select('cloudinary_url, created_at').eq('project_id', projectId).order('created_at').limit(5),
  ])
  if (!project) return jsonError('Calendar not found.', 404)

  const cover = pages?.find((p) => p.page_type === 'cover')?.cloudinary_url
  const months = Array.from({ length: 12 }, (_, i) => pages?.find((p) => p.page_type === 'month' && p.month_number === i + 1)?.cloudinary_url)
  if (!cover || months.some((m) => !m)) return jsonError('This calendar is not finished yet.', 409)

  const style = styleById(project.style)
  const names = (pets ?? []).map((p) => p.name).filter(Boolean)
  // The render script copies the fonts next to the composition and asks for relative URLs.
  const local = request.nextUrl.searchParams.get('fonts') === 'assets'
  const fontBase = local ? 'assets' : `${request.nextUrl.origin}/fonts`
  const gsapUrl = local ? 'assets/gsap.min.js' : `${request.nextUrl.origin}/vendor/gsap.min.js`

  const html = buildRevealComposition({
    title: coverTitle(names.length ? names : [project.pet_name || 'Your Pet'], project.start_year),
    subtitle: coverSubtitle(style?.name ?? 'Custom').split(' · ')[0],
    year: project.start_year,
    accent: '#c9a45c',
    coverUrl: cover,
    monthUrls: months as string[],
    referenceUrls: (photos ?? []).map((p) => p.cloudinary_url).filter(Boolean),
    fontBase,
    gsapUrl,
    siteLabel: new URL(SITE.url).host.replace(/^www\./, '') || 'petcalendar.ai',
  })

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
