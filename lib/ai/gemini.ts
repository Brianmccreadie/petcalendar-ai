import { GoogleGenAI, ApiError } from '@google/genai'
import { GEMINI_IMAGE, geminiApiKey } from './config'
import { ImageGenerationError, type ImageProvider, type ImageRequest } from './types'

let client: GoogleGenAI | null = null

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = geminiApiKey()
    if (!apiKey) throw new ImageGenerationError('GOOGLE_GEMINI_API_KEY is not set', 'config')
    client = new GoogleGenAI({ apiKey })
  }
  return client
}

function classify(error: unknown): ImageGenerationError {
  if (error instanceof ImageGenerationError) return error
  const status = error instanceof ApiError ? error.status : undefined
  const message = error instanceof Error ? error.message : String(error)
  if (status === 404 || /not found|is not supported|unknown model/i.test(message)) {
    return new ImageGenerationError(message, 'model_unavailable', status)
  }
  if (status === 401 || status === 403) return new ImageGenerationError(message, 'config', status)
  if (status === 429 || (status !== undefined && status >= 500)) {
    return new ImageGenerationError(message, 'transient', status)
  }
  return new ImageGenerationError(message, status === 400 ? 'unknown' : 'transient', status)
}

export const geminiProvider: ImageProvider = {
  name: 'gemini',
  models: GEMINI_IMAGE.models,

  async generate(request: ImageRequest, model: string) {
    // Each reference is preceded by its label so the model knows which pet it is.
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []
    request.references.forEach((ref, i) => {
      parts.push({ text: `Image ${i + 1}: ${ref.label}` })
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data.toString('base64') } })
    })
    parts.push({ text: request.prompt })

    try {
      const response = await getClient().models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: GEMINI_IMAGE.aspectRatio, imageSize: GEMINI_IMAGE.size },
        },
      })

      const candidate = response.candidates?.[0]
      for (const part of candidate?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          return {
            data: Buffer.from(part.inlineData.data, 'base64'),
            mimeType: part.inlineData.mimeType || 'image/png',
          }
        }
      }

      const blockReason = response.promptFeedback?.blockReason
      const finishReason = candidate?.finishReason
      if (blockReason || (finishReason && /SAFETY|PROHIBITED|BLOCK/i.test(String(finishReason)))) {
        throw new ImageGenerationError(
          `Blocked by safety filter (${blockReason || finishReason})`,
          'blocked'
        )
      }
      throw new ImageGenerationError('Model returned no image', 'transient')
    } catch (error) {
      throw classify(error)
    }
  },
}
