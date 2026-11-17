import { createHash } from 'crypto'
import { NextResponse } from 'next/server'

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

/** Salted hash of the caller's IP — enough to rate-limit without storing the address. */
export function clientHash(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || request.headers.get('x-real-ip')
  if (!ip) return null
  const salt = process.env.RATE_LIMIT_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'petcalendar'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    const body = await request.json()
    return body && typeof body === 'object' ? (body as T) : null
  } catch {
    return null
  }
}
