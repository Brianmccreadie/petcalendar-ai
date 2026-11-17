import { NextResponse } from 'next/server'
import { readiness } from '@/lib/readiness'

export const dynamic = 'force-dynamic'

// Which pieces of the service are configured. Booleans only — no secrets.
export async function GET() {
  return NextResponse.json(await readiness(), { headers: { 'Cache-Control': 'no-store' } })
}
