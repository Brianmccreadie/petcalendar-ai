import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { alertOwner, alertChannels } from '@/lib/alerts'
import { jsonError, readJson } from '@/lib/api'
import { SITE } from '@/lib/config'
import { subscribeWebhook } from '@/lib/lulu'

export const maxDuration = 60

// One-off setup actions.
//   {"action":"lulu-webhook"}  ask Lulu to report print-job status changes to this site
//   {"action":"test-alert"}    send a test alert through every configured channel
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const ok = Boolean(secret) && given.length === secret!.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret!))
  if (!ok) return jsonError('Unauthorized.', 401)

  const body = await readJson<{ action?: unknown }>(request)
  try {
    if (body?.action === 'lulu-webhook') {
      const url = `${SITE.url}/api/webhooks/lulu`
      await subscribeWebhook(url)
      return NextResponse.json({ subscribed: url })
    }
    if (body?.action === 'test-alert') {
      await alertOwner({ title: 'Test alert', lines: ['If you can read this, alerts are working.'], url: SITE.url })
      return NextResponse.json({ sent: alertChannels() })
    }
    return jsonError('Unknown action.', 400)
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Setup failed.', 500)
  }
}
