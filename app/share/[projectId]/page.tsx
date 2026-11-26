/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import CopyLinkButton from '@/components/CopyLinkButton'
import CalendarFlipbook from '@/components/calendar/CalendarFlipbook'
import { ArrowRight, Play } from '@/components/icons'
import { coverTitle, joinPetNames, possessive } from '@/lib/calendar/layout'
import { styleById } from '@/lib/style-meta'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { resolveSharedProject, shareToken } from '@/lib/share'

export const dynamic = 'force-dynamic'

// A public, interactive mock-up of one finished calendar. The link is the
// project's unguessable id, the same as the review page and the reveal film.
const loadCalendar = cache(async (token: string) => {
  const projectId = resolveSharedProject(token)
  if (!projectId) return null
  const supabase = createAdminSupabaseClient()
  const [{ data: project }, { data: pets }, { data: pages }, { data: photos }] = await Promise.all([
    supabase.from('projects').select('id, style, start_year, pet_name, pet_type').eq('id', projectId).maybeSingle(),
    supabase.from('pets').select('name').eq('project_id', projectId).order('sort_order'),
    supabase.from('calendar_pages').select('page_type, month_number, cloudinary_url, status').eq('project_id', projectId).eq('status', 'complete'),
    supabase.from('pet_photos').select('id, cloudinary_url, created_at').eq('project_id', projectId).order('created_at').limit(6),
  ])
  if (!project) return null

  const cover = pages?.find((p) => p.page_type === 'cover')?.cloudinary_url as string | undefined
  const months = Array.from({ length: 12 }, (_, i) => pages?.find((p) => p.page_type === 'month' && p.month_number === i + 1)?.cloudinary_url as string | undefined)
  const names = (pets ?? []).map((p) => p.name).filter(Boolean)
  return {
    project,
    names: names.length ? names : [project.pet_name || 'Your Pet'],
    style: styleById(project.style),
    cover,
    months,
    finished: Boolean(cover) && months.every(Boolean),
    photos: (photos ?? []).map((p) => ({ id: p.id as string, url: p.cloudinary_url as string })),
  }
})

export async function generateMetadata(props: PageProps<'/share/[projectId]'>): Promise<Metadata> {
  const { projectId } = await props.params
  const calendar = await loadCalendar(projectId)
  if (!calendar) return { title: 'Calendar', robots: { index: false } }
  const title = `${coverTitle(calendar.names, calendar.project.start_year)} calendar`
  const description = `Flip through ${possessive(joinPetNames(calendar.names))} ${calendar.project.start_year} wall calendar${calendar.style ? ` — the ${calendar.style.name} edition` : ''}.`
  return {
    title,
    description,
    robots: { index: false },
    openGraph: { title, description, images: calendar.cover ? [{ url: calendar.cover }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: calendar.cover ? [calendar.cover] : undefined },
  }
}

export default async function SharePage(props: PageProps<'/share/[projectId]'>) {
  const { projectId } = await props.params
  const calendar = await loadCalendar(projectId)
  if (!calendar) notFound()
  const { project, names, style, photos } = calendar
  const who = joinPetNames(names)

  return (
    <div className="bg-gradient-to-b from-paper-deep via-paper to-[#fdeef3]">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <header className="text-center">
          <p className="eyebrow">{style ? `The ${style.name} edition` : 'A custom wall calendar'}</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">
            {possessive(who)} {project.start_year}
          </h1>
          <p className="lede mx-auto mt-4 max-w-xl">Twelve months of {who}. Open it up and turn the pages.</p>
          <div className="mt-6">
            <CopyLinkButton title={`${possessive(who)} ${project.start_year} calendar`} />
          </div>
        </header>

        {calendar.finished ? (
          <div className="mt-14">
            <CalendarFlipbook
              petNames={names}
              petType={project.pet_type}
              styleName={style?.name ?? ''}
              year={project.start_year}
              accent={style?.accentColor}
              caption={`${who} · ${style?.name ?? ''}`}
              cover={calendar.cover as string}
              months={calendar.months as string[]}
              photos={photos.map((photo) => photo.url)}
            />
          </div>
        ) : (
          <p className="mx-auto mt-16 max-w-md rounded-2xl bg-card p-8 text-center text-ink-soft shadow-lift">
            This calendar is still being made. Check back in a few minutes.
          </p>
        )}

        {photos.length > 0 && (
          <section className="mx-auto mt-20 max-w-xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              It all started with {photos.length === 1 ? 'this photo' : 'these photos'}
            </h2>
            <ul className="mt-5 flex flex-wrap justify-center gap-3">
              {photos.map((photo, i) => (
                <li key={photo.id} className={`w-24 rounded-[4px] bg-white p-1.5 pb-5 shadow-lift ${i % 2 ? 'rotate-2' : '-rotate-2'}`}>
                  <img src={photo.url} alt={`Photo of ${who}`} className="aspect-square w-full object-cover" loading="lazy" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto mt-20 max-w-xl rounded-[1.25rem] bg-night p-8 text-center text-ivory sm:p-12">
          <h2 className="font-display text-4xl sm:text-5xl">Make one for your pet.</h2>
          <p className="mx-auto mt-3 max-w-sm text-ivory/70">Upload a few photos, pick a theme, and preview the whole year for free.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/create" className="btn btn-light">
              Make your calendar <ArrowRight size={18} />
            </Link>
            {calendar.finished && (
              <Link href={`/reveal/${shareToken(project.id)}`} className="btn btn-outline">
                <Play size={14} /> Watch the film
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
