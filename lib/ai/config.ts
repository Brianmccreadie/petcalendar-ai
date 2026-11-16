import type { ImageProviderName } from './types'

// ---------------------------------------------------------------------------
// Image model configuration
//
// Everything here can be overridden with environment variables so a new model
// release is a config change, not a code change.
//
//   IMAGE_PROVIDER        openai | gemini | mock   (default: openai when
//                         OPENAI_API_KEY is set, otherwise gemini; mock returns
//                         bundled sample images for local development)
//   OPENAI_IMAGE_MODEL    default gpt-image-2.5-sunburst
//   OPENAI_IMAGE_QUALITY  low | medium | high | xhigh | max   (default high)
//   OPENAI_IMAGE_SIZE     WIDTHxHEIGHT, both divisible by 16  (default 2176x1632)
//   GEMINI_IMAGE_MODEL    default gemini-3.1-flash-image
//   GEMINI_IMAGE_SIZE     1K | 2K | 4K                        (default 2K)
//   IMAGE_CONCURRENCY     pages generated in parallel          (default 4)
// ---------------------------------------------------------------------------

function list(...values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())).map((v) => v.trim()))]
}

export const OPENAI_IMAGE = {
  // First entry is used; later entries are tried only if the first is not
  // available to the API key (unknown model / no access).
  models: list(process.env.OPENAI_IMAGE_MODEL, 'gpt-image-2.5-sunburst', 'gpt-image-2'),
  quality: process.env.OPENAI_IMAGE_QUALITY || 'high',
  // 4:3 landscape. 2176x1632 prints at ~198 dpi across an 11in page and stays
  // inside the non-experimental resolution range.
  size: process.env.OPENAI_IMAGE_SIZE || '2176x1632',
  fallbackSize: '1536x1024',
}

export const GEMINI_IMAGE = {
  models: list(
    process.env.GEMINI_IMAGE_MODEL,
    'gemini-3.1-flash-image',
    'gemini-3.1-flash-image-preview'
  ),
  aspectRatio: '4:3',
  size: process.env.GEMINI_IMAGE_SIZE || '2K',
}

export function geminiApiKey(): string | undefined {
  return process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}

export function resolveProviderName(): ImageProviderName {
  const explicit = (process.env.IMAGE_PROVIDER || '').toLowerCase()
  if (explicit === 'openai' || explicit === 'gemini' || explicit === 'mock') return explicit
  if (process.env.OPENAI_API_KEY) return 'openai'
  return 'gemini'
}

export const IMAGE_CONCURRENCY = Math.max(1, Math.min(8, Number(process.env.IMAGE_CONCURRENCY) || 4))
export const MAX_ATTEMPTS_PER_MODEL = 3
