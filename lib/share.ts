import { createCipheriv, createDecipheriv, createHash } from 'crypto'
import { isUuid } from './validate'

// Share links must not hand out the project id: whoever holds the id can open
// the editing page. A UUID is exactly one AES block, so the share token is that
// block encrypted with a server-side key — short, stable, and only the server
// can turn it back into the id.

function key(): Buffer {
  const secret = process.env.SHARE_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'petcalendar-share'
  return createHash('sha256').update(`share:${secret}`).digest()
}

export function shareToken(projectId: string): string {
  const cipher = createCipheriv('aes-256-ecb', key(), null).setAutoPadding(false)
  const block = Buffer.from(projectId.replace(/-/g, ''), 'hex')
  return Buffer.concat([cipher.update(block), cipher.final()]).toString('base64url')
}

/** The project id behind a share token, or null if the token is not one of ours. */
export function projectIdFromShareToken(token: string): string | null {
  if (!/^[A-Za-z0-9_-]{22}$/.test(token)) return null
  try {
    const decipher = createDecipheriv('aes-256-ecb', key(), null).setAutoPadding(false)
    const hex = Buffer.concat([decipher.update(Buffer.from(token, 'base64url')), decipher.final()]).toString('hex')
    const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    return isUuid(id) ? id : null
  } catch {
    return null
  }
}

/** Accepts a share token, or (for links made before share tokens existed) a raw project id. */
export function resolveSharedProject(value: string): string | null {
  return projectIdFromShareToken(value) ?? (isUuid(value) ? value : null)
}
