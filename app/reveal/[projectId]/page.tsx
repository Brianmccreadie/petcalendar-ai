import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CopyLinkButton from '@/components/CopyLinkButton'
import RevealPlayer from '@/components/RevealPlayer'
import { ArrowRight } from '@/components/icons'
import { joinPetNames, possessive } from '@/lib/calendar/layout'
import { REVEAL } from '@/lib/reveal/composition'
import { resolveSharedProject, shareToken } from '@/lib/share'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// The short film of a finished calendar: the customer's photos, then the year.
// Public by share token, so it can be sent to friends without exposing the editor.
async function load(value: string) {
  const projectId = resolveSharedProject(value)
  if (!projectId) return null
  const supabase = createAdminSupabaseClient()
  const [{ data: project }, { data: pets }, { data: cover }] = await Promise.all([
    supabase.from('projects').select('id, start_year, pet_name').eq('id', projectId).maybeSingle(),
    supabase.from('pets').select('name').eq('project_id', projectId).order('sort_order'),
    supabase.from('calendar_pages').select('cloudinary_url').eq('project_id', projectId).eq('page_type', 'cover').eq('status', 'complete').maybeSingle(),
  ])
  if (!project) return null
  const names = (pets ?? []).map((p) => p.name).filter(Boolean)
  return {
    token: shareToken(project.id),
    who: joinPetNames(names.length ? names : [project.pet_name || 'Your Pet']),
    year: project.start_year as number,
    cover: (cover?.cloudinary_url as string | undefined) ?? null,
  }
}

export async function generateMetadata(props: PageProps<'/reveal/[projectId]'>): Promise<Metadata> {
  const film = await load((await props.params).projectId)
  if (!film) return { title: 'Calendar film', robots: { index: false } }
  const title = `${possessive(film.who)} ${film.year} calendar — the film`
  const description = `A short film of ${possessive(film.who)} ${film.year} wall calendar.`
  return {
    title,
    description,
    robots: { index: false },
    openGraph: { title, description, images: film.cover ? [{ url: film.cover }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: film.cover ? [film.cover] : undefined },
  }
}

export default async function RevealPage(props: PageProps<'/reveal/[projectId]'>) {
  const film = await load((await props.params).projectId)
  if (!film) notFound()

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="eyebrow">The film</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">
        {possessive(film.who)} {film.year}
      </h1>
      <p className="lede mt-3 max-w-2xl">From a few photos to twelve months, in under half a minute.</p>

      <div className="mt-8 overflow-hidden rounded-[6px] bg-ink shadow-lift">
        <RevealPlayer src={`/reveal/${film.token}/composition`} width={REVEAL.width} height={REVEAL.height} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CopyLinkButton title={`${possessive(film.who)} ${film.year} calendar`} />
        <Link href={`/share/${film.token}`} className="btn btn-ghost btn-sm">
          Flip through the calendar <ArrowRight size={16} />
        </Link>
        <Link href="/create" className="btn btn-quiet btn-sm">
          Make one for your pet
        </Link>
      </div>
    </div>
  )
}
