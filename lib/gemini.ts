import { GoogleGenerativeAI } from '@google/generative-ai'
import { uploadImage } from './cloudinary'
import { createServerSupabaseClient } from './supabase-server'
import { getPromptForMonth, getCoverPrompt } from './prompts'
import type { Project, PetPhoto, StyleId } from './types'

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
    model: 'gemini-2.0-flash-exp',
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
      text: `You are an expert artist. Using the attached reference photo of a real pet as your model, create a high-quality, print-resolution artistic image following these instructions precisely:\n\n${prompt}\n\nThe pet in the generated image must closely resemble the pet in the reference photo — same breed, coloring, markings, and proportions. The image should be portrait-oriented, suitable for a wall calendar page (roughly 3:2 aspect ratio, vertical). Do not include any text, watermarks, or signatures in the image.`,
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
 * Generate all calendar images (cover + 12 months) for a project.
 *
 * Iterates through each month, generates the image, uploads to Cloudinary,
 * and updates the calendar_pages table in Supabase.
 */
export async function generateCalendarImages(
  project: Project,
  photos: PetPhoto[],
  style: StyleId
): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const petName = project.pet_name || 'the pet'
  const petType = project.pet_type

  // Update project status to generating
  await supabase
    .from('projects')
    .update({ status: 'generating', updated_at: new Date().toISOString() })
    .eq('id', project.id)

  // Generate cover page
  const coverPrompt = getCoverPrompt(style, petName, petType)
  await generateAndSavePage(
    supabase,
    project.id,
    'cover',
    null,
    coverPrompt,
    photos[0],
    style
  )

  // Generate 12 monthly pages
  for (let month = 1; month <= 12; month++) {
    // Rotate through uploaded photos so each month uses a different reference
    const photo = photos[(month - 1) % photos.length]
    const monthPrompt = getPromptForMonth(style, month, petName, petType)

    await generateAndSavePage(
      supabase,
      project.id,
      'month',
      month,
      monthPrompt,
      photo,
      style
    )
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

    // Upload to Cloudinary
    const folder = `petcalendar/${projectId}/${style}`
    const uploadResult = await uploadImage(base64Image, folder)

    // Update calendar_pages row with completed image
    await supabase
      .from('calendar_pages')
      .update({
        cloudinary_url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        status: 'complete',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
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
