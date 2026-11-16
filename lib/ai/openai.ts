import OpenAI, { APIError, toFile } from 'openai'
import { OPENAI_IMAGE } from './config'
import { ImageGenerationError, type ImageProvider, type ImageRequest } from './types'

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) throw new ImageGenerationError('OPENAI_API_KEY is not set', 'config')
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0, timeout: 240_000 })
  }
  return client
}

function extension(mime: string): string {
  return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
}

function classify(error: unknown): ImageGenerationError {
  if (error instanceof ImageGenerationError) return error
  const message = error instanceof Error ? error.message : String(error)
  if (error instanceof APIError) {
    const status = error.status as number | undefined
    const code = (error as { code?: string | null }).code ?? ''
    if (code === 'moderation_blocked' || /safety system|content policy/i.test(message)) {
      return new ImageGenerationError(message, 'blocked', status)
    }
    if (status === 404 || code === 'model_not_found' || /does not exist|do not have access|must be verified/i.test(message)) {
      return new ImageGenerationError(message, 'model_unavailable', status)
    }
    if (status === 401) return new ImageGenerationError(message, 'config', status)
    if (status === 429 || (status !== undefined && status >= 500)) {
      return new ImageGenerationError(message, 'transient', status)
    }
    return new ImageGenerationError(message, 'unknown', status)
  }
  return new ImageGenerationError(message, 'transient')
}

export const openaiProvider: ImageProvider = {
  name: 'openai',
  models: OPENAI_IMAGE.models,

  async generate(request: ImageRequest, model: string) {
    const images = await Promise.all(
      request.references.map((ref, i) =>
        toFile(ref.data, `reference-${i + 1}.${extension(ref.mimeType)}`, { type: ref.mimeType })
      )
    )
    const legend = request.references.map((ref, i) => `Image ${i + 1}: ${ref.label}`).join('\n')
    const prompt = `${legend}\n\n${request.prompt}`

    const call = async (size: string) => {
      const result = await getClient().images.edit({
        model,
        image: images,
        prompt,
        size,
        quality: OPENAI_IMAGE.quality as 'high',
        output_format: 'jpeg',
        output_compression: 92,
        n: 1,
        ...(request.safetyId ? { safety_identifier: request.safetyId } : {}),
      })
      const b64 = result.data?.[0]?.b64_json
      if (!b64) throw new ImageGenerationError('Model returned no image', 'transient')
      return { data: Buffer.from(b64, 'base64'), mimeType: 'image/jpeg' }
    }

    try {
      return await call(OPENAI_IMAGE.size)
    } catch (error) {
      // Older or restricted models only accept the standard sizes.
      const message = error instanceof Error ? error.message : ''
      if (error instanceof APIError && error.status === 400 && /size|resolution/i.test(message)) {
        try {
          return await call(OPENAI_IMAGE.fallbackSize)
        } catch (retryError) {
          throw classify(retryError)
        }
      }
      throw classify(error)
    }
  },
}
