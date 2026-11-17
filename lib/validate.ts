import { CALENDAR_STYLES, type PetType, type StyleId } from './types'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

export function isStyleId(value: unknown): value is StyleId {
  return typeof value === 'string' && CALENDAR_STYLES.some((s) => s.id === value)
}

export function isPetType(value: unknown): value is PetType {
  return value === 'dog' || value === 'cat' || value === 'other'
}

/**
 * Pet names end up inside image prompts and on the printed cover, so strip
 * control characters and anything that could read as prompt structure.
 */
export function cleanPetName(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001f\u007f<>{}[\]\\`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function cleanInstruction(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, maxLength)
}

const IMAGE_SIGNATURES: { mime: string; test: (b: Uint8Array) => boolean }[] = [
  { mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    mime: 'image/webp',
    test: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45,
  },
]

/** Sniff the real image type from magic bytes; never trust the client's MIME. */
export function sniffImageMime(bytes: Uint8Array): string | null {
  return IMAGE_SIGNATURES.find((s) => s.test(bytes))?.mime ?? null
}

export function extensionForMime(mime: string): string {
  return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
}
