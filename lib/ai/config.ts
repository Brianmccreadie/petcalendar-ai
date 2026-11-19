import type { ImageProviderName } from './types'

// ---------------------------------------------------------------------------
// Image model configuration
//
// Everything here can be overridden with environment variables so a new model
// release is a config change, not a code change.
//
//   IMAGE_PROVIDER        fal | openai | gemini | mock   (default: the first of
//                         fal, openai, gemini that has a key; mock returns
//                         bundled sample images for local development)
//   FAL_KEY               fal.ai key (FAL_API_KEY, FAL_AI_KEY and FAL also accepted)
//   FAL_IMAGE_MODEL       default openai/gpt-image-2.5/sunburst/edit
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

export const FAL_IMAGE = {
  // fal endpoint ids. GPT Image 2.5 first; Nano Banana 2 if it is unavailable.
  models: list(process.env.FAL_IMAGE_MODEL, 'openai/gpt-image-2.5/sunburst/edit', 'fal-ai/nano-banana-2/edit'),
  gptSize: process.env.OPENAI_IMAGE_SIZE || '2176x1632',
  gptQuality: process.env.OPENAI_IMAGE_QUALITY || 'high',
  resolution: process.env.GEMINI_IMAGE_SIZE || '2K',
}

const FAL_KEY_NAMES = ['FAL_KEY', 'FAL_API_KEY', 'FAL_AI_KEY', 'FAL_AI_API_KEY', 'FAL'] as const

/** Tolerate the common paste mistakes: whitespace, wrapping quotes, a leading "Key ". */
function cleanKey(raw: string): string {
  return raw
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/^Key\s+/i, '')
    .trim()
}

export function falApiKey(): string | undefined {
  for (const name of FAL_KEY_NAMES) {
    const value = process.env[name]
    if (value && cleanKey(value)) return cleanKey(value)
  }
  return undefined
}

/** Shape of the configured key for diagnostics — never the key itself. */
export function falKeyShape() {
  const present = FAL_KEY_NAMES.filter((name) => Boolean(process.env[name]))
  const raw = present.length ? process.env[present[0]]! : ''
  const cleaned = cleanKey(raw)
  const [id = '', secret = ''] = cleaned.split(':')
  return {
    variable_used: present[0] ?? null,
    other_fal_variables_set: present.slice(1),
    length: cleaned.length,
    has_colon: cleaned.includes(':'),
    id_length: id.length,
    secret_length: secret.length,
    had_quotes_or_spaces: raw !== cleaned,
    looks_like_placeholder: /your|xxx|example|<|>/i.test(cleaned),
  }
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
  if (explicit === 'fal' || explicit === 'openai' || explicit === 'gemini' || explicit === 'mock') return explicit
  if (falApiKey()) return 'fal'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return 'gemini'
}

export const IMAGE_CONCURRENCY = Math.max(1, Math.min(8, Number(process.env.IMAGE_CONCURRENCY) || 4))
export const MAX_ATTEMPTS_PER_MODEL = 3
