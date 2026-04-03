import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

export const maxDuration = 300

// Step 1: Create project + pets (no photos — those come separately)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pets, multiPetMode } = body as {
      pets: { name: string; type: string }[]
      multiPetMode?: string
    }

    if (!pets || pets.length === 0) {
      return NextResponse.json({ error: 'At least one pet is required' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()

    // Create project
    const { data: project, error: projError } = await supabase
      .from('projects')
      .insert({
        name: 'My Pet Calendar',
        pet_name: pets[0].name,
        pet_type: pets[0].type,
        style: 'mythical-quest',
        status: 'uploading',
        multi_pet_mode: multiPetMode || 'alternate',
        start_year: new Date().getFullYear(),
      })
      .select('id')
      .single()

    if (projError || !project) {
      console.error('Failed to create project:', projError)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    // Create pet entries
    const petIds: string[] = []
    for (let i = 0; i < pets.length; i++) {
      const { data: pet, error: petError } = await supabase
        .from('pets')
        .insert({
          project_id: project.id,
          name: pets[i].name,
          pet_type: pets[i].type,
          sort_order: i,
        })
        .select('id')
        .single()

      if (petError || !pet) {
        console.error(`Failed to create pet ${i}:`, petError)
        continue
      }
      petIds.push(pet.id)
    }

    return NextResponse.json({ projectId: project.id, petIds })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
