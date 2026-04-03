import { GoogleGenerativeAI } from '@google/generative-ai'
import { uploadGeneratedImage } from './storage'
import { createAdminSupabaseClient } from './supabase-admin'
import { getPromptForMonth, getCoverPrompt } from './prompts'
import type { Project, Pet, PetPhoto, StyleId, MultiPetMode } from './types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

/**
 * Generate a stylised pet image using Gemini 2.0 Flash.
 *
 * @param referencePhotoUrl  Public URL of the user's uploaded pet photo
 * @param prompt             Detailed style + scene prompt
 * @returns base64 encoded image data (PNG)
 */
export async function generatePetImage(
  referencePhotoUrl: string,
  prompt: string
): Promise<string> {
  // Fetch the reference photo as raw bytes
  const photoResponse = await fetch(referencePhotoUrl)
  if (!photoResponse.ok) {
    throw new Error(`Failed to fetch reference photo: ${photoResponse.statusText}`)
  }
  const photoBuffer = await photoResponse.arrayBuffer()
  const photoBase64 = Buffer.from(photoBuffer).toString('base64')
  const mimeType = photoResponse.headers.get('content-type') || 'image/jpeg'

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
    generationConfig: {
      // @ts-expect-error - responseModalities is valid for image generation
      responseModalities: ['image', 'text'],
    },
  })

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: photoBase64,
      },
    },
    {
      text: `You are an expert artist. Using the attached reference photo of a real pet as your model, create a high-quality, print-resolution image following these instructions precisely:\n\n${prompt}\n\nFACELOCK=100%. The pet in the generated image must be an EXACT match to the pet in the reference photo — identical breed, coloring, markings, proportions, face shape, and eye color. Preserve the pet's unique identity perfectly. The image should be LANDSCAPE-oriented (wider than tall), suitable for a wall calendar page (11x8.5 inches, roughly 3:2 horizontal aspect ratio). CRITICAL: Do NOT include any text, words, letters, numbers, watermarks, signatures, captions, labels, or typography of any kind in the image. The image must contain ONLY the visual scene with zero text elements.`,
    },
  ])

  const response = result.response
  const candidates = response.candidates
  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates returned from Gemini')
  }

  const parts = candidates[0].content.parts
  for (const part of parts) {
    if (part.inlineData) {
      return part.inlineData.data
    }
  }

  throw new Error('No image data found in Gemini response')
}

/**
 * Iterate on a previously generated image.
 * Sends the previous generation + original pet reference + optional new reference photo
 * so Gemini has full context of what to improve.
 */
export async function iteratePetImage(
  originalPetPhotoUrl: string,
  previousGenerationUrl: string,
  prompt: string,
  customInstructions: string,
  newReferenceBase64?: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
    generationConfig: {
      // @ts-expect-error - responseModalities is valid for image generation
      responseModalities: ['image', 'text'],
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = []

  // 1. Original pet reference photo
  const petResponse = await fetch(originalPetPhotoUrl)
  if (petResponse.ok) {
    const petBuffer = await petResponse.arrayBuffer()
    parts.push({
      inlineData: {
        mimeType: petResponse.headers.get('content-type') || 'image/jpeg',
        data: Buffer.from(petBuffer).toString('base64'),
      },
    })
    parts.push({ text: '[REFERENCE 1] This is the original photo of the pet. The generated image MUST look exactly like this pet. FACELOCK=100%.' })
  }

  // 2. New reference photo if provided (for correcting pet appearance)
  if (newReferenceBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: newReferenceBase64,
      },
    })
    parts.push({ text: '[REFERENCE 2] This is an UPDATED reference photo of the pet. Use THIS as the primary reference for the pet appearance. The pet MUST match this photo exactly. FACELOCK=100%.' })
  }

  // 3. Previous generation as context
  const prevResponse = await fetch(previousGenerationUrl)
  if (prevResponse.ok) {
    const prevBuffer = await prevResponse.arrayBuffer()
    parts.push({
      inlineData: {
        mimeType: prevResponse.headers.get('content-type') || 'image/png',
        data: Buffer.from(prevBuffer).toString('base64'),
      },
    })
    parts.push({ text: '[PREVIOUS GENERATION] This is the image that was previously generated. Use it as context for what the user wants to change. Keep the parts they liked, modify only what they ask for.' })
  }

  // 4. The prompt with iteration instructions
  parts.push({
    text: `Regenerate this calendar image with the following changes. Keep everything the user liked about the previous generation, but apply these specific modifications:\n\nOriginal scene prompt: ${prompt}\n\nUSER REQUESTED CHANGES: ${customInstructions}\n\nFACELOCK=100%. The pet MUST be an exact match to the reference photo(s). The image should be LANDSCAPE-oriented (11x8.5 inches, 3:2 horizontal). CRITICAL: Do NOT include any text, words, letters, numbers, watermarks, signatures, captions, labels, or typography of any kind.`,
  })

  const result = await model.generateContent(parts)
  const candidates = result.response.candidates
  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates returned from Gemini')
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data
    }
  }

  throw new Error('No image data found in Gemini response')
}

/**
 * Generate an image with MULTIPLE pets together in one scene.
 * Sends multiple reference photos (one per pet) so Gemini can depict all pets.
 */
export async function generateMultiPetImage(
  petRefs: { name: string; petType: string; photoUrl: string }[],
  prompt: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
    generationConfig: {
      // @ts-expect-error - responseModalities is valid for image generation
      responseModalities: ['image', 'text'],
    },
  })

  // Build the content parts: one reference image per pet, then the combined prompt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = []

  for (let i = 0; i < petRefs.length; i++) {
    const ref = petRefs[i]
    const photoResponse = await fetch(ref.photoUrl)
    if (!photoResponse.ok) {
      throw new Error(`Failed to fetch reference photo for ${ref.name}: ${photoResponse.statusText}`)
    }
    const photoBuffer = await photoResponse.arrayBuffer()
    const photoBase64 = Buffer.from(photoBuffer).toString('base64')
    const mimeType = photoResponse.headers.get('content-type') || 'image/jpeg'

    parts.push({
      inlineData: { mimeType, data: photoBase64 },
    })
    parts.push({
      text: `[REFERENCE IMAGE ${i + 1}] This is ${ref.name} the ${ref.petType}. Remember their exact appearance — breed, coloring, markings, size, and proportions.`,
    })
  }

  const petList = petRefs.map((r) => `${r.name} the ${r.petType}`).join(' and ')
  parts.push({
    text: `You are an expert artist. Using ALL of the reference photos above, create a single high-quality, print-resolution image featuring ALL of these pets TOGETHER in the same scene: ${petList}.\n\nFACELOCK=100%. Each pet must be an EXACT match to their reference photo — identical breed, coloring, markings, proportions, face shape, and eye color. Preserve each pet's unique identity perfectly. They should be interacting naturally in the scene together.\n\n${prompt}\n\nThe image should be LANDSCAPE-oriented (wider than tall), suitable for a wall calendar page (11x8.5 inches, roughly 3:2 horizontal aspect ratio). CRITICAL: Do NOT include any text, words, letters, numbers, watermarks, signatures, captions, labels, or typography of any kind in the image. The image must contain ONLY the visual scene with zero text elements.`,
  })

  const result = await model.generateContent(parts)
  const response = result.response
  const candidates = response.candidates
  if (!candidates || candidates.length === 0) {
    throw new Error('No candidates returned from Gemini')
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data
    }
  }

  throw new Error('No image data found in Gemini response')
}

export interface PetWithPhotos {
  pet: Pet
  photos: PetPhoto[]
}

/**
 * Generate all calendar images (cover + 12 months) for a project.
 *
 * Supports two multi-pet modes:
 * - 'alternate': Each month features one pet, rotating through them
 * - 'together': Every month features ALL pets together in the same image
 */
export async function generateCalendarImages(
  project: Project,
  petsWithPhotos: PetWithPhotos[],
  style: StyleId
): Promise<void> {
  const supabase = createAdminSupabaseClient()

  if (petsWithPhotos.length === 0) return

  const mode: MultiPetMode = project.multi_pet_mode || 'alternate'
  const isMultiTogether = mode === 'together' && petsWithPhotos.length > 1

  // Update project status to generating
  await supabase
    .from('projects')
    .update({ status: 'generating', updated_at: new Date().toISOString() })
    .eq('id', project.id)

  // Build all generation tasks (cover + 12 months = 13 total)
  type GenTask = () => Promise<void>
  const tasks: GenTask[] = []

  // --- COVER TASK ---
  if (isMultiTogether) {
    const allPetNames = petsWithPhotos.map((p) => p.pet.name).join(' and ')
    const allPetTypes = petsWithPhotos.map((p) => `${p.pet.name} the ${p.pet.pet_type}`).join(' and ')
    const coverPrompt = getCoverPrompt(style, allPetNames, allPetTypes)
    const petRefs = petsWithPhotos.map((p) => ({
      name: p.pet.name,
      petType: p.pet.pet_type,
      photoUrl: p.photos[0].cloudinary_url,
    }))
    tasks.push(() => generateAndSavePageMulti(supabase, project.id, 'cover', null, coverPrompt, petRefs, style))
  } else {
    const firstPet = petsWithPhotos[0]
    const coverPrompt = getCoverPrompt(style, firstPet.pet.name, firstPet.pet.pet_type)
    tasks.push(() => generateAndSavePage(supabase, project.id, 'cover', null, coverPrompt, firstPet.photos[0], style))
  }

  // --- MONTHLY TASKS ---
  for (let month = 1; month <= 12; month++) {
    const m = month // capture for closure
    if (isMultiTogether) {
      const allPetNames = petsWithPhotos.map((p) => p.pet.name).join(' and ')
      const allPetTypes = petsWithPhotos.map((p) => `${p.pet.name} the ${p.pet.pet_type}`).join(' and ')
      const monthPrompt = getPromptForMonth(style, m, allPetNames, allPetTypes)
      const petRefs = petsWithPhotos.map((p) => ({
        name: p.pet.name,
        petType: p.pet.pet_type,
        photoUrl: p.photos[(m - 1) % p.photos.length].cloudinary_url,
      }))
      tasks.push(() => generateAndSavePageMulti(supabase, project.id, 'month', m, monthPrompt, petRefs, style))
    } else {
      const petData = petsWithPhotos[(m - 1) % petsWithPhotos.length]
      const photo = petData.photos[(m - 1) % petData.photos.length]
      const monthPrompt = getPromptForMonth(style, m, petData.pet.name, petData.pet.pet_type)
      tasks.push(() => generateAndSavePage(supabase, project.id, 'month', m, monthPrompt, photo, style))
    }
  }

  // Run in parallel batches of 4 for speed without overwhelming the API
  const BATCH_SIZE = 4
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE)
    await Promise.allSettled(batch.map((task) => task()))
  }

  // Update project status to preview
  await supabase
    .from('projects')
    .update({ status: 'preview', updated_at: new Date().toISOString() })
    .eq('id', project.id)
}

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

async function generateAndSavePage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  projectId: string,
  pageType: 'cover' | 'month' | 'back',
  monthNumber: number | null,
  prompt: string,
  photo: PetPhoto,
  style: StyleId
): Promise<void> {
  // Upsert a calendar_page row so we can track status
  const { data: existingPage } = await supabase
    .from('calendar_pages')
    .select('id, generation_attempts')
    .eq('project_id', projectId)
    .eq('page_type', pageType)
    .eq('month_number', monthNumber)
    .maybeSingle()

  const pageId = existingPage?.id
  const attempts = (existingPage?.generation_attempts ?? 0) + 1

  if (pageId) {
    await supabase
      .from('calendar_pages')
      .update({
        status: 'generating',
        prompt,
        generation_attempts: attempts,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
  } else {
    const { data: inserted } = await supabase
      .from('calendar_pages')
      .insert({
        project_id: projectId,
        page_type: pageType,
        month_number: monthNumber,
        prompt,
        status: 'generating',
        generation_attempts: attempts,
      })
      .select('id')
      .single()

    if (!inserted) {
      throw new Error('Failed to insert calendar_page row')
    }
    // Use the newly inserted id for subsequent updates
    await generateAndUpload(supabase, inserted.id, projectId, prompt, photo, style)
    return
  }

  await generateAndUpload(supabase, pageId, projectId, prompt, photo, style)
}

async function generateAndSavePageMulti(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  projectId: string,
  pageType: 'cover' | 'month' | 'back',
  monthNumber: number | null,
  prompt: string,
  petRefs: { name: string; petType: string; photoUrl: string }[],
  style: StyleId
): Promise<void> {
  const { data: existingPage } = await supabase
    .from('calendar_pages')
    .select('id, generation_attempts')
    .eq('project_id', projectId)
    .eq('page_type', pageType)
    .eq('month_number', monthNumber)
    .maybeSingle()

  const pageId = existingPage?.id
  const attempts = (existingPage?.generation_attempts ?? 0) + 1

  if (pageId) {
    await supabase
      .from('calendar_pages')
      .update({
        status: 'generating',
        prompt,
        generation_attempts: attempts,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
  } else {
    const { data: inserted } = await supabase
      .from('calendar_pages')
      .insert({
        project_id: projectId,
        page_type: pageType,
        month_number: monthNumber,
        prompt,
        status: 'generating',
        generation_attempts: attempts,
      })
      .select('id')
      .single()

    if (!inserted) throw new Error('Failed to insert calendar_page row')
    await generateAndUploadMulti(supabase, inserted.id, projectId, prompt, petRefs, style)
    return
  }

  await generateAndUploadMulti(supabase, pageId, projectId, prompt, petRefs, style)
}

async function generateAndUploadMulti(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  pageId: string,
  projectId: string,
  prompt: string,
  petRefs: { name: string; petType: string; photoUrl: string }[],
  style: StyleId
): Promise<void> {
  try {
    const base64Image = await generateMultiPetImage(petRefs, prompt)
    const { url, path } = await uploadGeneratedImage(projectId, 'multi', null, base64Image)

    await supabase
      .from('calendar_pages')
      .update({
        cloudinary_url: url,
        cloudinary_public_id: path,
        status: 'complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    // Save version history
    await supabase
      .from('page_versions')
      .update({ is_selected: false })
      .eq('calendar_page_id', pageId)

    const { data: maxVer } = await supabase
      .from('page_versions')
      .select('version_number')
      .eq('calendar_page_id', pageId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    await supabase.from('page_versions').insert({
      calendar_page_id: pageId,
      project_id: projectId,
      image_url: url,
      image_path: path,
      is_selected: true,
      version_number: (maxVer?.version_number ?? 0) + 1,
    })
  } catch (error) {
    console.error(`Failed to generate multi-pet page ${pageId}:`, error)
    await supabase
      .from('calendar_pages')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', pageId)
  }
}

async function generateAndUpload(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  pageId: string,
  projectId: string,
  prompt: string,
  photo: PetPhoto,
  style: StyleId
): Promise<void> {
  try {
    const base64Image = await generatePetImage(photo.cloudinary_url, prompt)

    // Upload to Supabase Storage
    const { url, path } = await uploadGeneratedImage(projectId, 'month', null, base64Image)

    // Update calendar_pages row with completed image
    await supabase
      .from('calendar_pages')
      .update({
        cloudinary_url: url,
        cloudinary_public_id: path,
        status: 'complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)

    // Save version history
    await supabase
      .from('page_versions')
      .update({ is_selected: false })
      .eq('calendar_page_id', pageId)

    const { data: maxVer } = await supabase
      .from('page_versions')
      .select('version_number')
      .eq('calendar_page_id', pageId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    await supabase.from('page_versions').insert({
      calendar_page_id: pageId,
      project_id: projectId,
      image_url: url,
      image_path: path,
      is_selected: true,
      version_number: (maxVer?.version_number ?? 0) + 1,
    })
  } catch (error) {
    console.error(`Failed to generate page ${pageId}:`, error)
    await supabase
      .from('calendar_pages')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
  }
}
