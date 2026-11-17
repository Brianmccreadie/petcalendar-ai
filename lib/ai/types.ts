export type ImageProviderName = 'fal' | 'openai' | 'gemini' | 'mock'

export interface ReferenceImage {
  data: Buffer
  mimeType: string
  /** Short human label used in the prompt, e.g. "Luna the dog — reference photo". */
  label: string
}

export interface ImageRequest {
  /** Full instructions for the model (scene, identity rules, format rules). */
  prompt: string
  /** Ordered reference images. Pet photos first, then any previous render. */
  references: ReferenceImage[]
  /** Opaque per-project id passed to providers that support abuse monitoring. */
  safetyId?: string
}

export interface GeneratedImage {
  data: Buffer
  mimeType: string
  provider: ImageProviderName
  model: string
}

export interface ImageProvider {
  name: ImageProviderName
  models: string[]
  generate(request: ImageRequest, model: string): Promise<{ data: Buffer; mimeType: string }>
}

/** Thrown for errors where trying again (or another model) cannot help. */
export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly kind: 'blocked' | 'config' | 'model_unavailable' | 'transient' | 'unknown',
    public readonly status?: number
  ) {
    super(message)
    this.name = 'ImageGenerationError'
  }
}
