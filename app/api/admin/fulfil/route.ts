import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { jsonError, readJson } from '@/lib/api'
import { fulfilOrder } from '@/lib/orders'
import { isUuid } from '@/lib/validate'

export const maxDuration = 300

// Re-run fulfilment for a paid order whose print submission failed.
//   curl -X POST $APP_URL/api/admin/fulfil -H "Authorization: Bearer $ADMIN_SECRET" \
//        -H "Content-Type: application/json" -d '{"order_id":"…"}'
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const ok =
    Boolean(secret) &&
    given.length === secret!.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(secret!))
  if (!ok) return jsonError('Unauthorized.', 401)

  const body = await readJson<{ order_id?: unknown }>(request)
  if (!isUuid(body?.order_id)) return jsonError('order_id is required.', 400)

  try {
    const order = await fulfilOrder(body.order_id)
    return NextResponse.json({ status: order.status, lulu_order_id: order.lulu_order_id })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Fulfilment failed.', 500)
  }
}
