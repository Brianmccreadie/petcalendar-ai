import { alertOwner } from './alerts'
import { SITE } from './config'
import {
  buildRevisionPrompt,
  buildScenePrompt,
  describeImageConfig,
  generateImage,
  petReference,
  previousRenderReference,
  shotDirection,
  type PetSubject,
  type ReferenceImage,
} from './ai'
import { IMAGE_CONCURRENCY } from './ai/config'
import { petIndexForMonth } from './calendar/layout'
import { LIMITS } from './config'
import { normaliseGeneratedImage, normalisePetPhoto } from './images'
import { describeSubjects, getCoverPrompt, getPromptForMonth } from './prompts'
import { fetchStoredImage, uploadGeneratedImage, uploadPetPhoto } from './storage'
import { createAdminSupabaseClient } from './supabase-admin'
import type { CalendarPage, Pet, PetPhoto, Project, StyleId } from './types'

export interface PetWithPhotos {
  pet: Pet
  photos: PetPhoto[]
}

export interface ProjectContext {
  project: Project
  pets: PetWithPhotos[]
}

interface PagePlan {
  pageType: 'cover' | 'month'
  month: number | null
  /** Pets that appear on this page. */
  subjects: PetWithPhotos[]
  scene: string
}

export class RevisionLimitError extends Error {}
export class NotFoundError extends Error {}

const MAX_REFS_SINGLE = 3
const MAX_REFS_PER_PET_GROUP = 2

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export async function loadProjectContext(projectId: string): Promise<ProjectContext | null> {
  const supabase = createAdminSupabaseClient()
  const [{ data: project }, { data: pets }, { data: photos }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).maybeSingle(),
    supabase.from('pets').select('*').eq('project_id', projectId).order('sort_order', { ascending: true }),
    supabase.from('pet_photos').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),
  ])
  if (!project) return null

  const withPhotos: PetWithPhotos[] = ((pets ?? []) as Pet[])
    .map((pet) => ({ pet, photos: ((photos ?? []) as PetPhoto[]).filter((p) => p.pet_id === pet.id) }))
    .filter((p) => p.photos.length > 0)

  return { project: project as Project, pets: withPhotos }
}

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

function toSubject(p: PetWithPhotos): PetSubject {
  return { name: p.pet.name, petType: p.pet.pet_type }
}

function planPages(ctx: ProjectContext, style: StyleId): PagePlan[] {
  const together = ctx.project.multi_pet_mode === 'together' && ctx.pets.length > 1
  const everyone = ctx.pets
  const plans: PagePlan[] = [
    // The cover always shows the whole cast — it carries all their names.
    {
      pageType: 'cover',
      month: null,
      subjects: everyone,
      scene: getCoverPrompt(style, describeSubjects(everyone.map(toSubject))),
    },
  ]
  for (let month = 1; month <= 12; month++) {
    const subjects = together ? everyone : [everyone[petIndexForMonth(month, everyone.length)]]
    plans.push({
      pageType: 'month',
      month,
      subjects,
      scene: getPromptForMonth(style, month, describeSubjects(subjects.map(toSubject))),
    })
  }
  return plans
}

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

type ImageCache = Map<string, Promise<{ data: Buffer; mimeType: string }>>

function cachedFetch(cache: ImageCache, url: string) {
  let hit = cache.get(url)
  if (!hit) {
    hit = fetchStoredImage(url)
    cache.set(url, hit)
  }
  return hit
}

/**
 * Pick reference photos for a page. The first upload is always included (people
 * lead with their best photo); the rest rotate by month so every photo gets used.
 */
async function collectReferences(
  subjects: PetWithPhotos[],
  rotation: number,
  cache: ImageCache
): Promise<ReferenceImage[]> {
  const perPet = subjects.length === 1 ? MAX_REFS_SINGLE : MAX_REFS_PER_PET_GROUP
  const jobs: Promise<ReferenceImage>[] = []
  for (const subject of subjects) {
    const [first, ...rest] = subject.photos
    const rotated = rest.length ? [...rest.slice(rotation % rest.length), ...rest.slice(0, rotation % rest.length)] : []
    for (const photo of [first, ...rotated].slice(0, perPet)) {
      jobs.push(
        cachedFetch(cache, photo.cloudinary_url).then((img) => petReference(toSubject(subject), img.data, img.mimeType))
      )
    }
  }
  return Promise.all(jobs)
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

async function savePageImage(
  page: { id: string; project_id: string },
  url: string,
  path: string,
  instructions: string | null
): Promise<void> {
  const supabase = createAdminSupabaseClient()
  const now = new Date().toISOString()

  await supabase
    .from('calendar_pages')
    .update({ cloudinary_url: url, cloudinary_public_id: path, status: 'complete', updated_at: now })
    .eq('id', page.id)

  await supabase.from('page_versions').update({ is_selected: false }).eq('calendar_page_id', page.id)

  const { data: latest } = await supabase
    .from('page_versions')
    .select('version_number')
    .eq('calendar_page_id', page.id)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  await supabase.from('page_versions').insert({
    calendar_page_id: page.id,
    project_id: page.project_id,
    image_url: url,
    image_path: path,
    custom_instructions: instructions,
    is_selected: true,
    version_number: (latest?.version_number ?? 0) + 1,
  })
}

async function setPageStatus(pageId: string, status: CalendarPage['status']) {
  await createAdminSupabaseClient()
    .from('calendar_pages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', pageId)
}

// ---------------------------------------------------------------------------
// Full calendar generation
// ---------------------------------------------------------------------------

async function renderAndStore(
  page: { id: string; project_id: string; page_type: string; month_number: number | null },
  prompt: string,
  references: ReferenceImage[],
  instructions: string | null
): Promise<string> {
  const image = await generateImage({ prompt, references, safetyId: page.project_id })
  const normalised = await normaliseGeneratedImage(image.data, image.mimeType)
  const label = page.page_type === 'month' ? `month-${page.month_number}` : page.page_type
  const { url, path } = await uploadGeneratedImage(page.project_id, label, normalised.data, normalised.mimeType)
  await savePageImage(page, url, path, instructions)
  return url
}

/**
 * Generate the cover + 12 months for a project.
 * With `onlyIncomplete`, pages that already finished are left untouched so a
 * retry only pays for what failed.
 */
export async function generateCalendar(projectId: string, options: { onlyIncomplete?: boolean } = {}): Promise<void> {
  const supabase = createAdminSupabaseClient()
  const ctx = await loadProjectContext(projectId)
  if (!ctx || ctx.pets.length === 0) throw new NotFoundError('Project has no pets with photos')

  const style = ctx.project.style as StyleId
  const plans = planPages(ctx, style)
  const now = () => new Date().toISOString()

  await supabase.from('projects').update({ status: 'generating', updated_at: now() }).eq('id', projectId)

  const { data: existingRows } = await supabase.from('calendar_pages').select('*').eq('project_id', projectId)
  const existing = (existingRows ?? []) as CalendarPage[]

  // Queue every page up front so the preview shows the whole calendar at once.
  const queue: { page: CalendarPage; plan: PagePlan }[] = []
  for (const plan of plans) {
    const row = existing.find((p) => p.page_type === plan.pageType && p.month_number === plan.month)
    if (row && options.onlyIncomplete && row.status === 'complete' && row.cloudinary_url) continue

    const fields = {
      prompt: plan.scene,
      pet_id: plan.subjects.length === 1 ? plan.subjects[0].pet.id : null,
      status: 'pending' as const,
      updated_at: now(),
    }
    if (row) {
      await supabase.from('calendar_pages').update(fields).eq('id', row.id)
      queue.push({ page: { ...row, ...fields }, plan })
    } else {
      const { data: inserted, error } = await supabase
        .from('calendar_pages')
        .insert({ project_id: projectId, page_type: plan.pageType, month_number: plan.month, generation_attempts: 0, ...fields })
        .select('*')
        .single()
      if (error || !inserted) throw new Error(`Failed to create calendar page: ${error?.message}`)
      queue.push({ page: inserted as CalendarPage, plan })
    }
  }

  const config = describeImageConfig()
  console.log(`[generate] project=${projectId} pages=${queue.length} provider=${config.provider} model=${config.model}`)

  const cache: ImageCache = new Map()
  let cursor = 0
  let failedPages = 0
  let lastFailure = ''
  const worker = async () => {
    while (cursor < queue.length) {
      const { page, plan } = queue[cursor++]
      try {
        await supabase
          .from('calendar_pages')
          .update({ status: 'generating', generation_attempts: (page.generation_attempts ?? 0) + 1, updated_at: now() })
          .eq('id', page.id)
        const references = await collectReferences(plan.subjects, plan.month ?? 0, cache)
        const prompt = buildScenePrompt(plan.scene, plan.subjects.map(toSubject), shotDirection(plan.pageType, plan.month, style), style)
        await renderAndStore(page, prompt, references, null)
      } catch (error) {
        console.error(`[generate] page ${page.page_type}/${page.month_number ?? '-'} failed:`, error)
        failedPages++
        lastFailure = error instanceof Error ? error.message : String(error)
        await setPageStatus(page.id, 'failed')
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(IMAGE_CONCURRENCY, queue.length) }, worker))

  // Several failed pages in one run usually means the image service is down or out of credit.
  if (failedPages >= 3) {
    await alertOwner({
      urgent: failedPages === queue.length,
      title: `${failedPages} of ${queue.length} calendar pages failed to generate`,
      lines: [`Calendar ${projectId}`, lastFailure.slice(0, 300)],
      url: `${SITE.url}/create/preview?p=${projectId}`,
    })
  }

  await supabase.from('projects').update({ status: 'preview', updated_at: now() }).eq('id', projectId)
}

// ---------------------------------------------------------------------------
// Single page redo / revision
// ---------------------------------------------------------------------------

export async function regeneratePage(
  pageId: string,
  options: { instructions?: string | null; newReference?: Buffer | null } = {}
): Promise<{ url: string }> {
  const supabase = createAdminSupabaseClient()

  const { data: pageRow } = await supabase.from('calendar_pages').select('*').eq('id', pageId).maybeSingle()
  if (!pageRow) throw new NotFoundError('Calendar page not found')
  const page = pageRow as CalendarPage

  const ctx = await loadProjectContext(page.project_id)
  if (!ctx || ctx.pets.length === 0) throw new NotFoundError('No reference photos found')

  const { count } = await supabase
    .from('page_versions')
    .select('id', { count: 'exact', head: true })
    .eq('calendar_page_id', pageId)
  if ((count ?? 0) >= 1 + LIMITS.maxRevisionsPerPage) {
    throw new RevisionLimitError('This page has been changed a great many times. Please choose one of its versions.')
  }

  const subjects = page.pet_id ? ctx.pets.filter((p) => p.pet.id === page.pet_id) : ctx.pets
  const cast = subjects.length > 0 ? subjects : ctx.pets
  const scene =
    page.prompt ||
    (page.page_type === 'cover'
      ? getCoverPrompt(ctx.project.style as StyleId, describeSubjects(cast.map(toSubject)))
      : getPromptForMonth(ctx.project.style as StyleId, page.month_number ?? 1, describeSubjects(cast.map(toSubject))))

  await supabase
    .from('calendar_pages')
    .update({ status: 'generating', generation_attempts: (page.generation_attempts ?? 0) + 1, updated_at: new Date().toISOString() })
    .eq('id', pageId)

  try {
    const cache: ImageCache = new Map()
    let references = await collectReferences(cast, page.month_number ?? 0, cache)

    // A fresh photo from the customer is the strongest likeness signal: put it
    // first, and keep it on the project so later pages benefit too.
    if (options.newReference) {
      const target = cast[0]
      const photo = await normalisePetPhoto(options.newReference)
      references = [petReference(toSubject(target), photo.data, photo.mimeType), ...references].slice(0, 6)
      try {
        const stored = await uploadPetPhoto(page.project_id, target.pet.id, photo.data, photo.mimeType)
        await supabase.from('pet_photos').insert({
          project_id: page.project_id,
          pet_id: target.pet.id,
          cloudinary_url: stored.url,
          cloudinary_public_id: stored.path,
          original_filename: 'revision-reference.jpg',
          width: photo.width,
          height: photo.height,
        })
      } catch (error) {
        console.error('[regenerate] could not store new reference photo:', error)
      }
    }

    const instructions = options.instructions?.trim() || null
    let prompt: string
    if (instructions && page.cloudinary_url) {
      const previous = await fetchStoredImage(page.cloudinary_url)
      references = [...references, previousRenderReference(previous.data, previous.mimeType)]
      prompt = buildRevisionPrompt(scene, cast.map(toSubject), instructions, ctx.project.style)
    } else {
      prompt = buildScenePrompt(
        scene,
        cast.map(toSubject),
        shotDirection(page.page_type, page.month_number, ctx.project.style),
        ctx.project.style
      )
    }

    const url = await renderAndStore(page, prompt, references, instructions)
    return { url }
  } catch (error) {
    // Keep the previous image selectable if there was one.
    await setPageStatus(pageId, page.cloudinary_url ? 'complete' : 'failed')
    throw error
  }
}
