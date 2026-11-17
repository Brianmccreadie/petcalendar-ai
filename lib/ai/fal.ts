import { FAL_IMAGE, falApiKey } from './config'
import { ImageGenerationError, type ImageProvider, type ImageRequest } from './types'

// fal.ai queue API: submit → poll status → fetch result → download the image.
// https://docs.fal.ai/model-endpoints/queue
const QUEUE = 'https://queue.fal.run'
const POLL_MS = 2000
const DEADLINE_MS = 6 * 60 * 1000

interface QueueSubmit {
  request_id: string
  status_url: string
  response_url: string
}

interface FalResult {
  images?: { url: string; content_type?: string }[]
  detail?: unknown
}

function headers(): Record<string, string> {
  const key = falApiKey()
  if (!key) throw new ImageGenerationError('FAL_KEY is not set', 'config')
  return { Authorization: `Key ${key}`, 'Content-Type': 'application/json' }
}

function failure(status: number, body: string): ImageGenerationError {
  const message = `fal ${status}: ${body.slice(0, 400)}`
  if (/content_policy|safety|moderation|flagged|prohibited/i.test(body)) return new ImageGenerationError(message, 'blocked', status)
  if (status === 401 || status === 403) return new ImageGenerationError(message, 'config', status)
  if (status === 404) return new ImageGenerationError(message, 'model_unavailable', status)
  if (status === 429 || status >= 500) return new ImageGenerationError(message, 'transient', status)
  return new ImageGenerationError(message, 'unknown', status)
}

/** Each endpoint family names its size and quality options differently. */
function inputFor(model: string, request: ImageRequest): Record<string, unknown> {
  const legend = request.references.map((ref, i) => `Image ${i + 1}: ${ref.label}`).join('\n')
  const base = {
    prompt: `${legend}\n\n${request.prompt}`,
    image_urls: request.references.map((ref) => `data:${ref.mimeType};base64,${ref.data.toString('base64')}`),
    num_images: 1,
    output_format: 'jpeg',
  }
  if (model.startsWith('openai/')) {
    const [width, height] = FAL_IMAGE.gptSize.split('x').map(Number)
    return { ...base, image_size: { width, height }, quality: FAL_IMAGE.gptQuality }
  }
  return { ...base, aspect_ratio: '4:3', resolution: FAL_IMAGE.resolution }
}

export const falProvider: ImageProvider = {
  name: 'fal',
  models: FAL_IMAGE.models,

  async generate(request: ImageRequest, model: string) {
    let submitted: QueueSubmit
    try {
      const res = await fetch(`${QUEUE}/${model}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(inputFor(model, request)),
      })
      if (!res.ok) throw failure(res.status, await res.text())
      submitted = (await res.json()) as QueueSubmit
    } catch (error) {
      if (error instanceof ImageGenerationError) throw error
      throw new ImageGenerationError(error instanceof Error ? error.message : String(error), 'transient')
    }

    const deadline = Date.now() + DEADLINE_MS
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS))
      if (Date.now() > deadline) throw new ImageGenerationError('fal request timed out', 'transient')
      const res = await fetch(submitted.status_url, { headers: headers() })
      if (!res.ok) {
        if (res.status >= 500 || res.status === 429) continue
        throw failure(res.status, await res.text())
      }
      const status = (await res.json()) as { status: string }
      if (status.status === 'COMPLETED') break
    }

    const res = await fetch(submitted.response_url, { headers: headers() })
    const text = await res.text()
    if (!res.ok) throw failure(res.status, text)
    const result = JSON.parse(text) as FalResult
    const image = result.images?.[0]
    if (!image?.url) throw new ImageGenerationError(`fal returned no image: ${text.slice(0, 200)}`, 'transient')

    if (image.url.startsWith('data:')) {
      const [meta, b64] = image.url.split(',')
      return { data: Buffer.from(b64, 'base64'), mimeType: meta.slice(5).split(';')[0] || 'image/jpeg' }
    }
    const download = await fetch(image.url)
    if (!download.ok) throw new ImageGenerationError(`Could not download fal image (${download.status})`, 'transient')
    return {
      data: Buffer.from(await download.arrayBuffer()),
      mimeType: image.content_type || download.headers.get('content-type') || 'image/jpeg',
    }
  },
}
