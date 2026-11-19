import { NextResponse } from 'next/server'
import { clientHash, jsonError, readJson } from '@/lib/api'
import { LIMITS, defaultCalendarYear } from '@/lib/config'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { cleanPetName, isPetType } from '@/lib/validate'

// Step 1 of the flow: create the project and its pets. Photos follow one by one.
export async function POST(request: Request) {
  try {
    const body = await readJson<{ pets?: unknown; multiPetMode?: unknown }>(request)
    const rawPets = Array.isArray(body?.pets) ? body!.pets : []
    if (rawPets.length === 0) return jsonError('Add at least one pet.', 400)
    if (rawPets.length > LIMITS.maxPets) return jsonError(`A calendar can feature up to ${LIMITS.maxPets} pets.`, 400)

    const pets = rawPets.map((p) => {
      const pet = (p ?? {}) as { name?: unknown; type?: unknown }
      return { name: cleanPetName(pet.name, LIMITS.maxPetNameLength), type: isPetType(pet.type) ? pet.type : 'dog' }
    })
    if (pets.some((p) => !p.name)) return jsonError('Every pet needs a name.', 400)

    const supabase = createAdminSupabaseClient()
    const hash = clientHash(request)

    if (hash) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count, error } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('client_hash', hash)
        .gte('created_at', since)
      if (!error && (count ?? 0) >= LIMITS.maxProjectsPerDay) {
        return jsonError('You have started several calendars today. Please finish one of those, or try again tomorrow.', 429)
      }
    }

    const base = {
      name: 'My Pet Calendar',
      pet_name: pets[0].name,
      pet_type: pets[0].type,
      style: 'mythical-quest',
      status: 'uploading',
      multi_pet_mode: body?.multiPetMode === 'together' ? 'together' : 'alternate',
      start_year: defaultCalendarYear(),
    }
    let { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ ...base, client_hash: hash })
      .select('id')
      .single()
    if (projectError && /client_hash/.test(projectError.message)) {
      // Migration not applied yet — create the project without the rate-limit column.
      ;({ data: project, error: projectError } = await supabase.from('projects').insert(base).select('id').single())
    }
    if (projectError || !project) {
      console.error('create-project: insert failed', projectError)
      return jsonError('Could not start your calendar. Please try again.', 500)
    }

    const { data: petRows, error: petError } = await supabase
      .from('pets')
      .insert(pets.map((p, i) => ({ project_id: project!.id, name: p.name, pet_type: p.type, sort_order: i })))
      .select('id, sort_order')
    if (petError || !petRows || petRows.length !== pets.length) {
      console.error('create-project: pets insert failed', petError)
      await supabase.from('projects').delete().eq('id', project.id)
      return jsonError('Could not save your pets. Please try again.', 500)
    }

    const petIds = [...petRows].sort((a, b) => a.sort_order - b.sort_order).map((p) => p.id)
    return NextResponse.json({ projectId: project.id, petIds })
  } catch (error) {
    console.error('create-project error:', error)
    const detail = error instanceof Error ? error.message : ''
    if (/not configured/i.test(detail)) {
      // Typically a preview deployment without the production environment variables.
      return jsonError('This copy of the site is not connected to its database, so calendars cannot be started here.', 503)
    }
    if (/fetch failed|network|timeout|ECONN|ENOTFOUND/i.test(detail)) {
      return jsonError('We could not reach the database just now. Please try again in a moment.', 503)
    }
    return jsonError('Could not start your calendar (unexpected server error). Please try again.', 500)
  }
}
